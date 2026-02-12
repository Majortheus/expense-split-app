// Minimal BottomSheet provider and hook for layout

import type { ReactNode } from 'react'
import { createContext, useContext, useState } from 'react'

type Context = {
	isBottomSheetOpen: boolean
	setOpen: (open: boolean) => void
}

const BottomSheetContext = createContext<Context | null>(null)

export function BottomSheetProvider({ children }: { children: ReactNode }) {
	const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false)

	return <BottomSheetContext.Provider value={{ isBottomSheetOpen, setOpen: setIsBottomSheetOpen }}>{children}</BottomSheetContext.Provider>
}

export function useBottomSheet() {
	const ctx = useContext(BottomSheetContext)
	if (!ctx) return { isBottomSheetOpen: false, setOpen: () => {} }
	return ctx
}
