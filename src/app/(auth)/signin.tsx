import { useRouter } from 'expo-router'
import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { View } from 'react-native'
import Logo from '@/assets/logo.svg'
import { Button } from '@/components/button'
import { Input } from '@/components/input'
import { KeyboardScroll } from '@/components/keyboard-aware-scroll'
import { Page } from '@/components/page/page'
import { Typography } from '@/components/typography'
import { setTokenToStorage } from '@/services/storage/token-storage'

type SignInForm = {
	email: string
	password: string
}

export default function SignInScreen() {
	const router = useRouter()
	const methods = useForm<SignInForm>({
		defaultValues: { email: '', password: '' },
	})
	const { handleSubmit, setError } = methods
	const [loading, setLoading] = useState(false)

	const onSubmit = async (values: SignInForm) => {
		setLoading(true)
		setTimeout(async () => {
			setLoading(false)
			const validEmail = 'demo@demo.com'
			const validPassword = 'Password123'

			if (values.email === validEmail && values.password === validPassword) {
				await setTokenToStorage({ accessToken: 'dev-token' })
				router.replace('/(app)/home')
			} else {
				setError('password', { message: 'Credenciais inválidas' })
				setError('email', { message: ' ' }, { shouldFocus: false })
			}
		}, 800)
	}

	return (
		<Page>
			<View className="w-full flex-1">
				<View className="flex-1 items-center justify-center">
					<View className="mb-3">
						<Logo width={131} height={95} />
					</View>
				</View>

				<View className="w-full">
					<KeyboardScroll extraKeyboardSpace={0}>
						<View className="w-full gap-8 rounded-t-[20px] bg-gray-700 px-8 py-10">
							<View className="items-center">
								<Typography variant="label-lg" className="text-white">
									Entre no app
								</Typography>
							</View>

							<FormProvider {...methods}>
								<View className="gap-3">
									<Input
										name="email"
										iconName="mail-send-envelope"
										placeholder="Email"
										keyboardType="email-address"
										autoComplete="email"
										textContentType="emailAddress"
									/>
									<Input name="password" iconName="asterisk-1" placeholder="Senha" secureTextEntry autoComplete="password" textContentType="password" />
								</View>
								<Button variant="primary" onPress={handleSubmit(onSubmit)} disabled={loading}>
									{loading ? 'Entrando...' : 'Entrar'}
								</Button>
							</FormProvider>

							<View className="gap-4 border-gray-600 border-t pt-8">
								<View className="items-center">
									<Typography variant="text-sm" className="text-gray-200">
										Ainda não tem cadastro?
									</Typography>
								</View>
								<View className="items-center">
									<Button variant="secondary" onPress={() => router.replace('/(auth)/signup')}>
										Criar conta
									</Button>
								</View>
							</View>
						</View>
					</KeyboardScroll>
				</View>
			</View>
		</Page>
	)
}
