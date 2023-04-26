import { ModelUUID, ModelUUIDData } from '@michealpearce/typeorm-models'
import {
	Column,
	Entity,
	JoinTable,
	ManyToMany,
	OneToMany,
	Unique,
} from 'typeorm'
import { UserRole, type UserRoleData } from './UserRole'
import { UserPermission, type UserPermissionData } from './UserPermission'
import { UserMeta, type UserMetaData } from './UserMeta'

export interface UserData extends ModelUUIDData {
	name: string
	email: string
	password?: string
	roles: UserRoleData[]
	permissions?: UserPermissionData[]
	meta?: UserMetaData[]
}

@Entity()
@Unique('name-email', ['name', 'email'])
export class User extends ModelUUID<UserData> implements UserData {
	@Column('varchar')
	declare name: string

	@Column('varchar')
	declare email: string

	@Column('varchar', { select: false })
	declare password?: string

	@ManyToMany(() => UserRole, role => role.users, { eager: true })
	declare roles: UserRole[]

	@OneToMany(() => UserPermission, perm => perm.user, { cascade: true })
	declare permissions?: UserPermission[]

	@OneToMany(() => UserMeta, meta => meta.user, { cascade: true })
	declare meta?: UserMeta[]
}

export const model = User
