<script lang="ts">
import { useAsync } from 'client/includes/useAsync'
import { injectUser, useUsers } from 'client/stores/users'
import { computed, defineComponent, onBeforeMount, reactive } from 'vue'

export default defineComponent({
	name: 'UserMeta',
})
</script>

<script setup lang="ts">
const users = useUsers()
const user = injectUser()

const userMeta = reactive(new Map<string, any>())
const metaToAdd = reactive({
	name: '',
	value: '',
})

const sortedMeta = computed(() =>
	Array.from(userMeta).sort(([a], [b]) => a.localeCompare(b)),
)

const fetch = useAsync(async () => {
	if (!user.value) return

	userMeta.clear()
	const metas = await users.listMeta(user.value.uuid, {
		limit: 10000,
	})
	for (const meta of metas) userMeta.set(meta.name, meta)
})

async function setMeta(name: string, value: string) {
	if (!user.value) return

	const updated = await users.setMeta(user.value.uuid, name, value)

	userMeta.set(updated.name, updated)
}

async function removeMeta(name: string) {
	if (!user.value) return

	const doitpussy = confirm('Are you sure you want to remove this meta?')
	if (doitpussy) {
		await users.removeMeta(user.value.uuid, name)
		userMeta.delete(name)
	}
}

onBeforeMount(fetch.trigger)
</script>

<template>
	<section class="user-meta">
		<hgroup>
			<h2>Meta</h2>

			<form
				@submit.prevent="
					() => {
						setMeta(metaToAdd.name, metaToAdd.value)
						metaToAdd.name = ''
					}
				"
			>
				<FormInput
					v-model="metaToAdd.name"
					id="add-user-meta-name"
					:options="{ placeholder: 'Name' }"
				/>
				<!-- <FormInput
					v-model="metaToAdd.value"
					id="add-user-meta-value"
				/> -->

				<FormButton type="submit">Add Meta</FormButton>
			</form>
		</hgroup>

		<div class="items">
			<div
				v-for="[name, meta] of sortedMeta"
				:key="name"
				:id="`user-meta-${name}`"
				class="item"
			>
				<hgroup>
					<span class="name">{{ name }}</span>

					<div class="actions">
						<FormButton @click="removeMeta(name)">Remove</FormButton>
						<FormButton @click="setMeta(name, meta.value)">Save</FormButton>
					</div>
				</hgroup>

				<FormTextArea
					v-model="meta.value"
					:id="`user-meta-${name}-input`"
				/>
			</div>
		</div>
	</section>
</template>

<style lang="scss" scoped>
.user-meta {
	@include flex(column);
	row-gap: 1em;

	hgroup,
	.items {
		width: 100%;
	}

	hgroup {
		@include flex(row, space-between, center);

		form {
			@include flex(row);
			column-gap: 1em;

			.form-input {
				flex: 1;
			}
		}
	}

	.items {
		@include flex(column);
		row-gap: 1em;

		.item {
			@include flex(column);
			width: 100%;
			row-gap: 0.5em;
			padding: 1em;
			border: 1px solid white;

			hgroup,
			.form-text-area {
				width: 100%;
			}

			hgroup {
				@include flex(row, space-between, center);

				.actions {
					@include flex(row);
					column-gap: 1em;
				}
			}

			.form-text-area :deep(textarea) {
				min-height: 10em;
			}
		}
	}
}
</style>
