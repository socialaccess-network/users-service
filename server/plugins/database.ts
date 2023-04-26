import { DataSource } from 'typeorm'
import { definePlugin } from '@michealpearce/classy-fastify'
import { isDefined, type ClassType } from '@michealpearce/utils'
import type { BaseModel } from '@michealpearce/typeorm-models'
import { baseOptions } from '../includes/baseOptions'
import { Option } from '../database/models/Option'
import type { FastifyInstance } from 'fastify'
import { baseRoles } from '../includes/baseRoles'
import { UserRole } from '../database/models/UserRole'

declare module 'fastify' {
	interface FastifyInstance {
		database: DataSource
		siteOptions: SiteOptions
	}
}

class SiteOptions extends Map<string, any> {
	async load() {
		const options = await Option.find()
		for (const option of options) this.set(option.name, option.value)
	}

	async save() {
		for (const [name, value] of this) {
			const option = await Option.findOneByOrFail({ name }).catch(() =>
				Option.init({ name }),
			)

			option.value = value
			await option.save()
		}
	}

	toJSON() {
		return Object.fromEntries(this)
	}
}

function getModels(): Array<ClassType<BaseModel<any>>> {
	const files = import.meta.glob<true, string, Record<string, any>>(
		'../database/models/**/*.ts',
		{
			eager: true,
		},
	)

	return Object.values(files)
		.map(file => file.model)
		.filter(isDefined)
}

async function loadBaseOptions(instance: FastifyInstance) {
	for (const { name, value } of baseOptions) {
		const option = await Option.findOneBy({ name })
		if (option) continue

		instance.log.info({ option: name, value }, 'Creating base option')
		await Option.init({ name, value }).save()
	}
}

async function loadBaseRoles(instance: FastifyInstance) {
	for (const data of baseRoles) {
		const role = await UserRole.findOneBy({ name: data.name })
		if (role) continue

		instance.log.info(data, 'Creating base role')
		await UserRole.init(data).save()
	}
}

export const plugin = definePlugin(
	async instance => {
		const entities = getModels()
		const entityNames = entities.map(entity => entity.name)

		const source = new DataSource({
			type: 'mysql',
			host: import.meta.env.SERVER_DATABASE_HOST ?? 'localhost',
			port: Number(import.meta.env.SERVER_DATABASE_PORT ?? 3306),
			username: import.meta.env.SERVER_DATABASE_USER,
			password: import.meta.env.SERVER_DATABASE_PASSWORD,
			database: import.meta.env.SERVER_DATABASE_NAME,
			synchronize: !import.meta.env.PROD,

			entities,
		})

		instance.log.info({ entities: entityNames }, 'Initializing database')

		try {
			await source.initialize()
		} catch (error) {
			instance.log.error(error, 'Failed to initialize database')
			throw error
		}

		instance.log.info('Database initialized')
		instance.decorate('database', source)

		instance.log.info('Loading base roles')
		await loadBaseRoles(instance)

		await loadBaseOptions(instance)
		const siteOptions = new SiteOptions()

		instance.log.info('Loading site options')
		try {
			await siteOptions.load()
		} catch (error) {
			instance.log.error(error, 'Failed to load site options')
			throw error
		}

		instance.decorate('siteOptions', siteOptions)
		instance.log.info({ siteOptions }, 'Site options loaded')
	},
	{
		global: true,
		name: 'database',
	},
)
