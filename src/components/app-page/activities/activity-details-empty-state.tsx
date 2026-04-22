import { View } from 'react-native'
import { Icon } from '@/components/icon'
import { Typography } from '@/components/typography'

export function ActivityDetailsEmptyState() {
	return (
		<View className="items-center gap-4 px-8">
			<Icon name="pie-chart" className="h-6 w-6 text-gray-400" />
			<Typography variant="text-sm" className="max-w-[170px] text-center text-gray-400">
				Para começar a dividir, registre uma despesa
			</Typography>
		</View>
	)
}
