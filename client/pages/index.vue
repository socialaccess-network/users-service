<script lang="ts">
import { defineComponent, onBeforeMount } from 'vue'
import { useRouter } from 'vue-router'

export default defineComponent({
	name: 'IndexPage',
})
</script>

<script setup lang="ts">
const router = useRouter()

onBeforeMount(() => {
	router.push('/admin')
})
</script>

<template>
	<div class="index-page"></div>
</template>
