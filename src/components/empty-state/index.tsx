import { View } from 'react-native'
import { Button } from '@/components/button'
import { Icon, type IconNames } from '@/components/icon'
import { Typography } from '@/components/typography'

type EmptyStateProps = {
	iconName: IconNames
	message: string
	actionLabel?: string
	onActionPress?: () => void
}

export function EmptyState({ iconName, message, actionLabel, onActionPress }: EmptyStateProps) {
	return (
		<View className="flex-1 items-center justify-center gap-4 px-8">
			<Icon name={iconName} className="h-6 w-6 text-gray-500" />

			<Typography variant="text-sm" className="max-w-[200px] text-center text-gray-400">
				{message}
			</Typography>

			{actionLabel ? (
				<Button startIconName="add-1" endIconName="add-1" className="max-w-[140px]" onPress={onActionPress}>
					{actionLabel}
				</Button>
			) : null}
		</View>
	)
}
