import { useLocalSearchParams } from 'expo-router'
import { ScrollView, View } from 'react-native'
import { AppBottomNav } from '@/components/app-bottom-nav'
import { AppLogo } from '@/components/app-logo'
import { Avatar } from '@/components/avatar'
import { EmptyState } from '@/components/empty-state'
import { ScreenFrame } from '@/components/screen-frame'
import { Typography } from '@/components/typography'
import { participants } from '@/mocks/expense-split'
import { formatActivityCount, getInitials } from '@/utils/formatters'

export default function ParticipantsScreen() {
	const params = useLocalSearchParams<{ state?: string }>()
	const participantList = params.state === 'empty' ? [] : participants.slice(0, 6)

	return (
		<ScreenFrame>
			<View className="flex-1">
				<ScrollView className="flex-1" contentContainerClassName="flex-grow px-6 pt-10">
					<View className="flex-1 gap-4 pb-6">
						<AppLogo />

						<View className="gap-1">
							<Typography variant="label-lg" className="text-white">
								Participantes
							</Typography>
							<Typography variant="text-md" className="text-gray-300">
								Pessoas com quem você já dividiu tarefas
							</Typography>
						</View>

						{participantList.length === 0 ? (
							<EmptyState iconName="user-multiple-group" message="Você ainda não adicionou participantes em atividades" />
						) : (
							<View className="gap-4">
								{participantList.map((participant) => (
									<View key={participant.id} className="flex-row items-center gap-3 rounded-[20px] border border-white/10 bg-gray-700 p-4">
										<Avatar label={getInitials(participant.name)} size="lg" />

										<View className="flex-1">
											<Typography variant="label-md" className="text-white">
												{participant.name}
											</Typography>
											<Typography variant="text-sm" className="text-gray-300">
												{formatActivityCount(participant.activitiesCount)}
											</Typography>
										</View>
									</View>
								))}
							</View>
						)}
					</View>
				</ScrollView>

				<AppBottomNav activeTab="participants" />
			</View>
		</ScreenFrame>
	)
}
