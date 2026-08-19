import type { ActivityDetailResponse, ActivityListResponse, CreateActivityRequest, UpdateActivityRequest } from '@/@types/api/activities'
import type { ActivityBalanceResponse, BalanceBetweenUsersResponse, DetailedBalanceResponse, UserGlobalBalanceResponse } from '@/@types/api/balance'
import type { CreateExpenseRequest, ExpenseDetailResponse, MarkPaymentRequest, SetExpensePayerRequest, UpdateExpenseRequest } from '@/@types/api/expenses'
import type { AddParticipantsRequest } from '@/@types/api/participants'
import type { GetUsersParams, SignInRequest, SignUpRequest, UserListItem } from '@/@types/api/users'
import type { AppApi } from './index'

const currentUser = {
	id: 'demo-user',
	name: 'Marina Costa',
	email: 'marina@demo.local',
}

let users: UserListItem[] = [
	currentUser,
	{ id: 'lucas', name: 'Lucas Mendes', email: 'lucas@demo.local' },
	{ id: 'jessica', name: 'Jéssica Silva', email: 'jessica@demo.local' },
	{ id: 'rafael', name: 'Rafael Martins', email: 'rafael@demo.local' },
	{ id: 'maria', name: 'Maria Oliveira', email: 'maria@demo.local' },
	{ id: 'jonas', name: 'Jonas Santos', email: 'jonas@demo.local' },
]

let activities: ActivityDetailResponse[] = [
	{
		id: 'ferias-florianopolis',
		name: 'Viagem para Florianópolis',
		activityDate: '2026-09-18T12:00:00.000Z',
		totalAmountInCents: 486000,
		participants: users.slice(0, 5).map(({ id, name, email }) => ({ id, name, email })),
		expenses: [],
	},
	{
		id: 'jantar-aniversario',
		name: 'Jantar de aniversário',
		activityDate: '2026-08-29T20:00:00.000Z',
		totalAmountInCents: 68400,
		participants: users.slice(0, 4).map(({ id, name, email }) => ({ id, name, email })),
		expenses: [],
	},
	{
		id: 'churrasco-equipe',
		name: 'Churrasco da equipe',
		activityDate: '2026-08-10T15:00:00.000Z',
		totalAmountInCents: 93250,
		participants: users.map(({ id, name, email }) => ({ id, name, email })),
		expenses: [],
	},
]

let expenses: ExpenseDetailResponse[] = [
	createSeedExpense('hospedagem', 'ferias-florianopolis', 'Viagem para Florianópolis', 'Hospedagem', 280000, users.slice(0, 5), ['demo-user', 'lucas']),
	createSeedExpense('passagens', 'ferias-florianopolis', 'Viagem para Florianópolis', 'Passagens', 146000, users.slice(0, 5), ['demo-user']),
	createSeedExpense(
		'mercado',
		'ferias-florianopolis',
		'Viagem para Florianópolis',
		'Mercado',
		60000,
		users.slice(0, 5),
		users.slice(0, 5).map((user) => user.id),
	),
	createSeedExpense('restaurante', 'jantar-aniversario', 'Jantar de aniversário', 'Restaurante', 68400, users.slice(0, 4), ['demo-user', 'jessica', 'rafael']),
	createSeedExpense('compras-churrasco', 'churrasco-equipe', 'Churrasco da equipe', 'Compras do churrasco', 93250, users, ['demo-user', 'maria']),
]

syncActivityExpenses()

function createSeedExpense(
	id: string,
	activityId: string,
	activityName: string,
	name: string,
	amountInCents: number,
	participants: UserListItem[],
	paidIds: string[],
): ExpenseDetailResponse {
	const amountPerPerson = Math.round(amountInCents / participants.length)
	return {
		id,
		activityId,
		activityName,
		name,
		amountInCents,
		createdAt: new Date().toISOString(),
		payer: { userId: currentUser.id, name: currentUser.name, email: currentUser.email },
		payments: [],
		participants: participants.map((participant) => {
			const isPaid = paidIds.includes(participant.id)
			return {
				userId: participant.id,
				name: participant.name,
				email: participant.email,
				amountOwedInCents: amountPerPerson,
				amountPaidInCents: isPaid ? amountPerPerson : 0,
				remainingDebtInCents: isPaid ? 0 : amountPerPerson,
				paymentStatus: isPaid ? 'paid' : 'pending',
			}
		}),
	}
}

