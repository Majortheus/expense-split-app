import { zodResolver } from '@hookform/resolvers/zod'
import { BlurView } from 'expo-blur'
import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { Modal, Platform, Pressable, StyleSheet, View } from 'react-native'
import { z } from 'zod'
import { ActivitiesEmptyState } from '@/components/activities-empty-state'
import { Button } from '@/components/button'
import { Icon } from '@/components/icon'
import { Input } from '@/components/input'
import { Header } from '@/components/page/header'
import { Page } from '@/components/page/page'
import { Typography } from '@/components/typography'

const createActivitySchema = z.object({
	title: z.string().trim().min(1, 'Título é obrigatório'),
	date: z.string().trim().min(1, 'Data é obrigatória'),
})

type CreateActivityFormData = z.infer<typeof createActivitySchema>

export default function ActivitiesScreen() {
	const [isCreateOpen, setIsCreateOpen] = useState(false)
	const methods = useForm<CreateActivityFormData>({
		defaultValues: { title: '', date: '' },
		resolver: zodResolver(createActivitySchema),
	})
	const { handleSubmit, reset } = methods

	const closeCreateModal = () => {
		setIsCreateOpen(false)
		reset()
	}

	const onSubmit = (_values: CreateActivityFormData) => {
		closeCreateModal()
	}

	return (
		<Page>
			<View className="w-full flex-1 bg-gray-800 px-6 pt-6 pb-6">
				<View className="relative w-full flex-1 gap-4">
					<Header title="Atividades" subtitle="Organize suas despesas divididas" />

					<View className="relative flex-1 items-center justify-center">
						<ActivitiesEmptyState />

						<View className="absolute right-0 bottom-0">
							<Button startIconName="add-1" onPress={() => setIsCreateOpen(true)}>
								Criar
							</Button>
						</View>
					</View>
				</View>

				<Modal transparent animationType="fade" visible={isCreateOpen} onRequestClose={closeCreateModal}>
					<View className="flex-1 items-center justify-center gap-6 px-4">
						{Platform.OS === 'android' ? (
							<BlurView
								blurReductionFactor={20}
								experimentalBlurMethod="dimezisBlurView"
								intensity={25}
								tint="dark"
								style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(255, 0, 0, 0.4)' }]}
							/>
						) : (
							<BlurView intensity={18} tint="dark" style={StyleSheet.absoluteFill} />
						)}
						<View className="absolute inset-0 bg-black/40" />
						<Pressable className="absolute inset-0" onPress={closeCreateModal} />

						<View className="w-full max-w-[358px] gap-6 rounded-[10px] bg-gray-700 p-6">
							<View className="flex-row items-center justify-between">
								<Typography variant="label-md" className="text-gray-100">
									Nova atividade
								</Typography>

								<Pressable onPress={closeCreateModal}>
									<Icon name="delete-1" className="h-4 w-4 text-gray-300" />
								</Pressable>
							</View>

							<FormProvider {...methods}>
								<View className="gap-2">
									<Input name="title" placeholder="Título" />
									<Input name="date" iconName="blank-calendar" placeholder="Data" />
								</View>

								<Button className="w-full" onPress={handleSubmit(onSubmit)}>
									Salvar
								</Button>
							</FormProvider>
						</View>
					</View>
				</Modal>
			</View>
		</Page>
	)
}
