import { zodResolver } from '@hookform/resolvers/zod'
import clsx from 'clsx'
import { useLocalSearchParams } from 'expo-router'
import { useEffect, useState } from 'react'
import { FormProvider, useForm, useWatch } from 'react-hook-form'
import { FlatList, Pressable, View } from 'react-native'
import { twMerge } from 'tailwind-merge'
import { z } from 'zod'
import { ActivityDetailsEmptyState } from '@/components/app-page/activities/activity-details-empty-state'
import { ActivityDetailsHeader } from '@/components/app-page/activities/activity-details-header'
import { ActivityFormModal } from '@/components/app-page/activities/create-activity-modal'
import { Avatar } from '@/components/avatar'
import { Button } from '@/components/button'
import { Icon } from '@/components/icon'
import { Input } from '@/components/input'
import { Page } from '@/components/page/page'
import { Select } from '@/components/select'
import { Status } from '@/components/status'
import { StatusSelect } from '@/components/status-select'
import { Typography } from '@/components/typography'
import { Skeleton } from '@/components/ui/skeleton'
import { useBottomSheet } from '@/hooks/use-bottom-sheets'
import { useActivityByIdQuery } from '@/services/query/activities'
import {
	useCreateExpenseMutation,
	useDeleteExpenseMutation,
	useExpenseByIdQuery,
	useExpensesByActivityIdQuery,
	useToggleExpenseParticipantPaymentMutation,
	useUpdateExpenseMutation,
} from '@/services/query/expenses'
import { useUsersQuery } from '@/services/query/users'
import { formatCurrencyBRL } from '@/utils/formatters'
import { getInitials } from '@/utils/text-helpers'

export default function ActivityDetailsScreen() {
	const params = useLocalSearchParams<{ id?: string }>()
	const { openBottomSheet, closeBottomSheet } = useBottomSheet()
	const [isEditOpen, setIsEditOpen] = useState(false)

	const { data, isLoading, isError, refetch } = useActivityByIdQuery(params.id)
	const { data: expensesData } = useExpensesByActivityIdQuery(params.id)

	return (
		<Page>
			<View className="w-full flex-1 bg-gray-800 px-6 pt-6 pb-0">
				<View className="w-full flex-1 gap-4 pb-5">
					<ActivityDetailsHeader title={data?.name} date={data?.activityDate} isLoading={isLoading} onEditPress={() => setIsEditOpen(true)} />

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
						<View className="flex-1 items-center justify-center gap-4">
							<ActivityDetailsEmptyState />
							<Button
								className="w-[182px]"
								startIconName="add-1"
								onPress={() => openBottomSheet(<ExpenseDrawerContent activityId={params.id} onClose={closeBottomSheet} />)}
							>
								Nova despesa
							</Button>
						</View>
					) : (
						<View className="flex-1 gap-6">
							<View className="flex-row items-end justify-between">
								<View className="">
									<View className="flex-row items-center">
										{(data?.participants ?? []).slice(0, 6).map((participant, index) => (
											<Avatar key={participant.id} label={getInitials(participant.name)} size="sm" className={clsx(index > 0 && '-ml-1.5')} />
										))}
									</View>
									<Typography variant="text-sm" className="text-gray-400">
										{data?.participants.length ?? 0} participantes
									</Typography>
								</View>

								<View className="items-end">
									<Typography variant="label-md" className="text-green-light">
										{formatCurrencyBRL(data?.totalAmountInCents ?? 0)}
									</Typography>
									<Typography variant="text-sm" className="text-gray-400">
										Gastos totais
									</Typography>
								</View>
							</View>

							<FlatList
								contentContainerClassName="gap-3 pb-20"
								data={expensesData?.expenses ?? []}
								keyExtractor={(item) => item.id}
								ListHeaderComponent={
									<View className="flex-row items-center justify-between pb-1">
										<Typography variant="label-md" className="text-gray-200">
											Despesas
										</Typography>
										<Typography variant="text-sm" className="text-gray-400">
											{expensesData?.expenses.length ?? 0}
										</Typography>
									</View>
								}
								renderItem={({ item }) => (
									<Pressable onPress={() => openBottomSheet(<ExpenseDetailSheet expenseId={item.id} onClose={closeBottomSheet} />)}>
										<ExpenseDetail id={item.id} />
									</Pressable>
								)}
							/>
							<View className="items-end">
								<Button
									className="w-[113px]"
									startIconName="add-1"
									onPress={() => openBottomSheet(<ExpenseDrawerContent activityId={params.id} onClose={closeBottomSheet} />)}
								>
									Nova
								</Button>
							</View>
						</View>
					)}
				</View>

				<ActivityFormModal
					isOpen={isEditOpen}
					onClose={() => setIsEditOpen(false)}
					defaultValues={{
						id: params.id,
						date: data?.activityDate ? new Date(data.activityDate) : undefined,
						title: data?.name,
					}}
				/>
			</View>
		</Page>
	)
}

