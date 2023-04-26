import { useAuth } from 'client/stores/auth'
import type { MiddlewareHandler } from 'client/types'

export const isAuthed: MiddlewareHandler = function (to, _from, context) {
	const auth = useAuth(context)

	if (!auth.current && !to.path.startsWith('/login'))
		// Redirect to login page
		return {
			path: '/login',
		}
}
