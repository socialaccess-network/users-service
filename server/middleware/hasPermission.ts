import type { onRequestHookHandler } from 'fastify'
import { ServerError } from '../includes/ServerError'
import { User } from '../database/models/User'
import { UserRole } from '../database/models/UserRole'
import { UserPermission } from '../database/models/UserPermission'
import { RolePermission } from '../database/models/RolePermission'

export function hasPermission(...permissions: string[]): onRequestHookHandler {
	return async function (request) {
		const authed = request.authed
		if (!authed) throw new ServerError('Not logged in', 401)

		const userPerms = await UserPermission.findBy({
			userUUID: authed.uuid,
		})

		const foundPerms = new Set<string>()

		for (const perm of userPerms)
			if (permissions.includes(perm.name)) foundPerms.add(perm.name)
		if (foundPerms.size === permissions.length) return

		// check user roles
		for (const { name } of authed.roles) {
			const rolePerms = await RolePermission.findBy({
				roleName: name,
			})

			for (const perm of rolePerms)
				if (permissions.includes(perm.name)) foundPerms.add(perm.name)

			if (foundPerms.size === permissions.length) return
		}

		const missingPerms = permissions
			.filter(perm => !foundPerms.has(perm))
			.join(', ')
		throw new ServerError(`Missing permissions: ${missingPerms}`, 403)
	}
}
