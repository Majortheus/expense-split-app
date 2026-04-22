import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { FormProvider, type UseFormReturn, useForm } from 'react-hook-form'
import { Modal, Pressable, View } from 'react-native'
import { z } from 'zod'
import { Button } from '@/components/button'
import { DatePickerInput } from '@/components/date-picker'
import { Icon } from '@/components/icon'
import { Input } from '@/components/input'
import { Typography } from '@/components/typography'
import { useAuth } from '@/hooks/use-auth'
import { useCreateActivityMutation } from '@/services/query/activities'

export const createActivitySchema = z.object({
	title: z.string().trim().min(1, 'Título é obrigatório'),
	date: z.date().min(1, 'Data é obrigatória'),
})

export type CreateActivityFormData = z.infer<typeof createActivitySchema>

type CreateActivityModalProps = {
	isOpen: boolean
	onClose: () => void
	title?: string
	buttonLabel?: string
	buttonLoadingLabel?: string
	isLoading?: boolean
	defaultValues?: Partial<CreateActivityFormData>
	onSubmitOverride?: (values: CreateActivityFormData) => Promise<void>
}

export function CreateActivityModal({
	isOpen,
	onClose,
	title = 'Nova atividade',
	buttonLabel = 'Salvar',
	buttonLoadingLabel = 'Salvando...',
	isLoading = false,
	defaultValues,
	onSubmitOverride,
}: CreateActivityModalProps) {
	const { user } = useAuth()
	const methods = useForm<CreateActivityFormData>({
		defaultValues: { title: '', date: new Date(), ...defaultValues },
		resolver: zodResolver(createActivitySchema),
	})
	const createActivityMutation = useCreateActivityMutation()
	const { handleSubmit, reset } = methods

	useEffect(() => {
		if (!isOpen) {
			const timeout = setTimeout(() => reset(), 300)
			return () => clearTimeout(timeout)
		}

		return undefined
	}, [isOpen, reset])

	const submit = async (values: CreateActivityFormData) => {
		if (onSubmitOverride) {
			await onSubmitOverride(values)
			return
		}

		if (!user?.id) return

		await createActivityMutation.mutateAsync({
			userId: user.id,
			data: {
				activityDate: values.date.toISOString(),
				title: values.title,
			},
		})

		onClose()
	}

	const loading = isLoading || createActivityMutation.isPending

	return (
		<Modal transparent animationType="fade" visible={isOpen} onRequestClose={onClose}>
			<View className="flex-1 items-center justify-center gap-6 bg-gray-800/80 px-4">
				<Pressable className="absolute inset-0" onPress={onClose} />

				<View className="w-full max-w-[358px] gap-6 rounded-[10px] border border-gray-600 bg-gray-700 p-6">
					<View className="flex-row items-center justify-between">
						<Typography variant="label-md" className="text-gray-100">
							{title}
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

						<Button className="w-full" isLoading={loading} onPress={handleSubmit(submit)}>
							{loading ? buttonLoadingLabel : buttonLabel}
						</Button>
					</FormProvider>
				</View>
			</View>
		</Modal>
	)
}
