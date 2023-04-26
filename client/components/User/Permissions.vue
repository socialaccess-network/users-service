<script lang="ts">
import { useAsync } from 'client/includes/useAsync'
import { injectUser, useUsers } from 'client/stores/users'
import { defineComponent, onBeforeMount, reactive, ref } from 'vue'

export default defineComponent({
	name: 'UserPermissions',
})
</script>

<script setup lang="ts">
const users = useUsers()
const user = injectUser()

const perms = reactive(new Set<string>())
const permissionToAdd = ref('')

const fetch = useAsync(async () => {
	if (!user.value) return

	perms.clear()
	const res = await users.fetchPermissions(user.value.uuid)
	for (const perm of res) perms.add(perm)
	console.log(perms)
})

async function addPermission() {
	if (!user.value || !permissionToAdd.value.length) return

	await users.addPermission(user.value.uuid, permissionToAdd.value)
	permissionToAdd.value = ''

	fetch.trigger()
}

async function removePermission(perm: string) {
	if (!user.value) return

	await users.removePermission(user.value.uuid, perm)

	fetch.trigger()
}

onBeforeMount(fetch.trigger)
</script>

<template>
	<section class="user-permissions">
		<hgroup>
			<h2>Permissions</h2>

			<form @submit.prevent="addPermission">
				<FormInput
					v-model="permissionToAdd"
					id="add-user-permission"
				/>
				<FormButton type="submit">Add Permission</FormButton>
			</form>
		</hgroup>

		<div class="permissions">
			<div
				v-for="perm of perms"
				:key="perm"
				class="permission"
			>
				<span class="name">{{ perm }}</span>
				<FormButton @click="removePermission(perm)">Remove</FormButton>
			</div>
		</div>
	</section>
</template>

<style lang="scss" scoped>
.user-permissions {
	@include flex(column);
	row-gap: 1em;

	hgroup,
	.permissions {
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

	.permissions {
		@include flex(row);
		flex-wrap: wrap;
		column-gap: 1em;
		row-gap: 1em;

		.permission {
			@include flex(row, space-between, center);
			width: 100%;
			padding: 1em;
			border: 1px solid white;

			.name {
				flex: 1;
			}
		}
	}
}
</style>
