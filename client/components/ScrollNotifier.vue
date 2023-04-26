<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
	name: 'ScrollNotifier',
})
</script>

<script setup lang="ts">
const emit = defineEmits<{
	(event: 'scrolled', percent: number): void
}>()

function onScroll({ target }: Event) {
	if (!(target instanceof HTMLElement)) return

	let percent = target.scrollTop / (target.scrollHeight - target.clientHeight)

	// if percent is NaN, it means the scrollable element is at the start
	if (isNaN(percent)) percent = 1
	emit('scrolled', percent * 100)
}
</script>

<template>
	<slot :onScroll="onScroll" />
</template>
