import { toast } from '@backpackapp-io/react-native-toast'
import { zodResolver } from '@hookform/resolvers/zod'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useMemo, useState } from 'react'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import { Pressable, ScrollView, View } from 'react-native'
import { z } from 'zod'
import { AppBottomNav } from '@/components/app-bottom-nav'
import { Avatar } from '@/components/avatar'
import { AvatarStack } from '@/components/avatar-stack'
import { Button } from '@/components/button'
import { Icon } from '@/components/icon'
import { Input } from '@/components/input'
import { KeyboardScroll } from '@/components/keyboard-aware-scroll'
import { ModalSheet } from '@/components/modal-sheet'
import { ScreenFrame } from '@/components/screen-frame'
import { Status } from '@/components/status'
import { Typography } from '@/components/typography'
import { type AppExpense, type AppParticipant, activityParticipants, getActivityById } from '@/mocks/expense-split'
import { formatCurrencyBRL, getInitials } from '@/utils/formatters'

const activitySchema = z.object({
	title: z.string().trim().min(1, 'Informe o título'),
	date: z.string().trim().min(1, 'Informe a data'),
})

const expenseSchema = z.object({
	title: z.string().trim().min(1, 'Informe o título'),
	amount: z.string().trim().min(1, 'Informe o valor'),
	participantsIds: z.array(z.string()).min(1, 'Selecione participantes'),
})

type ActivityFormData = z.infer<typeof activitySchema>
type ExpenseFormData = z.infer<typeof expenseSchema>

export default function ActivityDetailsScreen() {
	const router = useRouter()
	const params = useLocalSearchParams<{ activityId: string; modal?: string }>()
	const activity = useMemo(() => getActivityById(params.activityId), [params.activityId])
	const [isEditOpen, setIsEditOpen] = useState(params.modal === 'edit')
	const [isExpenseOpen, setIsExpenseOpen] = useState(params.modal === 'new-expense')
	const isEmpty = activity.expenses.length === 0

	return (
		<ScreenFrame>
			<View className="flex-1">
				<ScrollView className="flex-1" contentContainerClassName="px-6 pt-10 pb-6">
					<View className="gap-6">
						<View className="flex-row items-start justify-between gap-4">
							<View className="flex-1 gap-3">
								<Pressable onPress={() => router.replace({ pathname: '/activities/index' })}>
									<Typography variant="text-md" className="text-gray-100">
										{'<- Voltar'}
									</Typography>
								</Pressable>

								<Pressable className="gap-1" onPress={() => setIsEditOpen(true)}>
									<Typography variant="label-lg" className="text-white">
										{activity.name}
									</Typography>

									<View className="flex-row items-center gap-2">
										<Icon name="blank-calendar" className="h-4 w-4 text-gray-300" />
										<Typography variant="text-sm" className="text-gray-300">
											{activity.activityDate}
										</Typography>
									</View>
								</Pressable>
							</View>

							<Button accessibilityLabel="Nova despesa" startIconName="add-1" onPress={() => setIsExpenseOpen(true)} />
						</View>

						{activity.participants.length > 0 ? (
							<View className="flex-row items-end justify-between gap-4">
								<View className="gap-2">
									<AvatarStack items={activity.participants.map((participant) => ({ id: participant.id, label: getInitials(participant.name) }))} />
									<Typography variant="text-sm" className="text-gray-300">
										{activity.participants.length} participantes
									</Typography>
								</View>

								<View className="items-end rounded-[20px] border border-white/10 bg-gray-700 px-4 py-3">
									<Typography variant="label-lg" className="text-white">
										{formatCurrencyBRL(activity.totalAmountInCents)}
									</Typography>
									<Typography variant="text-sm" className="text-gray-300">
										Gastos totais
									</Typography>
								</View>
							</View>
						) : null}

						{isEmpty ? (
							<View className="flex-1 justify-center gap-6 py-10">
								<Typography variant="text-md" className="text-center text-gray-400">
									Para começar a dividir, registre uma despesa
								</Typography>

								<Button startIconName="add-1" endIconName="add-1" onPress={() => setIsExpenseOpen(true)}>
									Nova despesa
								</Button>
							</View>
						) : (
							<View className="gap-4">
								<View className="flex-row items-center justify-between">
									<Typography variant="label-lg" className="text-white">
										Despesas
									</Typography>
									<Typography variant="label-lg" className="text-white">
										{activity.expenses.length}
									</Typography>
								</View>

								{activity.expenses.map((expense) => (
									<ExpenseCard
										key={expense.id}
										expense={expense}
										participants={activity.participants}
										onPress={() => router.push({ pathname: '/expenses/[expenseId]', params: { expenseId: expense.id } })}
									/>
								))}

								<Button startIconName="add-1" endIconName="add-1" onPress={() => setIsExpenseOpen(true)}>
									Nova
								</Button>
							</View>
						)}
					</View>
				</ScrollView>

				<AppBottomNav activeTab="activities" />
			</View>

			<ActivityEditSheet activity={activity} open={isEditOpen} onClose={() => setIsEditOpen(false)} />
			<ExpenseCreateSheet open={isExpenseOpen} onClose={() => setIsExpenseOpen(false)} />
		</ScreenFrame>
	)
}

