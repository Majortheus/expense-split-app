import { styled } from 'nativewind'
import type { ComponentType, JSX } from 'react'
import type { ViewProps } from 'react-native'
import { Platform, View } from 'react-native'
import type { SvgProps } from 'react-native-svg'
import { ICON_MAP, type IconNames } from '@/constants/icons'

type IconComponent = ComponentType<Partial<SvgProps> & { className?: string }>

export type IconProps = Partial<SvgProps> &
	Partial<ViewProps> & {
		name: IconNames
		className?: string
	}

export function Icon({ name, className, ...rest }: IconProps): JSX.Element | null {
	const IconBase = ICON_MAP[name]
	if (!IconBase) return null

	if (Platform.OS === 'web') {
		return (
			<View className={className} {...rest}>
				<IconBase />
			</View>
		)
	}

	// For native, apply `styled` lazily to avoid runtime errors during module import.
	let Styled: IconComponent | undefined
	try {
		Styled = styled(IconBase)
	} catch {
		Styled = IconBase
	}

	return <Styled className={className} {...rest} />
}
