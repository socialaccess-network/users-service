<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
	name: 'UsersLayout',
})
</script>

<script setup lang="ts"></script>

<template>
	<Layout class="users-layout">
		<UserPageSidebar />
		<RouterView />
	</Layout>
</template>

<style lang="scss" scoped>
.users-layout {
	@include flex(row);
}
</style>
