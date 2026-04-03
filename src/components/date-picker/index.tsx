import DateTimePicker from '@expo/ui/datetimepicker'
import { useState } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { Pressable, View } from 'react-native'
import { Typography } from '@/components/typography'
import { formatDateBR } from '@/utils/formatters'
import { Icon } from '../icon'

type DatePickerInputProps = {
	name: string
	placeholder?: string
}

export function DatePickerInput({ name, placeholder = 'Data' }: DatePickerInputProps) {
	const { control } = useFormContext()
	const [isOpen, setIsOpen] = useState(false)

	return (
		<Controller
			control={control}
			name={name}
			render={({ field: { value, onChange }, fieldState: { error } }) => (
				<>
					<Pressable className="flex-row items-center rounded-lg border border-gray-600 bg-gray-800 px-4 py-3" onPress={() => setIsOpen(true)}>
						<View className="mr-3">
							<Icon name="blank-calendar" className="h-5 w-5 text-gray-200" />
						</View>

						<View className="flex-1">
							<Typography variant="text-md" className={value ? 'text-gray-200' : 'text-gray-400'}>
								{value ? formatDateBR(value) : placeholder}
							</Typography>
						</View>
					</Pressable>
					{error && (
						<Typography variant="text-xs" className="text-danger-light">
							{error.message}
						</Typography>
					)}
					{isOpen && (
						<DateTimePicker
							value={value}
							onValueChange={(event, selectedDate) => {
								console.log({ event, selectedDate })
								onChange(selectedDate)
								setIsOpen(false)
							}}
							mode="date"
							onDismiss={() => setIsOpen(false)}
							timeZoneName="America/Sao_Paulo"
							locale="pt_Br"
							presentation="dialog"
						/>
					)}
				</>
			)}
		/>
	)
}
