import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { ActivityDetailResponse } from '@/@types/api/activities'
import type {
	CreateExpenseRequest,
	CreateExpenseResponse,
	ExpenseDetailResponse,
	ExpenseListResponse,
	MarkPaymentRequest,
	SetExpensePayerRequest,
	SetExpensePayerResponse,
	ToggleParticipantPaymentResponse,
	UpdateExpenseRequest,
} from '@/@types/api/expenses'
import type { UserListResponse } from '@/@types/api/users'
import { participants } from '@/mocks/expense-split'
import { api } from '@/services/api'

const OPTIMISTIC_EXPENSE_ID = 'optimistic-expense'

type CreateExpenseVariables = {
	activityId: string
	data: CreateExpenseRequest
}

type UpdateExpenseVariables = {
	expenseId: string
	data: UpdateExpenseRequest
}

type DeleteExpenseVariables = {
	activityId?: string
	expenseId: string
}

type SetExpensePayerVariables = {
	expenseId: string
	data: SetExpensePayerRequest
}

type ToggleExpenseParticipantPaymentVariables = {
	expenseId: string
	participantId: string
}

type MarkExpensePaymentVariables = {
	expenseId: string
	data: MarkPaymentRequest
}

type ExpensesMutationContext = {
	previousDetail?: ExpenseDetailResponse
	previousLists: Array<[ReadonlyArray<string>, ExpenseListResponse | undefined]>
}

function getExpenseLists(queryClient: ReturnType<typeof useQueryClient>) {
	return queryClient.getQueriesData<ExpenseListResponse>({
		queryKey: ['expenses', 'activity'],
	}) as ExpensesMutationContext['previousLists']
}

export function useExpensesByActivityIdQuery(activityId?: string) {
	return useQuery({
		queryKey: ['expenses', 'activity', activityId],
		enabled: !!activityId,
		queryFn: () => {
			if (!activityId) throw new Error('activityId is required')

			return api.expenses.getByActivityId(activityId)
		},
	})
}

export function useExpenseByIdQuery(expenseId?: string) {
	return useQuery({
		queryKey: ['expenses', expenseId],
		enabled: !!expenseId,
		queryFn: () => {
			if (!expenseId) throw new Error('expenseId is required')

			return api.expenses.getById(expenseId)
		},
	})
}

