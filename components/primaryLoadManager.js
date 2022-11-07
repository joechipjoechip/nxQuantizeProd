import { worlds } from '@/static/config/worlds.js';
import { entities } from '@/static/config/entities.js';
import { core } from '@/static/config/core.js';

import { CharacterController } from '@/components/characterController.js';

import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

class PrimaryLoadManager{

	constructor(vm){

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

			this._LoadGlb(world);

			this._LoadTexture(world, index);
			
		});

	}

	_InitBobs(){

		const position = new THREE.Vector3(0,0,0);
		const rotation = new THREE.Vector3(0,0,0);
		const promises = [];
		const bobsCreated = [];

		// const { position, rotation } = this.sceneElements.positionsCollection.find(blenderObject => blenderObject.name === "bob-position_1-0")


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

					// console.log("promise.all -> result all : ", targets);

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
				
				res(target);

			});
			
		});

	}

	_LoadMovesAndCreateBob( targets ){

		return new Promise(res => {

			this._LoadMoves(targets).then((movesObj) => {

				this.bobs = [];
	
				targets.forEach((target, index) => {
	
					this.bobs.push({
						name: target.name,
						instance: new CharacterController({
							scene: null,
							target,
							animations: movesObj.animations[target.name],
							mixer: movesObj.mixers[target.name],
							bobInfos: this.entities.bobs[target.name].infos
						})
					});
	
				});
	
				// console.log("BOBS ARE LOADED : ", this.bobs);

				this.vm.$nuxt.$emit("assets-have-been-loaded", {
						type: "bobs",
						assets: this.bobs
					}
				);
	
			});

		})


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

	_LoadGlb( worldData ){

		this.glbLoader.load(
			worldData.main.meshInfos.glbPath, 
			glbFile => { 

				this.glbs.push({
					name: worldData.name,
					glbFile
				});

				if( this.glbs.length === this.worlds.length ){

					this.vm.$nuxt.$emit("assets-have-been-loaded",
						{
							type: "glbs",
							assets: this.glbs
						}
					);

				}

			}
		);
			

	}

	_LoadTexture( worldData, index ){

		this.textures[index] = {
			name: worldData.name,
			file: this.textureLoader.load(worldData.main.meshInfos.imagePath.landscape)
		}

		if( this.textures.length === this.worlds.length ){
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