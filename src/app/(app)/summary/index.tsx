import { useRouter } from 'expo-router'
import { View } from 'react-native'
import { Button } from '@/components/button'
import { Icon } from '@/components/icon'
import { Header } from '@/components/page/header'
import { Page } from '@/components/page/page'
import { Typography } from '@/components/typography'
import type { IconNames } from '@/constants/icons'
import { useUserMeStatisticsQuery } from '@/services/query/users'
import { formatCurrencyBRL, formatExpenseCount } from '@/utils/formatters'

export default function SummaryScreen() {
	const router = useRouter()
	const { data, isLoading, isError } = useUserMeStatisticsQuery()

	const isEmpty = !isLoading && !isError && data?.activitiesCount === 0

	return (
		<Page>
			<View className="w-full flex-1 bg-gray-800 px-6 pt-6 pb-0">
				<View className="w-full flex-1 gap-4 pb-5">
					<Header title="Resumo" subtitle="Acompanhe as informações principais sobre suas atividades" />

					{isLoading ? (
						<View className="flex-1 items-center justify-center">
							<Typography variant="text-sm" className="text-gray-400">
								Carregando...
							</Typography>
						</View>
					) : isEmpty ? (
						<View className="flex-1 items-center justify-center">
							<View className="items-center justify-center gap-4">
								<Icon name="pie-chart" className="h-8 w-8 text-gray-400" />
								<Typography variant="text-sm" className="w-[200px] text-center text-gray-400">
									Para começar a acompanhar, crie uma atividade
								</Typography>
								<Button onPress={() => router.push('/activities?openCreateModal=true')} startIconName="add-1">
									Criar atividade
								</Button>
							</View>
						</View>
					) : (
						<View className="flex-1 gap-4">
							<View className="gap-3">
								<Typography variant="label-sm" className="text-gray-100">
									Minhas contas
								</Typography>

								<View className="rounded-[10px] border border-gray-600 bg-gray-800 p-4">
									<View className="flex-row items-center gap-4">
										<View className="h-12 w-12 items-center justify-center rounded-lg bg-success-low">
											<Icon name="check" className="h-4 w-4 text-success-light" />
										</View>
										<View className="">
											<Typography variant="label-lg" className="text-gray-100">
												{formatCurrencyBRL(data?.amountPaidInCents ?? 0)}
											</Typography>
											<View className="flex-row gap-1">
												<Typography variant="text-sm" className="text-gray-300">
													Pago em
												</Typography>

												<Typography variant="label-sm" className="text-gray-300">
													{formatExpenseCount(data?.paidExpensesCount ?? 0)}
												</Typography>
											</View>
										</View>
									</View>
								</View>

								<View className="rounded-[10px] border border-gray-600 bg-gray-800 p-4">
									<View className="flex-row items-center gap-4">
										<View className="h-12 w-12 items-center justify-center rounded-lg bg-danger-low">
											<Icon name="warning-octagon" className="h-4 w-4 text-danger-light" />
										</View>
										<View className="">
											<Typography variant="label-lg" className="text-gray-100">
												{formatCurrencyBRL(data?.amountToPayInCents ?? 0)}
											</Typography>
											<View className="flex-row gap-1">
												<Typography variant="text-sm" className="text-gray-300">
													Pendente em
												</Typography>

												<Typography variant="label-sm" className="text-gray-300">
													{formatExpenseCount(data?.expensesToPayCount ?? 0)}
												</Typography>
											</View>
										</View>
									</View>
								</View>
							</View>

							<View className="gap-3">
								<Typography variant="label-sm" className="text-gray-100">
									Informações gerais
								</Typography>

								<View className="rounded-[10px] border border-gray-600 bg-gray-800 p-4">
									<View className="flex-row items-center gap-4">
										<View className="h-12 w-12 items-center justify-center rounded-lg bg-gray-700">
											<Icon name="pie-chart" className="h-4 w-4 text-green-base" />
										</View>
										<View className="">
											<Typography variant="label-lg" className="text-gray-100">
												{formatCurrencyBRL(data?.totalExpensesAmountInCents ?? 0)}
											</Typography>
											<Typography variant="text-sm" className="text-gray-300">
												Total de despesas
											</Typography>
										</View>
									</View>
								</View>

								<View className="flex-row justify-between gap-2">
									<MetricCard value={data?.activitiesCount ?? 0} label="Atividades" iconName="bullet-list" />
									<MetricCard value={data?.expensesCount ?? 0} label="Despesas" iconName="dollar-coin-1" />
									<MetricCard value={data?.uniqueParticipantsCount ?? 0} label="Participantes" iconName="user-multiple-group" />
								</View>
							</View>
						</View>
					)}
				</View>
			</View>
		</Page>
	)
}

function MetricCard({ value, label, iconName }: { value: number; label: string; iconName: IconNames }) {
	return (
		<View className="max-w-[260px] flex-1 gap-1 rounded-[10px] border border-gray-600 bg-gray-800 p-3">
			<View className="flex-row justify-between">
				<Typography variant="heading-lg">{value.toString().padStart(2, '0')}</Typography>
				<Icon name={iconName} className="h-4 w-4 text-green-light" />
			</View>
			<Typography variant="text-xs" className="text-gray-300">
				{label}
			</Typography>
		</View>
	)
}