export function useCreateExpenseMutation() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationKey: ['expenses', 'create'],
		mutationFn: ({ activityId, data }: CreateExpenseVariables) => api.expenses.postByActivityId(activityId, data),
		onMutate: async ({ activityId, data }: CreateExpenseVariables) => {
			await queryClient.cancelQueries({
				queryKey: ['expenses', 'activity', activityId],
			})

			const previousLists = getExpenseLists(queryClient)
			const currentExpenses = queryClient.getQueryData<ExpenseListResponse>(['expenses', 'activity', activityId])

			if (currentExpenses) {
				queryClient.setQueryData<ExpenseListResponse>(['expenses', 'activity', activityId], {
					expenses: [
						...currentExpenses.expenses,
						{
							amountInCents: data.amountInCents,
							id: OPTIMISTIC_EXPENSE_ID,
							name: data.title,
							participantsCount: data.participantsIds.length,
						},
					],
				})

				const allUsers = await queryClient.getQueryData<UserListResponse>(['users', 'all'])

				queryClient.setQueryData<ExpenseDetailResponse>(['expenses', OPTIMISTIC_EXPENSE_ID], {
					id: OPTIMISTIC_EXPENSE_ID,
					createdAt: new Date().toISOString(),
					activityId,
					activityName: '',
					name: data.title,
					payments: [],
					amountInCents: data.amountInCents,
					participants: data.participantsIds.map((userId) => {
						const user = allUsers?.users.find((user) => user.id === userId)
						return {
							amountOwedInCents: Math.floor(data.amountInCents / data.participantsIds.length),
							amountPaidInCents: 0,
							email: user?.email ?? '',
							name: user?.name ?? '',
							paymentStatus: 'pending',
							remainingDebtInCents: Math.floor(data.amountInCents / data.participantsIds.length),
							userId,
						}
					}),
					payer: undefined,
				} as ExpenseDetailResponse)

				queryClient.setQueryData<ActivityDetailResponse>(['activities', activityId], (prev) => {
					const participants = prev?.participants ?? []
					for (const participantId of data.participantsIds) {
						if (!participants.some((p) => p.id === participantId)) {
							const user = allUsers?.users.find((user) => user.id === participantId)

							participants.push({
								id: participantId,
								email: user?.email ?? '',
								name: user?.name ?? '',
							})
						}
					}

					return {
						...prev,
						totalAmountInCents: (prev?.totalAmountInCents ?? 0) + data.amountInCents,
						participants: prev?.participants,
					} as ActivityDetailResponse
				})
			}

			return {
				previousLists,
			}
		},
		onError: (_error, _variables, context: ExpensesMutationContext | undefined) => {
			if (!context) return

			for (const [queryKey, previous] of context.previousLists) {
				queryClient.setQueryData(queryKey, previous)
			}
		},
		onSuccess: (data: CreateExpenseResponse, variables: CreateExpenseVariables) => {
			const currentExpenses = queryClient.getQueryData<ExpenseListResponse>(['expenses', 'activity', variables.activityId])

			if (!currentExpenses) return

			const optimisticIndex = currentExpenses.expenses.findIndex((expense) => expense.id === OPTIMISTIC_EXPENSE_ID)

			if (optimisticIndex === -1) return

			queryClient.setQueryData<ExpenseListResponse>(['expenses', 'activity', variables.activityId], {
				expenses: currentExpenses.expenses.map((expense, index) =>
					index === optimisticIndex
						? {
								amountInCents: data.amountInCents,
								createdAt: data.createdAt,
								id: data.id,
								name: data.name,
								participantsCount: data.participants.length,
								payer:
									data.payerId && data.payerName
										? {
												name: data.payerName,
												userId: data.payerId,
											}
										: undefined,
							}
						: expense,
				),
			})

			queryClient.removeQueries({
				queryKey: ['expenses', OPTIMISTIC_EXPENSE_ID],
				exact: true,
			})
		},
	})
}

