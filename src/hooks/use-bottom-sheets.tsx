import BottomSheet, { BottomSheetBackdrop, BottomSheetModalProvider, BottomSheetView } from '@gorhom/bottom-sheet'
import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'
import { KeyboardScroll } from '@/components/keyboard-aware-scroll'

type BottomSheetContextValue = {
	openBottomSheet: (content: React.ReactNode, config?: BottomSheetConfig) => void
	closeBottomSheet: () => void
	isBottomSheetOpen: boolean
}

type BottomSheetConfig = {
	snapPoints?: (string | number)[]
	enablePanDownToClose?: boolean
}

const BottomSheetContext = createContext<BottomSheetContextValue | null>(null)

const defaultConfig: BottomSheetConfig = {
	snapPoints: ['75%', '90%'],
	enablePanDownToClose: false,
}

export function BottomSheetProvider({ children }: { children: React.ReactNode }) {
	const bottomSheetRef = useRef<BottomSheet>(null)

	const [content, setContent] = useState<React.ReactNode>(null)
	const [config, setConfig] = useState<BottomSheetConfig>(defaultConfig)

	const openBottomSheet = useCallback((content: React.ReactNode, config?: BottomSheetConfig) => {
		setConfig({ ...defaultConfig, ...config })
		setContent(content)

		bottomSheetRef.current?.snapToIndex(0)
	}, [])

	const closeBottomSheet = useCallback(() => {
		bottomSheetRef.current?.close()
		setContent(null)
	}, [])

	const isBottomSheetOpen = useMemo(() => {
		return content !== null
	}, [content])

	return (
		<BottomSheetModalProvider>
			<BottomSheetContext.Provider value={{ openBottomSheet, closeBottomSheet, isBottomSheetOpen }}>
				{children}
				<BottomSheet
					ref={bottomSheetRef}
					backgroundStyle={{
						borderTopLeftRadius: 32,
						borderTopRightRadius: 32,
						backgroundColor: '#121216'
					}}
					backdropComponent={(props) => (
						<BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} opacity={0.7} pressBehavior="close" onPress={closeBottomSheet} />
					)}
					enablePanDownToClose={config.enablePanDownToClose ?? true}
					handleIndicatorStyle={{backgroundColor: 'white'}}
					index={-1}
					animateOnMount
					snapPoints={config.snapPoints}
					onClose={closeBottomSheet}
				>
					<BottomSheetView className="pb-10 bg-gray-700">
						<KeyboardScroll>{content}</KeyboardScroll>
					</BottomSheetView>
				</BottomSheet>
			</BottomSheetContext.Provider>
		</BottomSheetModalProvider>
	)
}

export const useBottomSheet = (): BottomSheetContextValue => {
	const ctx = useContext(BottomSheetContext)
	if (!ctx) throw new Error('useBottomSheet must be used within BottomSheetProvider')
	return ctx
}
