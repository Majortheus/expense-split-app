import { View } from 'react-native'
import LogoMark from '@/assets/logo-mark.svg'
import { Typography } from '@/components/typography'

export function LogoHorizontal() {
	return (
		<View className="flex-row items-center gap-2 self-start">
			<LogoMark width={18} height={18} />
			<Typography variant="heading-sm" className="text-[18px] text-green-light tracking-[-0.36px]">
				TaskCost Split
			</Typography>
		</View>
	)
}
