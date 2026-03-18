import { useEffect } from 'react'
import { Modal, Pressable, View } from 'react-native'
import { useBottomSheet } from '@/hooks/use-bottom-sheets'

type ModalSheetProps = {
	open: boolean
	onClose: () => void
	children: React.ReactNode
}

export function ModalSheet({ open, onClose, children }: ModalSheetProps) {
	const { setOpen } = useBottomSheet()

	useEffect(() => {
		setOpen(open)

		return () => {
			setOpen(false)
		}
	}, [open, setOpen])

	return (
		<Modal transparent animationType="fade" visible={open} onRequestClose={onClose}>
			<View className="flex-1 justify-end bg-black/80">
				<Pressable className="flex-1" onPress={onClose} />

				<View className="rounded-t-[20px] border-white/10 border-t bg-gray-700 px-4 py-5">{children}</View>
			</View>
		</Modal>
	)
}
