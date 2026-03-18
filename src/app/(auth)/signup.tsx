import { type Href, useRouter } from 'expo-router'
import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { View } from 'react-native'
import Logo from '@/assets/logo.svg'
import { Button } from '@/components/button'
import { Input } from '@/components/input'
import { KeyboardScroll } from '@/components/keyboard-aware-scroll'
import { Page } from '@/components/page/page'
import { Typography } from '@/components/typography'
import { useAuth } from '@/hooks/use-auth'
import { setTokenToStorage } from '@/services/storage/token-storage'

const HOME_ROUTE = '/home' as Href
const SIGNIN_ROUTE = '/signin' as Href

type SignUpForm = {
	name: string
	email: string
	password: string
}

export default function SignUpScreen() {
	const router = useRouter()
	const { setUser } = useAuth()
	const methods = useForm<SignUpForm>({
		defaultValues: { name: '', email: '', password: '' },
	})
	const { handleSubmit, setError } = methods
	const [loading, setLoading] = useState(false)

	const onSubmit = async (values: SignUpForm) => {
		setLoading(true)
		setTimeout(async () => {
			setLoading(false)

			if (!values.name.trim()) {
				setError('name', { message: 'Nome é obrigatório' })
				return
			}

			if (!values.email.trim()) {
				setError('email', { message: 'E-mail é obrigatório' })
				return
			}

			if (!values.password || values.password.length < 8) {
				setError('password', { message: 'Senha deve ter ao menos 8 caracteres' })
				return
			}

			await setTokenToStorage({ accessToken: 'dev-token' })
			setUser({ email: values.email })
			router.replace(HOME_ROUTE)
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
									Crie sua conta
								</Typography>
							</View>

							<FormProvider {...methods}>
								<View className="gap-3">
									<Input name="name" iconName="user-circle-single" placeholder="Nome" autoComplete="name" textContentType="name" />
									<Input
										name="email"
										iconName="mail-send-envelope"
										placeholder="E-mail"
										keyboardType="email-address"
										autoComplete="email"
										textContentType="emailAddress"
									/>
									<Input name="password" iconName="asterisk-1" placeholder="Senha" secureTextEntry autoComplete="password" textContentType="password" />
								</View>
								<Button variant="primary" onPress={handleSubmit(onSubmit)} disabled={loading}>
									{loading ? 'Cadastrando...' : 'Cadastrar'}
								</Button>
							</FormProvider>

							<View className="gap-4 border-gray-600 border-t pt-8">
								<View className="items-center">
									<Typography variant="text-sm" className="text-gray-200">
										Já tem cadastro?
									</Typography>
								</View>

								<View className="w-full">
									<Button variant="secondary" onPress={() => router.replace(SIGNIN_ROUTE)}>
										Entrar na conta
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
