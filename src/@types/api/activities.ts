export type CreateActivityRequest = {
	activityDate: string
	title: string
}

export type UpdateActivityRequest = {
	activityDate?: string | null
	title?: string | null
}

export type CreateActivityResponse = {
	activityDate: string
	createdAt?: string | null
	id: string
	name: string
}

export type ActivityListItemParticipantInfo = {
	email: string
	id: string
	name: string
}

export type ActivityListItem = {
	activityDate: string
	expensesAmount: number
	id: string
	name: string
	participants: ActivityListItemParticipantInfo[]
	participantsAmount: number
	totalAmountInCents: number
}

export type ActivityListResponse = {
	activities: ActivityListItem[]
}

export type ActivityDetailResponseParticipantInfo = {
	email: string
	id: string
	name: string
}

export type ActivityDetailResponseExpenseParticipantInfo = {
	email: string
	id: string
	name: string
	paymentStatus: string
}

export type ActivityDetailResponseExpenseInfo = {
	amountInCents: number
	id: string
	name: string
	participants: ActivityDetailResponseExpenseParticipantInfo[]
	payerId?: string | null
	payerName?: string | null
	paymentStatus: string
}

export type ActivityDetailResponse = {
	activityDate: string
	expenses: ActivityDetailResponseExpenseInfo[]
	id: string
	name: string
	participants: ActivityDetailResponseParticipantInfo[]
	totalAmountInCents: number
}
