// Axios API client with refresh-token support and request queue for 401 retries

import axios, { type AxiosInstance } from 'axios'
import { env } from '@/envs'
import { getTokenFromStorage } from '@/services/storage/token-storage'

const baseURL = env.API_URL

const apiClient: AxiosInstance = axios.create({
	baseURL,
	headers: {
		'Content-Type': 'application/json',
	},
})

apiClient.interceptors.request.use(async (config) => {
	try {
		const tokenObj = await getTokenFromStorage()
		const token = tokenObj?.accessToken ?? null
		if (token && config.headers) config.headers.Authorization = `Bearer ${token}`
	} catch (_e) {
		// ignore
	}
	return config
})

export { apiClient }
