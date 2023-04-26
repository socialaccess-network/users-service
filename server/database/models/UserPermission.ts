import { BaseModel, BaseModelData } from '@michealpearce/typeorm-models'
import { Column, Entity, JoinColumn, ManyToMany, ManyToOne } from 'typeorm'
import { User, type UserData } from './User'
import { UserRole, type UserRoleData } from './UserRole'

export interface UserPermissionData extends BaseModelData {
	name: string
	userUUID: string
	user?: UserData
}

@Entity()
export class UserPermission
	extends BaseModel<UserPermissionData>
	implements UserPermissionData
{
	@Column('varchar', { length: 255, primary: true })
	declare name: string

	@Column('varchar', { length: 255, primary: true })
	declare userUUID: string

	@ManyToOne(() => User, user => user.permissions)
	@JoinColumn({ name: 'userUUID' })
	declare user?: User
}

export const model = UserPermission
