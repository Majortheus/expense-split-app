// Axios API client with refresh-token support and request queue for 401 retries

import axios, { type AxiosError, type AxiosInstance, type AxiosRequestConfig } from 'axios'
import { env } from '@/envs'
import { getTokenFromStorage, removeTokenFromStorage, setTokenToStorage } from '@/services/storage/token-storage'

const baseURL = env.API_URL

const client: AxiosInstance = axios.create({
	baseURL,
	headers: {
		'Content-Type': 'application/json',
	},
})

let isRefreshing = false
let failedQueue: Array<{
	resolve: (value?: string | null) => void
	reject: (error: unknown) => void
}> = []

const processQueue = (error: unknown, token: string | null = null) => {
	failedQueue.forEach(({ resolve, reject }) => {
		if (error) reject(error)
		else resolve(token)
	})
	failedQueue = []
}

client.interceptors.request.use(async (config) => {
	try {
		const tokenObj = await getTokenFromStorage()
		const token = tokenObj?.accessToken ?? null
		if (token && config.headers) config.headers.Authorization = `Bearer ${token}`
	} catch (_e) {
		// ignore
	}
	return config
})

client.interceptors.response.use(
	(response) => response,
	async (error: AxiosError) => {
		const originalRequest = error.config as AxiosRequestConfig & {
			_retry?: boolean
		}

		if (error.response?.status === 401 && !originalRequest._retry) {
			if (isRefreshing) {
				return new Promise<string | null>((resolve, reject) => {
					failedQueue.push({ resolve, reject })
				})
					.then((token) => {
						if (originalRequest.headers) originalRequest.headers.Authorization = `Bearer ${token}`
						return client(originalRequest)
					})
					.catch((err) => Promise.reject(err))
			}

			originalRequest._retry = true
			isRefreshing = true

			try {
				const current = (await getTokenFromStorage()) || {
					accessToken: null,
					refreshToken: null,
				}
				const refreshToken = current.refreshToken || null
				const resp = await axios.post(`${baseURL}/auth/refresh`, {
					token: refreshToken,
				})
				const newToken = resp.data?.accessToken
				const newRefresh = resp.data?.refreshToken

				// Persist new tokens in AsyncStorage
				await setTokenToStorage({
					accessToken: newToken || null,
					refreshToken: newRefresh || null,
				})

				processQueue(null, newToken || null)
				if (originalRequest.headers && newToken) originalRequest.headers.Authorization = `Bearer ${newToken}`
				return client(originalRequest)
			} catch (err) {
				// On refresh failure remove token and reject queue
				await removeTokenFromStorage()
				processQueue(err, null)
				return Promise.reject(err)
			} finally {
				isRefreshing = false
			}
		}

		return Promise.reject(error)
	},
)

export { client as apiClient }