function createId(prefix: string) {
	return `${prefix}-${Date.now()}-${Math.round(Math.random() * 10000)}`
}

function syncActivityExpenses() {
	activities = activities.map((activity) => {
		const activityExpenses = expenses.filter((expense) => expense.activityId === activity.id)
		return {
			...activity,
			totalAmountInCents: activityExpenses.reduce((total, expense) => total + expense.amountInCents, 0),
			expenses: activityExpenses.map((expense) => ({
				id: expense.id,
				name: expense.name,
				amountInCents: expense.amountInCents,
				payerId: expense.payer?.userId,
				payerName: expense.payer?.name,
				paymentStatus: getPaymentStatus(expense),
				participants: expense.participants.map((participant) => ({
					id: participant.userId,
					name: participant.name,
					email: participant.email,
					paymentStatus: participant.paymentStatus,
				})),
			})),
		}
	})
}

function getPaymentStatus(expense: ExpenseDetailResponse) {
	if (expense.participants.every((participant) => participant.paymentStatus === 'paid')) return 'paid'
	if (expense.participants.some((participant) => participant.paymentStatus === 'paid')) return 'partial'
	return 'pending'
}

function getActivityList(): ActivityListResponse {
	return {
		activities: activities.map((activity) => ({
			id: activity.id,
			name: activity.name,
			activityDate: activity.activityDate,
			totalAmountInCents: activity.totalAmountInCents,
			participants: activity.participants,
			participantsAmount: activity.participants.length,
			expensesAmount: activity.expenses.length,
		})),
	}
}

function getUser(id: string) {
	return users.find((user) => user.id === id) ?? currentUser
}

