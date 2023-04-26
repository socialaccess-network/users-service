<script lang="ts">
import { assign } from '@michealpearce/utils'
import { useAsync } from 'client/includes/useAsync'
import { useOptions } from 'client/stores/options'
import { computed, defineComponent, onBeforeMount, reactive } from 'vue'

export default defineComponent({
	name: 'OptionsPage',
})
</script>

<script setup lang="ts">
const options = useOptions()

const items: Record<string, any> = reactive({})
const fetch = useAsync(async () => {
	const data = await options.fetch()
	assign(items, data)
})

async function save() {
	await options.save(items)
}

onBeforeMount(fetch.trigger)
</script>

<template>
	<Page class="options-page">
		<h1>Options</h1>

		<form @submit.prevent="save">
			<template
				v-for="name of Object.keys(items)"
				:key="name"
			>
				<FormInput
					v-if="typeof items[name] === 'number'"
					v-model.number="items[name]"
					:id="`option-${name}`"
					:label="name"
					:options="{ type: 'number' }"
				/>
				<FormInput
					v-else
					v-model="items[name]"
					:id="`option-${name}`"
					:label="name"
				/>
			</template>

			<FormButton type="submit">Save</FormButton>
		</form>
	</Page>
</template>

<style lang="scss" scoped>
.options-page {
}
</style>
