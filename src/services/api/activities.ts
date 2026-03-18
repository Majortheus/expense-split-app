import type { AxiosInstance } from 'axios'
import type {
	ActivityDetailResponse,
	ActivityListResponse,
	CreateActivityRequest,
	CreateActivityResponse,
	UpdateActivityRequest,
} from '@/@types/api/activities'
import { apiClient } from '@/libs/apiClient'

export class ActivitiesApiService {
	constructor(private readonly client: AxiosInstance) {}

	async post(data: CreateActivityRequest): Promise<CreateActivityResponse> {
		const response = await this.client.post<CreateActivityResponse>('/activities', data)

		return response.data
	}

	async getById(activityId: string): Promise<ActivityDetailResponse> {
		const response = await this.client.get<ActivityDetailResponse>(`/activities/${activityId}`)

		return response.data
	}

	async putById(activityId: string, data: UpdateActivityRequest): Promise<CreateActivityResponse> {
		const response = await this.client.put<CreateActivityResponse>(`/activities/${activityId}`, data)

		return response.data
	}

	async deleteById(activityId: string): Promise<number> {
		const response = await this.client.delete<number>(`/activities/${activityId}`)

		return response.data
	}

	async getByUserId(userId: string): Promise<ActivityListResponse> {
		const response = await this.client.get<ActivityListResponse>(`/users/${userId}/activities`)

		return response.data
	}
}

export const activitiesApi = new ActivitiesApiService(apiClient)
