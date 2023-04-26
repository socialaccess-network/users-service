import { defineStore } from 'client/includes/functions'
import type { LoginCreds, UserData, UserSessionData } from 'server'
import { ref } from 'vue'

export const useAuth = defineStore('auth', context => {
	const { api } = context

	const current = ref<UserData | null>(null)

	async function fetch() {
		const { data } = await api.get<UserData>('auth')
		current.value = data

		return data
	}

	async function login(creds: LoginCreds) {
		const { data } = await api.post<UserSessionData>('auth', creds)

		localStorage.setItem('token', data.id)
		api.defaults.headers.common.Authorization = `Bearer ${data.id}`

		current.value = data.user!
	}

	function clear() {
		localStorage.removeItem('token')
		api.defaults.headers.common.Authorization = undefined
		current.value = null
	}

	async function logout() {
		clear()
		await api.delete('auth')
	}

	return {
		current,
		fetch,
		login,
		clear,
		logout,
	}
})
