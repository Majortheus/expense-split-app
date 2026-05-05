import { useRouter } from 'expo-router'
import type React from 'react'
import { createContext, useContext, useEffect, useState } from 'react'
import { getUserFromStorage, removeUserFromStorage, setUserToStorage } from '@/services/storage/user-storage'

type User = {
	id: string
	name: string
	email: string
} | null

type AuthContextValue = {
	user: User
	setUser: (u: User) => void
	signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const router = useRouter()
	const [user, setUser] = useState<User>(null)

	useEffect(() => {
		async function loadUser() {
			const storedUser = await getUserFromStorage()
			setUser(storedUser)
		}

		loadUser()
	}, [])

	async function updateUser(nextUser: User) {
		setUser(nextUser)

		if (nextUser) {
			await setUserToStorage(nextUser)
		} else {
			await removeUserFromStorage()
		}
	}

	async function signOut() {
		await removeUserFromStorage()
		setUser(null)
		router.replace('/signin')
	}

	return <AuthContext.Provider value={{ user, setUser: updateUser, signOut }}>{children}</AuthContext.Provider>
}

export function useAuth() {
	const ctx = useContext(AuthContext)
	if (!ctx) throw new Error('useAuth must be used within AuthProvider')
	return ctx
}

export default AuthContext
