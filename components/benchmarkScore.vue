<template>
	<div>

		<div class="rank" :style="{ 'color': color }">
		
			<div v-if="!$store.state.badComputer && !$store.state.veryBadComputer">
				<i class="i ic:round-star"></i>
				<i class="i ic:round-star"></i>
				<i class="i ic:round-star"></i>
			</div>

			<div v-if="$store.state.badComputer">
				<i class="i ic:round-star"></i>
				<i class="i ic:round-star"></i>
				<i class="i ic:round-star-border"></i>
			</div>

			<div v-if="$store.state.veryBadComputer">
				<i class="i ic:round-star"></i>
				<i class="i ic:round-star-border"></i>
				<i class="i ic:round-star-border"></i>
			</div>

		</div>

		<div class="recommandation">

			<div v-if="!$store.state.badComputer && !$store.state.veryBadComputer">
				<p>Your device is ready to handle.</p>
				<p>Enjoy !</p>
			</div>

			<div v-if="$store.state.badComputer">
				<p>Your device could be overloaded from time to time</p>
				<p>May be you would watch the video instead</p>
				<a href="https://youtu.be/xZkmwE-OlJY?si=RaORb4IyHsCaCPup" target="_blank">
					Click here to see the video version
				</a>
			</div>

			<div v-if="$store.state.veryBadComputer">
				<p>Sorry but your device will struggle with the interactive experience</p>
				<a href="https://youtu.be/xZkmwE-OlJY?si=RaORb4IyHsCaCPup" target="_blank">
					Click here to see the video version
				</a>
			</div>

		</div>

	</div>
</template>

<script>
export default {
	data(){
		return {

		}
	},
	computed: {
		color(){
			let color

			if( this.$store.state.veryBadComputer ){
				color = "red"
			} else if ( this.$store.state.badComputer ){
				color = "orange"
			} else {
				color = "limegreen"
			}

			return color
		}
	}
}
</script>

<style lang="scss" scoped>
// icon font
	@font-face {
		font-family: "Iconify Explorer Font";
		src: url("@/static/assets/fonts/fonticon/iconfont.eot");
		src: url("@/static/assets/fonts/fonticon/iconfont.eot") format("embedded-opentype"),
			url("@/static/assets/fonts/fonticon/iconfont.ttf") format("truetype"),
			url("@/static/assets/fonts/fonticon/iconfont.woff") format("woff"),
			url("@/static/assets/fonts/fonticon/iconfont.woff2") format("woff2"),
			url("@/static/assets/fonts/fonticon/iconfont.svg") format("svg");
		font-weight: normal;
		font-style: normal;
	}

	.i {
		font-family: "Iconify Explorer Font" !important;
		font-size: 1.5em;
		font-style: normal;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
	}


	.i.ic\:round-star:before {
		content: "\e001";
	}

	.i.ic\:round-star-border:before {
		content: "\e002";
	}

	p {
		margin: 0.25rem auto 0.5rem auto;
	}

	a {
		color: white;
		// font-weight: bold;
	}
</style>
