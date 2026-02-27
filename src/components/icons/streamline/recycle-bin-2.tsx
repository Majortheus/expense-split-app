import { type SvgProps, SvgXml } from 'react-native-svg'

const StreamlineRecycleBin2Icon = (props: Omit<SvgProps, 'xml'>) => {
	const xml = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="M1 3.5h12m-10.5 0h9v9a1 1 0 0 1-1 1h-7a1 1 0 0 1-1-1zm2 0V3a2.5 2.5 0 1 1 5 0v.5m-4 3.001v4.002m3-4.002v4.002"/></svg>`

	return <SvgXml xml={xml} {...props} />
}

export default StreamlineRecycleBin2Icon
