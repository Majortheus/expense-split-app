import type React from 'react'
import { createContext, useContext, useState } from 'react'
import { removeTokenFromStorage } from '@/services/storage/token-storage'

type User = {
	email: string
} | null

type AuthContextValue = {
	user: User
	setUser: (u: User) => void
	signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [user, setUser] = useState<User>(null)

	async function signOut() {
		await removeTokenFromStorage()
		setUser(null)
	}

	return <AuthContext.Provider value={{ user, setUser, signOut }}>{children}</AuthContext.Provider>
}

export function useAuth() {
	const ctx = useContext(AuthContext)
	if (!ctx) throw new Error('useAuth must be used within AuthProvider')
	return ctx
}

export default AuthContext
