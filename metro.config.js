const { getDefaultConfig } = require('expo/metro-config')
const { withNativewind } = require('nativewind/metro')
const { withMonicon } = require('@monicon/metro')

module.exports = (() => {
	const config = getDefaultConfig(__dirname)
	return withNativewind(withMonicon(config))
})()
