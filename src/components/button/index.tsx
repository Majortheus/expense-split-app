import clsx from 'clsx'
import type { ComponentProps } from 'react'
import { TouchableOpacity } from 'react-native'
import { twMerge } from 'tailwind-merge'
import { Typography } from '@/components/typography'
import { Icon, type IconNames } from '../icon'
import { Spinner } from '../spinner'

export interface ButtonProps extends ComponentProps<typeof TouchableOpacity> {
	children?: React.ReactNode
	startIconName?: IconNames
	endIconName?: IconNames
	isLoading?: boolean
	variant?: 'primary' | 'secondary' | 'danger'
}

export function Button({ children, startIconName, endIconName, isLoading = false, variant = 'primary', className, disabled, ...props }: ButtonProps) {
	const isIconOnly = !children
	const isDisabled = disabled || isLoading

	const sizeClasses = clsx({
		'px-4 py-3 rounded-full': !isIconOnly,
		'p-3 rounded-full': isIconOnly,
	})

	const variantClasses = clsx({
		'bg-green-base border border-green-light': variant === 'primary',
		'bg-gray-600 border border-gray-500': variant === 'secondary' || variant === 'danger',
	})

	const textColor = clsx({
		'text-gray-800': variant === 'primary',
		'text-gray-200': variant === 'secondary',
		'text-danger-light': variant === 'danger',
	})

	return (
		<TouchableOpacity
			accessibilityRole="button"
			accessibilityState={{ disabled: isDisabled }}
			activeOpacity={0.7}
			className={twMerge(
				'w-full flex-row items-center justify-center gap-2',
				sizeClasses,
				variantClasses,
				isDisabled ? 'opacity-85' : '',
				'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
				className,
			)}
			disabled={isDisabled}
			{...props}
		>
			{isLoading ? <Spinner variant={variant} /> : startIconName && <Icon name={startIconName} className={twMerge('h-6 w-6', textColor)} />}

			{children && (
				<Typography variant="label-md" className={textColor}>
					{children}
				</Typography>
			)}

			{endIconName && <Icon name={endIconName} className={twMerge('h-6 w-6', textColor)} />}
		</TouchableOpacity>
	)
}
