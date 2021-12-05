<template>
	<div>
		<button @click="launchAlteration">launch realtime css</button>
		<div ref="realtimeMain" class="realtimeMain">
			<p class="title">Hey, ceci est un POC</p>
			<p class="title">testant l'altération en temps réel des regles css</p>
			<div class="subContent">
				olay
				<span class="oneSpan">jul</span>
				<span class="oneSpan">c'est</span>
				<span class="oneSpan">le</span>
				<span class="oneSpan">S</span>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		data(){
			return {
				goodStylesheet: null
			}
		},

		mounted(){

			this.defineWorkingVariables();

			console.log("goodStylesheet : ", this.goodStylesheet);

		},

		methods: {

			launchAlteration(){

				this.goodStylesheet.cssRules[0].style.borderColor = "pink";

				console.log("after alteration, concerned cssRules : ", this.goodStylesheet.cssRules[0]);

			},

			defineWorkingVariables(){

				this.goodStylesheet = Array.from(document.styleSheets).find(stylesheet => {

					const thingToTest = stylesheet.cssRules[0]?.cssText;

					if( thingToTest ){
	
						if( thingToTest?.indexOf('[class="realtimeMain"]') !== -1 ){
	
							return stylesheet;
	
						} 

					}

				});

			}

			// bon, preuve est faite, ca marche, malgré l'encapsulation vuejs
			// en revanche, niveau gestion de la chose, je suis pas persuadé que ce soit la meilleure manière de procéder
			// peut être qu'une simple gestion temporelle d'ajout de classes type .step1 .step2 etc sur les différents éléments
			// serait plus facilement manageable sur qqch d'ampleur
			// .. bref, fallait que je test d'abord ;)
		}
	}
</script>

<style lang="scss" scoped>

	[class="realtimeMain"]{
		width: 100%;
		border: solid 10px orange;

		.title {
			background-color: chartreuse;
			margin: 0;
		}

		.subContent {
			display: flex;
			flex-flow: row nowrap;
			justify-content: center;

			.oneSpan {
				display: inline-block;
				border: solid 2px pink;
				margin-right: 15px;
			}
		}
	}

</style>