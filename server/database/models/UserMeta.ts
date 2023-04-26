import { Model, type ModelData } from '@michealpearce/typeorm-models'
import { User, type UserData } from './User'
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'

export interface UserMetaData extends ModelData {
	userUUID: string
	name: string
	value: string

	user?: UserData
}

@Entity()
export class UserMeta extends Model<UserMetaData> implements UserMetaData {
	@Column('varchar', { length: 225, primary: true })
	declare userUUID: string

	@Column('varchar', { length: 225, primary: true })
	declare name: string

	@Column('longtext')
	declare value: string

	@ManyToOne(() => User, user => user.meta, { onDelete: 'CASCADE' })
	@JoinColumn({ name: 'userUUID' })
	declare user?: User
}

export const model = UserMeta
