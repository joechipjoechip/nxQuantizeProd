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

		const count = particlesInfos.count;

		const geometry = new THREE.BufferGeometry();

		const positionArray = new Float32Array(count * 3);

		const scaleArray = new Float32Array(count);

		geometry.setAttribute("position", new THREE.BufferAttribute(positionArray, 3));
		geometry.setAttribute("aScale", new THREE.BufferAttribute(scaleArray, 1));

		const material = new THREE.ShaderMaterial({
			vertexShader: firefliesVertexShader,
			fragmentShader: firefliesFragmentShader,
			transparent: true,
			// blending: THREE.AdditiveBlending,
			depthWrite: false,
			uniforms: {
				uTime: {
					value: 0
				},
				uPixelRatio: {
					value: Math.min(window.devicePixelRatio, 2)
				},
				uSize: {
					value: 40
				}
			}
		});

		const meshToAdd = new THREE.Points(geometry, material);

		meshToAdd.name = "fireflies";



		for(let i = 0; i < count; i++){
			positionArray[i * 3 + 0] = (Math.random() - 0.5) * 8
			positionArray[i * 3 + 1] = Math.random() * 4
			positionArray[i * 3 + 2] = (Math.random() - 0.5) * 14
			// le 8 le 4 le 14 :  sont arbitraires, ca correpond à la taille de la scene 
			// pour une répartition homogène
			scaleArray[i] = Math.random();
		}

		this._builtParticle = meshToAdd;

	}
	
}

export { ParticlesBuilder };