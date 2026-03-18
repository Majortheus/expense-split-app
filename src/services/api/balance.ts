import type { AxiosInstance } from 'axios'
import type { ActivityBalanceResponse, BalanceBetweenUsersResponse, DetailedBalanceResponse, UserGlobalBalanceResponse } from '@/@types/api/balance'
import { apiClient } from '@/libs/apiClient'

export class BalanceApiService {
	constructor(private readonly client: AxiosInstance) {}

	async getByActivityId(activityId: string): Promise<ActivityBalanceResponse> {
		const response = await this.client.get<ActivityBalanceResponse>(`/activities/${activityId}/balance`)

		return response.data
	}

	async getBetweenUsers(userId1: string, userId2: string): Promise<BalanceBetweenUsersResponse> {
		const response = await this.client.get<BalanceBetweenUsersResponse>(`/balance/between/${userId1}/${userId2}`)

		return response.data
	}

	async getUserGlobal(userId: string): Promise<UserGlobalBalanceResponse> {
		const response = await this.client.get<UserGlobalBalanceResponse>(`/balance/users/${userId}/global`)

		return response.data
	}

	async getUserDetailed(userId: string): Promise<DetailedBalanceResponse> {
		const response = await this.client.get<DetailedBalanceResponse>(`/balance/users/${userId}/detailed`)

		return response.data
	}
}

export const balanceApi = new BalanceApiService(apiClient)
