<script lang="ts">
import { computed, defineComponent } from 'vue'

export default defineComponent({
	name: 'FormInput',
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
		class="form-input"
	>
		<input
			v-model="value"
			:id="props.id"
			v-bind="props.options"
		/>
	</FormInputBox>
</template>

<style lang="scss" scoped>
.form-input {
	input {
		width: 100%;
		padding: 0.5em;
		border: 1px solid black;
		border-radius: 0.25em;

		transform: scale(1);
		transition: all 0.25s;
	}
}
</style>
