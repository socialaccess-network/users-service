import { Endpoint, defineRoute } from '@michealpearce/classy-fastify'
import { isAdmin } from '../middleware/isAdmin'
import { hasPermission } from '../middleware/hasPermission'

export const route = defineRoute('/options')

@route.endpoint('GET')
export class OptionsGETEndpoint extends Endpoint {
	static onRequest = [hasPermission('options.read')]

	handle() {
		return this.instance.siteOptions.toJSON()
	}
}

@route.endpoint('POST')
export class OptionsSaveEndpoint extends Endpoint<{
	body: Record<string, any>
}> {
	static onRequest = [hasPermission('options.write')]

	async handle() {
		const {
			body,
			instance: { siteOptions },
		} = this

		for (const [name, value] of Object.entries(body))
			siteOptions.set(name, value)

		await siteOptions.save()
		return siteOptions.toJSON()
	}
}
