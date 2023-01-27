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

				this.currentPosition = {
					x: (((event.offsetX + this.canvasSizeRef.width / 2) / this.canvasSizeRef.width) - 1) * 2,
					y: (((event.offsetY + this.canvasSizeRef.height / 2) / this.canvasSizeRef.height) - 1) * -2
				};

				this.emitNewPosition();
			},

			emitNewPosition(){

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