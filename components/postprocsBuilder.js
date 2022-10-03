import * as THREE from 'three';

import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { GammaCorrectionShader } from 'three/examples/jsm/shaders/GammaCorrectionShader.js';
import { LuminosityShader } from 'three/examples/jsm/shaders/LuminosityShader.js';
import { SobelOperatorShader } from 'three/examples/jsm/shaders/SobelOperatorShader.js';

import { GlitchPass } from 'three/examples/jsm/postprocessing/GlitchPass.js';
import { BokehPass } from 'three/examples/jsm/postprocessing/BokehPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

class PostprocsBuilder {
	// Some effects needs a shaderPass + an effectPass

	constructor( params ){

		this._camera = params.camera;
		this._scene = params.scene;
		this._canvas = params.canvas;

		const finalObj = {
			postprocInfos: params.sequenceInfos.postproc,
			shadersPass: this._BuildShaderPass(params.effectObj),
			effectsPass: this._BuildEffectPass(params.effectObj)
		}

		return finalObj

	}

	_BuildShaderPass( postProcInfos ){

		const shadersArrayToReturn = [];

		switch(postProcInfos.type){

			case "glitch":
			case "blur":
				shadersArrayToReturn.push(new ShaderPass(GammaCorrectionShader));
				break;
				
			case "sobel":
				const grayScale = new ShaderPass( LuminosityShader );
				const sobelShader = new ShaderPass(SobelOperatorShader);
				
				sobelShader.uniforms[ 'resolution' ].value.x = window.innerWidth * window.devicePixelRatio;
				sobelShader.uniforms[ 'resolution' ].value.y = window.innerHeight * window.devicePixelRatio;

				shadersArrayToReturn.push(grayScale);
				shadersArrayToReturn.push(sobelShader);
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

			case "sobel":
				// nothing here (because only shader)
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

}

export { PostprocsBuilder }