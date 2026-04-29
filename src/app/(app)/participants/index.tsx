import { View } from 'react-native'
import { Icon } from '@/components/icon'
import { Header } from '@/components/page/header'
import { Page } from '@/components/page/page'
import { Typography } from '@/components/typography'

export default function ParticipantsScreen() {
	return (
		<Page>
			<View className="w-full flex-1 bg-gray-800 px-6 pt-6 pb-0">
				<View className="w-full flex-1 gap-4 pb-5">
					<Header title="Participantes" subtitle="Pessoas com quem você já dividiu tarefas" />

					<View className="flex-1 items-center justify-center">
						<View className="items-center justify-center gap-4">
							<Icon name="user-multiple-group" className="h-8 w-8 text-gray-400" />
							<Typography variant="text-sm" className="w-[200px] text-center text-gray-400">
								Você ainda não adicionou participantes em atividades
							</Typography>
						</View>
					</View>
				</View>
			</View>
		</Page>
	)
}
