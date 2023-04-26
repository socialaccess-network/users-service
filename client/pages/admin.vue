<script lang="ts">
import { isAdmin } from 'client/middleware/isAdmin'
import { defineComponent } from 'vue'

export default defineComponent({
	name: 'AdminPage',
	middleware: [isAdmin],
})
</script>

<script setup lang="ts"></script>

<template>
	<Layout class="admin-layout">
		<NavigationSidebar />
		<RouterView class="admin-subpage" />
	</Layout>
</template>

<style lang="scss" scoped>
.admin-layout {
	@include flex(row);

	.admin-subpage {
		flex: 1;
	}
}
</style>
