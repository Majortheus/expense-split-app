import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { SignInRequest, SignUpRequest, UserListResponse } from '@/@types/api/users'
import { api } from '@/services/api'
import { setTokenToStorage } from '@/services/storage/token-storage'

const OPTIMISTIC_USER_ID = 'optimistic-user'

type SignUpMutationContext = {
	previousUsers?: UserListResponse
}

export function useUsersQuery(activityId?: string) {
	return useQuery({
		queryKey: ['users', activityId ?? 'all'],
		queryFn: () => api.users.get(activityId ? { activityId } : undefined),
	})
}

export function useUserMeQuery() {
	return useQuery({
		queryKey: ['users', 'me'],
		queryFn: () => api.users.getMe(),
	})
}

export function useUserMeStatisticsQuery() {
	return useQuery({
		queryKey: ['users', 'me', 'statistics'],
		queryFn: () => api.users.getMeStatistics(),
	})
}

export function useUserSignInMutation() {
	return useMutation({
		mutationFn: (data: SignInRequest) => api.users.postSignIn(data),
		mutationKey: ['users', 'sign-in'],
		onSuccess: async (data) => {
			await setTokenToStorage({ accessToken: data.token })
		},
	})
}

export function useUserSignUpMutation() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (data: SignUpRequest) => api.users.postSignUp(data),
		mutationKey: ['users', 'sign-up'],
		onError: (_error, _variables, context: SignUpMutationContext | undefined) => {
			if (!context) return

			queryClient.setQueryData(['users', 'all'], context.previousUsers)
		},
		onMutate: async (data: SignUpRequest) => {
			await queryClient.cancelQueries({ queryKey: ['users', 'all'] })

			const previousUsers = queryClient.getQueryData<UserListResponse>(['users', 'all'])

			if (!previousUsers) {
				return {
					previousUsers,
				}
			}

			queryClient.setQueryData<UserListResponse>(['users', 'all'], {
				users: [
					{
						email: data.email,
						id: OPTIMISTIC_USER_ID,
						name: data.name,
					},
					...previousUsers.users,
				],
			})

			return {
				previousUsers,
			}
		},
		onSuccess: async (data) => {
			await setTokenToStorage({ accessToken: data.token })

			const currentUsers = queryClient.getQueryData<UserListResponse>(['users', 'all'])

			if (!currentUsers) return

			const optimisticIndex = currentUsers.users.findIndex((user) => user.id === OPTIMISTIC_USER_ID)

			if (optimisticIndex === -1) return

			queryClient.setQueryData<UserListResponse>(['users', 'all'], {
				users: currentUsers.users.map((user, index) =>
					index === optimisticIndex
						? {
								email: data.email,
								id: data.id,
								name: data.name,
							}
						: user,
				),
			})
		},
	})
}
