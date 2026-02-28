import clsx from 'clsx'
import type { ComponentProps } from 'react'
import { useEffect, useMemo, useState } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { Modal, Pressable, TouchableOpacity, View } from 'react-native'
import { FlatList } from 'react-native-gesture-handler'
import { AndroidSoftInputModes, KeyboardAvoidingView, KeyboardController } from 'react-native-keyboard-controller'
import { twMerge } from 'tailwind-merge'
import { Input } from '@/components/input'
import { Typography } from '@/components/typography'

export interface SelectOption {
	label: string
	value: string
	customRender?: React.ReactNode
}

export interface SelectProps extends ComponentProps<typeof View> {
	name: string
	options: SelectOption[]
	placeholder?: string
}

export function Select({ name, options, placeholder, className, ...props }: SelectProps) {
	const { control, setValue, setError, clearErrors, watch } = useFormContext()
	const [open, setOpen] = useState(false)
	const inputValue = watch(`${name}-search-input`)

	const filtered = useMemo(() => {
		if (!inputValue) return options
		return options.filter((o) => o.label.toLowerCase().includes(inputValue.toLowerCase()))
	}, [options, inputValue])

	useEffect(() => {
		if (!open && inputValue && !options.find((o) => o.label === inputValue)) {
			setError(name, { message: 'Opção inválida' })
		}
	}, [open, inputValue, options, name, setError])

	return (
		<Controller
			control={control}
			name={name}
			render={({ field: { value, onChange }, fieldState: { error } }) => {
				function handleSelect(v: string) {
					setOpen(false)
					onChange(v)
					setValue(`${name}-search-input`, options.find((o) => o.value === v)?.label)
					clearErrors(`${name}`)
				}

				return (
					<View className={twMerge('z-10 w-full flex-col gap-1')} {...props}>
						<TouchableOpacity
							className={twMerge('rounded-lg border border-gray-600 bg-gray-800 px-4 py-3', clsx({ 'border-danger-light': error }))}
							activeOpacity={0.7}
							onPress={() => setOpen(true)}
						>
							<Typography variant="label-md" className={twMerge('text-gray-300', clsx({ 'text-gray-200': value || inputValue }))}>
								{value ? options.find((o) => o.value === value)?.label : inputValue ? inputValue : placeholder}
							</Typography>
						</TouchableOpacity>

						{open && (
							<Modal transparent animationType="fade" onRequestClose={() => setOpen(false)}>
								<View className="h-screen w-screen flex-1 items-center justify-center px-4">
									<Pressable className="absolute h-screen w-screen flex-1 bg-[#000000aa]" onPress={() => setOpen(false)} />
									<View className="w-full max-w-md gap-3 rounded-lg bg-gray-700 p-6">
										<Typography variant="heading-sm">Selecione uma opção</Typography>
										<Input name={`${name}-search-input`} placeholder={placeholder} />
										<View className="mt-2 max-h-[160px] rounded-[10px] border border-gray-600 bg-gray-600 py-1">
											<FlatList
												data={filtered}
												keyExtractor={(item) => item.value}
												contentContainerClassName=""
												renderItem={({ item }) => (
													<TouchableOpacity
														key={item.value}
														activeOpacity={0.7}
														onPress={() => handleSelect(item.value)}
														className="px-4 py-1.5 hover:bg-gray-500 active:bg-gray-500"
													>
														{item.customRender ? item.customRender : <Typography variant="label-md">{item.label}</Typography>}
													</TouchableOpacity>
												)}
												ListEmptyComponent={() => (
													<Typography variant="label-md" className="px-4 py-1 text-gray-300">
														Nenhuma opção encontrada
													</Typography>
												)}
											/>
										</View>
									</View>
								</View>
							</Modal>
						)}
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
