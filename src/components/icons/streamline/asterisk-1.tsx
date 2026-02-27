import { type SvgProps, SvgXml } from 'react-native-svg'

const StreamlineAsterisk1Icon = (props: Omit<SvgProps, 'xml'>) => {
	const xml = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="M7 .5v13m-5.5-10l11 7m-11 0l11-7"/></svg>`

	return <SvgXml xml={xml} {...props} />
}

export default StreamlineAsterisk1Icon
