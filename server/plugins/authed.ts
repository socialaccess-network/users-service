import { definePlugin } from '@michealpearce/classy-fastify'
import { UserSession } from '../database/models/UserSession'
import type { User } from '../database/models/User'

declare module 'fastify' {
	interface FastifyRequest {
		token?: string
		authed?: User
	}
}

export const plugin = definePlugin(
	instance => {
		instance.addHook('onRequest', async (request, reply) => {
			const token = request.headers.authorization?.split(' ')[1]
			if (!token) return

			const session = await UserSession.findOneBy({ id: token })

			if (!session) {
				reply.status(401).send()
				return
			} else if (session.expires < Date.now()) {
				await session.remove()
				reply.status(401).send()
				return
			}

			request.token = token
			request.authed = session.user
		})
	},
	{
		global: true,
		name: 'authed',
	},
)
