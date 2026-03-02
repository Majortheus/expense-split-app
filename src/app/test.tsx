import { Link } from 'expo-router'
import { FormProvider, useForm } from 'react-hook-form'
import { View } from 'react-native'
import { Button } from '@/components/button'
import { Input } from '@/components/input'
import { KeyboardScroll } from '@/components/keyboard-aware-scroll'
import { Page } from '@/components/page/page'
import { Select } from '@/components/select'
import { Status } from '@/components/status'
import { StatusSelect } from '@/components/status-select'
import { Typography } from '@/components/typography'

export default function TestPage() {
	const form = useForm()

	return (
		<Page>
			<FormProvider {...form}>
				<KeyboardScroll>
					<View className="flex-1 px-8 py-8">
						<Typography variant="heading-lg">Página de Components do Figma</Typography>

						<View className="mt-4">
							<Typography variant="label-md" className="mb-2">
								Buttons (with icons both sides)
							</Typography>

							<View className="flex-col gap-8">
								<Button startIconName="add-1" endIconName="add-1" variant="primary">
									Label
								</Button>

								<Button startIconName="add-1" endIconName="add-1" variant="secondary">
									Label
								</Button>

								<Button startIconName="add-1" endIconName="add-1" variant="danger">
									Label
								</Button>
								<View className="flex-row items-center gap-8">
									<Button startIconName="add-1" variant="primary" accessibilityLabel="Adicionar" />
									<Button startIconName="add-1" variant="secondary" accessibilityLabel="Adicionar" />
									<Button startIconName="add-1" variant="danger" accessibilityLabel="Adicionar" />
								</View>
							</View>
						</View>

						<View className="mt-8">
							<Typography variant="label-md" className="mb-2">
								Status
							</Typography>

							<View className="flex-row items-center gap-4">
								<Status variant="pending" />
								<Status variant="partial" />
								<Status variant="paid" />
							</View>

							<View className="mt-4">
								<Typography variant="label-md" className="mb-2">
									Status Select
								</Typography>
								<View className="flex-row items-center gap-4">
									<StatusSelect name="status" />
									<Typography variant="text-sm">Selected: {form.watch('status')}</Typography>
								</View>
							</View>
						</View>

						<View className="mt-8">
							<Typography variant="label-md" className="mb-2">
								Inputs
							</Typography>

							<View className="flex-col gap-4">
								<Input name="placeholder-input" placeholder="Placeholder" />
								<Input name="text-input" placeholder="Text" />
								<View className="mt-4">
									<Typography variant="label-md" className="mb-2">
										Select (uses Input)
									</Typography>
									<View className="flex-col items-center gap-4">
										<Select
											name="select"
											placeholder="Selecionar participantes"
											multiple
											options={[
												{ value: '1', label: 'Matheus Limão Brites' },
												{ value: '2', label: 'Rebeka Souza Limão Brites' },
												{ value: '3', label: 'Wilson Brites' },
												{ value: '4', label: 'Maria Inês' },
												{ value: '5', label: 'Fernanda' },
												{ value: '6', label: 'Ryan' },
												{ value: '7', label: 'Joelinda' },
											]}
										/>
										<Typography variant="text-sm">Selected values: {form.watch('select')?.join(', ')}</Typography>
									</View>
								</View>
							</View>
						</View>
						<View className="mt-8">
							<Link href="/">
								<Typography>Voltar para Home</Typography>
							</Link>
						</View>
					</View>
				</KeyboardScroll>
			</FormProvider>
		</Page>
	)
}
