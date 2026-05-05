import clsx from 'clsx'
import { View } from 'react-native'
import { twMerge } from 'tailwind-merge'
import { Typography } from '@/components/typography'

type AvatarProps = {
	label: string
	size?: 'sm' | 'md' | 'lg' | 'xl'
	className?: string
}

export function Avatar({ label, size = 'md', className }: AvatarProps) {
	return (
		<View
			className={twMerge(
				'items-center justify-center rounded-full border border-gray-600 bg-gray-700',
				clsx({
					'h-7 w-7': size === 'sm',
					'h-8 w-8': size === 'md',
					'h-[42px] w-[42px]': size === 'lg',
					'h-[56px] w-[56px]': size === 'xl',
				}),
				className,
			)}
		>
			<Typography variant="heading-sm" className={twMerge('text-[11px]', clsx({ 'text-[10px]': size === 'sm', 'text-[20px]': size === 'xl' }))}>
				{label}
			</Typography>
		</View>
	)
}
