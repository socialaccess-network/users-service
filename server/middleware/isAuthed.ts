import type { onRequestHookHandler } from 'fastify'
import { ServerError } from '../includes/ServerError'

export const isAuthed: onRequestHookHandler = function (request, _reply, done) {
	if (!request.authed) done(new ServerError('Not authorized', 401))
	else done()
}
