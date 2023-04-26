<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
	name: 'FormButton',
})
</script>

<script setup lang="ts"></script>

<template>
	<button class="form-button">
		<slot />
	</button>
</template>

<style lang="scss" scoped>
.form-button {
	@include flex(row, center, center);
	padding: 0.5em 1em;

	border: 1px solid black;
	border-radius: 0.25em;

	font-size: 0.8em;
	font-weight: bold;

	cursor: pointer;
	transform: scale(1);
	transition: all 0.25s;

	&:hover,
	&:focus {
		&:not(:active):not(:disabled) {
			transform: scale(1.05);
		}
	}
}
</style>
