<script setup lang="ts"></script>

<template>
	<RouterView />
</template>

<style lang="scss">
* {
	box-sizing: border-box;
}

html,
body,
#app {
	display: contents;
	width: 100%;
	height: 100%;

	padding: 0px;
	margin: 0px;

	font-family: 'Fira Mono', monospace;
	font-size: medium;

	background-color: #212121;
	color: #ffffff;

	overflow: hidden;
}

h1,
h2,
h3,
h4,
h5,
h6 {
	margin: 0px;
	padding: 0.5em 0px;
}

p {
	margin: 0px;
	padding: 0.5em 0px;
}
</style>
