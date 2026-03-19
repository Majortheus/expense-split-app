import { Redirect } from 'expo-router'
import { useAuth } from '@/hooks/use-auth'

export default function IndexRedirect() {
	const { user } = useAuth()

	if (user) {
		return <Redirect href="/activities" />
	}

	return <Redirect href="/signin" />
}
