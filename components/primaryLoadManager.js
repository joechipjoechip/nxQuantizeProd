import { worlds } from '@/static/config/worlds.js';
import { entities } from '@/static/config/entities.js';
import { core } from '@/static/config/core.js';

import { CustomShaderBuilder } from './customShaderBuilder';

import { plasticVertex } from '../static/assets/js/shaders/plastic/vertex';
import { plasticFragment } from "../static/assets/js/shaders/plastic/fragment";

import { CharacterController } from '@/components/characterController.js';

import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

import { loopify } from '@/components/loopify.js';

import soundBase from "@/static/assets/audio/onyi-firstPart.mp3";

class PrimaryLoadManager{

	constructor( vm ){

		this.vm = vm;

		this.entities = entities;
		this.worlds = worlds;
		this.glbs = [];
		this.textures = [];

		this.dracoLoader = new DRACOLoader();
		this.glbLoader = new GLTFLoader();
		this.textureLoader = new THREE.TextureLoader();
		// _ _ to load compressed glTF (so glB files) we need a DracoLoader
		this.dracoLoader.setDecoderPath("assets/js/draco/");
		this.glbLoader.setDRACOLoader(this.dracoLoader);


		// NOW ACT SOMETHING :

		// load bobs
		this._InitBobs();

		// load worlds
		worlds.forEach((world, index) => {

			this._LoadGlb(world, index);

			this._LoadTexture(world, index);
			
		});

		this._InitSounds()

	}

	_InitSounds(){

		this.vm.$store.commit("setAudioBase", new Audio(soundBase));

		loopify(
			this.vm,
			"assets/audio/onyi-loop-light-compressed.wav", 
			(err, loop) => {
				// If something went wrong, `err` is supplied
				if (err) {
					console.log("loopify error -------> ", err);
				}

				// Play it whenever you want
				// loop.play();
				this.vm.$store.commit("setAudioLoopNeutral", loop);
			}
		);

		loopify(
			this.vm,
			"assets/audio/loopDrumOne-compressed.wav", 
			(err, loop) => {
				// If something went wrong, `err` is supplied
				if (err) {
					console.log("loopify error -------> ", err);
				}

				// Play it whenever you want
				// loop.play();
				this.vm.$store.commit("setAudioLoopDrumOne", loop);
			}
		);

		loopify(
			this.vm,
			"assets/audio/loopDrumTwo-compressed.wav", 
			(err, loop) => {
				// If something went wrong, `err` is supplied
				if (err) {
					console.log("loopify error -------> ", err);
				}

				// Play it whenever you want
				// loop.play();
				this.vm.$store.commit("setAudioLoopDrumTwo", loop);
			}
		);

	}

	_InitBobs(){

		const position = new THREE.Vector3(0,0,0);
		const rotation = new THREE.Vector3(0,0,0);
		const promises = [];


		Object.keys(this.entities.bobs).forEach(bobKey => {

			const bobInfos = Object.assign(
				{ position, rotation },
				this.entities.bobs[bobKey]
			);

			promises.push(this._LoadBobTarget(bobInfos));
			
		});


		Promise.all([...promises])
			.then(
				targets => {
					this._LoadMovesAndCreateBob(targets);
				},
				reason => {
					console.log("Promise.all fails : reason : ", reason)
				}
			);

	}

	async _LoadBobTarget( mainObj ){

		return new Promise(res => {

			const loader = new FBXLoader();
			let target;

			let filePath = mainObj.fbxPath.split("/");
			const fileName = filePath.pop();
			filePath = filePath.join("/") + "/";

			loader.setPath(filePath);

			loader.load(fileName, (fbx) => {

				fbx.scale.setScalar(mainObj.infos.scale);

				fbx.traverse(c => {
					if( c.type !== "Bone" ){
						c.castShadow = true;
					}

					if( mainObj.options?.emissiveEnabled ){

						if( c.type === "SkinnedMesh" ){
	
							if( c.material.length ){
	
								c.material.forEach((child, index) => {
	
									if( child.name.includes("emissive") ){
										c.material[index] = this._ReplaceMaterialWithEmissive(
											child,
											mainObj.options.emissive,
											child.name.replace("emissive-", "")
										);
									}
	
								})
	
							}
							// else {
							// 	console.log("material solo : ", c.material.name)
							// }
	
						}

					}

				});

				target = fbx;
				target.name = mainObj.name;
				
				target.position.copy(mainObj.position);
				target.rotation.copy(mainObj.rotation);

				if( mainObj.infos.shader ){

					const shaderInfos = mainObj.infos.shader;

					const targetMesh = target.children.find(child => child.name !== "Armature");

					if( targetMesh && targetMesh.material ){
						targetMesh.material = new CustomShaderBuilder(shaderInfos);
					}


				}

				res(target);

			});
			
		});

	}

