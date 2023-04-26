import type { onRequestHookHandler } from 'fastify'
import { ServerError } from '../includes/ServerError'

export const isAdmin: onRequestHookHandler = function (request, _reply, done) {
	const authed = request.authed

	if (!authed) return done(new ServerError('Unauthorized', 401))

	const hasAdminRole = authed.roles.some(role => role.name === 'admin')
	if (!hasAdminRole) return done(new ServerError('Unauthorized', 401))
	else done()
}
