import { inject, unref, type UnwrapRef } from 'vue'
import type { ClientContext, MiddlewareHandler } from '../types'

export function useContext() {
	return inject('context') as ClientContext
}

export function defineMiddleware(handler: MiddlewareHandler) {
	return handler
}

export type StoreDefinition<State = any> = (context: ClientContext) => State

export function defineStore<State>(
	namespace: string,
	definition: StoreDefinition<State>,
) {
	return function useStore(context = useContext()): UnwrapRef<State> {
		if (!context.state[namespace])
			context.state[namespace] = unref(definition(context))

		return context.state[namespace]
	}
}

export function debounce<T extends (...args: any[]) => any>(
	fn: T,
	delay: number,
) {
	let timeout: NodeJS.Timeout
	return (...args: Parameters<T>) => {
		clearTimeout(timeout)
		timeout = setTimeout(() => fn(...args), delay)
	}
}
