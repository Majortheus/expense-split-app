import type { MoniconConfig } from '@monicon/core'
import { clean, reactNative } from '@monicon/core/plugins'

export default {
	icons: [
		'lucide:chevron-down',
		'lucide:chevron-left',
		'lucide:chevron-right',
		'streamline:user-circle-single',
		'streamline:asterisk-1',
		'streamline:mail-send-envelope',
		'streamline:warning-octagon',
		'streamline:check',
		'streamline:bullet-list',
		'streamline:bullet-list-solid',
		'streamline:pie-chart',
		'streamline:pie-chart-solid',
		'streamline:user-multiple-group',
		'streamline:user-multiple-group-solid',
		'streamline:add-1',
		'streamline:dollar-coin-1',
		'streamline:blank-calendar',
		'streamline:pencil',
		'streamline:recycle-bin-2',
		'streamline:delete-1',
	],
	collections: [],
	plugins: [clean({ patterns: ['src/components/icons'] }), reactNative({ outputPath: 'src/components/icons' })],
} satisfies MoniconConfig
