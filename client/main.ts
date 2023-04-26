import { createApp, reactive } from 'vue'
import App from './App.vue'
import type { ClientContext } from './types'
import { setupAPI } from './plugins/api'
import { setupRouter } from './plugins/router'

const context = {
	app: createApp(App),
	state: reactive({}),
} as ClientContext

async function mount() {
	context.app.provide('context', context)
	await setupAPI(context)
	setupRouter(context)

	context.app.mount('#app')
}

mount()
