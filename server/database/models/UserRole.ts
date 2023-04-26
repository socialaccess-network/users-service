import { Model, type ModelData } from '@michealpearce/typeorm-models'
import { Column, Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm'
import { User, type UserData } from './User'
import { UserPermission, type UserPermissionData } from './UserPermission'
import { RolePermission } from './RolePermission'

export interface UserRoleData extends ModelData {
	name: string
	displayName: string
	users?: UserData[]
	permissions?: UserPermissionData[]
}

@Entity()
export class UserRole extends Model<UserRoleData> implements UserRoleData {
	@Column('varchar', { unique: true, primary: true, length: 255 })
	declare name: string

	@Column('varchar')
	declare displayName: string

	@ManyToMany(() => User, user => user.roles)
	@JoinTable({ name: 'user_roles' })
	declare users?: User[]

	@OneToMany(() => RolePermission, permission => permission.role, {
		cascade: true,
	})
	declare permissions?: UserPermission[]
}

export const model = UserRole
