import { type Href, Redirect } from 'expo-router'
import { useAuth } from '@/hooks/use-auth'

const HOME_ROUTE = '/home' as Href
const SIGNIN_ROUTE = '/signin' as Href

export default function IndexRedirect() {
	const { user } = useAuth()

	if (user) {
		return <Redirect href={HOME_ROUTE} />
	}

	return <Redirect href={SIGNIN_ROUTE} />
}
