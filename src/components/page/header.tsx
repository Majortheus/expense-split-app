import { View } from 'react-native'
import { Typography } from '@/components/typography'
import { LogoHorizontal } from './logo-horizontal'

type HeaderProps = {
	title: string
	subtitle?: string
}

export function Header({ title, subtitle }: HeaderProps) {
	return (
		<View className="w-full items-start gap-4">
			<LogoHorizontal />

			<View className="w-full items-start gap-1">
				<Typography variant="label-lg" className="text-[20px] text-white">
					{title}
				</Typography>

				{subtitle && (
					<Typography variant="text-md" className="text-[16px] text-gray-300">
						{subtitle}
					</Typography>
				)}
			</View>
		</View>
	)
}
