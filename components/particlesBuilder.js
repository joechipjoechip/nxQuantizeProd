import * as THREE from 'three';
import { TimelineLite } from 'gsap';

import firefliesVertexShader from "@/static/assets/js/shaders/fireflies/vertex.glsl"
import firefliesFragmentShader from "@/static/assets/js/shaders/fireflies/fragment.glsl"

class ParticlesBuilder{
	constructor(params){

		this._builtParticle = null;

		this._Init(params);
		
	}
	
	_Init( particlesInfos ){

		switch(particlesInfos.type){
			case "fireflies":
				this._BuildFireflies(particlesInfos);
				break;
		}

		
	}
	
	_BuildFireflies( particlesInfos ){

		const { count, particleSize, additive, blockSize } = particlesInfos;

		const geometry = new THREE.BufferGeometry();

		const positionArray = new Float32Array(count * 3);

		const scaleArray = new Float32Array(count);

		geometry.setAttribute("position", new THREE.BufferAttribute(positionArray, 3));
		geometry.setAttribute("aScale", new THREE.BufferAttribute(scaleArray, 1));

		const material = new THREE.ShaderMaterial({
			vertexShader: firefliesVertexShader,
			fragmentShader: firefliesFragmentShader,
			transparent: true,
			blending: additive ? THREE.AdditiveBlending : null,
			depthWrite: false,
			uniforms: {
				uTime: {
					value: 0
				},
				uPixelRatio: {
					value: Math.min(window.devicePixelRatio, 2)
				},
				uSize: {
					value: particleSize
				}
			}
		});

		const meshToAdd = new THREE.Points(geometry, material);

		meshToAdd.name = "fireflies";



		for(let i = 0; i < count; i++){
			positionArray[i * 3 + 0] = (Math.random() - 0.5) * blockSize.x
			positionArray[i * 3 + 1] = Math.random() * blockSize.y
			positionArray[i * 3 + 2] = (Math.random() - 0.5) * blockSize.z
			
			scaleArray[i] = Math.random();
		}

		this._builtParticle = meshToAdd;

	}
	
}

export { ParticlesBuilder };