import { ConstructError } from '@michealpearce/utils'

export class ServerError extends ConstructError {
	constructor(message: string, public statusCode = 500, cause?: any) {
		super(message, cause)
	}
}
