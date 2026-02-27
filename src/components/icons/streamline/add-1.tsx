import { type SvgProps, SvgXml } from 'react-native-svg'

const StreamlineAdd1Icon = (props: Omit<SvgProps, 'xml'>) => {
	const xml = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="M7 .5v13M.5 6.96h13"/></svg>`

	return <SvgXml xml={xml} {...props} />
}

export default StreamlineAdd1Icon
