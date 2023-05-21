import { worlds } from '@/static/config/worlds.js';
import { entities } from '@/static/config/entities.js';
import { core } from '@/static/config/core.js';

import { CustomShaderBuilder } from './customShaderBuilder';

import { CharacterController } from '@/components/characterController.js';

import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

import { loopify } from '@/components/loopify.js';

import soundBase from "@/static/assets/audio/onyi-firstPart.mp3";
// import soundLoop from "@/static/assets/audio/onyi-loop-real.wav";

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
			"assets/audio/onyi-loop-light.wav", 
			(err, loop) => {
				// If something went wrong, `err` is supplied
				if (err) {
					console.log("loopify error -------> ", err);
				}

				// Play it whenever you want
				// loop.play();
				this.vm.$store.commit("setAudioLoop", loop);
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
				});

				target = fbx;
				target.name = mainObj.name;
				
				target.position.copy(mainObj.position);
				target.rotation.copy(mainObj.rotation);

				// if( mainObj.infos.shader ){

				// 	debugger;

				// 	const shaderInfos = mainObj.infos.shader;

				// 	const targetMesh = target.children.find(child => child.name !== "Armature");

				// 	const customShader = new CustomShaderBuilder(shaderInfos.shaderName, shaderInfos.shaderScale);

				// 	customShader.skinning = true;

					

				// 	targetMesh.material = customShader;

				// 	// debugger;

				// }

				
				res(target);

			});
			
		});

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