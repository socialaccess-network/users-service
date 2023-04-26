import { isDefined } from '@michealpearce/utils'
import fastify, {
	type FastifyPluginAsync,
	type FastifyPluginCallback,
} from 'fastify'

const app = fastify({
	ignoreDuplicateSlashes: true,
	logger: {
		transport: {
			target: 'pino-pretty',
		},
	},
	ignoreTrailingSlash: true,
})

function getPlugins(): Array<FastifyPluginAsync | FastifyPluginCallback> {
	const files = import.meta.glob<true, string, Record<string, any>>(
		'./plugins/*.ts',
		{
			eager: true,
		},
	)

	return Object.values(files)
		.map(file => file.plugin)
		.filter(isDefined)
}

async function main() {
	const plugins = getPlugins()
	for (const plugin of plugins) await app.register(plugin)

	const serverURL = new URL(
		import.meta.env.SERVER_URL ?? 'http://localhost:3001',
	)

	await app.listen({
		port: Number(serverURL.port),
	})

	// Current implementation of construct cli does fully stop the process due to hmr being enabled so need to close the server manually on full reload
	import.meta.hot?.on('vite:beforeFullReload', () => app.close())
}

main()
