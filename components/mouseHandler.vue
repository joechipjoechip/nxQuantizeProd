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

				// if( !this.isMovingFromZero ){

				// 	if( this.currentPosition.x === 0 && this.currentPosition.y === 0 ){

				// 		this.isMovingFromZero = true;
	
				// 		this.positionFromZeroTo({
				// 			x: event.screenX,
				// 			y: event.screenY
				// 		});
	
				// 	} else {
	
				// 		this.computePosition(event);
						
				// 	}
					
				// }
				
				this.computePosition(event);

			},

			computePosition( event ){

				this.currentPosition = {
					x: this.formulaX(event.screenX),
					y: this.formulaY(event.screenY)
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

			},

			// positionFromZeroTo( goToObj ){

			// 	const animatedObject = {
			// 		x: 0,
			// 		y: 0
			// 	};

			// 	const tlGoTo = new TimelineLite();

			// 	tlGoTo.to(animatedObject, 0.25, {
			// 		x: goToObj.x,
			// 		y: goToObj.y,
			// 		onUpdate( that ){

			// 			that.computePosition({
			// 				screenX: animatedObject.x,
			// 				screenY: animatedObject.y
			// 			})

						
			// 		},
			// 		onUpdateParams: [this],
			// 		onComplete( that ){
			// 			that.isMovingFromZero = false;
			// 		},
			// 		onCompleteParams: [this],
			// 	});

			// },
		}
	}
</script>

<style scoped>

</style>