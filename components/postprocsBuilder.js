import * as THREE from 'three';

import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { GammaCorrectionShader } from 'three/examples/jsm/shaders/GammaCorrectionShader.js';
import { LuminosityShader } from 'three/examples/jsm/shaders/LuminosityShader.js';
import { SobelOperatorShader } from 'three/examples/jsm/shaders/SobelOperatorShader.js';
import { DotScreenShader } from 'three/examples/jsm/shaders/DotScreenShader.js';
import { RGBShiftShader } from 'three/examples/jsm/shaders/RGBShiftShader.js';

import { BleachBypassShader } from 'three/examples/jsm/shaders/BleachBypassShader.js';
// import { ColorifyShader } from 'three/examples/jsm/shaders/ColorifyShader.js';
import { HorizontalBlurShader } from 'three/examples/jsm/shaders/HorizontalBlurShader.js';
import { VerticalBlurShader } from 'three/examples/jsm/shaders/VerticalBlurShader.js';
import { SepiaShader } from 'three/examples/jsm/shaders/SepiaShader.js';
import { VignetteShader } from 'three/examples/jsm/shaders/VignetteShader.js';
import { PixelShader } from 'three/examples/jsm/shaders/PixelShader.js';
import { KaleidoShader } from 'three/examples/jsm/shaders/KaleidoShader.js';



import { GlitchPass } from 'three/examples/jsm/postprocessing/GlitchPass.js';
import { BokehPass } from 'three/examples/jsm/postprocessing/BokehPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { FilmPass } from 'three/examples/jsm/postprocessing/FilmPass.js';
import { AfterimagePass } from 'three/examples/jsm/postprocessing/AfterimagePass.js';

class PostprocsBuilder {
	// Some effects needs a shaderPass + an effectPass

	constructor( params ){

		this._params = params;
		this._camera = params.camera;
		this._scene = params.scene;
		this._canvas = params.canvas;

		this._finalObj = {
			postprocType: params.effectObj.type
		};

		this._finalObj.shadersPass = this._BuildShaderPass(params.effectObj);

		this._finalObj.effectsPass = this._BuildEffectPass(params.effectObj);

		return this._finalObj

	}

