import { StatusBar, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export function Page({ children }: { children: React.ReactNode }) {
	return (
		<View className="flex-1 items-center bg-gray-800 text-gray-100">
			<StatusBar barStyle="light-content" />
			<SafeAreaView className="h-screen w-full max-w-5xl" edges={['top']}>
				{children}
			</SafeAreaView>
		</View>
	)
}
