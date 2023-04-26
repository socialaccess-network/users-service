<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
	name: 'UsersIndexPage',
})
</script>

<script setup lang="ts"></script>

<template>
	<Page class="users-index-page">
		<h1>Select a User</h1>
	</Page>
</template>

<style lang="scss" scoped>
.users-index-page {
	@include flex(column, center, center);
}
</style>
