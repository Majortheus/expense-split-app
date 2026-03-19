import { styled } from 'nativewind'
import { Platform, View } from 'react-native'
import { SafeAreaView as ReactSafeAreaView, type SafeAreaViewProps } from 'react-native-safe-area-context'

const SafeAreaViewNativeWind = styled(ReactSafeAreaView, { className: 'style' })

export function SafeAreaView(props: SafeAreaViewProps) {
	if (Platform.OS === 'web') {
		return <View {...props} />
	}

	return <SafeAreaViewNativeWind {...props} />
}
