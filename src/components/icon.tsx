import { styled } from 'nativewind'
import type { ComponentType, JSX } from 'react'
import type { ViewProps } from 'react-native'
import { Platform, View } from 'react-native'
import type { SvgProps } from 'react-native-svg'
import Add from '@/components/icons/streamline/add-1'
import Asterisk from '@/components/icons/streamline/asterisk-1'
import BlankCalendar from '@/components/icons/streamline/blank-calendar'
import StreamlineBulletListIcon from '@/components/icons/streamline/bullet-list'
import BulletListSolid from '@/components/icons/streamline/bullet-list-solid'
import Check from '@/components/icons/streamline/check'
import Delete1 from '@/components/icons/streamline/delete-1'
import DollarCoin from '@/components/icons/streamline/dollar-coin-1'
import MailSend from '@/components/icons/streamline/mail-send-envelope'
import Pencil from '@/components/icons/streamline/pencil'
import PieChart from '@/components/icons/streamline/pie-chart'
import PieChartSolid from '@/components/icons/streamline/pie-chart-solid'
import RecycleBin from '@/components/icons/streamline/recycle-bin-2'
import UserCircle from '@/components/icons/streamline/user-circle-single'
import UserMultiple from '@/components/icons/streamline/user-multiple-group'
import UserMultipleSolid from '@/components/icons/streamline/user-multiple-group-solid'
import WarningOctagon from '@/components/icons/streamline/warning-octagon'

type IconComponent = ComponentType<Partial<SvgProps> & { className?: string }>

const ICON_MAP = {
	'bullet-list': StreamlineBulletListIcon,
	'bullet-list-solid': BulletListSolid,
	check: Check,
	'add-1': Add,
	'asterisk-1': Asterisk,
	'blank-calendar': BlankCalendar,
	'delete-1': Delete1,
	'dollar-coin-1': DollarCoin,
	'mail-send-envelope': MailSend,
	pencil: Pencil,
	'pie-chart': PieChart,
	'pie-chart-solid': PieChartSolid,
	'recycle-bin-2': RecycleBin,
	'user-circle-single': UserCircle,
	'user-multiple-group': UserMultiple,
	'user-multiple-group-solid': UserMultipleSolid,
	'warning-octagon': WarningOctagon,
}

export type IconNames = keyof typeof ICON_MAP

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
