import { Slot } from 'expo-router'
import { Page } from '@/components/page/page'

export default function AppLayout() {
	return (
		<Page>
			<Slot />
		</Page>
	)
}
