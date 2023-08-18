// THREE
import * as THREE from 'three';

import { SequencesBuilder } from '@/components/sequencesBuilder.js';
import { DynamicLightsBuilder } from '@/components/dynamicLightsBuilder.js';
import { ParticlesBuilder } from '@/components/particlesBuilder.js';
import { CustomShaderBuilder } from '@/components/customShaderBuilder.js';
import { Reflector } from 'three/examples/jsm/objects/Reflector'

class SceneBuilder {

	constructor( params ) {

		// Get data from instanciation
		const { canvas, worldConfig, sequenceID, glb, texture, bobs, type, downScale } = params;

		this.name = worldConfig.name;
		this.canvas = canvas;
		this.worldConfig = worldConfig;
		this.sequenceID = sequenceID;
		this.glb = glb;
		this.texture = texture;
		this.type = type;
		this.downScale = downScale;

		this.bobs = {};
		bobs.forEach(bob => {
			this.bobs[bob.name] = bob.instance;
		});

		console.log("scene builder - - - - - > ", worldConfig);

		// _ Three elements
		this.aspectRatio = window.innerWidth / window.innerHeight;
		this.camera = new THREE.PerspectiveCamera(50, this.aspectRatio, 0.001, 15);
		this.camera.name = "camera";
		this.scene = new THREE.Scene();
		this.sequencesElements = {};
		this.sceneElements = {
			name: this.worldConfig.name,
			landscape: null,
			mirrorMeshes: [],
			mirrorMeshesBuilt: [],
			sky: null,
			bobs: this.bobs,
			initialCamera: new THREE.Object3D({ position: { x: 0, y: 0, z: 0 }}),
			tubes: [],
			blenderLights: [],
			dynamicLights: [],
			emissiveShapesFromBlender: [],
			emissiveShapesBuilt: [],
			standardMeshesFromBlender: [],
			standardMeshesBuilt: [],
			meshesForCustomShader: [],
			meshesForCustomShaderBuilt: [],
			meshCustomShaderOptions: this.worldConfig.main.meshCustomShaderOptions,
			positionsCollection: [],
			particlesWorld: this.worldConfig.main.particles || [],
			particlesCollection: [],
			happenings: {}
		};


		this.orbit = null;
		this.sceneIsReady = false;
		
	}

	returnBundle(){

		return new Promise(res => {

			this.glbParser(this.glb);

			this.bindBobAndScene();
	
			this.createAndApplyBakedMaterial(this.texture);
	
			this.createElementsOnTheFly();
	
			this.sequencesBuild();
	
			this.composeScene();
	
			this.initScene();
	
			this.refreshAndStartScene();

			res(this);

		});

	}

	glbParser( glbObj ){

		this.sceneElements.landscape = glbObj.landscape;

		if( !this.sceneElements.landscape ){
			debugger;
		}

		this.createLandscapeShadow(this.sceneElements.landscape.clone());

		glbObj.glbFile.scene.traverse(child => {

			// console.log("child -> ", child.name);
			// if( child.name.includes("camera") ){

			// 	this.sceneElements.initialCamera.position.copy(child.position);

			// }
				
			// find camera paths for blenderTubes
			if( child.name.includes("plan-") ){

				this.sceneElements.tubes.push(child);

			}

			// find lights
			if( child.name.includes("light") ){

				this.sceneElements.blenderLights.push(child);

			}

			// find emissive shapes
			if( child.name.includes("emissive") ){

				this.sceneElements.emissiveShapesFromBlender.push(child);

			}

			// find standard meshes
			if( child.name.includes("standard-mesh") ){

				this.sceneElements.standardMeshesFromBlender.push(child);

			}

			// find meshes for custom shaders
			if( child.name.includes("mesh-custom-shader") ){

				this.sceneElements.meshesForCustomShader.push(child);

			}

			// find meshes for custom shaders
			if( child.name.includes("mirror") ){

				this.sceneElements.mirrorMeshes.push(child);

			}

			// find misc positions
			if( child.name.includes("position_") ){

				this.sceneElements.positionsCollection.push(child);

			}

			// find debug objects
			if( child.name.includes("debug-object") ){

				if( !this.sceneElements.debugObjects ){
					this.sceneElements.debugObjects = [];
				}

				child.castShadow = true;
				child.receiveShadow = true;
				
				this.sceneElements.debugObjects.push(child);
			}

		});

	}

