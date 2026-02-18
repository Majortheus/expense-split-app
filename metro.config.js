const { getDefaultConfig } = require('expo/metro-config')
const { withNativewind } = require('nativewind/metro')
const { withMonicon } = require('@monicon/metro')

const config = getDefaultConfig(__dirname)
const configWithMonicon = withMonicon(config)

module.exports = withNativewind(configWithMonicon)
