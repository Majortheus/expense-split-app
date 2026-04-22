import { Modal, Pressable, View } from 'react-native'
import { Button } from '@/components/button'
import { Icon } from '@/components/icon'
import { Typography } from '@/components/typography'

type EditActivityModalProps = {
	open: boolean
	onClose: () => void
	activityTitle?: string
}

export function EditActivityModal({ open, onClose, activityTitle = 'Editar atividade' }: EditActivityModalProps) {
	return (
		<Modal transparent animationType="fade" visible={open} onRequestClose={onClose}>
			<View className="flex-1 items-center justify-center gap-6 bg-gray-800/80 px-4">
				<Pressable className="absolute inset-0" onPress={onClose} />

				<View className="w-full max-w-[358px] gap-6 rounded-[10px] border border-gray-600 bg-gray-700 p-6">
					<View className="flex-row items-center justify-between">
						<Typography variant="label-md" className="text-gray-100">
							{activityTitle}
						</Typography>

						<Pressable onPress={onClose}>
							<Icon name="delete-1" className="h-4 w-4 text-gray-300" />
						</Pressable>
					</View>

					<Typography variant="text-sm" className="text-gray-400">
						Formulário de edição será implementado depois.
					</Typography>

					<Button className="w-full" variant="secondary" onPress={onClose}>
						Fechar
					</Button>
				</View>
			</View>
		</Modal>
	)
}
