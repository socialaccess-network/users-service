<script lang="ts">
import { injectUser } from 'client/stores/users'
import { defineComponent } from 'vue'

export default defineComponent({
	name: 'UsersSingleIndexPage',
})
</script>

<script setup lang="ts">
const user = injectUser()
</script>

<template>
	<Page
		v-if="user"
		class="users-single-index-page"
	>
		<h1>{{ user.name }}</h1>

		<UserRoles />
		<UserPermissions />
		<UserMeta />
	</Page>
</template>

<style lang="scss" scoped>
.users-single-index-page {
	@include flex(column);
	max-width: 900px;
	height: auto;
	padding: 1em;
	padding-bottom: 30%;
	row-gap: 1em;

	.user-roles,
	.user-permissions,
	.user-meta {
		width: 100%;
	}
}
</style>
