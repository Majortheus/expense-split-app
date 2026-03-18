import type { AxiosInstance } from 'axios'
import type {
	GetUsersParams,
	SignInRequest,
	SignInResponse,
	SignUpRequest,
	SignUpResponse,
	UserExpenseStatisticsResponse,
	UserListResponse,
	UserProfileResponse,
} from '@/@types/api/users'
import { apiClient } from '@/libs/apiClient'

export class UsersApiService {
	constructor(private readonly client: AxiosInstance) {}

	async get(params?: GetUsersParams): Promise<UserListResponse> {
		const response = await this.client.get<UserListResponse>('/users', {
			params,
		})

		return response.data
	}

	async getMe(): Promise<UserProfileResponse> {
		const response = await this.client.get<UserProfileResponse>('/users/me')

		return response.data
	}

	async getMeStatistics(): Promise<UserExpenseStatisticsResponse> {
		const response = await this.client.get<UserExpenseStatisticsResponse>('/users/me/statistics')

		return response.data
	}

	async postSignIn(data: SignInRequest): Promise<SignInResponse> {
		const response = await this.client.post<SignInResponse>('/users/sign-in', data)

		return response.data
	}

	async postSignUp(data: SignUpRequest): Promise<SignUpResponse> {
		const response = await this.client.post<SignUpResponse>('/users/sign-up', data)

		return response.data
	}
}

export const usersApi = new UsersApiService(apiClient)
