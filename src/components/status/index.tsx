import clsx from 'clsx'
import { View } from 'react-native'
import { twMerge } from 'tailwind-merge'
import { Typography } from '@/components/typography'

export type StatusProps = {
	variant?: 'pending' | 'partial' | 'paid'
	isActive?: boolean
	className?: string
}

export function Status({ variant, isActive = true, className, ...props }: StatusProps) {
	const label = variant === 'pending' ? 'Pendente' : variant === 'partial' ? 'Parcial' : 'Pago'

	const variantClasses = clsx({
		'text-gray-300': !isActive,
		'bg-danger-low text-danger-light': variant === 'pending' && isActive,
		'bg-alert-low text-alert-light': variant === 'partial' && isActive,
		'bg-success-low text-success-light': variant === 'paid' && isActive,
	})

	return (
		<View className="flex-row">
			<Typography variant="text-xs" className={twMerge('rounded-lg px-2 py-1', variantClasses, className)} {...props}>
				{label}
			</Typography>
		</View>
	)
}
