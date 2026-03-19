import { useRouter } from 'expo-router'
import { View } from 'react-native'
import Logo from '@/assets/logo.svg'
import { Button } from '@/components/button'
import { Icon } from '@/components/icon'
import { Page } from '@/components/page/page'
import { Typography } from '@/components/typography'

export default function NotFoundScreen() {
	const router = useRouter()

	return (
		<Page>
			<View className="w-full flex-1">
				<View className="flex-1 items-center justify-center">
					<View className="mb-3">
						<Logo width={131} height={95} />
					</View>
				</View>

				<View className="w-full">
					<View className="w-full gap-8 rounded-t-[20px] bg-gray-700 px-8 py-10">
						<View className="items-center gap-4">
							<Icon name="warning-octagon" className="h-6 w-6 text-gray-400" />

							<View className="items-center gap-2">
								<Typography variant="label-lg" className="text-white">
									Página não encontrada
								</Typography>

								<Typography variant="text-sm" className="max-w-[260px] text-center text-gray-300">
									O conteúdo que você tentou acessar não existe ou não está disponível.
								</Typography>
							</View>
						</View>

						<Button variant="secondary" onPress={() => router.replace('/signin')}>
							Voltar para o login
						</Button>
					</View>
				</View>
			</View>
		</Page>
	)
}
