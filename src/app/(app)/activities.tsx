import { View } from 'react-native'
import { ActivitiesEmptyState } from '@/components/activities-empty-state'
import { Button } from '@/components/button'
import { Header } from '@/components/page/header'
import { Page } from '@/components/page/page'

export default function ActivitiesScreen() {
	const handleCreatePress = () => {
		return
	}

	return (
		<Page>
			<View className="w-full flex-1 bg-gray-800 px-6 pt-6 pb-6">
				<View className="relative w-full flex-1 gap-4">
					<Header title="Atividades" subtitle="Organize suas despesas divididas" />

					<View className="relative flex-1 items-center justify-center">
						<ActivitiesEmptyState />

						<View className="absolute right-0 bottom-0">
							<Button startIconName="add-1" onPress={handleCreatePress}>
								Criar
							</Button>
						</View>
					</View>
				</View>
			</View>
		</Page>
	)
}
