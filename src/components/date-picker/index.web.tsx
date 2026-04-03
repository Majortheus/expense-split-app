import { useState } from 'react'
import { ptBR } from 'react-day-picker/locale'
import { Controller, useFormContext } from 'react-hook-form'
import { View } from 'react-native'
import { Typography } from '@/components/typography'
import { formatDateBR } from '@/utils/formatters'
import { Icon } from '../icon'
import { Button } from '../ui/button'
import { Calendar } from '../ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'

type DatePickerInputProps = {
	name: string
	placeholder?: string
}

export function DatePickerInput({ name, placeholder = 'Data' }: DatePickerInputProps) {
	const { control } = useFormContext<Record<string, Date>>()
	const [isOpen, setIsOpen] = useState(false)

	return (
		<Controller
			control={control}
			name={name}
			render={({ field: { value, onChange }, fieldState: { error } }) => (
				<Popover modal={true} open={isOpen} onOpenChange={setIsOpen}>
					<View>
						<PopoverTrigger asChild>
							<Button className="flex-1 cursor-pointer flex-row items-center rounded-lg border border-gray-600 bg-gray-800 px-4 py-3 font-normal text-base text-gray-200 outline-0">
								<View className="mr-3">
									<Icon name="blank-calendar" className="h-5 w-5 text-gray-200" />
								</View>

								<View className="flex-1">
									<Typography variant="text-md" className={value ? 'text-gray-200' : 'text-gray-400'}>
										{value ? formatDateBR(value) : placeholder}
									</Typography>
								</View>
							</Button>
						</PopoverTrigger>
						{error && (
							<Typography variant="text-xs" className="text-danger-light">
								{error.message}
							</Typography>
						)}
					</View>
					<PopoverContent className="z-[9999] w-auto p-0">
						<Calendar
							mode="single"
							locale={ptBR}
							defaultMonth={value.getMonth() ? value : new Date()}
							selected={value}
							onSelect={(date) => {
								onChange(date)
								setIsOpen(false)
							}}
						/>
					</PopoverContent>
				</Popover>
			)}
		/>
	)
}
