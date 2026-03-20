import { View } from 'react-native'
import { Icon } from '@/components/icon'
import { Typography } from '@/components/typography'

export function ActivitiesEmptyState() {
	return (
		<View className="w-full max-w-[280px] items-center gap-4">
			<Icon name="bullet-list" className="h-6 w-6 text-gray-400" />

			<Typography variant="text-sm" className="max-w-[156px] text-center text-gray-400">
				Você ainda não tem atividades criadas
			</Typography>
		</View>
	)
}
