import { View } from 'react-native'
import { cn } from '@/utils/shadcn'

function Skeleton({ className, ...props }: React.ComponentProps<typeof View>) {
	return <View className={cn('animate-pulse rounded-md bg-gray-400', className)} {...props} />
}

export { Skeleton }
