import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type {
	ActivityDetailResponse,
	ActivityListResponse,
	CreateActivityRequest,
	CreateActivityResponse,
	UpdateActivityRequest,
} from '@/@types/api/activities'
import { api } from '@/services/api'

const OPTIMISTIC_ACTIVITY_ID = 'optimistic-activity'

type CreateActivityVariables = {
	data: CreateActivityRequest
	userId: string
}

type UpdateActivityVariables = {
	activityId: string
	data: UpdateActivityRequest
}

type DeleteActivityVariables = {
	activityId: string
}

type ActivitiesMutationContext = {
	previousActivity?: ActivityDetailResponse
	previousLists: Array<[ReadonlyArray<string>, ActivityListResponse | undefined]>
}

function getActivityLists(queryClient: ReturnType<typeof useQueryClient>) {
	return queryClient.getQueriesData<ActivityListResponse>({
		queryKey: ['activities', 'user'],
	}) as ActivitiesMutationContext['previousLists']
}

export function useActivitiesByUserIdQuery(userId?: string) {
	return useQuery({
		queryKey: ['activities', 'user', userId],
		enabled: !!userId,
		queryFn: () => {
			if (!userId) throw new Error('userId is required')

			return api.activities.getByUserId(userId)
		},
	})
}

export function useActivityByIdQuery(activityId?: string) {
	return useQuery({
		queryKey: ['activities', activityId],
		enabled: !!activityId,
		queryFn: () => {
			if (!activityId) throw new Error('activityId is required')

			return api.activities.getById(activityId)
		},
	})
}

export function useCreateActivityMutation() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationKey: ['activities', 'create'],
		mutationFn: ({ data }: CreateActivityVariables) => api.activities.post(data),
		onMutate: async ({ data, userId }: CreateActivityVariables) => {
			await queryClient.cancelQueries({
				queryKey: ['activities', 'user', userId],
			})

			const previousLists = getActivityLists(queryClient)
			const currentActivities = queryClient.getQueryData<ActivityListResponse>(['activities', 'user', userId])

			if (currentActivities) {
				queryClient.setQueryData<ActivityListResponse>(['activities', 'user', userId], {
					activities: [
						{
							activityDate: data.activityDate,
							expensesAmount: 0,
							id: OPTIMISTIC_ACTIVITY_ID,
							name: data.title,
							participants: [],
							participantsAmount: 0,
							totalAmountInCents: 0,
						},
						...currentActivities.activities,
					],
				})
			}

			return {
				previousLists,
			}
		},
		onError: (_error, _variables, context: ActivitiesMutationContext | undefined) => {
			if (!context) return

			for (const [queryKey, previous] of context.previousLists) {
				queryClient.setQueryData(queryKey, previous)
			}
		},
		onSuccess: (data: CreateActivityResponse, variables: CreateActivityVariables) => {
			const currentActivities = queryClient.getQueryData<ActivityListResponse>(['activities', 'user', variables.userId])

			if (!currentActivities) return

			const optimisticIndex = currentActivities.activities.findIndex((activity) => activity.id === OPTIMISTIC_ACTIVITY_ID)

			if (optimisticIndex === -1) return

			queryClient.setQueryData<ActivityListResponse>(['activities', 'user', variables.userId], {
				activities: currentActivities.activities.map((activity, index) =>
					index === optimisticIndex
						? {
								...activity,
								activityDate: data.activityDate,
								id: data.id,
								name: data.name,
							}
						: activity,
				),
			})
		},
	})
}

export function useUpdateActivityMutation() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationKey: ['activities', 'update'],
		mutationFn: ({ activityId, data }: UpdateActivityVariables) => api.activities.putById(activityId, data),
		onMutate: async ({ activityId, data }: UpdateActivityVariables) => {
			await queryClient.cancelQueries({ queryKey: ['activities', activityId] })

			const previousActivity = queryClient.getQueryData<ActivityDetailResponse>(['activities', activityId])
			const previousLists = getActivityLists(queryClient)

			if (previousActivity) {
				queryClient.setQueryData<ActivityDetailResponse>(['activities', activityId], {
					...previousActivity,
					activityDate: data.activityDate ?? previousActivity.activityDate,
					name: data.title ?? previousActivity.name,
				})
			}

			for (const [queryKey, list] of previousLists) {
				if (!list) continue

				queryClient.setQueryData<ActivityListResponse>(queryKey, {
					activities: list.activities.map((activity) =>
						activity.id === activityId
							? {
									...activity,
									activityDate: data.activityDate ?? activity.activityDate,
									name: data.title ?? activity.name,
								}
							: activity,
					),
				})
			}

			return {
				previousActivity,
				previousLists,
			}
		},
		onError: (_error, variables, context: ActivitiesMutationContext | undefined) => {
			if (!context) return

			queryClient.setQueryData(['activities', variables.activityId], context.previousActivity)

			for (const [queryKey, previous] of context.previousLists) {
				queryClient.setQueryData(queryKey, previous)
			}
		},
		onSuccess: (data: CreateActivityResponse, variables: UpdateActivityVariables) => {
			const currentActivity = queryClient.getQueryData<ActivityDetailResponse>(['activities', variables.activityId])

			if (currentActivity) {
				queryClient.setQueryData<ActivityDetailResponse>(['activities', variables.activityId], {
					...currentActivity,
					activityDate: data.activityDate,
					id: data.id,
					name: data.name,
				})
			}

			const currentLists = getActivityLists(queryClient)

			for (const [queryKey, list] of currentLists) {
				if (!list) continue

				queryClient.setQueryData<ActivityListResponse>(queryKey, {
					activities: list.activities.map((activity) =>
						activity.id === variables.activityId
							? {
									...activity,
									activityDate: data.activityDate,
									id: data.id,
									name: data.name,
								}
							: activity,
					),
				})
			}
		},
	})
}

export function useDeleteActivityMutation() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationKey: ['activities', 'delete'],
		mutationFn: ({ activityId }: DeleteActivityVariables) => api.activities.deleteById(activityId),
		onMutate: async ({ activityId }: DeleteActivityVariables) => {
			await queryClient.cancelQueries({ queryKey: ['activities', activityId] })

			const previousActivity = queryClient.getQueryData<ActivityDetailResponse>(['activities', activityId])
			const previousLists = getActivityLists(queryClient)

			queryClient.removeQueries({
				queryKey: ['activities', activityId],
				exact: true,
			})

			for (const [queryKey, list] of previousLists) {
				if (!list) continue

				queryClient.setQueryData<ActivityListResponse>(queryKey, {
					activities: list.activities.filter((activity) => activity.id !== activityId),
				})
			}

			return {
				previousActivity,
				previousLists,
			}
		},
		onError: (_error, variables, context: ActivitiesMutationContext | undefined) => {
			if (!context) return

			queryClient.setQueryData(['activities', variables.activityId], context.previousActivity)

			for (const [queryKey, previous] of context.previousLists) {
				queryClient.setQueryData(queryKey, previous)
			}
		},
	})
}
