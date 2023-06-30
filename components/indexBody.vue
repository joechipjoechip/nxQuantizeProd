<template>
	<div class="body-wrapper">
		<h2 class="font-big">OnYi</h2>
		<p class="font-small sentence">an experience by</p>
		<div class="artist-box">
			<h3 class="artist-name font-medium artist-item">NxQuantize</h3>
			<p class="artist-spacer">&</p>
			<h3 class="artist-name font-medium artist-item">LeeLo.js</h3>
		</div>
		<div class="label-box">
			<p class="font-small sentence">for</p>
			<h4 class="font-label label-item">Omakaze Recordings</h4>
		</div>

		<div>

			<button v-if="!cinemaIsReady" 
				class="button-experience" 
				disabled
			>
				Loading ...
			</button>

			<button v-else 
				class="button-experience"
				@click="$parent.isAtEntrance = false"
			>
				GO
			</button>

		</div>
	</div>
</template>

<script>
	
	export default {
		data(){
			return {
				cinemaIsReady: false
			}
		},
		mounted(){
			this.$nuxt.$on("cinema-is-ready", this.toggleStartButton);
		},
		beforeDestroy(){
			this.$nuxt.$off("cinema-is-ready", this.toggleStartButton);
		},
		methods: {
			toggleStartButton( event ){
				if( event ){
					this.cinemaIsReady = true;
				}
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
			font-size: 1.5rem;
		}

		&-medium {
			font-size: 2.5rem;
		}

		&-big {
			font-size: 7rem;
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

			font-family: 'Comfortaa', arial;
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
			width: 100%;
			max-width: 900px;
			margin: 0 auto;
		}

		&-name {
			// width: 48%;
			

			// display: inline-block;
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
			margin-top: 2rem;
		}
	}

	.artist,
	.label {
		&-item {

			display: inline-block;
			padding: 0.75rem 1.25rem;
			border-radius: 20px;
			backdrop-filter: blur(8px);

			box-shadow: 0 -1px 0px rgba(255, 255, 255, 0.15),
						0 2px 2px rgba(0,0,0, 0.25),
						1px -1px 1px transparent;

			&:hover {
				box-shadow: 0 -1px 0px rgba(255,255,255,0.15),
							0 2px 2px rgba(0,0,0, 0.25),
							0 -20px 60px #00f9ff;
			}

		}
	}

	.sentence {
		margin-bottom: 0.5rem;
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