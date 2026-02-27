import clsx from 'clsx'
import type { ComponentProps } from 'react'
import { useState } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { TouchableOpacity, View } from 'react-native'
import { twMerge } from 'tailwind-merge'
import { Status } from '../status'

export type StatusKey = 'pending' | 'partial' | 'paid'

export interface StatusSelectProps extends ComponentProps<typeof View> {
	name: string
}

const DEFAULT_OPTIONS = ['pending', 'paid'] as const

export function StatusSelect({ name, className, ...props }: StatusSelectProps) {
	const { control } = useFormContext()

	return (
		<Controller
			control={control}
			name={name}
			render={({ field: { value, onChange } }) => (
				<View className="flex-row">
					<View className={twMerge('flex-row items-center rounded-lg border border-gray-600 bg-gray-800 p-1', className)} {...props}>
						{DEFAULT_OPTIONS.map((option) => {
							const isSelected = value === option

							return (
								<TouchableOpacity
									key={option}
									accessibilityRole="button"
									accessibilityState={{ selected: isSelected }}
									activeOpacity={0.8}
									onPress={() => {
										onChange?.(option)
									}}
								>
									<Status
										variant={option}
										isActive={isSelected}
										className={clsx({ 'border border-gray-600': isSelected, 'border border-transparent': !isSelected })}
									/>
								</TouchableOpacity>
							)
						})}
					</View>
				</View>
			)}
		/>
	)
}