function ExpenseDetailSheet({ expenseId, onClose }: { expenseId: string; onClose: () => void }) {
	const { openBottomSheet, closeBottomSheet } = useBottomSheet()

	const { data: expenseData } = useExpenseByIdQuery(expenseId)
	const { mutate: togglePaymentStatus } = useToggleExpenseParticipantPaymentMutation()
	const { mutate: deleteExpense } = useDeleteExpenseMutation()

	const participants = expenseData?.participants ?? []

	const methods = useForm({
		defaultValues: {
			participants,
		},
	})

	const participantsForm = useWatch({ name: 'participants', control: methods.control })

	return (
		<View className="gap-8 px-6 py-8">
			<View className="flex-row justify-between">
				<View className="flex-1 gap-1">
					<Typography variant="label-lg" className="text-gray-100">
						{expenseData?.name}
					</Typography>
					<Typography variant="label-md" className="text-green-light">
						{formatCurrencyBRL(expenseData?.amountInCents ?? 0)}
					</Typography>
				</View>
				<Pressable onPress={onClose}>
					<Icon name="delete-1" className="h-5 w-5 text-gray-300" />
				</Pressable>
			</View>

			<FormProvider {...methods}>
				<View className="gap-4">
					<View className="flex-row items-center justify-between gap-3">
						<Typography variant="text-sm" className="text-gray-400">
							{participants.length} participantes
						</Typography>
						<Status variant={getExpenseStatus(participantsForm.map((p) => p.paymentStatus))} />
					</View>
					<View className="gap-5 border-gray-600 border-t border-b py-4">
						{participants.map((participant, index) => {
							return (
								<View key={participant.userId} className="flex-row items-center justify-between gap-4">
									<View className="flex-row items-center gap-4">
										<Avatar label={getInitials(participant.name)} size="lg" className="bg-gray-600" />
										<View>
											<Typography variant="label-md" className="text-gray-200">
												{participant.name}
											</Typography>
											<Typography variant="text-sm" className="text-gray-300">
												{formatCurrencyBRL(participant.amountOwedInCents)}
											</Typography>
										</View>
									</View>
									<StatusSelect
										name={`participants[${index}].paymentStatus`}
										onChange={() => {
											togglePaymentStatus({
												expenseId: expenseId,
												participantId: participant.userId,
											})
										}}
									/>
								</View>
							)
						})}
					</View>
				</View>
			</FormProvider>

			<View className="flex-row items-center justify-between pt-2">
				<Button
					variant="danger"
					className="w-12"
					startIconName="recycle-bin-2"
					onPress={() => {
						deleteExpense({
							activityId: expenseData?.activityId,
							expenseId: expenseId,
						})
						onClose()
					}}
				/>
				<Button
					variant="secondary"
					className="w-[110px]"
					startIconName="pencil"
					onPress={() => {
						openBottomSheet(
							<ExpenseDrawerContent
								activityId={expenseData?.activityId}
								defaultValues={{
									id: expenseData?.id,
									title: expenseData?.name ?? '',
									amount: ((expenseData?.amountInCents ?? 0) / 100).toString().replace('.', ','),
									participants: expenseData?.participants.map((p) => p.userId) ?? [],
								}}
								onClose={closeBottomSheet}
							/>,
						)
						// onClose()
					}}
				>
					Editar
				</Button>
			</View>
		</View>
	)
}

const expenseDrawerSchema = z.object({
	id: z.uuid().optional(),
	title: z.string().trim().min(1, 'Título é obrigatório'),
	amount: z.string().trim().min(1, 'Valor é obrigatório'),
	participants: z.array(z.string()).min(1, 'Selecione participantes'),
})

type ExpenseDrawerFormData = z.infer<typeof expenseDrawerSchema>

