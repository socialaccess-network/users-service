<script lang="ts">
import { isDefined, isString, noop } from '@michealpearce/utils'
import { useAuth } from 'client/stores/auth'
import type { LoginCreds } from 'server'
import { defineComponent, onBeforeMount, reactive } from 'vue'
import { useRouter } from 'vue-router'

export default defineComponent({
	name: 'LoginPage',
})
</script>

<script setup lang="ts">
const router = useRouter()
const auth = useAuth()
const creds: LoginCreds = reactive({
	username: '',
	password: '',
})

function redirect() {
	const redirect = router.currentRoute.value.query.redirect as string

	if (isString(redirect)) return router.push(redirect)
	else return router.push('/')
}

async function login() {
	try {
		await auth.login(creds)
		return redirect()
	} catch (error) {
		alert('invalid username or password')
		console.error(error)
	}
}

onBeforeMount(async () => {
	const logout = router.currentRoute.value.query.logout as string

	if (isDefined(logout)) {
		await auth.logout().catch(noop)
		// hard refresh page
		window.location.href = '/login'
	} // else if (auth.current) return redirect()
})
</script>

<template>
	<Page class="login-page">
		<h1>Login</h1>
		<form @submit.prevent="login">
			<FormInput
				v-model="creds.username"
				id="username"
				label="Username"
				:options="{ type: 'text', required: true }"
			/>

			<FormInput
				v-model="creds.password"
				id="password"
				label="Password"
				:options="{ type: 'password', required: true }"
			/>

			<FormButton type="submit">Login</FormButton>
		</form>
	</Page>
</template>

<style lang="scss" scoped>
.login-page {
	@include flex(column, center, center);
	overflow: hidden;

	form {
		@include flex(column, center, center);
		padding: 1em;
		border: 1px solid black;
		border-radius: 0.25em;

		row-gap: 1em;

		.form-button {
			width: 100%;
		}
	}
}
</style>
