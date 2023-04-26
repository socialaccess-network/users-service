import { Endpoint, defineRoute } from '@michealpearce/classy-fastify'
import { hasPermission } from '../middleware/hasPermission'
import { parseListQuery } from '../includes/functions'
import { UserPermission } from '../database/models/UserPermission'
import { ServerError } from '../includes/ServerError'

export const route = defineRoute('/permissions')

@route.endpoint('GET')
export class PermissionsListEndpoint extends Endpoint<{
	query: Record<string, any>
}> {
	static onRequest = [hasPermission('permissions.read')]

	async handle() {
		const { query } = this
		const options = parseListQuery(query)

		try {
			const items = await UserPermission.find(options)

			if (!items.length) throw new ServerError('No items found', 404)
			return items
		} catch (error) {
			this.console.error(error, 'failed listing permissions')

			if (error instanceof ServerError) throw error
			throw new ServerError('Failed listing permissions', 500)
		}
	}
}
