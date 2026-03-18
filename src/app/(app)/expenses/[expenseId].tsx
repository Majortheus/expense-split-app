import { toast } from '@backpackapp-io/react-native-toast'
import { zodResolver } from '@hookform/resolvers/zod'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useState } from 'react'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import { Pressable, ScrollView, View } from 'react-native'
import { z } from 'zod'
import { Avatar } from '@/components/avatar'
import { AvatarStack } from '@/components/avatar-stack'
import { Button } from '@/components/button'
import { Icon } from '@/components/icon'
import { Input } from '@/components/input'
import { KeyboardScroll } from '@/components/keyboard-aware-scroll'
import { ModalSheet } from '@/components/modal-sheet'
import { ScreenFrame } from '@/components/screen-frame'
import { Status } from '@/components/status'
import { StatusSelect } from '@/components/status-select'
import { Typography } from '@/components/typography'
import { activityParticipants, getExpenseById } from '@/mocks/expense-split'
import { formatCurrencyBRL, getInitials } from '@/utils/formatters'

const expenseSchema = z.object({
	title: z.string().trim().min(1, 'Informe o título'),
	amount: z.string().trim().min(1, 'Informe o valor'),
	participantsIds: z.array(z.string()).min(1, 'Selecione participantes'),
})

type ExpenseFormData = z.infer<typeof expenseSchema>

