import { zodResolver } from '@hookform/resolvers/zod'
import { use, useEffect, useState } from 'react'
import { FormProvider, type UseFormReturn, useForm } from 'react-hook-form'
import { Modal, Pressable, View } from 'react-native'
import { z } from 'zod'
import { Button } from '@/components/button'
import { DatePickerInput } from '@/components/date-picker'
import { Icon } from '@/components/icon'
import { Input } from '@/components/input'
import { Typography } from '@/components/typography'
import { useAuth } from '@/hooks/use-auth'
import { useCreateActivityMutation, useUpdateActivityMutation } from '@/services/query/activities'

export const activitySchema = z.object({
	id: z.uuid().optional(),
	title: z.string().trim().min(1, 'Título é obrigatório'),
	date: z.date().min(1, 'Data é obrigatória'),
})

export type ActivityFormData = z.infer<typeof activitySchema>

type ActivityFormModalProps = {
	isOpen: boolean
	onClose: () => void
	defaultValues?: Partial<ActivityFormData>
}

export function ActivityFormModal({ isOpen, onClose, defaultValues }: ActivityFormModalProps) {
	const { user } = useAuth()

	const [isLoading, setIsLoading] = useState(false)

	const createActivityMutation = useCreateActivityMutation()
	const updateActivityMutation = useUpdateActivityMutation()

	const methods = useForm<ActivityFormData>({
		defaultValues: { title: '', date: new Date(), ...defaultValues },
		resolver: zodResolver(activitySchema),
	})

	const { handleSubmit, reset } = methods

	useEffect(() => {
		if (!isOpen) {
			const timeout = setTimeout(() => reset(), 300)
			return () => clearTimeout(timeout)
		}

		return undefined
	}, [isOpen, reset])

	useEffect(() => {
		if (defaultValues) {
			reset(defaultValues)
		}
	}, [defaultValues, reset])

	const submit = async (values: ActivityFormData) => {
		if (!user?.id) return
		try {
			setIsLoading(true)
			if (values.id) {
				await updateActivityMutation.mutateAsync({
					activityId: values.id,
					data: {
						activityDate: values.date.toISOString(),
						title: values.title,
					},
				})
			} else {
				await createActivityMutation.mutateAsync({
					userId: user.id,
					data: {
						activityDate: values.date.toISOString(),
						title: values.title,
					},
				})
			}
			onClose()
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<Modal transparent animationType="fade" visible={isOpen} onRequestClose={onClose}>
			<View className="flex-1 items-center justify-center gap-6 bg-gray-800/80 px-4">
				<Pressable className="absolute inset-0" onPress={onClose} />

				<View className="w-full max-w-[358px] gap-6 rounded-[10px] border border-gray-600 bg-gray-700 p-6">
					<View className="flex-row items-center justify-between">
						<Typography variant="label-md" className="text-gray-100">
							{defaultValues?.id ? 'Editar atividade' : 'Nova atividade'}
						</Typography>

						<Pressable onPress={onClose}>
							<Icon name="delete-1" className="h-4 w-4 text-gray-300" />
						</Pressable>
					</View>

					<FormProvider {...methods}>
						<View className="gap-2">
							<Input name="title" placeholder="Título" />
							<DatePickerInput name="date" placeholder="Data" />
						</View>

						<Button className="w-full" isLoading={isLoading} onPress={handleSubmit(submit)}>
							{isLoading ? 'Salvando...' : 'Salvar'}
						</Button>
					</FormProvider>
				</View>
			</View>
		</Modal>
	)
}