export function useUpdateExpenseMutation() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationKey: ['expenses', 'update'],
		mutationFn: ({ expenseId, data }: UpdateExpenseVariables) => api.expenses.putById(expenseId, data),
		onMutate: async ({ expenseId, data }: UpdateExpenseVariables) => {
			await queryClient.cancelQueries({ queryKey: ['expenses', expenseId] })

			const previousDetail = queryClient.getQueryData<ExpenseDetailResponse>(['expenses', expenseId])
			const previousLists = getExpenseLists(queryClient)

			const allUsers = queryClient.getQueryData<UserListResponse>(['users', 'all'])

			if (previousDetail) {
				queryClient.setQueryData<ExpenseDetailResponse>(['expenses', expenseId], {
					...previousDetail,
					amountInCents: data.amountInCents ?? previousDetail.amountInCents,
					name: data.title ?? previousDetail.name,
					participants: (data.participantsIds ?? []).map((participantId) => {
						const previousParticipant = previousDetail.participants.find((p) => p.userId === participantId)
						const user = allUsers?.users.find((user) => user.id === participantId)

						return {
							amountOwedInCents: Math.floor((data.amountInCents ?? 0) / (data.participantsIds?.length ?? 1)),
							amountPaidInCents: previousParticipant?.amountPaidInCents ?? 0,
							email: user?.email ?? previousParticipant?.email ?? '',
							name: user?.name ?? previousParticipant?.name ?? '',
							paymentStatus: previousParticipant?.paymentStatus ?? 'pending',
							remainingDebtInCents: Math.floor((data.amountInCents ?? 0) / (data.participantsIds?.length ?? 1)),
							userId: participantId,
						}
					}),
				})
			}

			queryClient.setQueryData<ExpenseListResponse>(['expenses', 'activity', previousDetail?.activityId], (prev) => {
				if (!prev) return { expenses: [] }

				prev.expenses = prev.expenses.map((expense) => {
					if (expense.id === expenseId) {
						expense.amountInCents = expense.amountInCents - (previousDetail?.amountInCents ?? 0) + (data.amountInCents ?? 0)
						expense.name = data.title ?? expense.name
						expense.participantsCount = data.participantsIds?.length ?? expense.participantsCount
					}
					return expense
				})

				return prev
			})

			queryClient.setQueryData<ActivityDetailResponse>(['activities', previousDetail?.activityId], (prev) => {
				return {
					...prev,
					totalAmountInCents: (prev?.totalAmountInCents ?? 0) - (previousDetail?.amountInCents ?? 0) + (data.amountInCents ?? 0),
				} as ActivityDetailResponse
			})

			return {
				previousDetail,
				previousLists,
			}
		},
		onError: (_error, variables, context: ExpensesMutationContext | undefined) => {
			if (!context) return

			queryClient.setQueryData(['expenses', variables.expenseId], context.previousDetail)

			for (const [queryKey, previous] of context.previousLists) {
				queryClient.setQueryData(queryKey, previous)
			}
		},
		onSuccess: (data: CreateExpenseResponse, variables: UpdateExpenseVariables) => {
			const currentDetail = queryClient.getQueryData<ExpenseDetailResponse>(['expenses', variables.expenseId])

			if (currentDetail) {
				queryClient.setQueryData<ExpenseDetailResponse>(['expenses', variables.expenseId], {
					...currentDetail,
					amountInCents: data.amountInCents,
					createdAt: data.createdAt,
					id: data.id,
					name: data.name,
					payer:
						data.payerId && data.payerName
							? {
									email: currentDetail.payer?.email ?? '',
									name: data.payerName,
									userId: data.payerId,
								}
							: undefined,
				})
			}

			const currentLists = getExpenseLists(queryClient)

			for (const [queryKey, list] of currentLists) {
				if (!list) continue

				queryClient.setQueryData<ExpenseListResponse>(queryKey, {
					expenses: list.expenses.map((expense) =>
						expense.id === variables.expenseId
							? {
									...expense,
									amountInCents: data.amountInCents,
									createdAt: data.createdAt,
									id: data.id,
									name: data.name,
									participantsCount: data.participants.length,
									payer:
										data.payerId && data.payerName
											? {
													name: data.payerName,
													userId: data.payerId,
												}
											: undefined,
								}
							: expense,
					),
				})
			}
		},
	})
}

export function useDeleteExpenseMutation() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationKey: ['expenses', 'delete'],
		mutationFn: ({ expenseId }: DeleteExpenseVariables) => api.expenses.deleteById(expenseId),
		onMutate: async ({ activityId, expenseId }: DeleteExpenseVariables) => {
			await queryClient.cancelQueries({ queryKey: ['expenses', expenseId] })

			const previousDetail = queryClient.getQueryData<ExpenseDetailResponse>(['expenses', expenseId])
			const previousLists = getExpenseLists(queryClient)

			queryClient.removeQueries({
				queryKey: ['expenses', expenseId],
				exact: true,
			})

			if (activityId) {
				const currentExpenses = queryClient.getQueryData<ExpenseListResponse>(['expenses', 'activity', activityId])

				if (currentExpenses) {
					queryClient.setQueryData<ExpenseListResponse>(['expenses', 'activity', activityId], {
						expenses: currentExpenses.expenses.filter((expense) => expense.id !== expenseId),
					})

					queryClient.setQueryData<ActivityDetailResponse>(
						['activities', activityId],
						(prev) =>
							({
								...prev,
								totalAmountInCents: (prev?.totalAmountInCents ?? 0) - (previousDetail?.amountInCents ?? 0),
							}) as ActivityDetailResponse,
					)
				}
			}

			return {
				previousDetail,
				previousLists,
			}
		},
		onError: (_error, variables, context: ExpensesMutationContext | undefined) => {
			if (!context) return

			queryClient.setQueryData(['expenses', variables.expenseId], context.previousDetail)

			for (const [queryKey, previous] of context.previousLists) {
				queryClient.setQueryData(queryKey, previous)
			}
		},
	})
}