export function createMockApi(): AppApi {
	return {
		users: {
			async get(params?: GetUsersParams) {
				const participantIds = params?.activityId
					? (activities.find((activity) => activity.id === params.activityId)?.participants.map((item) => item.id) ?? [])
					: []
				return { users: users.map((user) => ({ ...user, isInActivity: participantIds.includes(user.id) })) }
			},
			async getMe() {
				return { ...currentUser, createdAt: '2026-01-10T12:00:00.000Z' }
			},
			async getMeStatistics() {
				const totalExpensesAmountInCents = expenses.reduce((total, expense) => total + expense.amountInCents, 0)
				const currentUserExpenses = expenses.flatMap((expense) => expense.participants.filter((participant) => participant.userId === currentUser.id))
				return {
					activitiesCount: activities.length,
					expensesCount: expenses.length,
					uniqueParticipantsCount: users.length - 1,
					totalExpensesAmountInCents,
					amountPaidInCents: currentUserExpenses.reduce((total, participant) => total + participant.amountPaidInCents, 0),
					amountToPayInCents: currentUserExpenses.reduce((total, participant) => total + participant.remainingDebtInCents, 0),
					paidExpensesCount: currentUserExpenses.filter((participant) => participant.paymentStatus === 'paid').length,
					expensesToPayCount: currentUserExpenses.filter((participant) => participant.paymentStatus !== 'paid').length,
				}
			},
			async postSignIn(_data: SignInRequest) {
				return { ...currentUser, token: 'demo-token' }
			},
			async postSignUp(data: SignUpRequest) {
				const user = { id: createId('user'), name: data.name, email: data.email }
				users = [user, ...users]
				return { ...user, token: 'demo-token' }
			},
		},
		activities: {
			async post(data: CreateActivityRequest) {
				const activity = {
					id: createId('activity'),
					name: data.title,
					activityDate: data.activityDate,
					totalAmountInCents: 0,
					participants: [{ ...currentUser }],
					expenses: [],
				}
				activities = [activity, ...activities]
				return { id: activity.id, name: activity.name, activityDate: activity.activityDate, createdAt: new Date().toISOString() }
			},
			async getById(activityId: string) {
				return activities.find((activity) => activity.id === activityId) ?? activities[0]
			},
			async putById(activityId: string, data: UpdateActivityRequest) {
				const activity = activities.find((item) => item.id === activityId) ?? activities[0]
				activity.name = data.title ?? activity.name
				activity.activityDate = data.activityDate ?? activity.activityDate
				return { id: activity.id, name: activity.name, activityDate: activity.activityDate, createdAt: new Date().toISOString() }
			},
			async deleteById(activityId: string) {
				activities = activities.filter((activity) => activity.id !== activityId)
				expenses = expenses.filter((expense) => expense.activityId !== activityId)
				return 1
			},
			async getByUserId(_userId: string) {
				return getActivityList()
			},
		},
		participants: {
			async getByActivityId(activityId: string) {
				const activity = activities.find((item) => item.id === activityId) ?? activities[0]
				return {
					activityId: activity.id,
					activityName: activity.name,
					participants: activity.participants.map((participant) => ({ userId: participant.id, name: participant.name, email: participant.email })),
				}
			},
			async postByActivityId(activityId: string, data: AddParticipantsRequest) {
				const activity = activities.find((item) => item.id === activityId) ?? activities[0]
				const addedParticipants = data.participantsIds
					.filter((id) => !activity.participants.some((participant) => participant.id === id))
					.map((id) => getUser(id))
				activity.participants.push(...addedParticipants.map(({ id, name, email }) => ({ id, name, email })))
				return {
					acitivityId: activity.id,
					message: 'Participantes adicionados',
					addedParticipants: addedParticipants.map((participant) => ({ userId: participant.id, name: participant.name, email: participant.email })),
				}
			},
			async deleteByActivityIdAndUserId(activityId: string, userId: string) {
				const activity = activities.find((item) => item.id === activityId) ?? activities[0]
				const user = getUser(userId)
				activity.participants = activity.participants.filter((participant) => participant.id !== userId)
				return { activityId, removedUserId: userId, removedUserName: user.name, message: 'Participante removido' }
			},
		},
		expenses: {
			async getById(expenseId: string) {
				return expenses.find((expense) => expense.id === expenseId) ?? expenses[0]
			},
			async putById(expenseId: string, data: UpdateExpenseRequest) {
				const expense = expenses.find((item) => item.id === expenseId) ?? expenses[0]
				expense.name = data.title ?? expense.name
				expense.amountInCents = data.amountInCents ?? expense.amountInCents
				if (data.participantsIds) expense.participants = createParticipants(data.participantsIds, expense.amountInCents)
				syncActivityExpenses()
				return toCreateExpenseResponse(expense)
			},
			async deleteById(expenseId: string) {
				expenses = expenses.filter((expense) => expense.id !== expenseId)
				syncActivityExpenses()
				return 1
			},
			async getByActivityId(activityId: string) {
				return {
					expenses: expenses
						.filter((expense) => expense.activityId === activityId)
						.map((expense) => ({
							id: expense.id,
							name: expense.name,
							amountInCents: expense.amountInCents,
							createdAt: expense.createdAt,
							participantsCount: expense.participants.length,
							payer: expense.payer ? { userId: expense.payer.userId, name: expense.payer.name } : undefined,
						})),
				}
			},
			async postByActivityId(activityId: string, data: CreateExpenseRequest) {
				const activity = activities.find((item) => item.id === activityId) ?? activities[0]
				const expense: ExpenseDetailResponse = {
					id: createId('expense'),
					activityId,
					activityName: activity.name,
					name: data.title,
					amountInCents: data.amountInCents,
					createdAt: new Date().toISOString(),
					participants: createParticipants(data.participantsIds, data.amountInCents),
					payments: [],
					payer: data.payerId ? toPayer(getUser(data.payerId)) : undefined,
				}
				expenses = [expense, ...expenses]
				syncActivityExpenses()
				return toCreateExpenseResponse(expense)
			},
			async postPaymentByExpenseId(expenseId: string, data: MarkPaymentRequest) {
				const expense = expenses.find((item) => item.id === expenseId) ?? expenses[0]
				const participant = expense.participants.find((item) => item.userId === currentUser.id) ?? expense.participants[0]
				participant.amountPaidInCents += data.amountInCents
				participant.remainingDebtInCents = Math.max(participant.amountOwedInCents - participant.amountPaidInCents, 0)
				participant.paymentStatus = participant.remainingDebtInCents === 0 ? 'paid' : 'partial'
				return {
					id: createId('payment'),
					expenseId,
					debtorId: participant.userId,
					debtorName: participant.name,
					amountPaidInCents: data.amountInCents,
					paidAt: new Date().toISOString(),
				}
			},
			async putPayerByExpenseId(expenseId: string, data: SetExpensePayerRequest) {
				const expense = expenses.find((item) => item.id === expenseId) ?? expenses[0]
				expense.payer = toPayer(getUser(data.payerId))
				return { id: expense.id, name: expense.name, payerId: expense.payer.userId, payerName: expense.payer.name, updatedAt: new Date().toISOString() }
			},
			async putParticipantPaymentToggleByExpenseIdAndParticipantId(expenseId: string, participantId: string) {
				const expense = expenses.find((item) => item.id === expenseId) ?? expenses[0]
				const participant = expense.participants.find((item) => item.userId === participantId) ?? expense.participants[0]
				const isPaid = participant.paymentStatus === 'paid'
				participant.paymentStatus = isPaid ? 'pending' : 'paid'
				participant.amountPaidInCents = isPaid ? 0 : participant.amountOwedInCents
				participant.remainingDebtInCents = isPaid ? participant.amountOwedInCents : 0
				syncActivityExpenses()
				return {
					expenseId,
					participantId,
					participantName: participant.name,
					participantEmail: participant.email,
					amountOwedInCents: participant.amountOwedInCents,
					amountPaidInCents: participant.amountPaidInCents,
					remainingDebtInCents: participant.remainingDebtInCents,
					paymentStatus: participant.paymentStatus,
				}
			},
		},
		balance: createBalanceApi(),
	}
}

