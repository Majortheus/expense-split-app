import type { MoniconConfig } from '@monicon/core'
import { clean, reactNative } from '@monicon/core/plugins'

export default {
	// Loads individual icons by icon name
	icons: [
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
	// Loads all icons from the collection
	collections: [],
	plugins: [
		/**
		 * change the output path to your project config for example;
		 * - components/icons
		 * - src/components/icons
		 */
		clean({ patterns: ['src/components/icons'] }),
		reactNative({ outputPath: 'src/components/icons' }),
	],
} satisfies MoniconConfig