export function useMarkExpensePaymentMutation() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationKey: ['expenses', 'payment'],
		mutationFn: ({ expenseId, data }: MarkExpensePaymentVariables) => api.expenses.postPaymentByExpenseId(expenseId, data),
		onSuccess: (data, variables: MarkExpensePaymentVariables) => {
			const currentDetail = queryClient.getQueryData<ExpenseDetailResponse>(['expenses', variables.expenseId])

			if (!currentDetail) return

			queryClient.setQueryData<ExpenseDetailResponse>(['expenses', variables.expenseId], {
				...currentDetail,
				payments: [data, ...currentDetail.payments],
				participants: currentDetail.participants.map((participant) =>
					participant.userId === data.debtorId
						? {
								...participant,
								amountPaidInCents: participant.amountPaidInCents + data.amountPaidInCents,
								remainingDebtInCents: Math.max(participant.remainingDebtInCents - data.amountPaidInCents, 0),
							}
						: participant,
				),
			})
		},
	})
}

export function useSetExpensePayerMutation() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationKey: ['expenses', 'payer'],
		mutationFn: ({ expenseId, data }: SetExpensePayerVariables) => api.expenses.putPayerByExpenseId(expenseId, data),
		onSuccess: (data: SetExpensePayerResponse, variables: SetExpensePayerVariables) => {
			const currentDetail = queryClient.getQueryData<ExpenseDetailResponse>(['expenses', variables.expenseId])

			if (currentDetail) {
				queryClient.setQueryData<ExpenseDetailResponse>(['expenses', variables.expenseId], {
					...currentDetail,
					payer:
						data.payerId && data.payerName
							? {
									email: currentDetail.payer?.email ?? '',
									name: data.payerName,
									userId: data.payerId,
								}
							: undefined,
				})
			}

			const currentLists = getExpenseLists(queryClient)

			for (const [queryKey, list] of currentLists) {
				if (!list) continue

				queryClient.setQueryData<ExpenseListResponse>(queryKey, {
					expenses: list.expenses.map((expense) =>
						expense.id === variables.expenseId
							? {
									...expense,
									payer:
										data.payerId && data.payerName
											? {
													name: data.payerName,
													userId: data.payerId,
												}
											: undefined,
								}
							: expense,
					),
				})
			}
		},
	})
}

export function useToggleExpenseParticipantPaymentMutation() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationKey: ['expenses', 'participant-payment-toggle'],
		mutationFn: ({ expenseId, participantId }: ToggleExpenseParticipantPaymentVariables) =>
			api.expenses.putParticipantPaymentToggleByExpenseIdAndParticipantId(expenseId, participantId),
		onSuccess: (data: ToggleParticipantPaymentResponse, variables: ToggleExpenseParticipantPaymentVariables) => {
			const currentDetail = queryClient.getQueryData<ExpenseDetailResponse>(['expenses', variables.expenseId])

			if (!currentDetail) return

			queryClient.setQueryData<ExpenseDetailResponse>(['expenses', variables.expenseId], {
				...currentDetail,
				participants: currentDetail.participants.map((participant) =>
					participant.userId === variables.participantId
						? {
								...participant,
								amountOwedInCents: data.amountOwedInCents,
								amountPaidInCents: data.amountPaidInCents,
								email: data.participantEmail,
								name: data.participantName,
								paymentStatus: data.paymentStatus,
								remainingDebtInCents: data.remainingDebtInCents,
							}
						: participant,
				),
			})
		},
	})
}
