<script lang="ts">
import type { UserData } from 'server'
import { useUsers } from 'client/stores/users'
import { defineComponent, onBeforeMount, reactive, ref, watch } from 'vue'
import { useAsync } from 'client/includes/useAsync'
import { isString } from '@michealpearce/utils'
import { debounce } from 'client/includes/functions'

export default defineComponent({
	name: 'UserPageSidebar',
})
</script>

<script setup lang="ts">
const users = useUsers()

const search = ref('')
const items = reactive(new Map<string, UserData>())
const params = reactive({
	page: 0,
	limit: 50,
	order: '',
	where: '',
	search: '',
})

let errorTimeout: NodeJS.Timeout | null = null
const list = useAsync(async () => {
	if (errorTimeout) return

	params.page++
	try {
		const res = await users.list(params)
		for (const item of res) items.set(item.uuid, item)
	} catch (error) {
		params.page--
		console.error('failed listing users', error)

		errorTimeout = setTimeout(() => {
			errorTimeout = null
		}, 1000)
	}
})

const searchUpdated = debounce((value: string) => {
	const orderRegex = / ?(\w+:(?:DESC|ASC|desc|asc)) ?/g
	const whereRegex = / ?((?<prop>\w+)(?<like>~)?\[(?<value>[^\]]*)\]) ?/g

	params.order = Array.from(value.matchAll(orderRegex))
		.map(match => match[1])
		.filter(isString)
		.join(',')
	params.where = Array.from(value.matchAll(whereRegex))
		.map(match => match[1])
		.filter(isString)
		.join(',')
	params.search = value.replace(orderRegex, '').replace(whereRegex, '').trim()
	params.page = 0

	items.clear()
	list.trigger()
}, 1000)

const scrolled = debounce((percent: number) => {
	if (percent > 90) return list.trigger()
}, 250)

onBeforeMount(list.trigger)
watch(search, searchUpdated)
</script>

<template>
	<aside class="user-page-sidebar">
		<header>
			<h2>Users</h2>

			<Link
				class="create-user"
				to="/admin/users/create"
			>
				<FormButton>Create</FormButton>
			</Link>

			<FormInput
				v-model="search"
				id="users-search"
				:options="{
					type: 'search',
					placeholder: 'Search...',
				}"
			/>
		</header>

		<ScrollNotifier
			v-slot="{ onScroll }"
			@scrolled="scrolled"
		>
			<div
				class="items"
				@scroll.passive="onScroll"
				@wheel.passive="onScroll"
			>
				<Link
					v-for="[uuid, user] in items"
					:key="uuid"
					:to="`/admin/users/${uuid}`"
				>
					{{ user.name }}
				</Link>
			</div>
		</ScrollNotifier>
	</aside>
</template>

<style lang="scss" scoped>
.user-page-sidebar {
	@include flex(column);
	width: 300px;
	max-width: 100%;

	height: 100%;
	padding: 0.5em;
	border-right: 1px solid white;
	row-gap: 1em;
	flex-shrink: 0;

	header,
	.items {
		width: 100%;
	}

	header {
		display: grid;
		grid-template-columns: 1fr auto;
		grid-template-rows: auto auto;
		grid-template-areas: 'title create' 'search search';
		align-items: center;

		h2 {
			grid-area: title;
		}

		.create-user {
			grid-area: create;
		}

		.form-input {
			grid-area: search;
		}
	}

	.items {
		@include flex(column);
		flex: 1;
		overflow-y: auto;
		row-gap: 0.5em;

		.link {
			@include flex(row);
			width: 100%;
			align-items: center;
			padding: 1em;
			border-radius: 0.25em;
			transition: background-color 0.25s;
			color: white;

			&:hover,
			&.router-link-active {
				background-color: rgba(255, 255, 255, 0.1);
			}
		}
	}
}
</style>
