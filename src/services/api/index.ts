import { activitiesApi } from './activities'
import { balanceApi } from './balance'
import { expensesApi } from './expenses'
import { participantsApi } from './participants'
import { usersApi } from './users'

export const api = {
	activities: activitiesApi,
	balance: balanceApi,
	expenses: expensesApi,
	participants: participantsApi,
	users: usersApi,
}