	_ReplaceMaterialWithEmissive(baseMaterial, emissiveOptions, emissiveKey){

		if( emissiveOptions[emissiveKey]?.enabled ){

			return new THREE.MeshStandardMaterial({
				emissive: new THREE.Color(emissiveOptions[emissiveKey].color),
				emissiveIntensity: emissiveOptions[emissiveKey].intensity
			});

		} else {
			return baseMaterial;
		}

	}

	_LoadMovesAndCreateBob( targets ){

		this._LoadMoves(targets).then((movesObj) => {

			this.bobs = [];

			targets.forEach((target, index) => {

				this.bobs[index] = {
					name: target.name,
					instance: new CharacterController({
						scene: null,
						target,
						animations: movesObj.animations[target.name],
						mixer: movesObj.mixers[target.name],
						bobInfos: this.entities.bobs[target.name].infos,
						vm: this
					})
				};

			});

			// console.log("BOBS ARE LOADED : ", this.bobs);
			if( this.bobs.filter(bob => bob).length === Object.keys(this.entities.bobs).length ){

				this.vm.$nuxt.$emit("assets-have-been-loaded", {
						type: "bobs",
						assets: this.bobs
					}
				);

			}

		});

	}

	async _LoadMoves( targets ){

		return new Promise(res => {

			const mixers = {};
			const animations = {};
	
			targets.forEach(target => {
	
				mixers[target.name] = new THREE.AnimationMixer(target);
	
			});
	
			const manager = new THREE.LoadingManager();
			const loader = new FBXLoader(manager);
	
			manager.onLoad = () => {
				res({ animations, mixers });
			};

			const _OnLoad = (animName, anim) => {
				
				const clip = anim.animations[0];

				Object.keys(mixers).forEach(mixerKey => {
	
					const action = mixers[mixerKey].clipAction(clip);
	
					if( !animations.hasOwnProperty(mixerKey) ){
						animations[mixerKey] = {};
					}
	
					animations[mixerKey][animName] = {
						clip: clip,
						action: action
					};
	
				});
	
			};
	
			loader.setPath(this.entities.bobsMoveFolder);
	
			core.movesSpecs.smallGuy.forEach(fbxAnimName => {
	
				loader.load(`${fbxAnimName}.fbx`, (a) => { _OnLoad(fbxAnimName, a); });
	
			});

		});

	}

	_LoadGlb( worldData, index ){

		this.glbLoader.load(
			worldData.main.meshInfos.glbPath, 
			glbFile => {

				this.glbs[index] = {
					name: worldData.name,
					landscape: glbFile.scene.getObjectByName("landscape"),
					glbFile
				};

				// if( glbFile.scene.getObjectByName("landscape") ){
				// 	console.log("on a bien un landscape : ", worldData.name);
				// }

				
				if( this.glbs.filter(glbObj => glbObj.landscape).length === this.worlds.length ){
		
					this._DeclareGlbsLoadEnded();
		
				}

			}
		);
			

	}

	_DeclareGlbsLoadEnded(){

		this.vm.$nuxt.$emit("assets-have-been-loaded",
			{
				type: "glbs",
				assets: this.glbs
			}
		);

	}

	_LoadTexture( worldData, index ){

		this.textures[index] = {
			name: worldData.name,
			file: this.textureLoader.load(worldData.main.meshInfos.imagePath.landscape),
			options: {
				metalness: worldData.main.meshInfos.options?.metalness,
				roughness: worldData.main.meshInfos.options?.roughness
			}
		}

		if( this.textures.filter(texture => texture).length === this.worlds.length ){
			this.vm.$nuxt.$emit("assets-have-been-loaded", 
				{
					type: "textures",
					assets: this.textures
				}
			);
		}

	}

}

export { PrimaryLoadManager };