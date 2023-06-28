<template>
	<div class="body-wrapper">
		<h2 class="font-big">OnYi</h2>
		<p class="font-small">an experience by</p>
		<div class="artist-box">
			<h3 class="artist-name font-medium">NxQuantize</h3>
			<p class="artist-spacer">&</p>
			<h3 class="artist-name font-medium">LeeLo.js</h3>
		</div>
		<div class="label-box">
			<p class="font-small">for</p>
			<h4 class="font-label">Omakaze Recordings</h4>
		</div>

		<nuxt-link class="button-experience" to="cinemaNew">GO</nuxt-link>
	</div>
</template>

<script>
	
	export default {
		data(){
			return {
			}
		}
	}
</script>

<style lang="scss" scoped>

	@import url('https://fonts.googleapis.com/css2?family=Comfortaa:wght@300;700&display=swap');

	.font {

		&-small,
		&-label,
		&-medium,
		&-big {
			margin: 0;
		}

		&-small {
			font-size: 1rem;
		}

		&-label {
			font-size: 2rem;
		}

		&-medium {
			font-size: 3.5rem;
		}

		&-big {
			font-size: 8rem;
		}
	}

	.body {
		&-wrapper {
			color: white;
			// border: solid 2px green;
			text-align: center;
			position: relative;

			top: 0;
			left: 0;

			width: 100%;
			height: 100vh;

			display: flex;
			flex-flow: column nowrap;
			justify-content: center;

			font-family: 'Comfortaa', cursive;
			-webkit-font-smoothing: antialiased;
    		-moz-osx-font-smoothing: grayscale;
		}
	}

	.artist {

		&-box {
			display: flex;
			flex-flow: row nowrap;
			justify-content: center;
			align-items: center;
			width: 60%;
			margin: 0 auto;
		}

		&-name {
			width: 48%;
			// &:first-of-type {
			// 	text-align: right;
			// }
			// &:last-of-type {
			// 	text-align: left;
			// }
		}

		&-spacer {
			width: 2rem;
		}
	}

	.label {
		&-box {
			margin-top: 4rem;
		}
	}

	.button {

		&-experience {
			display: inline-block;
			background-color: white;
			margin: 2rem auto 0 auto;
			padding: 0.5rem 1.25rem;
			border-radius: 0.5rem;
		}
	}

</style>