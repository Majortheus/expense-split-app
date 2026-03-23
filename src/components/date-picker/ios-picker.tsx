import DateTimePicker from '@react-native-community/datetimepicker'
import { useState } from 'react'
import { Pressable, View } from 'react-native'
import { Icon } from '@/components/icon'
import { Typography } from '@/components/typography'
import { clampDate, formatDisplayDate, parseDisplayDate, startOfToday } from './utils'

type IosDatePickerProps = {
	value?: string
	onChange: (value: string) => void
	placeholder?: string
	minimumDate?: Date
	maximumDate?: Date
}

export function IosDatePicker({ value, onChange, placeholder = 'Data', minimumDate, maximumDate }: IosDatePickerProps) {
	const [open, setOpen] = useState(false)
	const currentDate = clampDate(parseDisplayDate(value) ?? startOfToday(), minimumDate, maximumDate)

	return (
		<View className="gap-1">
			<Pressable className="flex-row items-center rounded-lg border border-gray-600 bg-gray-800 px-4 py-3" onPress={() => setOpen((current) => !current)}>
				<View className="mr-3">
					<Icon name="blank-calendar" className="h-5 w-5 text-gray-200" />
				</View>

				<View className="flex-1">
					<Typography variant="text-md" className={value ? 'text-gray-200' : 'text-gray-400'}>
						{value || placeholder}
					</Typography>
				</View>
			</Pressable>

			{open && (
				<View className="overflow-hidden rounded-[12px] border border-gray-600 bg-gray-800">
					<DateTimePicker
						accentColor="#2DD36F"
						display="spinner"
						locale="pt-BR"
						maximumDate={maximumDate}
						minimumDate={minimumDate}
						mode="date"
						onChange={(_, selectedDate) => {
							if (!selectedDate) return
							onChange(formatDisplayDate(selectedDate))
						}}
						value={currentDate}
					/>
				</View>
			)}
		</View>
	)
}
