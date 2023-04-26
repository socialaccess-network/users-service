import type { App } from 'vue'
import type { RouteLocationNormalized, RouteLocationRaw } from 'vue-router'

export interface ClientState extends Record<string, any> {}

export interface ClientContext {
	app: App
	state: ClientState
}

type NavigationGuardReturn = void | Error | RouteLocationRaw | boolean
export type MiddlewareHandler = (
	to: RouteLocationNormalized,
	from: RouteLocationNormalized,
	context: ClientContext,
) => NavigationGuardReturn | Promise<NavigationGuardReturn>
