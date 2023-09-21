<template>
	<div class="body-wrapper">

		<main-hub />

		<div>

			<button v-if="!cinemaIsReady" 
				class="button-experience" 
				disabled
			>
				Loading ...
			</button>

			<button v-else 
				class="button-experience"
				@click="$parent.isAtEntrance = false"
			>
				GO
			</button>

		</div>
		
	</div>
</template>

<script>
	import MainHub from '@/components/mainHub.vue';
	
	export default {
	components: { 
		"main-hub": MainHub
	},
    data() {
        return {
            cinemaIsReady: false
        };
    },
    mounted() {
        this.$nuxt.$on("cinema-is-ready", this.handleCinemaIsReady);
    },
    beforeDestroy() {
        this.$nuxt.$off("cinema-is-ready", this.handleCinemaIsReady);
    },
    methods: {
        handleCinemaIsReady(event) {
            if (event) {
                this.cinemaIsReady = true;
            }
        },
    }
}
</script>

<style lang="scss" scoped>

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
		}
	}

	.button {

		&-experience {
			display: inline-block;
			background-color: white;
			margin: 2rem auto 0 auto;
			padding: 0.5rem 1.25rem;
			border-radius: 0.5rem;
		}

	}

</style>