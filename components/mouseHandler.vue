<template>
	<div></div>
</template>

<script>
	import { core } from '@/static/config/core.js';

	import { TimelineLite } from 'gsap';

	export default {
		props: {
			canvasSizeRef: {
				type: Object,
				required: true
			}
		},
		data(){
			return {
				core,
				currentPosition: { x: 0, y: 0 }
			}
		},
		mounted(){
			window.addEventListener("mousemove", this.handleMouseMove);
		},
		beforeDestroy(){
			window.removeEventListener("mousemove", this.handleMouseMove);
		},
		methods: {
			handleMouseMove( event ){

				// cancel previous timers
				if( this.timeoutID ){
					clearTimeout(this.timeoutID);
					this.timeoutID = null;
				}

				// create a new timer
				this.timeoutID = setTimeout(
					this.positionRecenter,
					this.core.mouse.moveTimeout * 1000
				);

				this.currentPosition = this.computePosition(event);

				this.emitNewPosition();
			},

			computePosition( event ){

				return {
					x: (((event.screenX + window.innerWidth / 2) / window.innerWidth) - 1) * 2,
					y: (((event.screenY + window.innerHeight / 2) / window.innerHeight) - 1) * -2
				};


			},

			emitNewPosition(){

				// console.log("mousemoveHandler : ", this.currentPosition.x);

				this.$nuxt.$emit("view-update-by-stick", this.currentPosition);

			},

			positionRecenter(){

				const animatedObject = {
					x: this.currentPosition.x,
					y: this.currentPosition.y
				};

				const tlRecenter = new TimelineLite();

				tlRecenter.to(animatedObject, this.core.mouse.recenterDuration, {
					x: 0,
					y: 0,
					onUpdate( that ){

						that.currentPosition = animatedObject;

						that.emitNewPosition(animatedObject)

					},
					onUpdateParams: [this]
				});

			},
		}
	}
</script>

<style scoped>

</style>