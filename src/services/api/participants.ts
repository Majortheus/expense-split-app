import type { AxiosInstance } from 'axios'
import type { ActivityParticipantsResponse, AddParticipantsRequest, AddParticipantsResponse, RemoveParticipantResponse } from '@/@types/api/participants'
import { apiClient } from '@/libs/apiClient'

export class ParticipantsApiService {
	constructor(private readonly client: AxiosInstance) {}

	async getByActivityId(activityId: string): Promise<ActivityParticipantsResponse> {
		const response = await this.client.get<ActivityParticipantsResponse>(`/activities/${activityId}/participants`)

		return response.data
	}

	async postByActivityId(activityId: string, data: AddParticipantsRequest): Promise<AddParticipantsResponse> {
		const response = await this.client.post<AddParticipantsResponse>(`/activities/${activityId}/participants`, data)

		return response.data
	}

	async deleteByActivityIdAndUserId(activityId: string, userId: string): Promise<RemoveParticipantResponse> {
		const response = await this.client.delete<RemoveParticipantResponse>(`/activities/${activityId}/participants/${userId}`)

		return response.data
	}
}

export const participantsApi = new ParticipantsApiService(apiClient)
