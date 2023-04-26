import type { FunctionType } from '@michealpearce/utils'
import { reactive } from 'vue'

export function useAsync<Func extends FunctionType<any, []>>(runner: Func) {
	const state: {
		pending: boolean
		error: unknown
		result: Awaited<ReturnType<Func>> | null
	} = reactive({
		pending: false,
		error: null,
		result: null,
	})

	async function trigger() {
		state.pending = true
		state.error = null
		state.result = null
		try {
			state.result = await runner()
		} catch (error) {
			state.error = error
		} finally {
			state.pending = false
		}
	}

	return {
		trigger,
		get pending() {
			return state.pending
		},
		get error() {
			return state.error
		},
		get result() {
			return state.result
		},
	}
}
