import { Endpoint, defineRoute } from '@michealpearce/classy-fastify'
import { pick } from '@michealpearce/utils'
import { User, type UserData } from '../database/models/User'
import { ServerError } from '../includes/ServerError'
import { parseListQuery } from '../includes/functions'
import { UserPermission } from '../database/models/UserPermission'
import { hasPermission } from '../middleware/hasPermission'
import { UserRole } from '../database/models/UserRole'
import { UserMeta } from '../database/models/UserMeta'

export const route = defineRoute('/users')

@route.endpoint('GET')
export class UsersListEndpoint extends Endpoint<{
	query: {
		limit?: number
		page?: number
		order?: string
	}
}> {
	async handle() {
		const options = parseListQuery(this.query)

		try {
			this.console.info(options, 'Listing users')
			const items = await User.find(options)

			if (!items.length) throw new ServerError('No users found', 404)
			return items
		} catch (error) {
			this.console.error(error, 'Failed to list users')

			if (error instanceof ServerError) throw error
			throw new ServerError('Failed to list users', 500)
		}
	}
}

@route.endpoint('POST')
export class UsersCreateEndpoint extends Endpoint<{
	body: Partial<UserData>
}> {
	get data() {
		return pick(this.body, ['name'])
	}

	async handle() {
		try {
			return await User.init(this.data).save()
		} catch (error) {
			this.console.error(error, 'Failed to create user')

			if (error instanceof ServerError) throw error
			throw new ServerError('Failed to create user', 500)
		}
	}
}

@route.endpoint('GET', '/:uuid')
export class UsersFetchEndpoint extends Endpoint<{
	params: {
		uuid: string
	}
}> {
	async handle() {
		try {
			const user = await User.findOneBy({
				uuid: this.params.uuid,
			})

			if (!user) throw new ServerError('User not found', 404)
			return user
		} catch (error) {
			this.console.error(error, 'Failed to fetch user')

			if (error instanceof ServerError) throw error
			throw new ServerError('Failed to fetch user', 500)
		}
	}
}

@route.endpoint('POST', '/:uuid/roles/:name')
export class UsersAddRoleEndpoint extends Endpoint<{
	params: { uuid: string; name: string }
}> {
	static onRequest = [hasPermission('users.addRole')]

	async handle() {
		const { name } = this.params
		const fetch = new UsersFetchEndpoint(
			this.instance,
			this.request,
			this.reply,
		)
		const user = await fetch.handle()

		try {
			const role = await UserRole.findOne({
				where: { name },
			})

			if (!role) throw new ServerError('Role not found', 400)

			user.roles.push(role)
			await user.save()

			return user
		} catch (error) {
			this.console.error(error, 'Failed to add user role')

			if (error instanceof ServerError) throw error
			throw new ServerError('Failed to add user role', 500)
		}
	}
}

@route.endpoint('DELETE', '/:uuid/roles/:name')
export class UsersRemoveRoleEndpoint extends Endpoint<{
	params: { uuid: string; name: string }
}> {
	static onRequest = [hasPermission('users.removeRole')]

	async handle() {
		const { name } = this.params
		const fetch = new UsersFetchEndpoint(
			this.instance,
			this.request,
			this.reply,
		)
		const user = await fetch.handle()

		try {
			const role = await UserRole.findOne({
				where: { name },
			})

			if (!role) throw new ServerError('Role not found', 400)

			user.roles = user.roles.filter(r => r.name !== role.name)
			await user.save()

			return user
		} catch (error) {
			this.console.error(error, 'Failed to remove user role')

			if (error instanceof ServerError) throw error
			throw new ServerError('Failed to remove user role', 500)
		}
	}
}

@route.endpoint('GET', '/:uuid/permissions')
export class UsersFetchPermissionsEndpoint extends Endpoint<{
	params: {
		uuid: string
	}
}> {
	async handle() {
		const { uuid } = this.params

		try {
			const user = await User.findOne({
				where: { uuid },
				relations: {
					permissions: true,
				},
				select: {
					uuid: true,
					permissions: true,
				},
			})

			if (!user) throw new ServerError('User not found', 404)
			else if (!user.permissions)
				throw new Error('user permissions relation not loaded')

			return user.permissions.map(perm => perm.name)
		} catch (error) {
			this.console.error(error, 'Failed to fetch user permissions')

			if (error instanceof ServerError) throw error
			throw new ServerError('Failed to fetch user permissions', 500)
		}
	}
}

@route.endpoint('GET', '/:uuid/permissions/:name')
export class UsersHasPermissionEndpoint extends Endpoint<{
	params: {
		uuid: string
		name: string
	}
}> {
	async handle() {
		const { uuid, name } = this.params

		try {
			const user = await User.findOne({
				where: { uuid },
				relations: {
					permissions: true,
					roles: true,
				},
				select: {
					uuid: true,
					permissions: true,
					roles: true,
				},
			})

			if (!user) throw new ServerError('User not found', 404)
			else if (!user.permissions)
				throw new Error('user permissions relation not loaded')

			const directlyHasPerm = user.permissions
				.map(perm => perm.name)
				.includes(name)

			if (directlyHasPerm) return true

			// check user roles
			for (const { name: roleName } of user.roles) {
				const role = await UserRole.findOneOrFail({
					where: { name: roleName },
					relations: {
						permissions: true,
					},
					select: {
						name: true,
						permissions: true,
					},
				})

				const roleHasPerm = role
					.permissions!.map(perm => perm.name)
					.includes(name)
				if (roleHasPerm) return true
			}

			return false
		} catch (error) {
			this.console.error(error, 'Failed to fetch user permission')

			if (error instanceof ServerError) throw error
			throw new ServerError('Failed to check user permission', 500)
		}
	}
}

