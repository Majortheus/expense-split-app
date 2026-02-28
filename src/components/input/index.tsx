import clsx from 'clsx'
import { useState } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { TextInput, type TextInputProps, View } from 'react-native'
import { twMerge } from 'tailwind-merge'
import { Typography } from '../typography'

export type InputProps = TextInputProps & {
	name: string
}

export function Input({ name, className, ...props }: InputProps) {
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
				return (
					<View className="flex-col gap-1">
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
							className={twMerge(
								'flex-row items-center rounded-lg border bg-gray-800 pt-3 pr-4 pb-3 pl-4 text-gray-200 outline-0 placeholder:text-gray-400',
								borderClasses,
							)}
							onChangeText={onChange}
							value={value}
							{...props}
						/>
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
