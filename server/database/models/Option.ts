import { Model, type ModelData } from '@michealpearce/typeorm-models'
import { Column, Entity } from 'typeorm'

export interface OptionData extends ModelData {
	name: string
	value: unknown
}

@Entity()
export class Option extends Model<OptionData> implements OptionData {
	@Column('varchar', { length: 255, primary: true })
	declare name: string

	@Column('simple-json')
	declare value: unknown
}

export const model = Option
