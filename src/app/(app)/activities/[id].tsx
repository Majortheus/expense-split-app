import { useLocalSearchParams, useRouter } from 'expo-router'
import { useState } from 'react'
import { View } from 'react-native'
import { ActivityDetailsEmptyState } from '@/components/app-page/activities/activity-details-empty-state'
import { ActivityDetailsHeader } from '@/components/app-page/activities/activity-details-header'
import { CreateActivityModal } from '@/components/app-page/activities/create-activity-modal'
import { Button } from '@/components/button'
import { Icon } from '@/components/icon'
import { Page } from '@/components/page/page'
import { Typography } from '@/components/typography'
import { useActivityByIdQuery } from '@/services/query/activities'
import { formatDateBR } from '@/utils/formatters'

export default function ActivityDetailsScreen() {
	const router = useRouter()
	const params = useLocalSearchParams<{ id?: string | string[] }>()
	const activityId = Array.isArray(params.id) ? params.id[0] : params.id
	const { data, isLoading, isError, refetch } = useActivityByIdQuery(activityId)
	const [isExpenseDrawerOpen, setIsExpenseDrawerOpen] = useState(false)
	const [isEditOpen, setIsEditOpen] = useState(false)

	const title = data?.name ?? 'Atividade'
	const date = data?.activityDate ? formatDateBR(new Date(data.activityDate)) : ''

	return (
		<Page>
			<View className="w-full flex-1 bg-gray-800 px-6 pt-6 pb-0">
				<View className="w-full flex-1 gap-4 pb-5">
					<ActivityDetailsHeader title={title} date={date} onBackPress={() => router.back()} onEditPress={() => setIsEditOpen(true)} />

					{isLoading ? (
						<View className="flex-1 items-center justify-center">
							<Typography variant="text-sm" className="text-gray-400">
								Carregando...
							</Typography>
						</View>
					) : isError ? (
						<View className="flex-1 items-center justify-center gap-3">
							<Typography variant="text-sm" className="text-center text-gray-400">
								Não foi possível carregar a atividade
							</Typography>
							<Button variant="secondary" onPress={() => refetch()}>
								Tentar novamente
							</Button>
						</View>
					) : data?.expenses.length === 0 ? (
						<View className='flex-1 justify-center items-center gap-4'>
							<ActivityDetailsEmptyState />
							<Button className="w-[182px]" startIconName="add-1" onPress={() => setIsExpenseDrawerOpen(true)}>
								Nova despesa
							</Button>
						</View>
					) : (
					<View className="flex-1" />
				)}
				</View>

				<CreateActivityModal
					isOpen={isEditOpen}
					onClose={() => setIsEditOpen(false)}
					title="Editar atividade"
					buttonLabel="Salvar"
					buttonLoadingLabel="Salvando..."
					onSubmitOverride={async () => {
						setIsEditOpen(false)
					}}
				/>

				{isExpenseDrawerOpen ? (
					<View className="absolute inset-0 bg-black/80">
						<View className="absolute inset-x-0 bottom-0 rounded-t-[20px] bg-gray-700 px-4 py-5">
							<Typography variant="label-md" className="text-gray-100">
								Nova despesa
							</Typography>
							<Typography variant="text-sm" className="mt-2 text-gray-400">
								Drawer vazio por enquanto.
							</Typography>
							<Button className="mt-4" variant="secondary" onPress={() => setIsExpenseDrawerOpen(false)}>
								Fechar
							</Button>
						</View>
					</View>
				) : null}
			</View>
		</Page>
	)
}
