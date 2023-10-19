<template>
	<div class="body-wrapper">

		<!-- <div v-show="benchmarkIsDone"> -->
			<main-hub />
		<!-- </div> -->

		<benchmark-ui />

		<!-- <p @click="cinemaIsReady = !cinemaIsReady">toggle</p> -->
		<transition name="button-experience-transition">

			<div class="button-experience-container" v-if="benchmarkIsDone">

				<transition name="button-experience-transition">

					<div v-if="!cinemaIsReady" 
						class="button-experience-loading"
					>
						<loader-one class="loader-one"/>
						Loading ({{ $store.state.assetsLoadCount }}/5)
					</div>

				</transition>

				<transition name="button-experience-transition">

					<div v-if="cinemaIsReady" 
						class="button-experience-ready"
						:class="colorReadyButtonClass"
						@click="$parent.isAtEntrance = false"
					>
						Start
					</div>

				</transition>

			</div>

		</transition>
		
	</div>
</template>

<script>
	import MainHub from '@/components/mainHub.vue';
	import BenchmarkUi from '@/components/benchmarkUi.vue';
	import LoaderOne from '@/components/micro/loaderOne.vue';
	
	export default {
	components: { 
		"main-hub": MainHub,
		"benchmark-ui": BenchmarkUi,
		"loader-one": LoaderOne
	},
    data() {
        return {
            cinemaIsReady: false,
			benchmarkIsDone: false,
			colorReadyButtonClass: "is-basic"
        };
    },
    mounted() {
        this.$nuxt.$on("cinema-is-ready", this.handleCinemaIsReady);
        this.$nuxt.$on("benchmark-is-done", this.handleBenchmarkDone);
    },
    beforeDestroy() {
		this.$nuxt.$off("cinema-is-ready", this.handleCinemaIsReady);
		this.$nuxt.$off("benchmark-is-done", this.handleBenchmarkDone);
    },
	watch: {
		benchmarkIsDone(newVal){
			if( newVal ){

			}
		}
	},
    methods: {
        handleCinemaIsReady(event) {
            if (event) {
                this.cinemaIsReady = true;
            }
        },

		handleBenchmarkDone(){
			this.benchmarkIsDone = true;

			if( this.$store.state.veryBadComputer ){
				this.colorReadyButtonClass = "is-red"
			} else if ( this.$store.state.badComputer ){
				this.colorReadyButtonClass = "is-orange"
			}

		}
    }
}
</script>

<style lang="scss" scoped>

	@import "./assets/style/variables.scss";

	.body {
		&-wrapper {
			text-align: center;

			top: 0;
			left: 0;

			width: 100%;
			height: 100vh;

			display: flex;
			flex-flow: column nowrap;
			justify-content: center;

			@media #{$mobile} {
				@media (orientation: landscape) {
					margin-top: -3.5rem;
				}
			}
		}
	}

	.button {

		&-experience {

			&-container {
				position: relative;
				font-family: 'Neue Haas Grotesk Text';
			}

			&-loading,
			&-ready {
				color: black;
				display: block;
				position: absolute;
				border-radius: 0 0 5rem 5rem;
				padding-bottom: 0.75rem;
				border: solid 1px rgba(255,255,255,0.05);
				background-color: rgba(255,255,255,0.01);

				-webkit-backdrop-filter: blur(12px);
				backdrop-filter: blur(12px);
				
				// margin: 2rem auto 0 auto;
				margin-top: 0.65rem;
				padding: 0.5rem 0;
				color: white;
				text-transform: uppercase;

				overflow: hidden;
				transform: translateY(0);
			}

			&-loading {
				width: 16rem;
				left: calc(50% - 8rem);
				cursor: progress;
			}
			
			&-ready {
				font-size: 1.75rem;
				width: 10rem;
				left: calc(50% - 5rem);
				cursor: pointer;

				transition: background-color .15s;

				animation: startAnimation 3s infinite;

				&:hover {
					background-color: rgba(255,255,255,0.25);
				}

				&.is-red {
					&:hover {
						background-color: rgba(255,0,0,0.25);
					}
				}
				&.is-orange {
					&:hover {
						background-color: rgba(255,165,0,0.25);
					}
				}

			}

			&-transition {

				&-enter-active {
					transition: opacity .4s ease,
								transform .4s ease;
				}

				&-leave-active {
					transition: opacity .7s ease,
								transform .7s ease;
				}

				&-enter-from,
				&-leave-to {
					opacity: 0;
					transform: translateY(50px);
				}

				&-enter,
				&-leave {
					opacity: 0 !important;
					transform: translateY(50px) !important;
				}

			}

		}

	}

	@keyframes startAnimation {
		0%, 100% {
			// background-color: rgba(255,255,255,0.15);
			border: solid 1px rgba(255,255,255,0.3);
		}

		25% {
			// background-color: rgba(255,255,255,0.35);
			border: solid 1px rgba(255,255,255,1);
		}
	}

	.loader-one {
		height: 1rem;
		opacity: 0.3;
	}



</style>