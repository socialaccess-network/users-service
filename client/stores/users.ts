import type { UserData } from 'server'
import { defineStore } from 'client/includes/functions'
import { reactive, type InjectionKey, type Ref, provide, inject } from 'vue'
import { assign } from '@michealpearce/utils'
import type { UserMetaData } from 'server'

export type UserRef = Ref<UserData | null>
export const UserInjectKey: InjectionKey<UserRef> = Symbol('users')

export function provideUser(user: UserRef) {
	return provide(UserInjectKey, user)
}

export function injectUser() {
	const user = inject(UserInjectKey)

	if (!user) throw new Error('No user provided')
	return user
}

export const useUsers = defineStore('users', context => {
	const { api } = context

	const items: {
		[uuid: string]: UserData
	} = reactive({})

	const get = (uuid: string): UserData | undefined => items[uuid]
	function set(user: UserData) {
		if (user.uuid in items) assign(items[user.uuid], user)
		else items[user.uuid] = user

		return get(user.uuid)!
	}

	async function list(params: Record<string, any>) {
		const { data } = await api.get<UserData[]>('users', { params })
		return data.map(set)
	}

	async function create(user: Partial<UserData>) {
		const { data } = await api.post<UserData>('users', user)
		return set(data)
	}

	function fetch(uuid: string) {
		return new Promise<UserData>((resolve, reject) => {
			const existing = get(uuid)
			if (existing) resolve(existing)

			return api
				.get<UserData>(`users/${uuid}`)
				.then(({ data }) => set(data))
				.then(resolve, reject)
		})
	}

	async function update(uuid: string, user: Partial<UserData>) {
		const { data } = await api.patch<UserData>(`users/${uuid}`, user)
		return set(data)
	}

	async function remove(uuid: string) {
		await api.delete(`users/${uuid}`)
		delete items[uuid]
	}

	function addRole(uuid: string, role: string) {
		return api
			.post<UserData>(`users/${uuid}/roles/${role}`)
			.then(({ data }) => set(data))
	}

	function removeRole(uuid: string, role: string) {
		return api
			.delete<UserData>(`users/${uuid}/roles/${role}`)
			.then(({ data }) => set(data))
	}

	function fetchPermissions(uuid: string) {
		return api
			.get<string[]>(`users/${uuid}/permissions`)
			.then(({ data }) => data)
	}

	function addPermission(uuid: string, permission: string) {
		return api.post(`users/${uuid}/permissions/${permission}`)
	}

	function removePermission(uuid: string, permission: string) {
		return api.delete(`users/${uuid}/permissions/${permission}`)
	}

	function listMeta(uuid: string, params?: Record<string, any>) {
		return api
			.get<UserMetaData[]>(`users/${uuid}/meta`, { params })
			.then(({ data }) => data)
	}

	function getMeta(uuid: string, name: string) {
		return api
			.get<UserMetaData>(`users/${uuid}/meta/${name}`)
			.then(({ data }) => data)
	}

	function setMeta(uuid: string, name: string, value: any) {
		return api
			.post<UserMetaData>(`users/${uuid}/meta/${name}`, { value })
			.then(({ data }) => data)
	}

	function removeMeta(uuid: string, name: string) {
		return api.delete(`users/${uuid}/meta/${name}`)
	}

	return {
		items,
		get,
		set,
		list,
		create,
		fetch,
		update,
		remove,
		addRole,
		removeRole,
		fetchPermissions,
		addPermission,
		removePermission,
		listMeta,
		getMeta,
		setMeta,
		removeMeta,
	}
})
