import AsyncStorage from '@react-native-async-storage/async-storage'
import { ASYNC_STORAGE_KEYS } from '@/constants/asyncstorage-keys'

export type TokenObject = {
	accessToken: string | null
	refreshToken?: string | null
}

export async function getTokenFromStorage(): Promise<TokenObject | null> {
	try {
		const raw = await AsyncStorage.getItem(ASYNC_STORAGE_KEYS.TOKEN)
		if (!raw) return null
		return JSON.parse(raw) as TokenObject
	} catch (_err) {
		return null
	}
}

export async function setTokenToStorage(token: TokenObject): Promise<void> {
	await AsyncStorage.setItem(ASYNC_STORAGE_KEYS.TOKEN, JSON.stringify(token))
}

export async function updateTokenInStorage(partial: Partial<TokenObject>): Promise<void> {
	const current = (await getTokenFromStorage()) || {
		accessToken: null,
		refreshToken: null,
	}
	const updated = { ...current, ...partial }
	await setTokenToStorage(updated)
}

export async function removeTokenFromStorage(): Promise<void> {
	await AsyncStorage.removeItem(ASYNC_STORAGE_KEYS.TOKEN)
}
