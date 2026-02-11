// Minimal react-query client instance
import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			// 10 minutes stale time
			staleTime: 1000 * 60 * 10,
		},
	},
})
