import type { onRequestHookHandler } from 'fastify'
import { ServerError } from '../includes/ServerError'

export function hasRole(...roleNames: string[]): onRequestHookHandler {
	return function (request, _reply, done) {
		const authed = request.authed
		if (!authed) return done(new ServerError('Not logged in', 401))

		const hasRoles = roleNames.every(roleName =>
			authed.roles.find(role => role.name === roleName),
		)

		if (hasRoles) return done()
		else return done(new ServerError('Missing roles', 403))
	}
}
