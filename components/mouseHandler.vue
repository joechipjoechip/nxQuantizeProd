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
				lastKnownPosition: { x: 0, y: 0 },
				isMovingFromZero: false,
				isSmoothing: false,
				streamedPosition: null
			}
		},
		watch: {
			currentPosition( newVal ){

				this.$nuxt.$emit("view-update-by-stick", newVal);

				this.lastKnownPosition = newVal;

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

				this.streamedPosition = event;

				// cancel previous timers
				if( this.timeoutID ){
					clearTimeout(this.timeoutID);
					this.timeoutID = null;
				}

				// create a new timer
				this.timeoutID = setTimeout(
					this.positionRecenter,
					this.$parent.$parent.isAtEntrance ? 3500 : this.core.mouse.moveTimeout * 1000
				);
				
				if( !this.isSmoothing ){

					if( this.lastKnownPosition.x === 0 && this.lastKnownPosition.y === 0 ){
						
						this.fromZeroSmoother({
							x: this.formulaX(event.clientX),
							y: this.formulaY(event.clientY)
						});
						
					} else {
	
						this.computePosition(event);					
	
					}

				}
				

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

				if( !this.isSmoothing ){

					this.isSmoothing = true;

					const tlRecenter = new TimelineLite();

					tlRecenter.to(animatedObject, 
						this.$parent.$parent.isAtEntrance ? 3.25 : 0.75, 
						{
						x: 0,
						y: 0,
						ease: "easeInOut",
						onUpdate( that ){

							that.currentPosition = animatedObject;

						},
						onUpdateParams: [this],
						onComplete( that ){
							that.isSmoothing = false
						},
						onCompleteParams: [this]
					});

				}

			},

			fromZeroSmoother(){

				const animatedObject = {
					x: 0,
					y: 0
				};
				
				if( !this.isSmoothing ){

					console.log("from zero triggered with : x ", this.streamedPosition.clientX)

					this.isSmoothing = true;

					const tlRecenter = new TimelineLite();

					tlRecenter.to(animatedObject, 0.175, {
						x: this.formulaX(this.streamedPosition.clientX),
						y: this.formulaY(this.streamedPosition.clientY),
						ease: "easeInOut",
						onUpdate( that ){

							that.currentPosition = animatedObject;

						},
						onUpdateParams: [this],
						onComplete( that ){

							that.isSmoothing = false;

						},
						onCompleteParams: [this]
					});
					
				}

			}

		}
	}
</script>

<style scoped>

</style>