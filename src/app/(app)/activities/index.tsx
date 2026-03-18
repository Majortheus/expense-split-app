import { toast } from '@backpackapp-io/react-native-toast'
import { zodResolver } from '@hookform/resolvers/zod'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { Pressable, ScrollView, View } from 'react-native'
import { z } from 'zod'
import { AppBottomNav } from '@/components/app-bottom-nav'
import { AppLogo } from '@/components/app-logo'
import { Button } from '@/components/button'
import { EmptyState } from '@/components/empty-state'
import { Icon } from '@/components/icon'
import { Input } from '@/components/input'
import { KeyboardScroll } from '@/components/keyboard-aware-scroll'
import { ModalSheet } from '@/components/modal-sheet'
import { ScreenFrame } from '@/components/screen-frame'
import { Typography } from '@/components/typography'
import { type AppActivity, activities as mockActivities } from '@/mocks/expense-split'
import { formatCurrencyBRL, formatExpenseCount, formatParticipantCount } from '@/utils/formatters'

const activitySchema = z.object({
	title: z.string().trim().min(1, 'Informe o título'),
	date: z.string().trim().min(1, 'Informe a data'),
})

type ActivityFormData = z.infer<typeof activitySchema>

export default function ActivitiesScreen() {
	const router = useRouter()
	const params = useLocalSearchParams<{ state?: string; modal?: string }>()
	const [activities, setActivities] = useState<AppActivity[]>(params.state === 'empty' ? [] : mockActivities)
	const [isCreateOpen, setIsCreateOpen] = useState(params.modal === 'new')

	const handleCreate = (values: ActivityFormData) => {
		const nextActivity: AppActivity = {
			id: values.title.toLowerCase().replace(/\s+/g, '-'),
			name: values.title,
			activityDate: values.date,
			participantsCount: 2,
			expensesCount: 0,
			totalAmountInCents: 0,
		}

		setActivities((current) => [nextActivity, ...current])
		setIsCreateOpen(false)
		toast.success('Atividade criada')
	}

	return (
		<ScreenFrame>
			<View className="flex-1">
				<ScrollView className="flex-1" contentContainerClassName="flex-grow px-6 pt-10">
					<View className="flex-1 gap-4 pb-6">
						<AppLogo />

						<View className="gap-1">
							<Typography variant="label-lg" className="text-white">
								Atividades
							</Typography>
							<Typography variant="text-md" className="text-gray-300">
								Organize suas despesas divididas
							</Typography>
						</View>

						{activities.length === 0 ? (
							<EmptyState
								iconName="bullet-list"
								message="Você ainda não tem atividades criadas"
								actionLabel="Criar"
								onActionPress={() => setIsCreateOpen(true)}
							/>
						) : (
							<View className="gap-4">
								{activities.map((activity) => (
									<Pressable
										key={activity.id}
										className="gap-3 rounded-[20px] border border-white/10 bg-gray-700 p-4"
										onPress={() => router.push({ pathname: '/activities/[activityId]', params: { activityId: activity.id } })}
									>
										<View className="flex-row items-start justify-between gap-4">
											<Typography variant="label-md" className="flex-1 text-white">
												{activity.name}
											</Typography>
											<Typography variant="heading-sm" className="text-green-light">
												{formatCurrencyBRL(activity.totalAmountInCents)}
											</Typography>
										</View>

										<View className="flex-row flex-wrap gap-x-4 gap-y-2">
											<InfoItem iconName="blank-calendar" label={activity.activityDate} />
											<InfoItem iconName="user-multiple-group" label={formatParticipantCount(activity.participantsCount)} />
											<InfoItem iconName="bullet-list" label={formatExpenseCount(activity.expensesCount)} />
										</View>
									</Pressable>
								))}

								<Button startIconName="add-1" endIconName="add-1" onPress={() => setIsCreateOpen(true)}>
									Criar
								</Button>
							</View>
						)}
					</View>
				</ScrollView>

				<AppBottomNav activeTab="activities" />
			</View>

			<ActivitySheet open={isCreateOpen} onClose={() => setIsCreateOpen(false)} onSubmit={handleCreate} />
		</ScreenFrame>
	)
}

function InfoItem({ iconName, label }: { iconName: 'blank-calendar' | 'user-multiple-group' | 'bullet-list'; label: string }) {
	return (
		<View className="flex-row items-center gap-2">
			<Icon name={iconName} className="h-4 w-4 text-gray-300" />
			<Typography variant="text-sm" className="text-gray-300">
				{label}
			</Typography>
		</View>
	)
}

function ActivitySheet({ open, onClose, onSubmit }: { open: boolean; onClose: () => void; onSubmit: (values: ActivityFormData) => void }) {
	const methods = useForm<ActivityFormData>({
		defaultValues: {
			title: '',
			date: '',
		},
		resolver: zodResolver(activitySchema),
	})

	const { handleSubmit, reset } = methods

	return (
		<ModalSheet
			open={open}
			onClose={() => {
				onClose()
				reset()
			}}
		>
			<FormProvider {...methods}>
				<KeyboardScroll extraKeyboardSpace={24}>
					<View className="gap-5">
						<View className="flex-row items-center justify-between gap-4">
							<Typography variant="label-lg" className="text-white">
								Nova atividade
							</Typography>

							<Button accessibilityLabel="Fechar modal" startIconName="delete-1" variant="secondary" onPress={onClose} />
						</View>

						<View className="gap-3">
							<Input name="title" placeholder="Título" />
							<Input name="date" placeholder="Data" keyboardType="numbers-and-punctuation" />
						</View>

						<Button
							startIconName="add-1"
							endIconName="add-1"
							onPress={handleSubmit((values) => {
								onSubmit(values)
								reset()
							})}
						>
							Salvar
						</Button>
					</View>
				</KeyboardScroll>
			</FormProvider>
		</ModalSheet>
	)
}
