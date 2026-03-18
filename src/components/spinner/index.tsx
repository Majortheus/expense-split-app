import clsx from 'clsx'
import type { ComponentProps } from 'react'
import { ActivityIndicator, View } from 'react-native'
import { twMerge } from 'tailwind-merge'

export interface SpinnerProps extends ComponentProps<typeof View> {
	size?: 'sm' | 'md'
	variant?: 'primary' | 'secondary' | 'danger'
}

export function Spinner({ size = 'sm', variant = 'secondary', className, ...props }: SpinnerProps) {
	const sizeClasses = clsx({
		'h-4 w-4': size === 'sm',
		'h-5 w-5': size === 'md',
	})

	const color = clsx({
		'#0b0b0e': variant === 'primary',
		'#e1e1e6': variant === 'secondary',
		'#e77482': variant === 'danger',
	})

	return (
		<View className={twMerge('items-center justify-center', sizeClasses, className)} {...props}>
			<ActivityIndicator color={color} size={size === 'sm' ? 'small' : 'large'} />
		</View>
	)
}
