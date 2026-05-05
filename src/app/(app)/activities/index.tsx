import { useGlobalSearchParams, useLocalSearchParams, useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import { FlatList, Pressable, View } from 'react-native'
import { ActivitiesEmptyState } from '@/components/activities-empty-state'
import { ActivityCard } from '@/components/app-page/activities/activity-card'
import { ActivityFormModal } from '@/components/app-page/activities/create-activity-modal'
import { Button } from '@/components/button'
import { Icon } from '@/components/icon'
import { Header } from '@/components/page/header'
import { Page } from '@/components/page/page'
import { Spinner } from '@/components/spinner'
import { Typography } from '@/components/typography'
import { useAuth } from '@/hooks/use-auth'
import { useActivitiesByUserIdQuery } from '@/services/query/activities'

export default function ActivitiesScreen() {
	const router = useRouter()
	const { user } = useAuth()
	const localParams = useLocalSearchParams()
	const [isCreateOpen, setIsCreateOpen] = useState(localParams.openCreateModal === 'true')

	const { data, isLoading, isError, refetch } = useActivitiesByUserIdQuery(user?.id)

	const isEmpty = !isLoading && data?.activities.length === 0

	const closeCreateModal = () => {
		setIsCreateOpen(false)
		router.replace('/activities')
	}

	useEffect(() => {
		if (localParams.openCreateModal === 'true') {
			setIsCreateOpen(true)
		}
	}, [localParams.openCreateModal])

	return (
		<Page>
			<View className="w-full flex-1 bg-gray-800 px-6 pt-6 pb-6">
				<View className="relative w-full flex-1 gap-4">
					<Header title="Atividades" subtitle="Organize suas despesas divididas" />
					<Pressable
						onPress={() => router.push('/profile')}
						className="absolute top-0 right-0 h-12 w-12 items-center justify-center rounded-full border border-gray-500 bg-gray-600"
					>
						<Icon name="user-circle-single" className="h-6 w-6 text-gray-300" />
					</Pressable>
					<View className="relative flex-1">
						{isLoading ? (
							<View className="flex-1 items-center justify-center gap-3">
								<Spinner size="md" variant="secondary" />
								<Typography variant="text-sm" className="text-gray-400">
									Carregando atividades...
								</Typography>
							</View>
						) : isError ? (
							<View className="flex-1 items-center justify-center gap-3">
								<Typography variant="text-sm" className="text-center text-gray-400">
									Não foi possível carregar as atividades
								</Typography>
								<Button variant="secondary" onPress={() => refetch()}>
									Tentar novamente
								</Button>
							</View>
						) : isEmpty ? (
							<View className="flex-1 items-center justify-center">
								<ActivitiesEmptyState />
							</View>
						) : (
							<FlatList
								contentContainerClassName="gap-3 pb-20"
								data={data?.activities ?? []}
								keyExtractor={(item) => item.id}
								renderItem={({ item }) => <ActivityCard activity={item} onPress={() => router.push(`/activities/${item.id}`)} />}
							/>
						)}

						<View className="absolute right-0 bottom-0">
							<Button startIconName="add-1" onPress={() => setIsCreateOpen(true)}>
								Criar
							</Button>
						</View>
					</View>
				</View>

				<ActivityFormModal isOpen={isCreateOpen} onClose={closeCreateModal} />
			</View>
		</Page>
	)
}
