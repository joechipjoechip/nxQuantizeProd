<template>
	<div class="joystick_wrapper"
		@mousemove="mouseMoveHandler"
	>
		JOYSTICKK
	</div>
</template>

<script>
	import { TimelineLite } from 'gsap';

	import { core } from '@/static/config/core.js';

	export default {

		data(){
			return {
				core,
				mousePos: {
					x: 0,
					y: 0
				},

				mouseRecenterTimeoutID: null,

			}
		},

		props: {
			canvasSizeRef: {
				type: Object,
				required: true
			}
		},

		watch: {

			mousePos(){

				if( this.mouseRecenterTimeoutID ){
					clearTimeout(this.mouseRecenterTimeoutID);
				}

				this.mouseRecenterTimeoutID = setTimeout(
					this.mouseRecenter,
					this.core.mouse.moveTimeout * 1000
				);

			},

		},

		methods: {
			mouseMoveHandler( event ){

				console.log("mouseHandler dans joystick");
					
				this.mousePos = {
					x: (((event.offsetX + this.canvasSizeRef.width / 2) / this.canvasSizeRef.width) - 1) * 2,
					y: (((event.offsetY + this.canvasSizeRef.height / 2) / this.canvasSizeRef.height) - 1) * -2
				};

				this.$nuxt.$emit("mouse-pos-update", this.mousePos);

			},

			mouseRecenter(){

				console.log("recentering the mousePos");

				const animatedObject = {
					x: this.mousePos.x,
					y: this.mousePos.y
				};

				const tlRecenter = new TimelineLite();

				tlRecenter.to(animatedObject, this.core.mouse.recenterDuration, {
					x: 0,
					y: 0,
					onUpdate( that ){

						that.mousePos.x = animatedObject.x;
						that.mousePos.y = animatedObject.y;

						that.$nuxt.$emit("mouse-pos-update", that.mousePos);

					},
					onUpdateParams: [this]
				});

			},
		}
	}
</script>

<style lang="scss" scoped>
	.joystick {

		&_wrapper {
			position: absolute;
			background-color: rgba(255,0,0,0.4);
			bottom: 0;
			width: 90%;
			height: 90%;
		}

	}
</style>