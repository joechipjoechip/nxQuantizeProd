<template>
	<div class="background-wrapper">
        <button @click="animate = !animate">animation</button>
		<canvas id="canvasIndex" ref="canvasIndex"></canvas>
	</div>
</template>

<script>

    import * as THREE from 'three';
    import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
    import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
    import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
    import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
    import { BokehPass } from 'three/examples/jsm/postprocessing/BokehPass.js';

	export default {
        props: {
            canvasSizeRef: {
                type: Object,
                required: true
            }
        },
		data(){
            return {
                

                frameRate: 1/60,
                deltaTime: 0,

                animate: false,

                requestAnimationFrameID: null,

                params: {
                    hemisphereLight: [0x000000, 0x0049ff, 0.3],
                    pointLight: ["#0049ff", 0.4],
                    pointLightBasePosition: [0, 5, 4],
                    perspectiveCamera: [75, window.innerWidth / window.innerHeight, 0.1, 100],
                    perspectiveCameraBasePosition: [0,0,3],

                    render: {
                        bgColor: "#000005"
                    },

                    model: {
                        name: "marie",
                        scale: 0.1,
                        basePosition: [0,-3.5,0],
                        animName: "floating",
                        emissive: {
                            enabled: true,
                            specific: {
                                one: {
                                    color: "#71E79B",
                                    intensity: 0.2,
                                    enabled: false
                                },
                                two: {
                                    color: "#5CE7E4",
                                    intensity: 1,
                                    enabled: false
                                },
                                three: {
                                    color: "#FFFFFF",
                                    intensity: 500,
                                    enabled: false
                                },
                                skin: {
                                    color: "#FFFFFF",
                                    intensity: 500,
                                    enabled: false
                                },
                                eyes: {
                                    color: "#FFFFFF",
                                    intensity: 100,
                                    enabled: true
                                }
                            }
                        }
                    },

                    postProcs: {
                        bloom: {
                            threshold: 0.00005,
                            strength: 1,
                            radius: 1
                        },
                        blur: {
                            focus: 1,
							aperture: 0.0003,
							maxblur: 0.08
                        }
                    }

                },

                currentMousePos: {
                    x: 0,
                    y: 0
                }
            }
        },
        watch: {
            animate( newVal ){
                if( newVal ){
                    this.mainTick();
                }
            }
        },
        mounted(){

            console.log("mounted");

            this.$nuxt.$on("view-update-by-stick", this.mouseUpdate);

            this.createScene();

            this.initRenderer();

            this.initComposer();

            this.createPostProc();

        },
        beforeDestroy(){

            window.cancelAnimationFrame(this.requestAnimationFrameID);
            this.disposeScene(this.scene);
            this.$nuxt.$off("view-update-by-stick", this.mouseUpdate);
        },
        methods: {

            createScene(){

                // SCENE
                this.scene = new THREE.Scene();
                
                // CAMERA
				this.camera = new THREE.PerspectiveCamera(...this.params.perspectiveCamera);
				this.camera.position.set(...this.params.perspectiveCameraBasePosition);
                
                // LIGHT
				this.hemisphericLight = new THREE.HemisphereLight(...this.params.hemisphereLight);

				this.light = new THREE.PointLight(...this.params.pointLight);

                this.light.position.set(...this.params.pointLightBasePosition);

                this.loadModel().then(
                    model => {
                        this.model = model;

                        // load moves 
                        this.loadMoves(this.model).then(() => {

                            const clip = this.model.animations[this.params.model.animName].clip;

                            const action = this.mixer.clipAction(clip);

                            action.play();

                            this.mixer.clipAction(clip).play();

                            // olright let's go
                            this.launchAll()

                        });

                    }, 
                    error => {
                        //
                    }
                );
                
				
            },

            initRenderer(){

                this.renderer = new THREE.WebGLRenderer({
                    canvas: this.$refs.canvasIndex,
                    antialias: true
                });

                this.renderer.setSize(this.canvasSizeRef.width, this.canvasSizeRef.height);

                this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

                this.renderer.setClearColor(this.params.render.bgColor);

                this.renderer.outputEncoding = THREE.sRGBEncoding;

                this.renderer.shadowMap.enabled = true;

                this.renderer.shadowMap.type = THREE.PCFShadowMap;

                this.clock = new THREE.Clock();

            },

            initComposer(){

                const renderPass = new RenderPass(this.scene, this.camera);

                this.composer = new EffectComposer(this.renderer);

                this.composer.setSize(this.canvasSizeRef.width, this.canvasSizeRef.height);

                this.composer.setPixelRatio(Math.min(window.devicePixelRatio, 2));


                this.composer.addPass(renderPass);

            },

            createPostProc(){

                // BLOOM
                const { threshold, strength, radius } = this.params.postProcs.bloom;

				const bloomPass = new UnrealBloomPass( new THREE.Vector2( this.canvasSizeRef.width, this.canvasSizeRef.height ), strength, radius, threshold);

                // BLUR
                const { focus, aperture, maxblur } = this.params.postProcs.blur;
                this.blurPass = new BokehPass( 
						this.scene, 
						this.camera, 
						{
							focus, aperture, maxblur,
							width: this.canvasSizeRef.width,
							height: this.canvasSizeRef.height
						}
					);



                // ADD
				this.composer.addPass(bloomPass);
				this.composer.addPass(this.blurPass);

            },

            loadModel(){
                return new Promise(res => {

                    const loader = new FBXLoader();
                    let target;

                    loader.setPath(`./../assets/3d/persos/${this.params.model.name}/`);

                    loader.load(`${this.params.model.name}.fbx`, (fbx) => {

                        fbx.scale.setScalar(this.params.model.scale);

                        fbx.traverse(c => {
                            if( c.type !== "Bone" ){
                                c.castShadow = true;
                            }

                            if( this.params.model.emissive.enabled ){

                                if( c.type === "SkinnedMesh" ){
            
                                    if( c.material.length ){
            
                                        c.material.forEach((child, index) => {
            
                                            console.log("material : ", child.name)
            
                                            if( child.name.includes("emissive") ){

                                                c.material[index] = this.replaceMaterialWithEmissive(
                                                    child,
                                                    child.name.replace("emissive-", "")
                                                );

                                            }
            
                                        });
            
                                    }
            
                                }

                            }

                        });

                        target = fbx;
                        target.name = this.params.model.name;
                        
                        target.position.copy(new THREE.Vector3(...this.params.model.basePosition));

                        res(target);

                    });

                });

            },

            replaceMaterialWithEmissive(baseMaterial, emissiveKey){

                if( this.params.model.emissive.specific[emissiveKey]?.enabled ){

                    return new THREE.MeshStandardMaterial({
                        emissive: new THREE.Color(this.params.model.emissive.specific[emissiveKey].color),
                        emissiveIntensity: this.params.model.emissive.specific[emissiveKey].intensity
                    });

                } else {
                    return baseMaterial;
                }

            },

            loadMoves( model ){

                return new Promise(res => {

                    const manager = new THREE.LoadingManager();
                    const loader = new FBXLoader(manager);
                    
                    this.mixer = new THREE.AnimationMixer(model);

                    manager.onLoad = () => {
                        res();
                    };

                    const _OnLoad = (animName, anim) => {
                        
                        const clip = anim.animations[0];

                        const action = this.mixer.clipAction(clip);

                        action.time = 0.0;
                        action.setEffectiveTimeScale(1.0);
                        action.setEffectiveWeight(1.0);

                        model.animations[animName] = {
                            clip: clip,
                            action: action
                        };

                    };

                    loader.setPath("./../assets/3d/persos/moves/smallGuy/");

                    loader.load(`${this.params.model.animName}.fbx`, (a) => { _OnLoad(this.params.model.animName, a); });

                });

            },

            fullFillScene(){

                // then add theses to the scene
                this.scene.add(this.model);
                this.scene.add(this.camera);
                this.scene.add(this.hemisphericLight);
                this.scene.add(this.light);

            },

            launchAll(){
                this.fullFillScene();
                this.mainTick();
            },

            mainTick(){

                this.deltaTime += this.clock.getDelta();
                
                // NOW CHECK IF FRAMERATE IS GOOD
                if( this.deltaTime >= this.frameRate ){

                    console.log("act render");
                    
                    this.updateThings();

                    // NOW COMPUTE RENDER
                    // this.renderer.render(this.scene, this.camera);
                    this.composer.render();

                    this.deltaTime = this.deltaTime % this.frameRate;

                }

                if( this.animate ){
                    this.requestAnimationFrameID = window.requestAnimationFrame(this.mainTick);
                } else {
                    // pour voir une frame sans animer pour autant
                    this.renderer.render(this.scene, this.camera);
                }

            },

            updateThings(){
                const elapsedTime = this.clock.getElapsedTime();

                this.mixer.update(this.deltaTime / 10);

                this.light.position.x = this.currentMousePos.x * -25;

                this.camera.position.set(
                    this.currentMousePos.x * 0.5,
                    this.currentMousePos.y + 1,
                    Math.cos(elapsedTime) / 3 + 2.5,
                );

                this.camera.lookAt(new THREE.Vector3(
                    this.model.position.x,
                    this.model.position.y + 4,
                    this.model.position.z
                ));

                this.updateBlurFocus(elapsedTime);

            },

            updateBlurFocus(elapsedTime){
                const { x, y, z } = this.camera;

                // compute distance beetween camera and target
                const distance = new THREE.Vector3(x,y,z).distanceTo({...this.model.position});

                // update focus value in blur effect
                this.blurPass.uniforms.focus.value = distance + Math.sin(elapsedTime);
            },

            mouseUpdate( event ){
                this.currentMousePos = event;
            },

			disposeScene( scene ){

				this.sceneTraverse(scene, o => {

					if (o.geometry) {
						o.geometry.dispose();
					}

					if (o.material) {
						if (o.material.length) {
							for (let i = 0; i < o.material.length; ++i) {
								o.material[i].dispose();
							}
						}
						else {
							o.material.dispose();
						}
					}
				})          

				scene = null;
	
			},

            sceneTraverse(obj, fn){

				if (!obj) return

				fn(obj)

				if (obj.children && obj.children.length > 0) {
					obj.children.forEach(o => {
						this.sceneTraverse(o, fn)
					})
				}

			}

        }

	}

</script>

<style lang="scss" scoped>

    .background-wrapper {
        background-color: #000005;
    }

    canvas {
        z-index: 3;
        width: 100% !important;
        height: 100% !important;
        // position: fixed;
        // top: 0;
        // left: 0;
        outline: none;
        pointer-events: all;
    }
</style>