<script lang="ts">
import { useUsers } from 'client/stores/users'
import { injectUser } from 'client/stores/users'
import { defineComponent, ref } from 'vue'

export default defineComponent({
	name: 'UserRoles',
})
</script>

<script setup lang="ts">
const users = useUsers()
const user = injectUser()

const roleToAdd = ref('')
async function addRole() {
	if (!user.value || !roleToAdd.value) return
	await users.addRole(user.value.uuid, roleToAdd.value)
	roleToAdd.value = ''
}

async function removeRole(role: string) {
	if (!user.value) return
	await users.removeRole(user.value.uuid, role)
}
</script>

<template>
	<section
		v-if="user"
		class="user-roles"
	>
		<hgroup>
			<h2>Roles</h2>

			<form @submit.prevent="addRole">
				<FormInput
					v-model="roleToAdd"
					id="user-add-role"
				/>
				<FormButton type="submit">Add Role</FormButton>
			</form>
		</hgroup>

		<div class="roles">
			<div
				v-for="role in user.roles"
				:key="role.name"
				class="role"
			>
				<span class="name">{{ role.displayName }} ({{ role.name }})</span>
				<FormButton @click="removeRole(role.name)">Remove</FormButton>
			</div>
		</div>
	</section>
</template>

<style lang="scss" scoped>
.user-roles {
	@include flex(column);
	row-gap: 1em;

	hgroup,
	.roles {
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

	.roles {
		@include flex(row);
		flex-wrap: wrap;
		column-gap: 1em;
		row-gap: 1em;

		.role {
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
