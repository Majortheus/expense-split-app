import { View } from 'react-native'
import Logo from '@/assets/logo.svg'
import { Typography } from '@/components/typography'

type AppLogoProps = {
	size?: 'sm' | 'lg'
	centered?: boolean
}

export function AppLogo({ size = 'sm', centered = false }: AppLogoProps) {
	const dimensions =
		size === 'lg' ? { width: 64, height: 64, textVariant: 'heading-lg' as const } : { width: 17, height: 17, textVariant: 'heading-sm' as const }

	return (
		<View className={centered ? 'items-center' : 'flex-row items-center gap-2'}>
			<Logo width={dimensions.width} height={dimensions.height} />

			<Typography variant={dimensions.textVariant} className={centered ? 'mt-4 text-green-light' : 'text-green-light'}>
				TaskCost Split
			</Typography>
		</View>
	)
}
