<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
	name: 'Layout',
})
</script>

<script setup lang="ts"></script>

<template>
	<div class="layout">
		<slot />
	</div>
</template>

<style lang="scss" scoped>
.layout {
	display: contents;
	width: 100%;
	height: 100%;

	overflow: hidden;
}
</style>
