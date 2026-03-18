import { useLocalSearchParams, useRouter } from 'expo-router'
import { Pressable, ScrollView, View } from 'react-native'
import { AppBottomNav } from '@/components/app-bottom-nav'
import { AppLogo } from '@/components/app-logo'
import { Button } from '@/components/button'
import { EmptyState } from '@/components/empty-state'
import { Icon } from '@/components/icon'
import { ScreenFrame } from '@/components/screen-frame'
import { Typography } from '@/components/typography'
import { summaryCards } from '@/mocks/expense-split'
import { formatCurrencyBRL } from '@/utils/formatters'

export default function SummaryScreen() {
	const router = useRouter()
	const params = useLocalSearchParams<{ state?: string }>()
	const isEmpty = params.state === 'empty'

	return (
		<ScreenFrame>
			<View className="flex-1">
				<ScrollView className="flex-1" contentContainerClassName="flex-grow px-6 pt-10">
					<View className="flex-1 gap-4 pb-6">
						<AppLogo />

						<View className="gap-1">
							<Typography variant="label-lg" className="text-white">
								Resumo
							</Typography>
							<Typography variant="text-md" className="text-gray-300">
								Acompanhe as informações principais sobre suas atividades
							</Typography>
						</View>

						{isEmpty ? (
							<EmptyState
								iconName="pie-chart"
								message="Para começar a acompanhar, crie uma atividade"
								actionLabel="Criar atividade"
								onActionPress={() => router.push({ pathname: '/activities/index', params: { modal: 'new' } })}
							/>
						) : (
							<View className="gap-6">
								<View className="gap-3">
									<Typography variant="label-md" className="text-white">
										Minhas contas
									</Typography>

									<SummaryCard
										iconName="check"
										title={formatCurrencyBRL(summaryCards.paidAmountInCents)}
										subtitle={`Pago em ${summaryCards.paidExpensesCount} despesas`}
									/>

									<SummaryCard
										iconName="warning-octagon"
										title={formatCurrencyBRL(summaryCards.pendingAmountInCents)}
										subtitle={`Pendente em ${summaryCards.pendingExpensesCount} despesas`}
									/>
								</View>

								<View className="gap-3">
									<Typography variant="label-md" className="text-white">
										Informações gerais
									</Typography>

									<SummaryCard iconName="dollar-coin-1" title={formatCurrencyBRL(summaryCards.totalExpensesAmountInCents)} subtitle="Total de despesas" />

									<View className="flex-row gap-3">
										<CompactMetric title={summaryCards.activitiesCount.toString().padStart(2, '0')} subtitle="Atividades" iconName="user-multiple-group" />
										<CompactMetric title={summaryCards.expensesCount.toString()} subtitle="Despesas" iconName="bullet-list" />
										<CompactMetric title={summaryCards.participantsCount.toString()} subtitle="Participantes" iconName="user-multiple-group" />
									</View>
								</View>

								<Button startIconName="add-1" endIconName="add-1" onPress={() => router.push({ pathname: '/activities/index', params: { modal: 'new' } })}>
									Criar atividade
								</Button>
							</View>
						)}
					</View>
				</ScrollView>

				<AppBottomNav activeTab="summary" />
			</View>
		</ScreenFrame>
	)
}

function SummaryCard({ iconName, title, subtitle }: { iconName: 'check' | 'warning-octagon' | 'dollar-coin-1'; title: string; subtitle: string }) {
	return (
		<View className="flex-row items-center gap-3 rounded-[20px] border border-white/10 bg-gray-700 p-4">
			<View className="h-10 w-10 items-center justify-center rounded-full bg-gray-600">
				<Icon name={iconName} className="h-4 w-4 text-green-light" />
			</View>

			<View className="flex-1">
				<Typography variant="label-md" className="text-white">
					{title}
				</Typography>
				<Typography variant="text-sm" className="text-gray-300">
					{subtitle}
				</Typography>
			</View>
		</View>
	)
}

function CompactMetric({ title, subtitle, iconName }: { title: string; subtitle: string; iconName: 'user-multiple-group' | 'bullet-list' }) {
	return (
		<Pressable className="flex-1 gap-3 rounded-[20px] border border-white/10 bg-gray-700 p-4">
			<View>
				<Typography variant="label-lg" className="text-white">
					{title}
				</Typography>
				<Typography variant="text-sm" className="text-gray-300">
					{subtitle}
				</Typography>
			</View>

			<Icon name={iconName} className="h-4 w-4 text-gray-300" />
		</Pressable>
	)
}
