<script lang="ts">
import { useAsync } from 'client/includes/useAsync'
import { useUsers, type UserRef, provideUser } from 'client/stores/users'
import { computed, defineComponent, ref, watch } from 'vue'

export default defineComponent({
	name: 'UsersSingleLayout',
})
</script>

<script setup lang="ts">
const users = useUsers()
const props = defineProps<{
	uuid: string
}>()

const uuid = computed(() => props.uuid)
const user: UserRef = ref(null)
const fetch = useAsync(async () => {
	user.value = await users.fetch(uuid.value)
})

provideUser(user)
watch(uuid, fetch.trigger, { immediate: true })
</script>

<template>
	<Layout class="users-single-layout">
		<RouterView :key="user?.uuid" />
	</Layout>
</template>

<style lang="scss" scoped>
.layout.users-single-layout {
	@include flex(row, center);
	overflow-y: auto;
}
</style>