	bindBobAndScene(){

		Object.keys(this.bobs).forEach(bobKey => {

			this.scene.add(this.bobs[bobKey]._controls._target);

			this.bobs[bobKey]._controls._scene = this.scene;

		});


	}

	createAndApplyBakedMaterial( textureTransmitted ){

		
		// create baked material
		let bakedMaterial;
		const texture = textureTransmitted.file;

		texture.flipY = false;
		texture.encoding = THREE.sRGBEncoding;

		if( textureTransmitted.options.metalness ){

			bakedMaterial = new THREE.MeshPhongMaterial({
				// map: texture,
	
				roughness: textureTransmitted.options.roughness || 0, 
				metalness: textureTransmitted.options.metalness || 0,
				reflectivity: textureTransmitted.options.reflectivity || 0, 
				specular: textureTransmitted.options.specular || 0,
				shininess: textureTransmitted.options.shininess || 0,
			});


		} else {

			bakedMaterial = new THREE.MeshBasicMaterial({
				map: texture
			});

		}

		// apply baked material
		this.sceneElements.landscape.material = bakedMaterial;

	}

	createElementsOnTheFly(){

		// dynamic lights
		this.sceneElements.dynamicLights = new DynamicLightsBuilder({
			lightsArr: this.sceneElements.blenderLights,
			ambientConfig: this.worldConfig.main.ambient
		});

		// emissive shapes
		this.sceneElements.emissiveShapesFromBlender.forEach(emissiveShape => {
			this.createEmissiveShape(emissiveShape);
		});

		// standard meshes
		this.sceneElements.standardMeshesFromBlender.forEach(mesh => {
			this.createStandardMesh(mesh);
		});

		// standard meshes
		this.sceneElements.meshesForCustomShader.forEach(mesh => {
			this.createMeshWithCustomShader(mesh);
		});

		// mirror meshes
		this.sceneElements.mirrorMeshes.forEach(mesh => {
			this.createMirrorMesh(mesh);
		});

		// particles
		this.sceneElements.particlesWorld.forEach(particle => {

			particle.downScaleRatio = this.downScale;
			
			this.sceneElements.particlesCollection.push(
				new ParticlesBuilder(particle)
			);
		
		});

		// fakebob
		const fakeBob = new THREE.Object3D();
		fakeBob.name = "fakeBob";
		fakeBob.position.copy(new THREE.Vector3(0,0,0));

		this.sceneElements.fakeBob = fakeBob;
		

	}

	createEmissiveShape( shapeFromBlender ){

		// console.log("---------> emissive debug : ", shapeFromBlender);

		const emissiveMaterial = new THREE.MeshStandardMaterial({
			emissive: shapeFromBlender.userData.emissiveColor ? new THREE.Color(shapeFromBlender.userData.emissiveColor) : new THREE.Color("#FFFFFF"),
			emissiveIntensity: shapeFromBlender.material.emissiveIntensity * 10,
			side: THREE.DoubleSide
		});

		shapeFromBlender.material = emissiveMaterial;

		this.sceneElements.emissiveShapesBuilt.push(shapeFromBlender)

	}

	createStandardMesh( mesh ){

		// debugger;

		// const phongMaterial = new THREE.MeshPhongMaterial({
		// 	color: `#${mesh.userData?.hexColor}` || "#FFFFFF",
		// 	specular: 0xFF0000,
		// 	shininess: mesh.userData?.shininess || 0.8,
		// 	roughness: 0.2
		// });
		// const phongMaterial = new THREE.MeshStandardMaterial({...mesh.material});

		// mesh.material = phongMaterial;

		this.sceneElements.standardMeshesBuilt.push(mesh)

	}

	createMeshWithCustomShader( mesh ){

		if(this.sceneElements.meshCustomShaderOptions.enabled ){

			mesh.material = new CustomShaderBuilder({
				shaderName: this.sceneElements.meshCustomShaderOptions.shaderName,
				shaderScale: this.sceneElements.meshCustomShaderOptions.shaderScale,
				shaderAxe: this.sceneElements.meshCustomShaderOptions.shaderAxe
			});
	
			this.sceneElements.meshesForCustomShaderBuilt.push(mesh);

		}

	}

