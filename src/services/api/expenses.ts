import type { AxiosInstance } from 'axios'
import type {
	CreateExpenseRequest,
	CreateExpenseResponse,
	ExpenseDetailResponse,
	ExpenseListResponse,
	MarkPaymentRequest,
	MarkPaymentResponse,
	SetExpensePayerRequest,
	SetExpensePayerResponse,
	ToggleParticipantPaymentResponse,
	UpdateExpenseRequest,
} from '@/@types/api/expenses'
import { apiClient } from '@/libs/apiClient'

export class ExpensesApiService {
	constructor(private readonly client: AxiosInstance) {}

	async getById(expenseId: string): Promise<ExpenseDetailResponse> {
		const response = await this.client.get<ExpenseDetailResponse>(`/expenses/${expenseId}`)

		return response.data
	}

	async putById(expenseId: string, data: UpdateExpenseRequest): Promise<CreateExpenseResponse> {
		const response = await this.client.put<CreateExpenseResponse>(`/expenses/${expenseId}`, data)

		return response.data
	}

	async deleteById(expenseId: string): Promise<number> {
		const response = await this.client.delete<number>(`/expenses/${expenseId}`)

		return response.data
	}

	async getByActivityId(activityId: string): Promise<ExpenseListResponse> {
		const response = await this.client.get<ExpenseListResponse>(`/activities/${activityId}/expenses`)

		return response.data
	}

	async postByActivityId(activityId: string, data: CreateExpenseRequest): Promise<CreateExpenseResponse> {
		const response = await this.client.post<CreateExpenseResponse>(`/activities/${activityId}/expenses`, data)

		return response.data
	}

	async postPaymentByExpenseId(expenseId: string, data: MarkPaymentRequest): Promise<MarkPaymentResponse> {
		const response = await this.client.post<MarkPaymentResponse>(`/expenses/${expenseId}/payments`, data)

		return response.data
	}

	async putPayerByExpenseId(expenseId: string, data: SetExpensePayerRequest): Promise<SetExpensePayerResponse> {
		const response = await this.client.put<SetExpensePayerResponse>(`/expenses/${expenseId}/payer`, data)

		return response.data
	}

	async putParticipantPaymentToggleByExpenseIdAndParticipantId(expenseId: string, participantId: string): Promise<ToggleParticipantPaymentResponse> {
		const response = await this.client.put<ToggleParticipantPaymentResponse>(`/expenses/${expenseId}/participants/${participantId}/payment/toggle`)

		return response.data
	}
}

export const expensesApi = new ExpensesApiService(apiClient)
