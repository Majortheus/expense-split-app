import AsyncStorage from '@react-native-async-storage/async-storage'
import { ASYNC_STORAGE_KEYS } from '@/constants/asyncstorage-keys'

export type UserObject = {
	id: string
	name: string
	email: string
} | null

export async function getUserFromStorage(): Promise<UserObject> {
	try {
		const raw = await AsyncStorage.getItem(ASYNC_STORAGE_KEYS.USER)
		if (!raw) return null
		return JSON.parse(raw) as UserObject
	} catch (_err) {
		return null
	}
}

export async function setUserToStorage(user: Exclude<UserObject, null>): Promise<void> {
	await AsyncStorage.setItem(ASYNC_STORAGE_KEYS.USER, JSON.stringify(user))
}

export async function removeUserFromStorage(): Promise<void> {
	await AsyncStorage.removeItem(ASYNC_STORAGE_KEYS.USER)
}
