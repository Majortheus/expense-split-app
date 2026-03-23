import { DateTimePickerAndroid, type DateTimePickerEvent } from '@react-native-community/datetimepicker'
import { Pressable, View } from 'react-native'
import { Icon } from '@/components/icon'
import { Typography } from '@/components/typography'
import { clampDate, formatDisplayDate, parseDisplayDate, startOfToday } from './utils'

type AndroidDatePickerProps = {
	value?: string
	onChange: (value: string) => void
	placeholder?: string
	minimumDate?: Date
	maximumDate?: Date
}

export function AndroidDatePicker({ value, onChange, placeholder = 'Data', minimumDate, maximumDate }: AndroidDatePickerProps) {
	const currentDate = clampDate(parseDisplayDate(value) ?? startOfToday(), minimumDate, maximumDate)

	const openPicker = () => {
		DateTimePickerAndroid.open({
			value: currentDate,
			mode: 'date',
			minimumDate,
			maximumDate,
			onChange: (_event: DateTimePickerEvent, selectedDate?: Date) => {
				if (!selectedDate) return
				onChange(formatDisplayDate(selectedDate))
			},
		})
	}

	return (
		<Pressable className="flex-row items-center rounded-lg border border-gray-600 bg-gray-800 px-4 py-3" onPress={openPicker}>
			<View className="mr-3">
				<Icon name="blank-calendar" className="h-5 w-5 text-gray-200" />
			</View>

			<View className="flex-1">
				<Typography variant="text-md" className={value ? 'text-gray-200' : 'text-gray-400'}>
					{value || placeholder}
				</Typography>
			</View>
		</Pressable>
	)
}
