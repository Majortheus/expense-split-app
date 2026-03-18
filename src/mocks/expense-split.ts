export type PaymentStatus = 'pending' | 'partial' | 'paid'

export type AppParticipant = {
	id: string
	name: string
	activitiesCount: number
}

export type AppActivity = {
	id: string
	name: string
	activityDate: string
	participantsCount: number
	expensesCount: number
	totalAmountInCents: number
}

export type AppExpense = {
	id: string
	activityId: string
	name: string
	amountInCents: number
	amountPerPersonInCents: number
	status: PaymentStatus
	participantIds: string[]
}

export type AppExpenseParticipant = {
	id: string
	name: string
	amountInCents: number
	status: 'pending' | 'paid'
}

export const participants: AppParticipant[] = [
	{ id: 'jonas-santos', name: 'Jonas Santos', activitiesCount: 1 },
	{ id: 'maria-oliveira', name: 'Maria Oliveira', activitiesCount: 3 },
	{ id: 'ricardo-almeida', name: 'Ricardo Almeida', activitiesCount: 2 },
	{ id: 'lucas-mendes', name: 'Lucas Mendes', activitiesCount: 4 },
	{ id: 'jessica-silva', name: 'Jessica Silva', activitiesCount: 3 },
	{ id: 'rafael-martins', name: 'Rafael Martins', activitiesCount: 5 },
	{ id: 'roberta-alves', name: 'Roberta Alves', activitiesCount: 2 },
	{ id: 'laura-morais', name: 'Laura Morais', activitiesCount: 2 },
]

export const activities: AppActivity[] = [
	{
		id: 'ferias-de-verao',
		name: 'Férias de verão',
		activityDate: '20/12/25',
		participantsCount: 6,
		expensesCount: 3,
		totalAmountInCents: 450000,
	},
	{
		id: 'jantar',
		name: 'Jantar',
		activityDate: '15/10/25',
		participantsCount: 4,
		expensesCount: 4,
		totalAmountInCents: 60000,
	},
	{
		id: 'cinema',
		name: 'Cinema',
		activityDate: '20/10/25',
		participantsCount: 4,
		expensesCount: 2,
		totalAmountInCents: 20000,
	},
	{
		id: 'almoco',
		name: 'Almoço',
		activityDate: '22/10/25',
		participantsCount: 4,
		expensesCount: 3,
		totalAmountInCents: 30000,
	},
	{
		id: 'show',
		name: 'Show',
		activityDate: '30/10/25',
		participantsCount: 4,
		expensesCount: 5,
		totalAmountInCents: 120000,
	},
]

export const activityParticipants = participants.slice(0, 6)

export const activityExpenses: AppExpense[] = [
	{
		id: 'aluguel-da-casa',
		activityId: 'ferias-de-verao',
		name: 'Aluguel da casa',
		amountInCents: 220000,
		amountPerPersonInCents: 110000,
		status: 'partial',
		participantIds: ['jonas-santos', 'maria-oliveira', 'ricardo-almeida', 'lucas-mendes', 'roberta-alves', 'rafael-martins'],
	},
	{
		id: 'alimentacao',
		activityId: 'ferias-de-verao',
		name: 'Alimentação',
		amountInCents: 180000,
		amountPerPersonInCents: 36000,
		status: 'pending',
		participantIds: ['jonas-santos', 'maria-oliveira', 'ricardo-almeida', 'lucas-mendes', 'roberta-alves', 'rafael-martins'],
	},
	{
		id: 'gasolina',
		activityId: 'ferias-de-verao',
		name: 'Gasolina',
		amountInCents: 50000,
		amountPerPersonInCents: 8330,
		status: 'paid',
		participantIds: ['jonas-santos', 'maria-oliveira', 'ricardo-almeida', 'lucas-mendes', 'roberta-alves', 'rafael-martins'],
	},
]

export const expenseParticipants: Record<string, AppExpenseParticipant[]> = {
	'aluguel-da-casa': [
		{ id: 'jonas-santos', name: 'Jonas Santos', amountInCents: 110000, status: 'pending' },
		{ id: 'maria-oliveira', name: 'Maria Oliveira', amountInCents: 110000, status: 'paid' },
	],
}

export const summaryCards = {
	paidAmountInCents: 36000,
	paidExpensesCount: 2,
	pendingAmountInCents: 123000,
	pendingExpensesCount: 6,
	totalExpensesAmountInCents: 680000,
	activitiesCount: 5,
	expensesCount: 13,
	participantsCount: 6,
}

export function getActivityById(activityId: string) {
	if (activityId === 'ferias-de-verao') {
		return {
			id: 'ferias-de-verao',
			name: 'Férias de verão',
			activityDate: '20/12/25',
			totalAmountInCents: 450000,
			participants: activityParticipants,
			expenses: activityExpenses,
		}
	}

	if (activityId === 'empty-state') {
		return {
			id: 'empty-state',
			name: 'Férias de verão',
			activityDate: '20/12/25',
			totalAmountInCents: 0,
			participants: [] as AppParticipant[],
			expenses: [] as AppExpense[],
		}
	}

	const fallback = activities.find((activity) => activity.id === activityId) ?? activities[0]

	return {
		id: fallback.id,
		name: fallback.name,
		activityDate: fallback.activityDate,
		totalAmountInCents: fallback.totalAmountInCents,
		participants: activityParticipants.slice(0, fallback.participantsCount),
		expenses: [],
	}
}

export function getExpenseById(expenseId: string) {
	const expense = activityExpenses.find((item) => item.id === expenseId) ?? activityExpenses[0]
	const activity = getActivityById(expense.activityId)

	return {
		activity,
		expense,
		participants: expenseParticipants[expense.id] ?? [],
	}
}
