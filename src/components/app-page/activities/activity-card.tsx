import clsx from 'clsx'
import type { ComponentProps } from 'react'
import { TouchableOpacity, View } from 'react-native'
import { twMerge } from 'tailwind-merge'
import type { ActivityListItem } from '@/@types/api/activities'
import { Typography } from '@/components/typography'
import { formatCurrencyBRL, formatDateBR, formatExpenseCount, formatParticipantCount } from '@/utils/formatters'
import { ActivityCardMeta } from './activity-card-meta'

type ActivityCardProps = ComponentProps<typeof TouchableOpacity> & {
	activity: ActivityListItem
}

export function ActivityCard({ activity, className, ...props }: ActivityCardProps) {
	return (
		<TouchableOpacity
			activeOpacity={0.7}
			className={twMerge('gap-3 rounded-[10px] border border-gray-600 bg-gray-700 p-4', className)}
			// onPress={() => {}}
			{...props}
		>
			<View className="flex-row items-start justify-between gap-3">
				<View className="flex-1">
					<Typography variant="label-md" className="text-gray-100">
						{activity.name}
					</Typography>
				</View>

				<View className="shrink-0 items-end">
					<Typography variant="text-sm" className={clsx('text-gray-200')}>
						{formatCurrencyBRL(activity.totalAmountInCents)}
					</Typography>
				</View>
			</View>

			<View className="flex-row flex-wrap justify-between gap-3 border-gray-600 border-t pt-4">
				<ActivityCardMeta iconName="blank-calendar" label={formatDateBR(new Date(activity.activityDate))} />
				<ActivityCardMeta iconName="user-multiple-group" label={formatParticipantCount(activity.participantsAmount)} />
				<ActivityCardMeta iconName="dollar-coin-1" label={formatExpenseCount(activity.expensesAmount)} />
			</View>
		</TouchableOpacity>
	)
}
