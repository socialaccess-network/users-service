import { Endpoint, defineRoute } from '@michealpearce/classy-fastify'
import { isAdmin } from '../middleware/isAdmin'
import { parseListQuery } from '../includes/functions'
import { UserRole } from '../database/models/UserRole'
import { ServerError } from '../includes/ServerError'

export const route = defineRoute('/user-roles')

@route.endpoint('GET')
export class UserRolesListEndpoint extends Endpoint<{
	query: {
		limit?: number
		page?: number
		order?: string
	}
}> {
	async handle() {
		const options = parseListQuery(this.query)

		try {
			const items = await UserRole.find(options)

			if (!items.length) throw new ServerError('No user roles found', 404)
			return items
		} catch (error) {
			this.console.error(error, 'Failed to list user roles')

			if (error instanceof ServerError) throw error
			throw new ServerError('Failed to list user roles', 500)
		}
	}
}

@route.endpoint('POST')
export class UserRolesCreateEndpoint extends Endpoint {
	static onRequest = [isAdmin]

	handle() {}
}

@route.endpoint('GET', '/:id')
export class UserRolesGetEndpoint extends Endpoint {
	handle() {}
}

@route.endpoint('PATCH', '/:id')
export class UserRolesUpdateEndpoint extends Endpoint {
	static onRequest = [isAdmin]

	handle() {}
}

@route.endpoint('DELETE', '/:id')
export class UserRolesDeleteEndpoint extends Endpoint {
	static onRequest = [isAdmin]

	handle() {}
}
