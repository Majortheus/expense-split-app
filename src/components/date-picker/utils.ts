import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import 'dayjs/locale/pt-br.js'

dayjs.extend(customParseFormat)
dayjs.locale('pt-br')

export const DATE_DISPLAY_FORMAT = 'DD/MM/YYYY'
export const DATE_WEB_FORMAT = 'YYYY-MM-DD'

export function startOfToday() {
	return dayjs().startOf('day').toDate()
}

export function formatDisplayDate(value: Date | string) {
	const date = dayjs(value)
	return date.isValid() ? date.format(DATE_DISPLAY_FORMAT) : ''
}

export function parseDisplayDate(value?: string) {
	if (!value) return null

	const date = dayjs(value, DATE_DISPLAY_FORMAT, true)
	return date.isValid() ? date.toDate() : null
}

export function toWebInputValue(value?: string) {
	const date = parseDisplayDate(value)
	return date ? dayjs(date).format(DATE_WEB_FORMAT) : ''
}

export function fromWebInputValue(value: string) {
	if (!value) return ''

	const date = dayjs(value, DATE_WEB_FORMAT, true)
	return date.isValid() ? date.format(DATE_DISPLAY_FORMAT) : ''
}

export function toWebDateInputValue(value: Date) {
	return dayjs(value).format(DATE_WEB_FORMAT)
}

export function clampDate(value: Date, minimumDate?: Date, maximumDate?: Date) {
	let date = dayjs(value)
	if (minimumDate && date.isBefore(dayjs(minimumDate), 'day')) date = dayjs(minimumDate)
	if (maximumDate && date.isAfter(dayjs(maximumDate), 'day')) date = dayjs(maximumDate)
	return date.toDate()
}