function ExpenseCard({ expense, participants, onPress }: { expense: AppExpense; participants: AppParticipant[]; onPress: () => void }) {
	return (
		<Pressable className="gap-3 rounded-[20px] border border-white/10 bg-gray-700 p-4" onPress={onPress}>
			<View className="flex-row items-start justify-between gap-4">
				<Typography variant="label-md" className="flex-1 text-white">
					{expense.name}
				</Typography>

				<View className="items-end">
					<Typography variant="heading-sm" className="text-green-light">
						{formatCurrencyBRL(expense.amountInCents)}
					</Typography>
					<Typography variant="text-xs" className="text-gray-300">
						{formatCurrencyBRL(expense.amountPerPersonInCents)} / pessoa
					</Typography>
				</View>
			</View>

			<View className="flex-row items-center justify-between gap-4">
				<AvatarStack items={participants.map((participant) => ({ id: participant.id, label: getInitials(participant.name) }))} />
				<Status variant={expense.status} />
			</View>
		</Pressable>
	)
}

function ActivityEditSheet({ activity, onClose, open }: { activity: { activityDate: string; name: string }; onClose: () => void; open: boolean }) {
	const methods = useForm<ActivityFormData>({
		defaultValues: {
			title: activity.name,
			date: activity.activityDate,
		},
		resolver: zodResolver(activitySchema),
	})

	const { handleSubmit, reset } = methods

	return (
		<ModalSheet
			open={open}
			onClose={() => {
				reset({ title: activity.name, date: activity.activityDate })
				onClose()
			}}
		>
			<FormProvider {...methods}>
				<KeyboardScroll extraKeyboardSpace={24}>
					<View className="gap-5">
						<View className="flex-row items-center justify-between gap-4">
							<Typography variant="label-lg" className="text-white">
								Editar atividade
							</Typography>

							<Button accessibilityLabel="Fechar edição da atividade" startIconName="delete-1" variant="secondary" onPress={onClose} />
						</View>

						<View className="gap-3">
							<Input name="title" placeholder="Título" />
							<Input name="date" placeholder="Data" keyboardType="numbers-and-punctuation" />
						</View>

						<Button
							startIconName="add-1"
							endIconName="add-1"
							onPress={handleSubmit(() => {
								toast.success('Atividade atualizada')
								onClose()
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

function ExpenseCreateSheet({ open, onClose }: { onClose: () => void; open: boolean }) {
	const methods = useForm<ExpenseFormData>({
		defaultValues: {
			title: '',
			amount: '0,00',
			participantsIds: activityParticipants.slice(0, 2).map((participant) => participant.id),
		},
		resolver: zodResolver(expenseSchema),
	})

	const { control, handleSubmit, watch } = methods
	const selectedIds = watch('participantsIds') ?? []
	const selectedParticipants = activityParticipants.filter((participant) => selectedIds.includes(participant.id))

	return (
		<ModalSheet open={open} onClose={onClose}>
			<FormProvider {...methods}>
				<KeyboardScroll extraKeyboardSpace={24}>
					<View className="gap-5">
						<View className="flex-row items-center justify-between gap-4">
							<Typography variant="label-lg" className="text-white">
								Nova despesa
							</Typography>

							<Button accessibilityLabel="Fechar criação de despesa" startIconName="delete-1" variant="secondary" onPress={onClose} />
						</View>

						<View className="gap-3">
							<Input name="title" placeholder="Título" />
							<Input name="amount" placeholder="0,00" keyboardType="decimal-pad" />

							<Controller
								control={control}
								name="participantsIds"
								render={({ field: { value, onChange }, fieldState: { error } }) => (
									<View className="gap-3">
										<Pressable className="rounded-lg border border-gray-600 bg-gray-800 px-4 py-3">
											<Typography variant="label-md" className="text-gray-300">
												Participantes
											</Typography>
										</Pressable>

										<View className="gap-3 rounded-[16px] border border-white/10 bg-gray-600 px-4 py-3">
											{selectedParticipants.map((participant) => (
												<View key={participant.id} className="flex-row items-center gap-3">
													<Avatar label={getInitials(participant.name)} size="md" />

													<Typography variant="label-md" className="flex-1 text-white">
														{participant.name}
													</Typography>

													<Pressable onPress={() => onChange(value.filter((participantId) => participantId !== participant.id))}>
														<Icon name="recycle-bin-2" className="h-4 w-4 text-danger-light" />
													</Pressable>
												</View>
											))}
										</View>

										{error ? (
											<Typography variant="text-xs" className="text-danger-light">
												{error.message}
											</Typography>
										) : null}
									</View>
								)}
							/>
						</View>

						<Button
							startIconName="add-1"
							endIconName="add-1"
							onPress={handleSubmit(() => {
								toast.success('Despesa criada')
								onClose()
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
