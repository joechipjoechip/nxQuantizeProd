import * as THREE from 'three';

import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { GammaCorrectionShader } from 'three/examples/jsm/shaders/GammaCorrectionShader.js';
import { KaleidoShader } from 'three/examples/jsm/shaders/KaleidoShader.js';
import { GlitchPass } from 'three/examples/jsm/postprocessing/GlitchPass.js';
import { BokehPass } from 'three/examples/jsm/postprocessing/BokehPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

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


		switch(postProcInfos.type){

			case "glitch":
			case "blur":
				this._IsAlreadyGamma() ? null : shadersArrayToReturn.push(gammaCorrectionShader);
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
				const bloomPass = new UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.innerHeight ), 1.5, 0.4, 0.85 );

				effectsArrayToReturn.push(
					Object.assign(bloomPass, { ...postProcInfos.value })
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