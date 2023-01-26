<template>
	<div class="stick-main_wrapper">

		<div class="stick-container">

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

	import Stick from '@/components/stick.vue';

	export default {

		components: {
			"stick": Stick
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