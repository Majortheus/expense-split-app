import clsx from 'clsx'
import type { ComponentProps } from 'react'
import { View } from 'react-native'
import { twMerge } from 'tailwind-merge'
import { Icon } from '@/components/icon'
import { Typography } from '@/components/typography'
import type { IconNames } from '@/constants/icons'

type ActivityCardMetaProps = ComponentProps<typeof View> & {
	iconName: IconNames
	label: string
}

export function ActivityCardMeta({ iconName, label, className, ...props }: ActivityCardMetaProps) {
	return (
		<View className={twMerge('flex-row items-center gap-2', className)} {...props}>
			<Icon name={iconName} className={clsx('h-4 w-4', 'text-gray-400')} />

			<Typography variant="text-sm" className="text-gray-400">
				{label}
			</Typography>
		</View>
	)
}
