import clsx from 'clsx'
import type { ComponentProps } from 'react'
import { useEffect, useMemo, useState } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { Modal, Pressable, TouchableOpacity, View } from 'react-native'
import { FlatList } from 'react-native-gesture-handler'
import { twMerge } from 'tailwind-merge'
import { Input } from '@/components/input'
import { Typography } from '@/components/typography'
import { Icon } from '../icon'

export interface SelectOption {
	label: string
	value: string
	customRender?: React.ReactNode
}

export interface SelectProps extends ComponentProps<typeof View> {
	name: string
	options: SelectOption[]
	placeholder?: string
	multiple?: boolean
}

export function Select({ name, options, placeholder, multiple = false, ...props }: SelectProps) {
	const { control, setError, clearErrors, watch } = useFormContext()
	const [open, setOpen] = useState(false)
	const inputValue: string = watch(`${name}-search-input`)
	const selected: string[] = watch(name) ?? []

	const filtered = useMemo(() => {
		return options.filter((o) => !selected.includes(o.value)).filter((o) => o.label.toLowerCase().includes(inputValue?.toLowerCase() ?? ''))
	}, [options, inputValue, selected])

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
					if (multiple) {
						const currentValues = Array.isArray(value) ? value : []
						const newValue = [...currentValues, v]
						onChange(newValue)
					} else {
						onChange([v])
						setOpen(false)
					}
					clearErrors(`${name}`)
				}

				function handleDeselect(v: string) {
					if (multiple) {
						const currentValues = Array.isArray(value) ? value : []
						const newValue = currentValues.filter((val) => val !== v)
						onChange(newValue)
					} else {
						onChange([])
					}
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
										<Typography variant="heading-sm">{multiple ? 'Selecione uma ou mais opções' : 'Selecione uma opção'}</Typography>
										<Input name={`${name}-search-input`} placeholder="Busque na lista" />
										<Typography variant="heading-sm">Lista:</Typography>
										<View className="mt-2 max-h-[160px] rounded-[10px] border border-gray-600 bg-gray-600 py-1">
											<FlatList
												data={filtered}
												keyExtractor={(item) => item.value}
												renderItem={({ item }) => (
													<TouchableOpacity
														key={item.value}
														activeOpacity={0.7}
														onPress={() => handleSelect(item.value)}
														className="flex-1 flex-row items-center gap-3 px-4 py-1.5 hover:bg-gray-500 active:bg-gray-500"
													>
														<View className="h-8 w-8 items-center justify-center rounded-full bg-gray-500">
															<Typography variant="heading-sm" className="text-[11px]">
																UN
															</Typography>
														</View>
														<Typography variant="label-md" className="flex-1">
															{item.label}
														</Typography>
													</TouchableOpacity>
												)}
												ListEmptyComponent={() => (
													<Typography variant="label-md" className="px-4 py-1 text-gray-300">
														Nenhuma opção encontrada
													</Typography>
												)}
											/>
										</View>
										<View className="max-h-[160px] gap-2">
											{value && value.length > 0 && (
												<Typography variant="label-md">{value.length > 1 ? 'Opções selecionadas' : 'Opção selecionada'}</Typography>
											)}
											<FlatList
												data={value}
												keyExtractor={(item) => item.value}
												contentContainerClassName="gap-3"
												renderItem={({ item }) => (
													<View className="flex-1 flex-row items-center gap-3 px-4 py-1.5">
														<Typography variant="label-md" className="flex-1">
															{options.find((o) => o.value === item)?.label}
														</Typography>
														<TouchableOpacity activeOpacity={0.7} onPress={() => handleDeselect(item)}>
															<Icon name="recycle-bin-2" className="h-6 w-6 text-danger-light" />
														</TouchableOpacity>
													</View>
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
