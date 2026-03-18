import { View } from 'react-native'
import { Page } from '@/components/page/page'

export function ScreenFrame({ children }: { children: React.ReactNode }) {
	return (
		<Page>
			<View className="flex-1 items-center web:px-6 web:py-6">
				<View className="web:min-h-[844px] w-full max-w-[390px] flex-1 web:overflow-hidden web:rounded-[20px] web:border web:border-white/10 bg-gray-800">
					{children}
				</View>
			</View>
		</Page>
	)
}
