import { definePlugin } from '@michealpearce/classy-fastify'
import { isDefined, type FunctionType } from '@michealpearce/utils'

function getRoutes(): Array<FunctionType> {
	const files = import.meta.glob<true, string, Record<string, any>>(
		'../api/**/*.route.ts',
		{
			eager: true,
		},
	)

	return Object.values(files)
		.map(file => file.route)
		.filter(isDefined)
}

export const plugin = definePlugin(
	async instance => {
		for (const route of getRoutes())
			await instance.register(route, {
				prefix: '/api',
			})
	},
	{
		global: true,
		name: 'routes',
	},
)