export default function ExpenseDetailsScreen() {
	const router = useRouter()
	const params = useLocalSearchParams<{ expenseId: string }>()
	const { activity, expense, participants } = getExpenseById(params.expenseId)
	const [isCreateOpen, setIsCreateOpen] = useState(false)
	const [isEditOpen, setIsEditOpen] = useState(false)
	const participantStatuses = participants.reduce<Record<string, 'pending' | 'paid'>>((accumulator, participant) => {
		accumulator[participant.id] = participant.status
		return accumulator
	}, {})
	const statusMethods = useForm({ defaultValues: participantStatuses })

	return (
		<ScreenFrame>
			<View className="flex-1">
				<ScrollView className="flex-1" contentContainerClassName="px-6 pt-10 pb-6">
					<View className="gap-6">
						<View className="flex-row items-start justify-between gap-4">
							<View className="flex-1 gap-3">
								<Pressable onPress={() => router.replace({ pathname: '/activities/[activityId]', params: { activityId: activity.id } })}>
									<Typography variant="text-md" className="text-gray-100">
										{'<- Voltar'}
									</Typography>
								</Pressable>

								<View className="gap-1">
									<Typography variant="label-lg" className="text-white">
										{activity.name}
									</Typography>

									<View className="flex-row items-center gap-2">
										<Icon name="blank-calendar" className="h-4 w-4 text-gray-300" />
										<Typography variant="text-sm" className="text-gray-300">
											{activity.activityDate}
										</Typography>
									</View>
								</View>
							</View>

							<Button accessibilityLabel="Nova despesa" startIconName="add-1" onPress={() => setIsCreateOpen(true)} />
						</View>

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

						<View className="gap-4">
							<View className="flex-row items-center justify-between">
								<Typography variant="label-lg" className="text-white">
									Despesas
								</Typography>
								<Typography variant="label-lg" className="text-white">
									{activity.expenses.length}
								</Typography>
							</View>

							{activity.expenses.map((item) => (
								<Pressable
									key={item.id}
									className="gap-3 rounded-[20px] border border-white/10 bg-gray-700 p-4"
									onPress={() => router.replace({ pathname: '/expenses/[expenseId]', params: { expenseId: item.id } })}
								>
									<View className="flex-row items-start justify-between gap-4">
										<Typography variant="label-md" className="flex-1 text-white">
											{item.name}
										</Typography>

										<View className="items-end">
											<Typography variant="heading-sm" className="text-green-light">
												{formatCurrencyBRL(item.amountInCents)}
											</Typography>
											<Typography variant="text-xs" className="text-gray-300">
												{formatCurrencyBRL(item.amountPerPersonInCents)} / pessoa
											</Typography>
										</View>
									</View>

									<View className="flex-row items-center justify-between gap-4">
										<AvatarStack items={activity.participants.map((participant) => ({ id: participant.id, label: getInitials(participant.name) }))} />
										<Status variant={item.status} />
									</View>
								</Pressable>
							))}

							<Button startIconName="add-1" endIconName="add-1" onPress={() => setIsCreateOpen(true)}>
								Nova
							</Button>
						</View>
					</View>
				</ScrollView>

				<View className="absolute inset-0 justify-end bg-black/80">
					<Pressable className="flex-1" onPress={() => router.replace({ pathname: '/activities/[activityId]', params: { activityId: activity.id } })} />

					<View className="rounded-t-[20px] border-white/10 border-t bg-gray-700 px-4 py-5">
						<FormProvider {...statusMethods}>
							<View className="gap-5">
								<View className="flex-row items-start justify-between gap-4">
									<View className="flex-1">
										<Typography variant="label-lg" className="text-white">
											{expense.name}
										</Typography>
										<Typography variant="heading-sm" className="text-green-light">
											{formatCurrencyBRL(expense.amountInCents)}
										</Typography>
									</View>

									<Button
										accessibilityLabel="Excluir despesa"
										startIconName="delete-1"
										variant="danger"
										onPress={() => {
											toast.error('Despesa removida')
											router.replace({ pathname: '/activities/[activityId]', params: { activityId: activity.id } })
										}}
									/>
								</View>

								<View className="flex-row items-center justify-between gap-4">
									<Typography variant="label-md" className="text-white">
										{participants.length} participantes
									</Typography>
									<Status variant={expense.status} />
								</View>

								<View className="gap-4">
									{participants.map((participant) => (
										<View key={participant.id} className="flex-row items-center gap-3">
											<Avatar label={getInitials(participant.name)} size="lg" />

											<View className="flex-1">
												<Typography variant="label-md" className="text-white">
													{participant.name}
												</Typography>
												<Typography variant="text-sm" className="text-gray-300">
													{formatCurrencyBRL(participant.amountInCents)}
												</Typography>
											</View>

											<StatusSelect name={participant.id} />
										</View>
									))}
								</View>

								<View className="flex-row gap-3">
									<Button
										accessibilityLabel="Fechar detalhes da despesa"
										startIconName="delete-1"
										variant="secondary"
										onPress={() => router.replace({ pathname: '/activities/[activityId]', params: { activityId: activity.id } })}
									/>
									<Button startIconName="add-1" endIconName="add-1" className="flex-1" onPress={() => setIsEditOpen(true)}>
										Editar
									</Button>
								</View>
							</View>
						</FormProvider>
					</View>
				</View>
			</View>

			<ExpenseEditorSheet
				open={isCreateOpen}
				title="Nova despesa"
				defaultValues={{ title: '', amount: '0,00', participantsIds: activityParticipants.slice(0, 2).map((participant) => participant.id) }}
				onClose={() => setIsCreateOpen(false)}
				onSuccess={() => toast.success('Despesa criada')}
			/>
			<ExpenseEditorSheet
				open={isEditOpen}
				title="Editar despesa"
				defaultValues={{ title: expense.name, amount: '2200,00', participantsIds: participants.map((participant) => participant.id) }}
				onClose={() => setIsEditOpen(false)}
				onSuccess={() => toast.success('Despesa atualizada')}
			/>
		</ScreenFrame>
	)
}

function ExpenseEditorSheet({
	defaultValues,
	onClose,
	onSuccess,
	open,
	title,
}: {
	defaultValues: ExpenseFormData
	onClose: () => void
	onSuccess: () => void
	open: boolean
	title: string
}) {
	const methods = useForm<ExpenseFormData>({
		defaultValues,
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
								{title}
							</Typography>

							<Button accessibilityLabel="Fechar modal da despesa" startIconName="delete-1" variant="secondary" onPress={onClose} />
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
								onSuccess()
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
