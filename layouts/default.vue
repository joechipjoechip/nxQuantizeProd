<template>
  <Nuxt />
</template>

<style lang="scss">

	@import "./assets/style/variables.scss";

	@font-face {
		font-family: 'Times Now';
		src: url('@/static/assets/fonts/TimesNow-ExtraLight.woff2') format('woff2'),
			url('@/static/assets/fonts/TimesNow-ExtraLight.woff') format('woff');
		font-weight: 200;
		font-style: normal;
		font-display: swap;
	}

	@font-face {
		font-family: 'Neue Haas Grotesk Text';
		src: url('@/static/assets/fonts/NeueHaasGroteskText-Bold.woff2') format('woff2'),
			url('@/static/assets/fonts/NeueHaasGroteskText-Bold.woff') format('woff');
		font-weight: bold;
		font-style: normal;
		font-display: swap;
	}

	body {
		padding: 0;
		margin: 0;
		overflow: hidden;

		* {
			-webkit-touch-callout: none; /* iOS Safari */
            -webkit-user-select: none; /* Safari */
            -khtml-user-select: none; /* Konqueror HTML */
            -moz-user-select: none; /* Old versions of Firefox */
            -ms-user-select: none; /* Internet Explorer/Edge */
		}
	}

	html {
		font-size: min(2.5vw, 2.5vh, 18px);
		color: #FFFFFF;

		font-family: "Times Now";

		-webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;

		h1,h2,h3,h4,h5,h6 {
			margin: 0;
		}

		@media #{$mobile} {
			font-size: min(3vw, 3vh, 18px);
		}
	}

</style>