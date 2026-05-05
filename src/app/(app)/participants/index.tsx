import { useMemo } from 'react'
import { FlatList, View } from 'react-native'
import { Avatar } from '@/components/avatar'
import { Icon } from '@/components/icon'
import { Header } from '@/components/page/header'
import { Page } from '@/components/page/page'
import { Typography } from '@/components/typography'
import { useAuth } from '@/hooks/use-auth'
import { useActivitiesByUserIdQuery } from '@/services/query/activities'
import { formatActivityCount } from '@/utils/formatters'
import { getInitials } from '@/utils/text-helpers'

type ParticipantItem = {
	id: string
	name: string
	activitiesCount: number
}

export default function ParticipantsScreen() {
	const { user } = useAuth()
	const { data, isLoading, isError } = useActivitiesByUserIdQuery(user?.id)

	const participants = useMemo<ParticipantItem[]>(() => {
		const map = new Map<string, ParticipantItem>()

		for (const activity of data?.activities ?? []) {
			for (const participant of activity.participants ?? []) {
				const current = map.get(participant.id)
				if (current) {
					map.set(participant.id, { ...current, activitiesCount: current.activitiesCount + 1 })
					continue
				}

				map.set(participant.id, {
					id: participant.id,
					name: participant.name,
					activitiesCount: 1,
				})
			}
		}

		return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name))
	}, [data?.activities])

	const isEmpty = !isLoading && !isError && participants.length === 0

	return (
		<Page>
			<View className="w-full flex-1 bg-gray-800 px-6 pt-6 pb-0">
				<View className="w-full flex-1 gap-4 pb-5">
					<Header title="Participantes" subtitle="Pessoas com quem você já dividiu tarefas" />

					{isLoading ? (
						<View className="flex-1 items-center justify-center">
							<Typography variant="text-sm" className="text-gray-400">
								Carregando...
							</Typography>
						</View>
					) : isEmpty ? (
						<View className="flex-1 items-center justify-center">
							<View className="items-center justify-center gap-4">
								<Icon name="user-multiple-group" className="h-8 w-8 text-gray-400" />
								<Typography variant="text-sm" className="w-[200px] text-center text-gray-400">
									Você ainda não adicionou participantes em atividades
								</Typography>
							</View>
						</View>
					) : (
						<FlatList
							data={participants}
							keyExtractor={(item) => item.id}
							contentContainerClassName="gap-2 pb-20"
							renderItem={({ item }) => (
								<View className="flex-row items-center gap-3 rounded-[10px] border border-gray-600 bg-gray-800 px-3 py-3">
									<Avatar label={getInitials(item.name)} size="lg" className="bg-gray-600" />
									<View className="flex-1 gap-0.5">
										<Typography variant="label-md" className="text-gray-100">
											{item.name}
										</Typography>
										<Typography variant="text-xs" className="text-gray-400">
											{formatActivityCount(item.activitiesCount)}
										</Typography>
									</View>
								</View>
							)}
						/>
					)}
				</View>
			</View>
		</Page>
	)
}