function createParticipants(ids: string[], amountInCents: number) {
	const amountPerPerson = Math.round(amountInCents / Math.max(ids.length, 1))
	return ids.map((id) => {
		const user = getUser(id)
		return {
			userId: user.id,
			name: user.name,
			email: user.email,
			amountOwedInCents: amountPerPerson,
			amountPaidInCents: 0,
			remainingDebtInCents: amountPerPerson,
			paymentStatus: 'pending',
		}
	})
}

function toPayer(user: UserListItem) {
	return { userId: user.id, name: user.name, email: user.email }
}

function toCreateExpenseResponse(expense: ExpenseDetailResponse) {
	return {
		id: expense.id,
		activityId: expense.activityId,
		name: expense.name,
		amountInCents: expense.amountInCents,
		createdAt: expense.createdAt,
		payerId: expense.payer?.userId,
		payerName: expense.payer?.name,
		participants: expense.participants.map((participant) => ({
			userId: participant.userId,
			userName: participant.name,
			amountOwedInCents: participant.amountOwedInCents,
		})),
	}
}

function createBalanceApi(): AppApi['balance'] {
	return {
		async getByActivityId(activityId: string): Promise<ActivityBalanceResponse> {
			const activity = activities.find((item) => item.id === activityId) ?? activities[0]
			return {
				activityId: activity.id,
				activityName: activity.name,
				transfers: [{ amountInCents: 41800, from: { userId: 'lucas', name: 'Lucas Mendes' }, to: { userId: currentUser.id, name: currentUser.name } }],
			}
		},
		async getBetweenUsers(userId1: string, userId2: string): Promise<BalanceBetweenUsersResponse> {
			return {
				details: [{ activityId: activities[0].id, activityName: activities[0].name, amountInCents: 41800, fromUser: userId1, toUser: userId2 }],
				netBalance: {
					amountInCents: 41800,
					creditor: { userId: userId2, name: getUser(userId2).name },
					debtor: { userId: userId1, name: getUser(userId1).name },
				},
			}
		},
		async getUserGlobal(_userId: string): Promise<UserGlobalBalanceResponse> {
			return {
				globalNetBalanceInCents: 65200,
				compensatedDebts: [],
				compensatedCredits: [
					{
						debtorId: 'lucas',
						debtorName: 'Lucas Mendes',
						netAmountInCents: 65200,
						activitiesCount: 2,
						activities: activities.slice(0, 2).map((activity) => ({ activityId: activity.id, activityName: activity.name, amountInCents: 32600 })),
					},
				],
			}
		},
		async getUserDetailed(_userId: string): Promise<DetailedBalanceResponse> {
			return {
				totalOwedToUserInCents: 65200,
				totalUserOwesInCents: 0,
				debts: [],
				credits: [
					{
						activityId: activities[0].id,
						activityName: activities[0].name,
						expenseId: expenses[0].id,
						expenseName: expenses[0].name,
						debtorId: 'lucas',
						debtorName: 'Lucas Mendes',
						amountInCents: 65200,
					},
				],
			}
		},
	}
}
