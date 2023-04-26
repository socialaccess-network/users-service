import { Endpoint, defineRoute } from '@michealpearce/classy-fastify'
import { ServerError } from '../includes/ServerError'
import { User } from '../database/models/User'
import { comparePassword, generateAPIKey } from '../includes/functions'
import { UserSession } from '../database/models/UserSession'
import { isAuthed } from '../middleware/isAuthed'

export type LoginCreds = {
	username: string
	password: string
}

export const route = defineRoute('/auth')

@route.endpoint('GET')
export class AuthGETEndpoint extends Endpoint {
	static onRequest = [isAuthed]

	handle() {
		return this.request.authed!
	}
}

@route.endpoint('POST')
export class AuthLoginEndpoint extends Endpoint<{
	body: LoginCreds
}> {
	async handle() {
		this.console.info(this.request.body)
		const { username, password } = this.request.body

		const user = await User.findOne({
			where: { name: username },
			select: {
				uuid: true,
				name: true,
				password: true,
			},
		})
		if (!user || !user.password)
			throw new ServerError('Invalid username or password', 401)

		const valid = await comparePassword(password, user.password)
		if (!valid) throw new ServerError('Invalid username or password', 401)

		const expires = this.instance.siteOptions.get('sessionExpires') ?? 604800000 // 1 week
		const session = await UserSession.init({
			id: generateAPIKey(),
			// 1 week
			expires: Date.now() + expires,
			userUUID: user.uuid,
		}).save()
		await session.reload()

		return session
	}
}

@route.endpoint('DELETE')
export class AuthLogoutEndpoint extends Endpoint {
	static onRequest = [isAuthed]

	async handle() {
		const token = this.request.token
		if (!token) throw new ServerError('No token provided', 400)

		await UserSession.delete({ id: token })
		return { success: true }
	}
}
