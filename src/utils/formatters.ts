const currencyFormatter = new Intl.NumberFormat('pt-BR', {
	style: 'currency',
	currency: 'BRL',
})

export function formatCurrencyBRL(valueInCents: number) {
	return currencyFormatter.format(valueInCents / 100)
}

export function formatActivityCount(count: number) {
	return `Em ${count} ${count === 1 ? 'atividade' : 'atividades'}`
}

export function formatExpenseCount(count: number) {
	return `${count} ${count === 1 ? 'despesa' : 'despesas'}`
}

export function formatParticipantCount(count: number) {
	return `${count} ${count === 1 ? 'pessoa' : 'pessoas'}`
}

export function getInitials(name: string) {
	return name
		.trim()
		.split(/\s+/)
		.slice(0, 2)
		.map((part) => part[0]?.toUpperCase() ?? '')
		.join('')
}
