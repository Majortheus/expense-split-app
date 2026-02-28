import { KeyboardAwareScrollView, type KeyboardAwareScrollViewProps } from 'react-native-keyboard-controller'

type Props = KeyboardAwareScrollViewProps & {}

export function KeyboardScroll({ children, ...rest }: Props) {
	return (
		<KeyboardAwareScrollView
			keyboardShouldPersistTaps={'never'}
			bottomOffset={150}
			contentContainerStyle={[{ flexGrow: 1 }, rest.contentContainerStyle]}
			extraKeyboardSpace={100}
			{...rest}
		>
			{children}
		</KeyboardAwareScrollView>
	)
}
