export type ActivityBalanceResponseUserInfo = {
	name: string
	userId: string
}

export type ActivityBalanceResponseTransfer = {
	amountInCents: number
	from: ActivityBalanceResponseUserInfo
	to: ActivityBalanceResponseUserInfo
}

export type ActivityBalanceResponse = {
	activityId: string
	activityName: string
	transfers: ActivityBalanceResponseTransfer[]
}

export type BalanceBetweenUsersResponseUserInfo = {
	name: string
	userId: string
}

export type BalanceBetweenUsersResponseNetBalance = {
	amountInCents: number
	creditor: BalanceBetweenUsersResponseUserInfo
	debtor: BalanceBetweenUsersResponseUserInfo
}

export type BalanceBetweenUsersResponseActivityDetail = {
	activityId: string
	activityName: string
	amountInCents: number
	fromUser: string
	toUser: string
}

export type BalanceBetweenUsersResponse = {
	details: BalanceBetweenUsersResponseActivityDetail[]
	netBalance: BalanceBetweenUsersResponseNetBalance
}

export type UserGlobalBalanceResponseActivityBreakdown = {
	activityId: string
	activityName: string
	amountInCents: number
}

export type UserGlobalBalanceResponseCompensatedDebt = {
	activities: UserGlobalBalanceResponseActivityBreakdown[]
	activitiesCount: number
	creditorId: string
	creditorName: string
	netAmountInCents: number
}

export type UserGlobalBalanceResponseCompensatedCredit = {
	activities: UserGlobalBalanceResponseActivityBreakdown[]
	activitiesCount: number
	debtorId: string
	debtorName: string
	netAmountInCents: number
}

export type UserGlobalBalanceResponse = {
	compensatedCredits: UserGlobalBalanceResponseCompensatedCredit[]
	compensatedDebts: UserGlobalBalanceResponseCompensatedDebt[]
	globalNetBalanceInCents: number
}

export type DetailedBalanceResponseCreditDetail = {
	activityId: string
	activityName: string
	amountInCents: number
	debtorId: string
	debtorName: string
	expenseId: string
	expenseName: string
}

export type DetailedBalanceResponseDebtDetail = {
	activityId: string
	activityName: string
	amountInCents: number
	creditorId: string
	creditorName: string
	expenseId: string
	expenseName: string
}

export type DetailedBalanceResponse = {
	credits: DetailedBalanceResponseCreditDetail[]
	debts: DetailedBalanceResponseDebtDetail[]
	totalOwedToUserInCents: number
	totalUserOwesInCents: number
}
