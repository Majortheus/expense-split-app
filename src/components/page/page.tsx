import { Keyboard, Platform, Pressable, View } from 'react-native'
import { SafeAreaView } from '../safe-area-view'

export function Page({ children }: { children?: React.ReactNode }) {
	if (Platform.OS === 'web') {
		return (
			<View className="w-full flex-1">
				<View className="flex-1 items-center bg-gray-800 text-gray-100">
					<View className="h-full w-full max-w-5xl">{children}</View>
				</View>
			</View>
		)
	}

	return (
		<Pressable onPress={() => Keyboard.dismiss()} className="w-full flex-1">
			<View className="flex-1 items-center bg-gray-800 text-gray-100">
				<SafeAreaView edges={['top']} className="h-full w-full">
					{children}
				</SafeAreaView>
			</View>
		</Pressable>
	)
}