	createMirrorMesh( mesh ){

		const mirrorMesh = new Reflector( mesh.geometry, {
			textureWidth: window.innerWidth * window.devicePixelRatio,
			textureHeight: window.innerHeight * window.devicePixelRatio,
			color: new THREE.Color(0xb5b5b5)
		});

		mirrorMesh.scale.copy(mesh.scale);
		mirrorMesh.position.copy(mesh.position);
		mirrorMesh.rotation.copy(mesh.rotation);

		this.sceneElements.mirrorMeshesBuilt.push(mirrorMesh);

	}

	createLandscapeShadow( blenderObj ){

		const shadowLandscapeMesh = blenderObj;

		const shadowMaterial = new THREE.ShadowMaterial({

			color: 0x000000,
			opacity: 0.48
		});

		shadowLandscapeMesh.name += "-shadow";

		// shadowLandscapeMesh.castShadow = true;
		shadowLandscapeMesh.receiveShadow = true;

		shadowLandscapeMesh.material = shadowMaterial;

		this.sceneElements.landscapeShadow = shadowLandscapeMesh;

	}

	sequencesBuild(){

		// console.log("at sequence build --> camera = ", this.camera); 

		this.sequencesElements = new SequencesBuilder(
			{
				sequences: this.worldConfig.sequences,
				scene: this.scene,
				sceneElements: this.sceneElements,
				camera: this.camera,
				canvas: this.canvas,
				that: this
			}
		);

	}

	composeScene(){

		// Here we add :

		// landscape
		this.scene.add(this.sceneElements.landscape);

		// landscape shadow
		this.scene.add(this.sceneElements.landscapeShadow);

		// emissive shapes
		this.sceneElements.emissiveShapesBuilt
			.forEach(emissiveBuilt => {
				this.scene.add(emissiveBuilt);
			});

		// standard meshes
		this.sceneElements.standardMeshesBuilt
			.forEach(mesh => {
				this.scene.add(mesh);
			});

		// meshes for custom shaders
		this.sceneElements.meshesForCustomShaderBuilt
			.forEach(mesh => {
				this.scene.add(mesh);
			});

		// mirror meshes
		this.sceneElements.mirrorMeshesBuilt
			.forEach(mesh => {
				console.log("- - - - - - add mirror : ", mesh)
				this.scene.add(mesh);
			});

		// bobs 
		// Object.keys(this.bobs).forEach(bobKey => {
		// 	this.scene.add(this.bobs[bobKey]._controls._target);
		// })

		// dynamic lights
		this.sceneElements.dynamicLights
			.forEach(light => {

				this.scene.add(light);

				// handle fakeBob
				if(light.name.includes("--needFakeBob--")){
					light.target = this.sceneElements.fakeBob;
					this.scene.add(light.target);

				}
				
			});

		// particles
		this.sceneElements.particlesCollection
			.forEach(item => {
				this.scene.add(item._builtParticle);
			});

		// debug objects
		this.sceneElements.debugObjects
			?.forEach(debugObject => {
				this.scene.add(debugObject);
			});
		
	}

	initScene(){

		// and we initialise
		this.camera.position.copy(this.sceneElements.initialCamera.position);
		this.camera.rotation.copy(this.sceneElements.initialCamera.rotation);
	
		this.scene.add(this.camera);

	}

	refreshAndStartScene(){

		this.camera.updateProjectionMatrix();
		
	}

	refreshBobs(newBobs, newScene){

		newBobs.forEach(bob => {
			this.bobs[bob.name] = bob.instance;
			this.bobs[bob.name]._controls._scene = newScene;
			newScene.add(this.bobs[bob.name]._controls._target);
		});

	}

	recomputeCameraAspectRatio( canvasSizeRef ){

		this.aspectRatio = canvasSizeRef.width / canvasSizeRef.height;

		this.camera.aspect = this.aspectRatio;

		this.camera.updateProjectionMatrix();

	}

};



export { SceneBuilder };
