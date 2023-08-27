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
				currentPosition: { x: 0, y: 0 },
				isMovingFromZero: false
			}
		},
		watch: {
			currentPosition( newVal ){
				this.$nuxt.$emit("view-update-by-stick", newVal);
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
				
				this.computePosition(event);

			},

			computePosition( event ){

				this.currentPosition = {
					x: this.formulaX(event.clientX),
					y: this.formulaY(event.clientY)
				}

			},

			formulaX( screenX ){
				return (((screenX + window.innerWidth / 2) / window.innerWidth) - 1) * 2
			},

			formulaY( screenY ){
				return (((screenY + window.innerHeight / 2) / window.innerHeight) - 1) * -2
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

					},
					onUpdateParams: [this]
				});

			}

		}
	}
</script>

<style scoped>

</style>