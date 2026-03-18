import { View } from 'react-native'
import { Avatar } from '@/components/avatar'

type AvatarStackItem = {
	id: string
	label: string
}

type AvatarStackProps = {
	items: AvatarStackItem[]
	size?: 'sm' | 'md'
}

export function AvatarStack({ items, size = 'sm' }: AvatarStackProps) {
	const visibleItems = items.slice(0, 6)

	return (
		<View className="flex-row">
			{visibleItems.map((item, index) => (
				<View key={item.id} className={index === 0 ? '' : '-ml-2'}>
					<Avatar label={item.label} size={size} />
				</View>
			))}
		</View>
	)
}
