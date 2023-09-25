<template>
	<div>
		<p>
			your computer score is
		</p>

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
				<p>Your computer is ready to handle</p>
			</div>

			<div v-if="$store.state.badComputer">
				<p>Your computer could be overloaded from time to time</p>
			</div>

			<div v-if="$store.state.veryBadComputer">
				<p>Your computer will struggle with the interactive experience :/<br>
				May be you should watch the captured video instead ;)</p>
				<a href="http://www.youtube.com" target="_blank">
					Click here to see the non-interactive videoclip
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
</style>
