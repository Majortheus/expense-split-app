import { Controller, useFormContext } from 'react-hook-form'
import { Platform } from 'react-native'
import { Typography } from '@/components/typography'
import { AndroidDatePicker } from './android-picker'
import { IosDatePicker } from './ios-picker'
import { WebDatePicker } from './web-picker'

type DatePickerFieldProps = {
	name: string
	placeholder?: string
	minimumDate?: Date
	maximumDate?: Date
}

export function DatePickerField({ name, placeholder = 'Data', minimumDate, maximumDate }: DatePickerFieldProps) {
	const { control } = useFormContext()

	return (
		<Controller
			control={control}
			name={name}
			render={({ field: { value, onChange }, fieldState: { error } }) => {
				const commonProps = {
					value: typeof value === 'string' ? value : '',
					onChange,
					placeholder,
					minimumDate,
					maximumDate,
				}

				const picker =
					Platform.OS === 'android' ? (
						<AndroidDatePicker {...commonProps} />
					) : Platform.OS === 'ios' ? (
						<IosDatePicker {...commonProps} />
					) : (
						<WebDatePicker {...commonProps} />
					)

				return (
					<>
						{picker}
						{error && (
							<Typography variant="text-xs" className="text-danger-light">
								{error.message}
							</Typography>
						)}
					</>
				)
			}}
		/>
	)
}
