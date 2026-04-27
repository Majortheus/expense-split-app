import { Pressable, View } from 'react-native'
import { Icon } from '@/components/icon'
import { Typography } from '@/components/typography'
import { Skeleton } from '@/components/ui/skeleton'
import { formatDateBR } from '@/utils/formatters'

type ActivityDetailsHeaderProps = {
	title?: string
	date?: string
	isLoading: boolean
	onBackPress: () => void
	onEditPress: () => void
}

export function ActivityDetailsHeader({ title, date, isLoading, onBackPress, onEditPress }: ActivityDetailsHeaderProps) {
	return (
		<View className="relative w-full">
			<View className="flex-row items-start justify-between gap-4">
				<View className="flex-1 gap-3">
					<Pressable onPress={onBackPress} className="flex-row items-center gap-2 py-1">
						<Icon name="chevron-left" className="h-4 w-4 text-green-light" />
						<Typography variant="text-sm" className="text-green-light">
							Voltar
						</Typography>
					</Pressable>

					<View className="gap-1">
						{isLoading ? (
							<Skeleton className="h-[30px] w-28" />
						) : (
							<Typography variant="label-lg" className="text-white">
								{title}
							</Typography>
						)}

						<View className="flex-row items-center gap-2">
							<Icon name="blank-calendar" className="h-4 w-4 text-gray-300" />
							{isLoading ? (
								<Skeleton className="h-[21px] w-24" />
							) : (
								date && (
									<Typography variant="text-sm" className="text-gray-300">
										{formatDateBR(new Date(date))}
									</Typography>
								)
							)}
						</View>
					</View>
				</View>

				<Pressable
					onPress={onEditPress}
					className="absolute top-0 right-0 h-12 w-12 items-center justify-center rounded-full border border-gray-500 bg-gray-600"
				>
					<Icon name="pencil" className="h-6 w-6 text-gray-300" />
				</Pressable>
			</View>
		</View>
	)
}
