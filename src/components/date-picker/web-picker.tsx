import { TextInput, View } from 'react-native'
import { Icon } from '@/components/icon'
import { clampDate, fromWebInputValue, parseDisplayDate, startOfToday, toWebDateInputValue } from './utils'

type WebDatePickerProps = {
	value?: string
	onChange: (value: string) => void
	placeholder?: string
	minimumDate?: Date
	maximumDate?: Date
}

export function WebDatePicker({ value, onChange, placeholder = 'Data', minimumDate, maximumDate }: WebDatePickerProps) {
	const currentDate = clampDate(parseDisplayDate(value) ?? startOfToday(), minimumDate, maximumDate)

	return (
		<View className="gap-1">
			<View className="flex-row items-center rounded-lg border border-gray-600 bg-gray-800 px-4 py-3">
				<View className="mr-3">
					<Icon name="blank-calendar" className="h-5 w-5 text-gray-200" />
				</View>

				<TextInput
					className="flex-1 py-0 font-normal text-base text-gray-200 outline-0 placeholder:text-gray-400"
					placeholder={placeholder}
					placeholderTextColor="#8B8C95"
					style={{ color: '#e1e1e6', flex: 1 }}
					{...({ type: 'date' } as any)}
					value={value ? toWebDateInputValue(currentDate) : ''}
					{...({
						min: minimumDate ? toWebDateInputValue(minimumDate) : undefined,
						max: maximumDate ? toWebDateInputValue(maximumDate) : undefined,
					} as any)}
					onChangeText={(nextValue) => onChange(fromWebInputValue(nextValue))}
				/>
			</View>
		</View>
	)
}