	_BuildShaderPass( postProcInfos ){

		const shadersArrayToReturn = [];

		const gammaCorrectionShader = new ShaderPass(GammaCorrectionShader);
		gammaCorrectionShader.isGamma = true;

		const shaderBleach = BleachBypassShader;

		const grayScaleShader = new ShaderPass( LuminosityShader );


		switch(postProcInfos.type){

			case "glitch":
			case "blur":
				this._IsAlreadyGamma() ? null : shadersArrayToReturn.push(gammaCorrectionShader);
				break;
				
			case "sobel":
				const sobelShader = new ShaderPass(SobelOperatorShader);
				
				sobelShader.uniforms["resolution"].value.x = window.innerWidth * window.devicePixelRatio;
				sobelShader.uniforms["resolution"].value.y = window.innerHeight * window.devicePixelRatio;

				shadersArrayToReturn.push(grayScaleShader);
				shadersArrayToReturn.push(sobelShader);
				break;

			case "dotscreen":

				const dotscreenShader = new ShaderPass( DotScreenShader );

				dotscreenShader.uniforms["scale"].value = postProcInfos.dotSize;
				
				this._IsAlreadyGamma() ? null : shadersArrayToReturn.push(gammaCorrectionShader);

				shadersArrayToReturn.push(dotscreenShader);
				break;
				
			case "rgbShift":
				const rgbShiftShader = new ShaderPass( RGBShiftShader );
				
				rgbShiftShader.uniforms["amount"].value = postProcInfos.amount;

				this._IsAlreadyGamma() ? null : shadersArrayToReturn.push(gammaCorrectionShader);
				shadersArrayToReturn.push( rgbShiftShader );
			break;

			case "grain":	
				const effectHBlur = new ShaderPass( HorizontalBlurShader );
				const effectVBlur = new ShaderPass( VerticalBlurShader );
				
				effectHBlur.uniforms["h"].value = 2 / ( window.innerWidth / postProcInfos.amount );
				effectVBlur.uniforms["v"].value = 2 / ( window.innerHeight / postProcInfos.amount );
				
				shadersArrayToReturn.push( effectVBlur );
				shadersArrayToReturn.push( effectVBlur );
				this._IsAlreadyGamma() ? null : shadersArrayToReturn.push(gammaCorrectionShader);
				break;
			
			case "sepia":
				const shaderSepia = SepiaShader;
				const effectSepia = new ShaderPass( shaderSepia );
				effectSepia.uniforms[ 'amount' ].value = postProcInfos.amount;

				this._IsAlreadyGamma() ? null : shadersArrayToReturn.push(gammaCorrectionShader);
				shadersArrayToReturn.push(effectSepia)

				break;

			case "vignette":
				const effectVignette = new ShaderPass( VignetteShader );

				effectVignette.uniforms["offset"].value = postProcInfos.offset;
				effectVignette.uniforms["darkness"].value = postProcInfos.darkness;

				this._IsAlreadyGamma() ? null : shadersArrayToReturn.push(gammaCorrectionShader);
				shadersArrayToReturn.push(effectVignette);

				break;

			case "bleach":
				const effectBleach = new ShaderPass( shaderBleach );
				effectBleach.uniforms["opacity"].value = postProcInfos.amount;

				shadersArrayToReturn.push(effectBleach);
				this._IsAlreadyGamma() ? null : shadersArrayToReturn.push(gammaCorrectionShader);

				break;

			case "film":
				const { linesAmount, opacity, aberration } = postProcInfos;

				const filmPass = new FilmPass(
					opacity,
					aberration,
					linesAmount,
					false
				);

				shadersArrayToReturn.push(filmPass);
				this._IsAlreadyGamma() ? null : shadersArrayToReturn.push(gammaCorrectionShader);

				break;

			case "grayscale":
				// console.log("grayscale - - - - >", grayScaleShader);
				// grayScaleShader.uniforms["tDiffuse"].value = postProcInfos.amount
				// this._IsAlreadyGamma() ? null : shadersArrayToReturn.push(gammaCorrectionShader);
				shadersArrayToReturn.push(grayScaleShader);
				break;

			case "afterimage":
				const afterimage = new AfterimagePass();
				afterimage.uniforms["damp"].value = postProcInfos.amount;

				shadersArrayToReturn.push(afterimage);
				break;

			case "pixel":
				const pixelPass = new ShaderPass( PixelShader );
				pixelPass.uniforms["resolution"].value = new THREE.Vector2(this._canvas.width, this._canvas.height);
				// pixelPass.uniforms["resolution"].value.multiplyScalar(window.devicePixelRatio);
				// debugger;
				pixelPass.uniforms["pixelSize"].value = postProcInfos.pixelSize;
				this._IsAlreadyGamma() ? null : shadersArrayToReturn.push(gammaCorrectionShader);
				shadersArrayToReturn.push(pixelPass);
				break;

			case "kaleidoscope":
				const kaleidoscopePass = new ShaderPass(KaleidoShader);

				kaleidoscopePass.uniforms["sides"].value = postProcInfos.sides;
				kaleidoscopePass.uniforms["angle"].value = postProcInfos.angle * Math.PI;

				this._IsAlreadyGamma() ? null : shadersArrayToReturn.push(gammaCorrectionShader);

				shadersArrayToReturn.push(kaleidoscopePass);

				break;

		}

		return shadersArrayToReturn;
		
	}
	
	_BuildEffectPass( postProcInfos ){

		const effectsArrayToReturn = [];

		switch(postProcInfos.type){

			case "glitch":
				effectsArrayToReturn.push(
					new GlitchPass()
				);
				break;

			case "blur":
				const { focus, aperture, maxblur } = postProcInfos.value;

				effectsArrayToReturn.push(
					new BokehPass( 
						this._scene, 
						this._camera, 
						{
							focus, aperture, maxblur,
							width: this._canvas.width,
							height: this._canvas.height
						}
					)
				);

				break;

			case "bloom":
				const { threshold, strength, radius } = postProcInfos.value;
				const bloomPass = new UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.innerHeight ), 1.5, 0.4, 0.85 );

				effectsArrayToReturn.push(
					Object.assign(bloomPass, { threshold, strength, radius })
				);

				break;

		}

		return effectsArrayToReturn;

	}

	_IsAlreadyGamma(){

		this._params.currentSequenceLib.postproc.forEach(postproc => {

			if( postproc.shadersPass.find(shader => shader.isGamma) ){
				return true;
			}

		});

		return false;

	}

}

export { PostprocsBuilder }