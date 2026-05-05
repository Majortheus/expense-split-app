import { View } from 'react-native'
import { Avatar } from '@/components/avatar'
import { Button } from '@/components/button'
import { Header } from '@/components/page/header'
import { Page } from '@/components/page/page'
import { Typography } from '@/components/typography'
import { useAuth } from '@/hooks/use-auth'
import { getInitials } from '@/utils/text-helpers'

export default function ProfileScreen() {
	const { user, signOut } = useAuth()

	return (
		<Page>
			<View className="w-full flex-1 bg-gray-800 px-6 pt-6 pb-0">
				<View className="w-full flex-1 gap-4 pb-5">
					<Header title="Perfil" subtitle="Gerencie sua conta e preferências" />
					<View className="flex-row gap-4 rounded-[20px] bg-gray-700 p-5">
						<Avatar label={getInitials(user?.name ?? '')} size="xl" />
						<View>
							<Typography variant="label-lg">{user?.name}</Typography>
							<Typography variant="text-sm" className="text-gray-300">
								{user?.email}
							</Typography>
						</View>
					</View>
					<Button variant="secondary" onPress={signOut}>
						Sair da conta
					</Button>
				</View>
			</View>
		</Page>
	)
}
