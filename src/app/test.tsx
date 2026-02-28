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
				<View className="flex-1 px-4 py-8">
					<KeyboardScroll>
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
											placeholder="Select an option"
											options={[
												{ value: 'pending', label: 'Pendente' },
												{ value: 'partial', label: 'Parcial' },
												{ value: 'paid', label: 'Pago' },
												{ value: 'partial2', label: 'Parcial2' },
												{ value: 'paid2', label: 'Pago2' },
												{ value: 'partial3', label: 'Parcial3' },
												{ value: 'paid3', label: 'Pago3' },
											]}
										/>
										<Typography variant="text-sm">Selected: {form.watch('select')}</Typography>
									</View>
								</View>
							</View>
						</View>
						<View className="mt-8">
							<Link href="/">
								<Typography>Voltar para Home</Typography>
							</Link>
						</View>
					</KeyboardScroll>
				</View>
			</FormProvider>
		</Page>
	)
}
