import { useQuery } from '@tanstack/react-query'
import { api } from '@/services/api'

export function useActivityBalanceQuery(activityId?: string) {
	return useQuery({
		queryKey: ['balance', 'activity', activityId],
		enabled: !!activityId,
		queryFn: () => {
			if (!activityId) throw new Error('activityId is required')

			return api.balance.getByActivityId(activityId)
		},
	})
}

export function useBalanceBetweenUsersQuery(userId1?: string, userId2?: string) {
	return useQuery({
		queryKey: ['balance', 'between-users', userId1, userId2],
		enabled: !!userId1 && !!userId2,
		queryFn: () => {
			if (!userId1 || !userId2) {
				throw new Error('userId1 and userId2 are required')
			}

			return api.balance.getBetweenUsers(userId1, userId2)
		},
	})
}

export function useUserGlobalBalanceQuery(userId?: string) {
	return useQuery({
		queryKey: ['balance', 'user', userId, 'global'],
		enabled: !!userId,
		queryFn: () => {
			if (!userId) throw new Error('userId is required')

			return api.balance.getUserGlobal(userId)
		},
	})
}

export function useUserDetailedBalanceQuery(userId?: string) {
	return useQuery({
		queryKey: ['balance', 'user', userId, 'detailed'],
		enabled: !!userId,
		queryFn: () => {
			if (!userId) throw new Error('userId is required')

			return api.balance.getUserDetailed(userId)
		},
	})
}
