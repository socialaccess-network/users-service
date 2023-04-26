<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
	name: 'Page',
})
</script>

<script setup lang="ts"></script>

<template>
	<div class="page">
		<slot />
	</div>
</template>

<style lang="scss" scoped>
.page {
	width: 100%;
	height: 100%;

	overflow-x: hidden;
	overflow-y: auto;
}
</style>
