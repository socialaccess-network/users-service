import { Model, type ModelData } from '@michealpearce/typeorm-models'
import { User, type UserData } from './User'
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'

export interface UserSessionData extends ModelData {
	id: string
	expires: number
	userUUID: string
	user: UserData
}

@Entity()
export class UserSession
	extends Model<UserSessionData>
	implements UserSessionData
{
	@Column('varchar', { primary: true, length: 255 })
	declare id: string

	@Column('bigint')
	declare expires: number

	@Column('varchar')
	declare userUUID: string

	@ManyToOne(() => User, { onDelete: 'CASCADE', eager: true })
	@JoinColumn({ name: 'userUUID' })
	declare user: User
}

export const model = UserSession
