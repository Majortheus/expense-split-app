import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import utc from 'dayjs/plugin/utc'
import 'dayjs/locale/pt-br'

dayjs.extend(customParseFormat)
dayjs.locale('pt-br')
dayjs.extend(utc)

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

export function formatDateBR(value: Date) {
	return dayjs(value, { utc: true }).format('DD/MM/YYYY')
}

export function getInitials(name: string) {
	return name
		.trim()
		.split(/\s+/)
		.slice(0, 2)
		.map((part) => part[0]?.toUpperCase() ?? '')
		.join('')
}
