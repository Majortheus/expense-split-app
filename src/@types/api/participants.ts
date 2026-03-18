export type AddParticipantsRequest = {
	participantsIds: string[]
}

export type AddParticipantsResponseParticipantInfo = {
	email: string
	joinedAt?: string | null
	name: string
	userId: string
}

export type AddParticipantsResponse = {
	acitivityId: string
	addedParticipants: AddParticipantsResponseParticipantInfo[]
	message: string
}

export type ActivityParticipantsResponseParticipantsInfo = {
	email: string
	joinedAt?: string | null
	name: string
	userId: string
}

export type ActivityParticipantsResponse = {
	activityId: string
	activityName: string
	participants: ActivityParticipantsResponseParticipantsInfo[]
}

export type RemoveParticipantResponse = {
	activityId: string
	message: string
	removedUserId: string
	removedUserName: string
}
