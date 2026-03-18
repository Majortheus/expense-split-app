export type CreateExpenseRequest = {
	amountInCents: number
	payerId?: string | null
	participantsIds: string[]
	title: string
}

export type UpdateExpenseRequest = {
	amountInCents?: number | null
	participantsIds?: string[] | null
	payerId?: string | null
	title?: string | null
}

export type CreateExpenseResponseParticipantDebt = {
	amountOwedInCents: number
	userId: string
	userName: string
}

export type CreateExpenseResponse = {
	activityId: string
	amountInCents: number
	createdAt?: string | null
	id: string
	name: string
	participants: CreateExpenseResponseParticipantDebt[]
	payerId?: string | null
	payerName?: string | null
}

export type ExpenseListItemPayerInfo = {
	name: string
	userId: string
}

export type ExpenseListItem = {
	amountInCents: number
	createdAt?: string | null
	id: string
	name: string
	participantsCount: number
	payer?: ExpenseListItemPayerInfo
}

export type ExpenseListResponse = {
	expenses: ExpenseListItem[]
}

export type ExpenseDetailResponsePayerInfo = {
	email: string
	name: string
	userId: string
}

export type ExpenseDetailResponseParticipantInfo = {
	amountOwedInCents: number
	amountPaidInCents: number
	email: string
	name: string
	paymentStatus: string
	remainingDebtInCents: number
	userId: string
}

export type ExpenseDetailResponsePaymentInfo = {
	amountPaidInCents: number
	debtorId: string
	debtorName: string
	id: string
	paidAt?: string | null
}

export type ExpenseDetailResponse = {
	activityId: string
	activityName: string
	amountInCents: number
	createdAt?: string | null
	id: string
	name: string
	participants: ExpenseDetailResponseParticipantInfo[]
	payments: ExpenseDetailResponsePaymentInfo[]
	payer?: ExpenseDetailResponsePayerInfo
}

export type MarkPaymentRequest = {
	amountInCents: number
}

export type MarkPaymentResponse = {
	amountPaidInCents: number
	debtorId: string
	debtorName: string
	expenseId: string
	id: string
	paidAt?: string | null
}

export type SetExpensePayerRequest = {
	payerId: string
}

export type SetExpensePayerResponse = {
	id: string
	name: string
	payerId?: string | null
	payerName?: string | null
	updatedAt?: string | null
}

export type ToggleParticipantPaymentResponse = {
	amountOwedInCents: number
	amountPaidInCents: number
	expenseId: string
	participantEmail: string
	participantId: string
	participantName: string
	paymentStatus: string
	remainingDebtInCents: number
}
