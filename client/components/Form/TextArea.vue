<script lang="ts">
import { computed } from '@vue/reactivity'
import { defineComponent } from 'vue'

export default defineComponent({
	name: 'FormTextArea',
})
</script>

<script setup lang="ts">
const props = defineProps<{
	modelValue: any
	id: string
	label?: string
	options?: Record<string, string | boolean>
}>()

const emit = defineEmits<{
	(event: 'update:modelValue', value: string): void
}>()

const value = computed({
	get: () => props.modelValue,
	set: value => emit('update:modelValue', value),
})
</script>

<template>
	<FormInputBox
		v-bind="props"
		class="form-text-area"
	>
		<textarea
			v-model="value"
			:id="props.id"
			v-bind="props.options"
		/>
	</FormInputBox>
</template>

<style lang="scss" scoped>
.form-text-area {
	textarea {
		width: 100%;
		padding: 0.5em;
		border: 1px solid black;
		border-radius: 0.25em;

		resize: vertical;
	}
}
</style>
