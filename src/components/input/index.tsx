import clsx from 'clsx'
import { useState } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { TextInput, type TextInputProps, View } from 'react-native'
import { twMerge } from 'tailwind-merge'
import { Icon, type IconNames } from '@/components/icon'
import { Typography } from '../typography'

export type InputProps = TextInputProps & {
	name: string
	iconName?: IconNames
}

export function Input({ name, className, iconName, ...props }: InputProps) {
	const [focused, setFocused] = useState(false)
	const { control } = useFormContext()

	return (
		<Controller
			control={control}
			name={name}
			render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => {
				const borderClasses = clsx({
					'border-gray-600': !focused && !error,
					'border-danger-light': !focused && error,
					'border-white': focused,
				})

				const wrapperClasses = twMerge('flex-row items-center rounded-lg border bg-gray-800 pr-4 pl-4', borderClasses, className)

				return (
					<View className="flex-col gap-1">
						<View className={wrapperClasses}>
							{iconName ? (
								<View className="mr-3">
									<Icon name={iconName} className="h-5 w-5 text-gray-200" />
								</View>
							) : null}

							<TextInput
								onFocus={(e) => {
									setFocused(true)
									props.onFocus?.(e)
								}}
								onBlur={(e) => {
									setFocused(false)
									props.onBlur?.(e)
									onBlur()
								}}
								className={twMerge('flex-1 py-3 text-gray-200 outline-0 placeholder:text-gray-400')}
								onChangeText={onChange}
								value={value}
								{...props}
							/>
						</View>

						{error && (
							<Typography variant="text-xs" className="text-danger-light">
								{error.message}
							</Typography>
						)}
					</View>
				)
			}}
		/>
	)
}
