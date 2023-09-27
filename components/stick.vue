<template>
	<div :class="`stick_hitbox-${side}`">

		<div class="stick_ui"
			@touchstart="touchStartHandler"
			@mousedown="touchStartHandler"
			@touchmove="touchMoveHandler"

			@touchend="touchEndHandler"
			@mouseup="touchEndHandler"
			:data-role="role"
		>

			<div  class="stick_inner-circle-surface">

				<div 
					class="stick_inner-circle-deep"
					:class="{ active: mouseDown }"
					:style="{'transform': transformString }"
				>
				</div>

			</div>

		</div>


	</div>
</template>

<script>

	import { TimelineLite } from 'gsap';

	import { core } from '@/static/config/core.js';

	export default {
		props: {

			side: {
				type: String,
				required: true
			},

			role: {
				type: String,
				required: true
			}

		},

		data(){
			return {
				core,
				mouseDown: false,
				mouseUp: true,
				circleActive: false,
				stickPos: { x:0, y:0 },
				lastKnownStickPos: { x:0, y:0 },
				timeoutID: null,
				abstractRole: ""
			}
		},

		mounted(){

			this.abstractRole = this.role === "bob" ? "stick" : "mouse";

			this.emitEventString = this.role === "bob" ? "bob-input-update-by-stick" : "view-update-by-stick";

		},

		computed: {

			transformString(){
				return `translate(
					${this.stickPos.x * 15}%,
					${this.stickPos.y * -15}%
				)`;
			}
		},

		watch: {

			mouseDown( newVal ){

				if( !newVal ){

					// cancel previous timers
					if( this.timeoutID ){
						clearTimeout(this.timeoutID);
						this.timeoutID = null;
					}


					// create a new timer
					this.timeoutID = setTimeout(
						this.stickRecenter,
						this.core[this.abstractRole].moveTimeout * 1000
					);

				}

			}

		},

		methods: {

			touchStartHandler( event ){
				event.preventDefault();

				// console.log("mouse DOWN : ", event);
				this.mouseDown = true;
				this.mouseUp = false;

				this.goToPosition(this.computePos(event));

			},

			touchEndHandler( event ){
				event.preventDefault();
				
				// console.log("mouse UP : ", event);
				this.mouseUp = true;
				this.mouseDown = false;
				
				this.updateStickPos(this.lastKnownStickPos);
				
			},

			touchMoveHandler( event ){
				event.preventDefault();

				// get normalized position for the stick
				const computedPos = this.computePos(event);

				this.updateStickPos(computedPos);

			},

			goToPosition( position ){

				const animatedObject = {
					x: this.stickPos.x,
					y: this.stickPos.y
				};

				const tlRecenter = new TimelineLite();

				tlRecenter.to(animatedObject, this.core[this.abstractRole].recenterDuration, {
					x: position.x,
					y: position.y,
					onUpdate( that ){

						that.updateStickPos(animatedObject);

						// console.log("onUpdate : ", animatedObject.x);

					},
					onUpdateParams: [this]
				});


			},

			computePos( input ){

				const { width, left, height, top } = event.target.getBoundingClientRect();

				if( input.touches?.[0] ){

					const goodTouch = Array.from(input.touches).find(touch => touch.target.dataset.role === this.role);
					
					return {
						x: Math.min(1,
							Math.max(
								-1,
								(((goodTouch.clientX - left) / width) - 0.5) * 2
							)
						),
						y: Math.min(1,
							Math.max(
								-1,
								(((goodTouch.clientY - top) / height) - 0.5) * -2
							)
						)
					}

				}

			},    

			updateStickPos( event ){

				this.lastKnownStickPos = event;

				this.stickPos = event;

				this.$nuxt.$emit(this.emitEventString, event)

			},

			stickRecenter(){

				if( this.mouseDown ){ return; }

				// console.log("recentering (stick component)");

				const animatedObject = {
					x: this.stickPos.x,
					y: this.stickPos.y
				};

				const tlRecenter = new TimelineLite();

				tlRecenter.to(animatedObject, this.core[this.abstractRole].recenterDuration, {
					x: 0,
					y: 0,
					onUpdate( that ){

						that.updateStickPos(animatedObject);

						// console.log("onUpdate : ", animatedObject.x);

					},
					onUpdateParams: [this]
				});

			},

		}
	}
</script>

<style lang="scss" scoped>

.stick {
	&_hitbox {
		// &-left {

		// 	.stick_ui {
		// 		left: 20px;
		// 	}
		// }

		// &-right {

		// 	.stick_ui {
		// 		right: 20px;
		// 	}
		// }

		// &-left,
		// &-right {
		// 	display: flex;
		// 	flex-flow: row nowrap;
		// 	justify-content: center;
		// 	align-items: center;
		// 	width: 50vw;
		// 	height: 80vh;
		// }
	}

	&_ui {
		// max-width: 20vw;
		// max-height: 20vw;
		// width: 100%;
		// height: 100%;

		// position: absolute;
		// bottom: 20px;

		width: 100vw;
		height: 100vh;
		opacity: 0;
	}

	&_inner {
		&-circle {
		&-surface {
			display: flex;
			flex-flow: row nowrap;
			justify-content: center;
			align-items: center;
			width: 100%;
			height: 100%;

			box-shadow: inset 0 0 4vw rgba(255,255,255,.25);
			border-radius: 50%;
			pointer-events: none;
		}

		&-deep {
			width: 72%;
			height: 72%;
			background-color: rgba(255,255,255,.1);
			box-shadow: 0 5px 12px rgba(255,255,255,.3);
			border-radius: 50%;
			transform: scale(1);
			transition: all .25s;

			&.active {
			background-color: rgba(255,255,255,.3);
			box-shadow: 0 0 22px rgba(255,255,255,.4);
			transform: scale(1.2);
			}
		}
		}
	}
}
</style>