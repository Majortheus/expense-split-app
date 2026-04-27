import CustomRealSignIcon from '@/components/icons/custom/real-sign'
import ChevronDown from '@/components/icons/lucide/chevron-down'
import ChevronLeft from '@/components/icons/lucide/chevron-left'
import ChevronRight from '@/components/icons/lucide/chevron-right'
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

export const ICON_MAP = {
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
	'chevron-down': ChevronDown,
	'chevron-left': ChevronLeft,
	'chevron-right': ChevronRight,
	'real-sign': CustomRealSignIcon,
} as const

export type IconNames = keyof typeof ICON_MAP
