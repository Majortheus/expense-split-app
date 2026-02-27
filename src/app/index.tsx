import { Link } from 'expo-router'
import { Text, View } from 'react-native'
import { Page } from '@/components/page/page'

export default function Home() {
	return (
		<Page>
			<View className="flex-1 items-center justify-center">
				<Link href="/test">
					<Text className="text-gray-100">Abrir página de testes</Text>
				</Link>
			</View>
		</Page>
	)
}
