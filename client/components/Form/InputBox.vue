<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
	name: 'FormInputBox',
})
</script>

<script setup lang="ts">
const props = defineProps<{
	id: string
	label?: string
	options?: Record<string, string | boolean>
}>()
</script>

<template>
	<fieldset class="form-input-box">
		<slot
			v-if="props.label"
			name="label"
			:label="props.label"
		>
			<label
				class="input-label"
				:for="props.id"
			>
				<FormRequiredMark v-if="props.options?.required" />
				{{ props.label }}
			</label>
		</slot>

		<div class="input-area">
			<slot />
		</div>
	</fieldset>
</template>

<style lang="scss" scoped>
.form-input-box {
	@include flex(column);
	row-gap: 0.25em;
	border: none;
	margin: 0px;
	padding: 0px;

	.input-label {
		@include flex(row, flex-start, center);
		width: 100%;
		column-gap: 0.25em;
	}

	.input-area {
		width: 100%;
	}
}
</style>
