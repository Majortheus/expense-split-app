import { useRouter } from 'expo-router'
import { Pressable, View } from 'react-native'
import { Icon } from '@/components/icon'
import { Typography } from '@/components/typography'

type TabKey = 'activities' | 'summary' | 'participants'

type TabConfig = {
	key: TabKey
	label: string
	href: '/activities/index' | '/summary' | '/participants'
	icon: 'bullet-list' | 'pie-chart' | 'user-multiple-group'
	activeIcon: 'bullet-list-solid' | 'pie-chart-solid' | 'user-multiple-group-solid'
}

const tabs: TabConfig[] = [
	{ key: 'activities', label: 'Atividades', href: '/activities/index', icon: 'bullet-list', activeIcon: 'bullet-list-solid' },
	{ key: 'summary', label: 'Resumo', href: '/summary', icon: 'pie-chart', activeIcon: 'pie-chart-solid' },
	{ key: 'participants', label: 'Participantes', href: '/participants', icon: 'user-multiple-group', activeIcon: 'user-multiple-group-solid' },
]

export function AppBottomNav({ activeTab }: { activeTab: TabKey }) {
	const router = useRouter()

	return (
		<View className="border-white/10 border-t bg-gray-800 px-6 py-4">
			<View className="flex-row justify-between gap-3">
				{tabs.map((tab) => {
					const isActive = tab.key === activeTab

					return (
						<Pressable
							key={tab.key}
							accessibilityRole="button"
							className="flex-1 items-center gap-2"
							onPress={() => {
								if (!isActive) {
									router.replace({ pathname: tab.href })
								}
							}}
						>
							<Icon name={isActive ? tab.activeIcon : tab.icon} className={isActive ? 'h-6 w-6 text-gray-100' : 'h-6 w-6 text-gray-400'} />
							<Typography variant="text-xs" className={isActive ? 'text-gray-100' : 'text-gray-400'}>
								{tab.label}
							</Typography>
						</Pressable>
					)
				})}
			</View>
		</View>
	)
}
