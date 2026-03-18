import { type Href, useRouter } from 'expo-router'
import { View } from 'react-native'
import { Button } from '@/components/button'
import { Page } from '@/components/page/page'
import { Typography } from '@/components/typography'
import { useAuth } from '@/hooks/use-auth'

const SIGNIN_ROUTE = '/signin' as Href

export default function Home() {
	const { signOut } = useAuth()
	const router = useRouter()

	const handleSignOut = async () => {
		await signOut()
		router.replace(SIGNIN_ROUTE)
	}

	return (
		<Page>
			<View className="flex-1 items-center justify-center">
				<Typography variant="heading-lg" className="text-white">
					Home (autenticada)
				</Typography>
				<Button variant="secondary" onPress={handleSignOut} className="mt-6">
					Sair
				</Button>
			</View>
		</Page>
	)
}
