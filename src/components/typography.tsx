import clsx from 'clsx'
import { Text } from 'react-native'
import { twMerge } from 'tailwind-merge'

type TypographyProps = {
	children: React.ReactNode
	className?: string
	variant?: 'label-lg' | 'label-md' | 'label-sm' | 'text-md' | 'text-sm' | 'text-xs' | 'heading-lg' | 'heading-sm'
	truncate?: boolean
} & React.ComponentProps<typeof Text>

export function Typography({ children, className, variant = 'text-md', truncate = false, ...props }: TypographyProps) {
	return (
		<Text
			className={twMerge(
				'text-gray-100',
				clsx(
					{
						/* label (Inter, SemiBold, 150%) */
						'font-semibold text-[20px] leading-[150%]': variant === 'label-lg',
						'font-semibold text-base leading-[150%]': variant === 'label-md',
						'font-semibold text-sm leading-[150%]': variant === 'label-sm',

						/* text (Inter, Regular, 150%) */
						'font-normal text-base leading-[150%]': variant === 'text-md',
						'font-normal text-sm leading-[150%]': variant === 'text-sm',
						'font-normal text-xs leading-[150%]': variant === 'text-xs',

						/* heading (Sora, Bold, 130%) */
						'font-bold text-[20px] leading-[130%]': variant === 'heading-lg',
						'font-bold text-sm leading-[130%]': variant === 'heading-sm',

						/* utility */
						truncate: truncate,
					},
					className,
				),
			)}
			numberOfLines={truncate ? 1 : undefined}
			ellipsizeMode={truncate ? 'tail' : undefined}
			{...props}
		>
			{children}
		</Text>
	)
}
