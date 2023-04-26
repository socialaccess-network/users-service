import { BaseModel, BaseModelData } from '@michealpearce/typeorm-models'
import {
	Column,
	Entity,
	JoinColumn,
	ManyToMany,
	ManyToOne,
	OneToOne,
} from 'typeorm'
import { UserRole } from './UserRole'

export interface RolePermissionData extends BaseModelData {
	name: string
	roleName: string
}

@Entity()
export class RolePermission
	extends BaseModel<RolePermissionData>
	implements RolePermissionData
{
	@Column('varchar', { length: 255, primary: true })
	declare name: string

	@Column('varchar', { length: 255, primary: true })
	declare roleName: string

	@ManyToOne(() => UserRole, role => role.permissions)
	@JoinColumn({ name: 'roleName' })
	declare role?: UserRole
}

export const model = RolePermission
