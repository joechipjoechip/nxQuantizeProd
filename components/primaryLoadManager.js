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

				if( mainObj.infos.shader ){

					const shaderInfos = mainObj.infos.shader;

					const targetMesh = target.children.find(child => child.name !== "Armature");

					// const customShader = new CustomShaderBuilder(shaderInfos.shaderName, shaderInfos.shaderScale);

					// customShader.skinning = true;

					

					// targetMesh.material = customShader;

					// console.log("material before compile : ", targetMesh.material);

					// targetMesh.material.userData.iGlobalTime = { value: 10.0 };
					targetMesh.userData.iGlobalTime = { value: this.vm.$store.state.audioCurrent.currentTime };
					
					targetMesh.userData.uniformsNeedUpdate = { value: true };

					targetMesh.material.onBeforeCompile = shader => {

						shader.uniforms.iGlobalTime = { value: targetMesh.userData.iGlobalTime.value };
						shader.uniforms.iResolution = { value: new THREE.Vector2(0.1,0.1) };

						// VERTEX
						shader.vertexShader = shader.vertexShader.replace(
							"#include <common>",
							`
								#include <common>
	
								attribute vec3 in_Position;
								varying vec2 fragCoord;
								varying vec2 vUv; 
							`
						);

						shader.vertexShader = shader.vertexShader.replace(
							"#include <fog_vertex>",
							`
								#include <fog_vertex>
	
								vUv = uv;
								fragCoord = position.xy;
							`
						);

						// FRAGMENT
						shader.fragmentShader = shader.fragmentShader.replace(
							/#include <common>([\s\S]*)dithering_fragment>/gi,
							`
								#include <common>
	
								uniform float iGlobalTime;
								uniform vec2 iResolution;
								uniform vec4      iMouse;
								uniform sampler2D iChannel0;
								varying vec2 fragCoord;
								varying vec2 vUv;

								#include <packing>
								#include <dithering_pars_fragment>
								#include <color_pars_fragment>
								#include <uv_pars_fragment>
								#include <uv2_pars_fragment>
								#include <map_pars_fragment>
								#include <alphamap_pars_fragment>
								#include <aomap_pars_fragment>
								#include <lightmap_pars_fragment>
								#include <emissivemap_pars_fragment>
								#include <envmap_common_pars_fragment>
								#include <envmap_pars_fragment>
								#include <cube_uv_reflection_fragment>
								#include <fog_pars_fragment>
								#include <bsdfs>
								#include <lights_pars_begin>
								#include <lights_phong_pars_fragment>
								#include <shadowmap_pars_fragment>
								#include <bumpmap_pars_fragment>
								#include <normalmap_pars_fragment>
								#include <specularmap_pars_fragment>
								#include <logdepthbuf_pars_fragment>
								#include <clipping_planes_pars_fragment>
								vec2 cmul( vec2 a, vec2 b )  { return vec2( a.x*b.x - a.y*b.y, a.x*b.y + a.y*b.x ); }

								vec2 csqr( vec2 a )  { return vec2( a.x*a.x - a.y*a.y, 2.*a.x*a.y  ); }

								vec3 dmul( vec3 a, vec3 b )  {
									float r = length(a);
									b.xy=cmul(normalize(a.xy), b.xy);
									b.yz=cmul(normalize(a.yz), b.yz);
									return r*b;
								}

								vec3 pow4( vec3 z){
									z=dmul(z,z);return dmul(z,z);
								}

								vec3 pow3( vec3 z){
									float r2 = dot(z,z);
									vec2 a = z.xy;a=csqr(a)/dot( a,a);
									vec2 b = z.yz;b=csqr(b)/dot( b,b); 
									vec2 c = z.xz;c=csqr(c)/dot( c,c);
									z.xy = cmul(a,z.xy);   
									z.yz = cmul(b,z.yz);      
									z.xz = cmul(c,z.xz);
									return r2*z;
								}

								mat2 rot(float a) {
									return mat2(cos(a),sin(a),-sin(a),cos(a));  
								}

								float zoom=4.;

								float field(in vec3 p) {
									float res = 0.;
									vec3 c = p;
									for (int i = 0; i < 10; ++i) {
										p = abs(p) / dot(p,p) -1.;
										p = dmul(p,p)+.7;
										res += exp(-6. * abs(dot(p,c)-.15));
									}
									return max(0., res/3.);
								}

								vec3 raycast( in vec3 ro, vec3 rd )
								{
									float t = 6.0;
									float dt = .05;
									vec3 col= vec3(0.);
									for( int i=0; i<64; i++ )
									{
										float c = field(ro+t*rd);               
										t+=dt/(.35+c*c);
										c = max(5.0 * c - .9, 0.0);
										col = .97*col+ .08*vec3(0.5*c*c*c, .6*c*c, c);
									}
									return col;
								}

								void main() {
									#include <clipping_planes_fragment>
									vec4 diffuseColor = vec4( diffuse, opacity );
									ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
									vec3 totalEmissiveRadiance = emissive;
									#include <logdepthbuf_fragment>
									#include <map_fragment>
									#include <color_fragment>
									#include <alphamap_fragment>
									#include <alphatest_fragment>
									#include <specularmap_fragment>
									#include <normal_fragment_begin>
									#include <normal_fragment_maps>
									#include <emissivemap_fragment>
									#include <lights_phong_fragment>
									#include <lights_fragment_begin>
									#include <lights_fragment_maps>
									#include <lights_fragment_end>
									#include <aomap_fragment>
									vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
									#include <envmap_fragment>
									gl_FragColor = vec4( outgoingLight, diffuseColor.a );
									#include <tonemapping_fragment>
									#include <encodings_fragment>
									#include <fog_fragment>
									#include <premultiplied_alpha_fragment>
									#include <dithering_fragment>

									float time = iGlobalTime;
									vec2 q = fragCoord.xy / iResolution.xy;
									vec2 p = -1.0 + 2.0 * q;
									p.x *= iResolution.x/iResolution.y;
									vec2 m = vec2(0.);
									if( iMouse.z>0.0 )m = iMouse.xy/iResolution.xy*3.14;
									m-=.5;
									vec3 ro = zoom*vec3(1.);
									ro.yz*=rot(m.y);
									ro.xz*=rot(m.x+ 0.1*time);
									vec3 ta = vec3( 0.0 , 0.0, 0.0 );
									vec3 ww = normalize( ta - ro );
									vec3 uu = normalize( cross(ww,vec3(0.0,1.0,0.0) ) );
									vec3 vv = normalize( cross(uu,ww));
									vec3 rd = normalize( p.x*uu + p.y*vv + 4.0*ww );
									vec3 col = raycast(ro,rd);
									col =  .5 *(log(1.+col));
									col = clamp(col,0.,1.);
									gl_FragColor = vec4( sqrt(col), 1.0 );
	
							`
						);


						shader.uniforms.uniformsNeedUpdate = { value: targetMesh.userData.uniformsNeedUpdate.value };

						// console.log("onBeforeCompile : base vertex ", shader.vertexShader);

						// console.log("onBeforeCompile : base fragment ", shader.fragmentShader);

						// console.log("onBeforeCompile : shader full ", shader);

					}

					targetMesh.onBeforeRender = (renderer, scene, camera, geometry, material, group) => {
						// console.log("àà à à à à àà à à à on before render renderer : ", renderer);
						// console.log("àà à à à à àà à à à on before render scene : ", scene);
						// console.log("àà à à à à àà à à à on before render camera : ", camera);
						// console.log("àà à à à à àà à à à on before render geometry : ", geometry);
						// console.log("àà à à à à àà à à à on before render material : ", material);
						// console.log("àà à à à à àà à à à on before render group : ", group);

						const bob = scene.children.find(child => child.name === "linkShader");
						const gl = renderer.getContext();

						console.log("gl : ", gl);

						
						bob.userData.iGlobalTime = { value: this.vm.$store.state.audioCurrent.currentTime };

						bob.needsUpdate = true;

						// material.program.getUniforms().setValue( gl, "color", object.userData.color 
						
						
						console.log("onbeforeRender : bob : ", bob);

						console.log("onbeforeRender : material get uniforms : ", THREE.UniformsUtils);


						// material.userData.iGlobalTime.value = this.vm.$store.state.audioCurrent.currentTime;

						// material.onBeforeCompile = shader => {
						// 	console.log("on before compile dans le on before render , supposed to update with : ", this.vm.$store.state.audioCurrent.currentTime);
						// 	shader.uniforms.iGlobalTime = { value: this.vm.$store.state.audioCurrent.currentTime };
						// }
					}

					// console.log("material AFTER compile : ", targetMesh.material);

					// debugger;

				}

				
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