import { useFonts } from 'expo-font'
import { SplashScreen } from 'expo-router'
import { useEffect } from 'react'

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync()

type FontGuardProps = {
	children: React.ReactNode
}

export function FontGuard({ children }: FontGuardProps) {
	const [loaded, error] = useFonts({
		/* Project fonts (placed under assets/fonts/) */
		'Inter-Regular': require('../../assets/fonts/inter/Inter_18pt-Regular.ttf'),
		'Inter-SemiBold': require('../../assets/fonts/inter/Inter_18pt-SemiBold.ttf'),
		'Sora-Bold': require('../../assets/fonts/sora/Sora-Bold.ttf'),
	})

	useEffect(() => {
		if (error) throw error
	}, [error])

	useEffect(() => {
		if (loaded) {
			SplashScreen.hideAsync()
		}
	}, [loaded])

	if (!loaded) {
		return null
	}

	return children
}
