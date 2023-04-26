<script lang="ts">
import { computed, defineComponent } from 'vue'

export default defineComponent({
	name: 'Link',
})
</script>

<script setup lang="ts">
const props = defineProps<{
	to: string
}>()

const isInternal = computed(() => props.to.startsWith('/'))
const componentName = computed(() => (isInternal.value ? 'RouterLink' : 'a'))
const attrName = computed(() => (isInternal.value ? 'to' : 'href'))
</script>

<template>
	<component
		:is="componentName"
		:[attrName]="props.to"
		class="link"
	>
		<slot />
	</component>
</template>

<style lang="scss" scoped>
.link {
}
</style>
