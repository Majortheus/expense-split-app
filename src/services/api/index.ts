import { isMockMode } from '@/envs'
import { activitiesApi } from './activities'
import { balanceApi } from './balance'
import { expensesApi } from './expenses'
import { createMockApi } from './mock'
import { participantsApi } from './participants'
import { usersApi } from './users'

export type AppApi = {
	activities: Pick<typeof activitiesApi, 'deleteById' | 'getById' | 'getByUserId' | 'post' | 'putById'>
	balance: Pick<typeof balanceApi, 'getBetweenUsers' | 'getByActivityId' | 'getUserDetailed' | 'getUserGlobal'>
	expenses: Pick<
		typeof expensesApi,
		| 'deleteById'
		| 'getByActivityId'
		| 'getById'
		| 'postByActivityId'
		| 'postPaymentByExpenseId'
		| 'putById'
		| 'putParticipantPaymentToggleByExpenseIdAndParticipantId'
		| 'putPayerByExpenseId'
	>
	participants: Pick<typeof participantsApi, 'deleteByActivityIdAndUserId' | 'getByActivityId' | 'postByActivityId'>
	users: Pick<typeof usersApi, 'get' | 'getMe' | 'getMeStatistics' | 'postSignIn' | 'postSignUp'>
}

const realApi: AppApi = {
	activities: activitiesApi,
	balance: balanceApi,
	expenses: expensesApi,
	participants: participantsApi,
	users: usersApi,
}

export const api: AppApi = isMockMode ? createMockApi() : realApi