function ExpenseDrawerContent({ activityId, defaultValues, onClose }: { activityId?: string; defaultValues?: ExpenseDrawerFormData; onClose: () => void }) {
	const [isLoading, setIsLoading] = useState(false)

	const { data: usersList, isLoading: isUsersLoading } = useUsersQuery()
	const createExpenseMutation = useCreateExpenseMutation()
	const updateExpenseMutation = useUpdateExpenseMutation()

	const methods = useForm<ExpenseDrawerFormData>({
		defaultValues: defaultValues ?? { title: '', amount: '', participants: [] },
		resolver: zodResolver(expenseDrawerSchema),
	})

	useEffect(() => {
		if (defaultValues) {
			methods.reset(defaultValues)
		}
	}, [defaultValues, methods.reset])

	console.log('Default Values:', defaultValues)
	console.log('Form Values:', methods.getValues())

	const onSubmit = async (values: ExpenseDrawerFormData) => {
		if (!activityId) return
		try {
			setIsLoading(true)
			if (values.id) {
				updateExpenseMutation.mutate({
					expenseId: values.id,
					data: {
						title: values.title,
						amountInCents: Math.round(parseFloat(values.amount.replace(',', '.')) * 100),
						participantsIds: values.participants,
					},
				})
			} else {
				createExpenseMutation.mutate({
					activityId: activityId,
					data: {
						title: values.title,
						amountInCents: Math.round(parseFloat(values.amount.replace(',', '.')) * 100),
						participantsIds: values.participants,
					},
				})
			}
			onClose()
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<View className="gap-8 px-6 py-8">
			<FormProvider {...methods}>
				<View className="flex-row items-center justify-between">
					<Typography variant="label-md" className="text-gray-100">
						Nova despesa
					</Typography>
					<Pressable onPress={onClose} className="h-5 w-5 items-center justify-center">
						<Icon name="delete-1" className="h-5 w-5 text-gray-300" />
					</Pressable>
				</View>

				<View className="gap-2">
					<Input name="title" placeholder="Título da despesa" />
					<Input name="amount" placeholder="0,00" keyboardType="decimal-pad" iconName="real-sign" />
					{isUsersLoading ? (
						<Skeleton className="h-[50px] w-full" />
					) : (
						<Select
							name="participants"
							placeholder="Participantes"
							options={usersList ? usersList.users.map((user) => ({ label: user.name, value: user.id })) : []}
							multiple
						/>
					)}
				</View>

				<Button className="w-full" onPress={methods.handleSubmit(onSubmit)} isLoading={isLoading}>
					{isLoading ? 'Salvando...' : 'Salvar'}
				</Button>
			</FormProvider>
		</View>
	)
}

type ExpenseDetailProps = {
	id: string
}

function ExpenseDetail({ id }: ExpenseDetailProps) {
	const { data: expenseData } = useExpenseByIdQuery(id)
	const participantCount = expenseData?.participants.length ?? 0
	const amountPerPersonInCents = participantCount > 0 ? Math.round((expenseData?.amountInCents ?? 0) / participantCount) : 0
	const status = getExpenseStatus(expenseData?.participants.map((participant) => participant.paymentStatus))
	const avatars = expenseData?.participants ?? []

	return (
		<View className="w-full rounded-[10px] border border-gray-600 bg-gray-700 p-4">
			<View className="flex-row items-start justify-between gap-4">
				<Typography variant="label-md" className="flex-1 text-gray-100">
					{expenseData?.name}
				</Typography>
				<View className="items-end">
					<Typography variant="text-sm" className="text-gray-200">
						{formatCurrencyBRL(expenseData?.amountInCents ?? 0)}
					</Typography>
					<Typography variant="text-xs" className="text-gray-300">
						{formatCurrencyBRL(amountPerPersonInCents)} / pessoa
					</Typography>
				</View>
			</View>

			<View className="mt-3 border-gray-600 border-t pt-3">
				<View className="flex-row items-center justify-between">
					<View className="flex-row items-center">
						{avatars.map((participant, index) => (
							<Avatar
								key={participant.userId}
								label={getInitials(participant.name)}
								size="sm"
								className={twMerge('border-gray-700 bg-gray-600', clsx({ '-ml-1.5': index > 0 }))}
							/>
						))}
					</View>

					<Status variant={status} />
				</View>
			</View>
		</View>
	)
}

function getExpenseStatus(paymentStatuses?: string[]): 'pending' | 'partial' | 'paid' {
	if (!paymentStatuses || paymentStatuses.length === 0) return 'pending'
	if (paymentStatuses.every((status) => status === 'paid')) return 'paid'
	if (paymentStatuses.some((status) => status === 'paid')) return 'partial'
	return 'pending'
}
