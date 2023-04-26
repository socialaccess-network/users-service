import { defineStore } from 'client/includes/functions'

export const useOptions = defineStore('options', context => {
	const { api } = context

	function fetch() {
		return api.get<Record<string, any>>('options').then(res => res.data)
	}

	function save(data: Record<string, any>) {
		return api.post<Record<string, any>>('options', data).then(res => res.data)
	}

	return {
		fetch,
		save,
	}
})
