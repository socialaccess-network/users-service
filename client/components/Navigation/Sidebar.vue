<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
	name: 'NavigationSidebar',
})
</script>

<script setup lang="ts"></script>

<template>
	<nav class="navigation-sidebar">
		<Link to="/admin/users">Users</Link>
		<Link to="/admin/user-roles">User Roles</Link>
		<Link to="/admin/options">Options</Link>
	</nav>
</template>

<style lang="scss" scoped>
.navigation-sidebar {
	@include flex(column);
	min-width: 200px;
	width: 20%;
	max-width: 250px;
	height: 100%;
	padding: 0.5em;
	row-gap: 0.5em;

	border-right: 1px solid white;

	.link {
		@include flex(row);
		width: 100%;
		align-items: center;
		padding: 1em;
		border-radius: 0.25em;
		transition: background-color 0.25s;
		color: white;

		&:hover,
		&.router-link-active {
			background-color: rgba(255, 255, 255, 0.1);
		}
	}
}
</style>
