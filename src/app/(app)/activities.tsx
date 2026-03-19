import { useRouter } from 'expo-router'
import { View } from 'react-native'
import { Button } from '@/components/button'
import { Typography } from '@/components/typography'
import { useAuth } from '@/hooks/use-auth'

export default function ActivitiesScreen() {
	const router = useRouter()
	const { signOut } = useAuth()

	const handleSignOut = async () => {
		await signOut()
		router.replace('/signin')
	}

	return (
		<View className="flex-1 items-center justify-center bg-gray-800 px-6">
			<Typography variant="heading-lg" className="text-white">
				Home
			</Typography>

			<Button variant="secondary" className="mt-6 max-w-[240px]" onPress={handleSignOut}>
				Logout / Sign out
			</Button>
		</View>
	)
}