@route.endpoint('POST', '/:uuid/permissions/:name')
export class UsersAddPermissionEndpoint extends Endpoint<{
	params: {
		uuid: string
		name: string
	}
}> {
	static onRequest = [hasPermission('users.addPermission')]

	async handle() {
		const { uuid, name } = this.params

		try {
			const user = await User.findOne({
				where: { uuid },
				relations: {
					permissions: true,
				},
				select: {
					uuid: true,
					permissions: true,
				},
			})

			if (!user) throw new ServerError('User not found', 404)
			else if (!user.permissions) user.permissions = []

			const missingPerm = !user.permissions.find(perm => perm.name === name)
			if (missingPerm) {
				user.permissions.push(UserPermission.init({ name }))
				await user.save()
			}

			return user.permissions.map(perm => perm.name)
		} catch (error) {
			this.console.error(error, 'Failed to add user permission')

			if (error instanceof ServerError) throw error
			throw new ServerError('Failed to add user permission', 500)
		}
	}
}

@route.endpoint('DELETE', '/:uuid/permissions/:name')
export class UsersRemovePermissionEndpoint extends Endpoint<{
	params: {
		uuid: string
		name: string
	}
}> {
	static onRequest = [hasPermission('users.removePermission')]

	async handle() {
		const { uuid, name } = this.params

		try {
			const user = await User.findOne({
				where: { uuid },
				relations: {
					permissions: true,
				},
				select: {
					uuid: true,
					permissions: true,
				},
			})

			if (!user) throw new ServerError('User not found', 404)
			else if (!user.permissions) user.permissions = []

			const missingPerm = !user.permissions.find(perm => perm.name === name)
			if (!missingPerm) {
				user.permissions = user.permissions.filter(perm => perm.name !== name)
				await user.save()
			}

			return user.permissions.map(perm => perm.name)
		} catch (error) {
			this.console.error(error, 'Failed to remove user permission')

			if (error instanceof ServerError) throw error
			throw new ServerError('Failed to remove user permission', 500)
		}
	}
}

@route.endpoint('GET', '/:uuid/meta')
export class UsersListMetaEndpoint extends Endpoint<{
	params: { uuid: string }
	query: Record<string, string>
}> {
	async handle() {
		const { uuid } = this.params
		const options = parseListQuery(this.query, 10000)

		if (options.where) options.where.uuid = uuid
		else options.where = { userUUID: uuid }

		try {
			const items = await UserMeta.find(options)

			if (!items) throw new ServerError('Meta not found', 404)
			return items
		} catch (error) {
			this.console.error(error, 'Failed to list user meta')

			if (error instanceof ServerError) throw error
			throw new ServerError('Failed to list user meta', 500)
		}
	}
}

@route.endpoint('GET', '/:uuid/meta/:name')
export class UsersGetMetaEndpoint extends Endpoint<{
	params: { uuid: string; name: string }
}> {
	async handle() {
		const { uuid, name } = this.params

		try {
			const meta = await UserMeta.findOneBy({ userUUID: uuid, name })

			if (!meta) throw new ServerError('Meta not found', 404)
			return meta
		} catch (error) {
			this.console.error(error, 'Failed to get user meta')

			if (error instanceof ServerError) throw error
			throw new ServerError('Failed to get user meta', 500)
		}
	}
}

@route.endpoint('POST', '/:uuid/meta/:name')
export class UsersSetMetaEndpoint extends Endpoint<{
	params: { uuid: string; name: string }
	body: { value: any }
}> {
	async handle() {
		const {
			params: { uuid: userUUID, name },
			body,
		} = this
		const value = body.value

		try {
			const meta = await UserMeta.init({ userUUID, name, value }).save()
			return meta
		} catch (error) {
			this.console.error(error, 'Failed to set user meta')

			if (error instanceof ServerError) throw error
			throw new ServerError('Failed to set user meta', 500)
		}
	}
}

@route.endpoint('DELETE', '/:uuid/meta/:name')
export class UsersRemoveMetaEndpoint extends Endpoint<{
	params: { uuid: string; name: string }
}> {
	async handle() {
		const { uuid, name } = this.params

		try {
			const meta = await UserMeta.findOneBy({ userUUID: uuid, name })

			if (!meta) throw new ServerError('Meta not found', 404)
			await meta.remove()
			return true
		} catch (error) {
			this.console.error(error, 'Failed to remove user meta')

			if (error instanceof ServerError) throw error
			throw new ServerError('Failed to remove user meta', 500)
		}
	}
}
