import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { ActivityParticipantsResponse, AddParticipantsRequest, AddParticipantsResponse, RemoveParticipantResponse } from '@/@types/api/participants'
import { api } from '@/services/api'

type AddParticipantsVariables = {
	activityId: string
	data: AddParticipantsRequest
}

type RemoveParticipantVariables = {
	activityId: string
	userId: string
}

type ParticipantsMutationContext = {
	previousParticipants?: ActivityParticipantsResponse
}

export function useParticipantsByActivityIdQuery(activityId?: string) {
	return useQuery({
		queryKey: ['participants', 'activity', activityId],
		enabled: !!activityId,
		queryFn: () => {
			if (!activityId) throw new Error('activityId is required')

			return api.participants.getByActivityId(activityId)
		},
	})
}

export function useAddParticipantsMutation() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationKey: ['participants', 'add'],
		mutationFn: ({ activityId, data }: AddParticipantsVariables) => api.participants.postByActivityId(activityId, data),
		onSuccess: (data: AddParticipantsResponse, variables: AddParticipantsVariables) => {
			const currentParticipants = queryClient.getQueryData<ActivityParticipantsResponse>(['participants', 'activity', variables.activityId])

			if (!currentParticipants) return

			queryClient.setQueryData<ActivityParticipantsResponse>(['participants', 'activity', variables.activityId], {
				...currentParticipants,
				participants: [...data.addedParticipants, ...currentParticipants.participants],
			})
		},
	})
}

export function useRemoveParticipantMutation() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationKey: ['participants', 'remove'],
		mutationFn: ({ activityId, userId }: RemoveParticipantVariables) => api.participants.deleteByActivityIdAndUserId(activityId, userId),
		onMutate: async ({ activityId, userId }: RemoveParticipantVariables) => {
			await queryClient.cancelQueries({
				queryKey: ['participants', 'activity', activityId],
			})

			const previousParticipants = queryClient.getQueryData<ActivityParticipantsResponse>(['participants', 'activity', activityId])

			if (previousParticipants) {
				queryClient.setQueryData<ActivityParticipantsResponse>(['participants', 'activity', activityId], {
					...previousParticipants,
					participants: previousParticipants.participants.filter((participant) => participant.userId !== userId),
				})
			}

			return {
				previousParticipants,
			}
		},
		onError: (_error, variables, context: ParticipantsMutationContext | undefined) => {
			if (!context) return

			queryClient.setQueryData(['participants', 'activity', variables.activityId], context.previousParticipants)
		},
		onSuccess: (data: RemoveParticipantResponse, variables: RemoveParticipantVariables) => {
			const currentParticipants = queryClient.getQueryData<ActivityParticipantsResponse>(['participants', 'activity', variables.activityId])

			if (!currentParticipants) return

			queryClient.setQueryData<ActivityParticipantsResponse>(['participants', 'activity', variables.activityId], {
				...currentParticipants,
				participants: currentParticipants.participants.filter((participant) => participant.userId !== data.removedUserId),
			})
		},
	})
}
