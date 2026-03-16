import { Keyboard, Platform, Pressable, View } from 'react-native'

export function Page({ children }: { children?: React.ReactNode }) {
	return (
		<Pressable onPress={() => Keyboard.dismiss()} className="w-full flex-1">
			<View className="flex-1 items-center bg-gray-800 text-gray-100">
				<SafeArea>{children}</SafeArea>
			</View>
		</Pressable>
	)
}

function SafeArea({ children }: { children: React.ReactNode }) {
	if (Platform.OS === 'web') {
		return <View className="h-screen w-full max-w-5xl">{children}</View>
	}

	return <View className="h-screen w-full">{children}</View>
}
