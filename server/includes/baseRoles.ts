import type { UserRoleData } from '../database/models/UserRole'

export const baseRoles: Array<
	Pick<UserRoleData, 'name' | 'displayName' | 'permissions'>
> = [
	{
		name: 'admin',
		displayName: 'Administrator',
		permissions: [
			{ name: 'users.list' },
			{ name: 'users.create' },
			{ name: 'users.edit' },
			{ name: 'users.addPermission' },
			{ name: 'users.removePermission' },
			{ name: 'users.delete' },
			{ name: 'users.addRole' },
			{ name: 'users.removeRole' },
			{ name: 'roles.list' },
			{ name: 'roles.create' },
			{ name: 'roles.addPermission' },
			{ name: 'roles.removePermission' },
			{ name: 'roles.delete' },
		],
	},
]
