export type SignInRequest = {
	email: string
	password: string
}

export type SignInResponse = {
	email: string
	id: string
	name: string
	token: string
}

export type SignUpRequest = {
	email: string
	name: string
	password: string
}

export type SignUpResponse = {
	email: string
	id: string
	name: string
	token: string
}

export type UserListItem = {
	email: string
	id: string
	isInActivity?: boolean | null
	name: string
}

export type UserListResponse = {
	users: UserListItem[]
}

export type UserProfileResponse = {
	createdAt?: string | null
	email: string
	id: string
	name: string
}

export type UserExpenseStatisticsResponse = {
	activitiesCount: number
	amountPaidInCents: number
	amountToPayInCents: number
	expensesCount: number
	expensesToPayCount: number
	paidExpensesCount: number
	totalExpensesAmountInCents: number
	uniqueParticipantsCount: number
}

export type GetUsersParams = {
	activityId?: string
}
