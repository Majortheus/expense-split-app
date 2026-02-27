import { KeyboardAwareScrollView, type KeyboardAwareScrollViewProps } from 'react-native-keyboard-controller'

type Props = KeyboardAwareScrollViewProps & {}

export function KeyboardScroll({ children, ...rest }: Props) {
	return (
		<KeyboardAwareScrollView
			keyboardShouldPersistTaps={'handled'}
			bottomOffset={30}
			contentContainerStyle={[{ flexGrow: 1 }, rest.contentContainerStyle]}
			{...rest}
		>
			{children}
		</KeyboardAwareScrollView>
	)
}
