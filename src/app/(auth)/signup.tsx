import { toast } from '@backpackapp-io/react-native-toast'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { View } from 'react-native'
import { z } from 'zod'
import Logo from '@/assets/logo.svg'
import { Button } from '@/components/button'
import { Input } from '@/components/input'
import { KeyboardScroll } from '@/components/keyboard-aware-scroll'
import { Page } from '@/components/page/page'
import { Typography } from '@/components/typography'
import { useAuth } from '@/hooks/use-auth'
import { setTokenToStorage } from '@/services/storage/token-storage'

const signUpSchema = z.object({
	name: z.string().trim().min(1, 'Nome é obrigatório'),
	email: z.string().trim().min(1, 'E-mail é obrigatório').email('E-mail inválido'),
	password: z.string().min(1, 'Senha é obrigatória').min(8, 'Senha deve ter ao menos 8 caracteres'),
})

type SignUpFormData = z.infer<typeof signUpSchema>

export default function SignUpScreen() {
	const router = useRouter()
	const { setUser } = useAuth()
	const methods = useForm<SignUpFormData>({
		defaultValues: { name: '', email: '', password: '' },
		resolver: zodResolver(signUpSchema),
	})
	const { handleSubmit } = methods
	const [isLoading, setIsLoading] = useState(false)

	const onSubmit = async (values: SignUpFormData) => {
		setIsLoading(true)
		setTimeout(async () => {
			setIsLoading(false)

			try {
				await setTokenToStorage({ accessToken: 'dev-token' })
				setUser({ email: values.email })
				router.replace('/activities')
			} catch {
				toast.error('Não foi possível criar sua conta')
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
									Crie sua conta
								</Typography>
							</View>

							<FormProvider {...methods}>
								<View className="gap-3">
									<Input name="name" iconName="user-circle-single" placeholder="Nome" autoComplete="name" textContentType="name" autoCapitalize="words" />
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
								<Button variant="primary" isLoading={isLoading} onPress={handleSubmit(onSubmit)}>
									{isLoading ? 'Cadastrando...' : 'Cadastrar'}
								</Button>
							</FormProvider>

							<View className="gap-4 border-gray-600 border-t pt-8">
								<View className="items-center">
									<Typography variant="text-sm" className="text-gray-200">
										Já tem cadastro?
									</Typography>
								</View>

								<View className="w-full">
									<Button variant="secondary" onPress={() => router.replace('/signin')}>
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
