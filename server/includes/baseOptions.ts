import type { OptionData } from '../database/models/Option'

export const baseOptions: Array<Pick<OptionData, 'name' | 'value'>> = [
	{
		name: 'sessionExpires',
		value: 604800000, // 1 week
	},
]
