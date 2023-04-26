import { defaults, isString } from '@michealpearce/utils'
import { compare, hash } from 'bcrypt'
import { randomBytes } from 'crypto'
import {
	Like,
	type FindManyOptions,
	type FindOptionsOrder,
	type FindOptionsWhere,
} from 'typeorm'

export function parseListQuery(
	query: Record<string, any>,
	maxLimit = 100,
): FindManyOptions & {
	where?: FindOptionsWhere<any>
} {
	const opts = defaults(query, {
		limit: 10,
		page: 0,
	})

	const take = parseLimitQuery(opts.limit, maxLimit)
	const skip = parsePageQuery(opts.page, take)

	const options: FindManyOptions = {
		take,
		skip,
	}

	if (isString(opts.order)) options.order = parseOrderQuery(opts.order)
	if (isString(opts.where)) options.where = parseWhereQuery(opts.where)

	return options
}

export function parseLimitQuery(limit: number, maxLimit = 100) {
	return Math.min(Math.max(limit, 1), maxLimit)
}

export function parsePageQuery(page: number, take: number) {
	return (Math.max(page, 1) - 1) * take
}

export function parseOrderQuery(input: string): FindOptionsOrder<any> {
	return input.split(',').reduce((acc, cur) => {
		const [key, direction] = cur.split(':')
		acc[key] = direction
		return acc
	}, {} as Record<string, any>)
}

export function parseWhereQuery(input: string): FindOptionsWhere<any> {
	const regex = / ?((?<prop>\w+)(?<like>~)?\[(?<value>[^\]]*)\]) ?/g
	const matches = Array.from(input.matchAll(regex))
	return matches.reduce((acc, { groups }) => {
		if (!groups) return acc

		if (groups.like) acc[groups.prop] = Like(groups.value)
		else acc[groups.prop] = groups.value

		return acc
	}, {} as Record<string, any>)
}

export function hashPassword(password: string) {
	return hash(password, 10)
}

export function comparePassword(password: string, hash: string) {
	return compare(password, hash)
}

export function generateAPIKey() {
	return randomBytes(32).toString('hex')
}
