import { toast } from '@backpackapp-io/react-native-toast'
import { zodResolver } from '@hookform/resolvers/zod'
import { isAxiosError } from 'axios'
import { useRouter } from 'expo-router'
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
import { useUserSignInMutation } from '@/services/query/users'

const signInSchema = z.object({
	email: z.string().trim().min(1, 'E-mail é obrigatório').email('E-mail inválido'),
	password: z.string().min(1, 'Senha é obrigatória'),
})

type SignInFormData = z.infer<typeof signInSchema>

export default function SignInScreen() {
	const router = useRouter()
	const { setUser } = useAuth()
	const signInMutation = useUserSignInMutation()
	const methods = useForm<SignInFormData>({
		defaultValues: { email: '', password: '' },
		resolver: zodResolver(signInSchema),
	})
	const { handleSubmit } = methods

	const onSubmit = async (values: SignInFormData) => {
		try {
			const { id, email, name } = await signInMutation.mutateAsync(values)
			setUser({ id, email, name })
			router.replace('/activities')
		} catch (error) {
			const message = isAxiosError(error) ? error.response?.data?.message : null
			toast.error(message ?? 'Credenciais inválidas')
		}
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
										placeholder="E-mail"
										keyboardType="email-address"
										autoComplete="email"
										textContentType="emailAddress"
									/>
									<Input name="password" iconName="asterisk-1" placeholder="Senha" secureTextEntry autoComplete="password" textContentType="password" />
								</View>
								<Button variant="primary" isLoading={signInMutation.isPending} onPress={handleSubmit(onSubmit)}>
									{signInMutation.isPending ? 'Entrando...' : 'Entrar'}
								</Button>
							</FormProvider>

							<View className="gap-4 border-gray-600 border-t pt-8">
								<View className="items-center">
									<Typography variant="text-sm" className="text-gray-200">
										Ainda não tem cadastro?
									</Typography>
								</View>
								<View className="w-full">
									<Button variant="secondary" onPress={() => router.replace('/signup')}>
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
