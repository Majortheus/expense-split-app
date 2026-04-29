import type { BottomTabBarProps } from '@react-navigation/bottom-tabs'
import clsx from 'clsx'
import { Tabs } from 'expo-router'
import { Pressable, View } from 'react-native'
import { twMerge } from 'tailwind-merge'
import { Icon } from '@/components/icon'
import { SafeAreaView } from '@/components/safe-area-view'
import { Typography } from '@/components/typography'
import type { IconNames } from '@/constants/icons'

type AppTabRoute = 'activities' | 'summary' | 'participants'

export default function Layout() {
	return (
		<Tabs screenOptions={{ headerShown: false }} tabBar={TabBar}>
			<Tabs.Screen name="activities" options={{ title: 'Atividades' }} />
			<Tabs.Screen name="summary" options={{ title: 'Resumo' }} />
			<Tabs.Screen name="participants" options={{ title: 'Participantes' }} />
		</Tabs>
	)
}

function TabBar({ descriptors }: BottomTabBarProps) {
	return (
		<SafeAreaView edges={['bottom']} className="bg-gray-700">
			<View className="items-center justify-between border-gray-800 border-t bg-gray-700 px-6 py-5">
				<View className="w-full max-w-5xl flex-row gap-4">
					{Object.entries(descriptors)
						.filter(([_, descriptor]) => TAB_CONFIG[descriptor.route.name as AppTabRoute])
						.map(([key, descriptor]) => (
							<Tab key={key} descriptor={descriptor} />
						))}
				</View>
			</View>
		</SafeAreaView>
	)
}

const TAB_CONFIG: { [key in AppTabRoute]: { icon: IconNames; activeIcon: IconNames } } = {
	activities: {
		icon: 'bullet-list',
		activeIcon: 'bullet-list-solid',
	},
	summary: {
		icon: 'pie-chart',
		activeIcon: 'pie-chart-solid',
	},
	participants: {
		icon: 'user-multiple-group',
		activeIcon: 'user-multiple-group-solid',
	},
} as const

function Tab({ descriptor }: { descriptor: BottomTabBarProps['descriptors'][string] }) {
	const config = TAB_CONFIG[descriptor.route.name as AppTabRoute]
	const isFocused = descriptor.navigation.isFocused()

	return (
		<Pressable
			className="flex-1 items-center gap-3 py-0.5"
			onPress={() => {
				descriptor.navigation.navigate(descriptor.route.name, descriptor.route.params)
			}}
		>
			<Icon name={isFocused ? config.activeIcon : config.icon} className={twMerge('h-6 w-6 text-gray-400', clsx({ 'text-green-light': isFocused }))} />
			<Typography variant={isFocused ? 'label-sm' : 'text-sm'} className={twMerge('text-center text-gray-400', clsx({ 'text-gray-200': isFocused }))}>
				{descriptor.options.title}
			</Typography>
		</Pressable>
	)
}
