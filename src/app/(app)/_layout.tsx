import { Tabs } from 'expo-router'
import { View } from 'react-native'
import { Icon } from '@/components/icon'
import { Page } from '@/components/page/page'
import { Typography } from '@/components/typography'

export default function AppLayout() {
	return (
		<Page>
			<Tabs
				screenOptions={{
					headerShown: false,
					sceneStyle: { backgroundColor: 'transparent' },
					tabBarStyle: {
						backgroundColor: '#0b0b0e',
						borderTopColor: 'rgba(255,255,255,0.1)',
						height: 80,
						paddingTop: 10,
						paddingBottom: 12,
					},
					tabBarShowLabel: false,
				}}
			>
				<Tabs.Screen
					name="activities/index"
					options={{
						href: '/activities',
						tabBarIcon: ({ focused }) => <TabBarItem focused={focused} icon={focused ? 'bullet-list-solid' : 'bullet-list'} label="Atividades" />,
					}}
				/>
				<Tabs.Screen
					name="participants"
					options={{
						tabBarIcon: ({ focused }) => (
							<TabBarItem focused={focused} icon={focused ? 'user-multiple-group-solid' : 'user-multiple-group'} label="Participantes" />
						),
					}}
				/>
				<Tabs.Screen
					name="summary"
					options={{
						tabBarIcon: ({ focused }) => <TabBarItem focused={focused} icon={focused ? 'pie-chart-solid' : 'pie-chart'} label="Resumo" />,
					}}
				/>
				<Tabs.Screen name="activities/[activityId]" options={{ href: null }} />
				<Tabs.Screen name="expenses/[expenseId]" options={{ href: null }} />
			</Tabs>
		</Page>
	)
}

function TabBarItem({
	focused,
	icon,
	label,
}: {
	focused: boolean
	icon: 'bullet-list' | 'bullet-list-solid' | 'pie-chart' | 'pie-chart-solid' | 'user-multiple-group' | 'user-multiple-group-solid'
	label: string
}) {
	return (
		<View className="items-center gap-2">
			<Icon name={icon} className={focused ? 'h-6 w-6 text-gray-100' : 'h-6 w-6 text-gray-400'} />
			<Typography variant="text-xs" className={focused ? 'text-gray-100' : 'text-gray-400'}>
				{label}
			</Typography>
		</View>
	)
}
