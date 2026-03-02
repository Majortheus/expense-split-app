import { KeyboardAwareScrollView, type KeyboardAwareScrollViewProps } from 'react-native-keyboard-controller'

type Props = KeyboardAwareScrollViewProps & {}

export function KeyboardScroll({ children, ...rest }: Props) {
	return (
		<KeyboardAwareScrollView
			keyboardShouldPersistTaps={'never'}
			bottomOffset={50}
			contentContainerStyle={[{ flexGrow: 1 }, rest.contentContainerStyle]}
			extraKeyboardSpace={50}
			{...rest}
		>
			{children}
		</KeyboardAwareScrollView>
	)
}
