import clsx from 'clsx'
import type { ComponentProps } from 'react'
import { useEffect, useMemo, useState } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { Modal, Pressable, TouchableOpacity, View } from 'react-native'
import { FlatList, ScrollView } from 'react-native-gesture-handler'
import { twMerge } from 'tailwind-merge'
import { Input } from '@/components/input'
import { Typography } from '@/components/typography'
import { Button } from '../button'
// import { Button } from '../button'
import { Icon } from '../icon'

export interface SelectOption {
	label: string
	value: string
	customRender?: React.ReactNode
}

export interface SelectProps extends ComponentProps<typeof View> {
	name: string
	options: SelectOption[]
	placeholder: string
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
		if (!open && selected.length > 0 && !options.some((o) => selected.includes(o.value))) {
			setError(name, { message: 'Opção inválida' })
		}
	}, [open, selected, options, setError, name])

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
							activeOpacity={0.7}
							onPress={() => setOpen(true)}
							className={twMerge(
								'flex-row items-center rounded-lg border border-gray-600 bg-gray-800 pt-3 pr-4 pb-3 pl-4 text-gray-200 outline-0',
								clsx({ 'border-danger-light': error }),
							)}
						>
							<Typography variant="label-md" className="text-gray-300">
								{placeholder ?? 'Selecione opção(es)'}
							</Typography>
						</TouchableOpacity>

						{value && value.length > 0 && (
							<Pressable onPress={() => setOpen(true)}>
								<ScrollView className={twMerge('mt-2 max-h-[160px] rounded-[10px] border border-gray-600 bg-gray-600 py-1')}>
									{value.map((item: string) => (
										<View key={item} className="flex-row items-center gap-3 px-4 py-1.5">
											<View className="h-8 w-8 items-center justify-center rounded-full bg-gray-500">
												<Typography variant="heading-sm" className="text-[11px]">
													UN
												</Typography>
											</View>
											<Typography variant="label-md" className="flex-1">
												{options.find((o) => o.value === item)?.label}
											</Typography>
										</View>
									))}
								</ScrollView>
							</Pressable>
						)}
						{open && (
							<Modal transparent animationType="fade" onRequestClose={() => setOpen(false)}>
								<Pressable className="absolute h-screen w-screen flex-1 bg-[#000000aa]" onPress={() => setOpen(false)} />
								<View className="h-full w-full items-center justify-center">
									<View className="w-full max-w-md gap-3 rounded-lg bg-gray-700 p-6">
										<Typography variant="heading-sm">{multiple ? 'Selecione uma ou mais opções' : 'Selecione uma opção'}</Typography>
										<Input name={`${name}-search-input`} placeholder="Busque na lista" autoFocus />
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
												keyExtractor={(item) => `selected-${item}`}
												contentContainerClassName="gap-2"
												renderItem={({ item }) => (
													<View className="flex-1 flex-row items-center gap-3 px-4 py-1.5">
														<Typography variant="label-md" className="flex-1">
															{options.find((o) => o.value === item)?.label}
														</Typography>
														<TouchableOpacity activeOpacity={0.7} onPress={() => handleDeselect(item)}>
															<Icon name="recycle-bin-2" className="h-5 w-5 text-danger-light" />
														</TouchableOpacity>
													</View>
												)}
											/>
										</View>
										<Button variant="secondary" onPress={() => setOpen(false)} className="mt-4">
											Fechar
										</Button>
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
