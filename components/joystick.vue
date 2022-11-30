<template>
	<div class="stick-main_wrapper"
		@mousemove="mouseMoveHandler"
	>

	<div v-if="stickNeeded" class="stick-container">

		<stick
			ref="left"
			side="left"
			role="bob"
		/>
	
		<stick
			ref="right"
			side="right"
			role="view"
		/>

	</div>


	</div>
</template>

<script>

	import { TimelineLite } from 'gsap';

	import { core } from '@/static/config/core.js';

	import Stick from '@/components/stick.vue';

	export default {

		components: {
			"stick": Stick
		},

		data(){
			return {
				core,
				mousePos: {
					x: 0,
					y: 0
				},

				mouseRecenterTimeoutID: null,

				stickNeeded: true

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

		mounted(){
			this.$nuxt.$on("stick-pos-update", this.stickPosUpdate);
		},
		beforeDestroy(){
			this.$nuxt.$off("stick-pos-update", this.stickPosUpdate);
		},

		methods: {

			stickPosUpdate( event ){

				this.mousePos = event;

			},

			mouseMoveHandler( event ){
					
				this.mousePos = {
					x: (((event.offsetX + this.canvasSizeRef.width / 2) / this.canvasSizeRef.width) - 1) * 2,
					y: (((event.offsetY + this.canvasSizeRef.height / 2) / this.canvasSizeRef.height) - 1) * -2
				};

				this.$nuxt.$emit("mouse-pos-update", this.mousePos);

			},

			mouseRecenter(){

				const isStick = this.stickNeeded && this.$refs.right;

				console.log("recentering the mousePos");

				const animatedObject = {
					x: isStick ? this.$refs.right.stickPos.x : this.mousePos.x,
					y: isStick ? this.$refs.right.stickPos.y : this.mousePos.y
				};

				const tlRecenter = new TimelineLite();

				tlRecenter.to(animatedObject, this.core.mouse.recenterDuration, {
					x: 0,
					y: 0,
					onUpdate( that ){

						if( isStick ){

							that.$refs.right.updateStickPos(animatedObject);

						} else {

							that.mousePos.x = animatedObject.x;
							that.mousePos.y = animatedObject.y;

						}

						that.$nuxt.$emit("mouse-pos-update", that.mousePos);

					},
					onUpdateParams: [this]
				});

			},
		}
	}
</script>

<style lang="scss" scoped>
	.stick {

		&-main_wrapper {
			position: absolute;
			bottom: 0;
			width: 100%;
		}

		&-container {
			display: flex;
			flex-flow: row nowrap;
			justify-content: space-between;
			align-items: flex-end;
		}

	}
</style>