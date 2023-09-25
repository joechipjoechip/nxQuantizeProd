<template>
  <Nuxt />
</template>

<style lang="scss">

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
	}

	// icon font
	@font-face {
		font-family: "Iconify Explorer Font";
		src: url("@/static/assets/fonts/fonticon/iconfont.eot");
		src: url("@/static/assets/fonts/fonticon/iconfont.eot") format("embedded-opentype"),
			url("@/static/assets/fonts/fonticon/iconfont.ttf") format("truetype"),
			url("@/static/assets/fonts/fonticon/iconfont.woff") format("woff"),
			url("@/static/assets/fonts/fonticon/iconfont.woff2") format("woff2"),
			url("@/static/assets/fonts/fonticon/iconfont.svg") format("svg");
		font-weight: normal;
		font-style: normal;
	}

	.i {
		font-family: "Iconify Explorer Font" !important;
		font-size: 1em;
		font-style: normal;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
	}


	.i.ic\:round-star:before {
		content: "\e001";
	}

	.i.ic\:round-star-border:before {
		content: "\e002";
	}

</style>