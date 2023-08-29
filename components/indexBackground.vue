<template>
	<div class="background-wrapper">
        <!-- <button @click="animate = !animate">animation</button>
        <span style="color: white;">fps : {{ currentFPSValue }}</span> -->
		<canvas id="canvasIndex" ref="canvasIndex"></canvas>
	</div>
</template>

<script>

    import * as THREE from 'three';
    import { TimelineLite } from 'gsap';
    import { disposeScene } from '@/components/sceneDisposer.js'

    import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
    import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
    import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
    import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';

    import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
    import { BokehPass } from 'three/examples/jsm/postprocessing/BokehPass.js';
    import { RGBShiftShader } from 'three/examples/jsm/shaders/RGBShiftShader.js'
    import { AfterimagePass } from 'three/examples/jsm/postprocessing/AfterimagePass.js';
    import { GlitchPass } from 'three/examples/jsm/postprocessing/GlitchPass.js';

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

                startTime: 0,
                currentFPSValue: 0,
                frames: 0,

                animate: true,

                requestAnimationFrameID: null,

                params: {
                    hemisphereLight: [0x000000, 0x0049ff, 0.4],

                    pointLight: ["#0049ff", 0.45],
                    pointLightBasePosition: [0, 5, 2],

                    pointLight2: ["#ffa500", 0.3],
                    pointLightBasePosition2: [0, 0, -3],
                    
                    perspectiveCamera: [55, window.innerWidth / window.innerHeight, 0.1, 20],
                    perspectiveCameraBasePosition: [0,0,3.5],

                    render: {
                        bgColor: "#346eff"
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
                                    intensity: 1,
                                    enabled: false
                                },
                                two: {
                                    color: "#5CE7E4",
                                    intensity: 1,
                                    enabled: false
                                },
                                three: {
                                    color: "#FFFFFF",
                                    intensity: 1,
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
                            threshold: 0.0002,
                            strength: 0.8,
                            radius: 0.7
                        },
                        blur: {
                            focus: 1,
							aperture: 0.0002,
							maxblur: 3
                        },
                        rgbShifter: {
                            min: 0,
                            max: 0.13,
                            durationOpen: 5.5,
                            durationClose: 0.25,
                            tweenNameOpen: "rgbTweenOpen",
                            tweenNameClose: "rgbTweenClose",
                            // every n seconds
                            reccurency: 15,
                            haveBeenTrigered: false
                        },
                        afterImage: {
                            min: 0.7,
                            max: 0.985,
                            durationOpen: 4,
                            durationClose: 2,
                            tweenNameOpen: "afterImageTweenOpen",
                            tweenNameClose: "afterImageTweenClose",
                            // every n seconds
                            reccurency: 10,
                            haveBeenTrigered: false
                        },
                        glitch: {
                            reccurency: 6,
                            duration: 1,
                            haveBeenTrigered: false
                        }
                    }

                },

                currentMousePos: {
                    x: 0,
                    y: 0
                },

                tweens: {}
            }
        },
        watch: {
            animate( newVal ){
                if( newVal ){
                    this.mainTick();
                }
            },

            "params.postProcs.afterImage.haveBeenTrigered"( newVal ){
                if( !newVal ){
                    this.afterImage.uniforms.damp.value = 0;
                }

            }
        },
        mounted(){

            this.$nuxt.$on("view-update-by-stick", this.mouseUpdate);

            this.createScene();

            this.initRenderer();

            this.initComposer();

            this.createPostProc();

        },
        beforeDestroy(){

            this.killTweens();

            window.cancelAnimationFrame(this.requestAnimationFrameID);
            
            disposeScene(this.scene);

            this.renderer.dispose();
            
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

				this.light2 = new THREE.PointLight(...this.params.pointLight2);
                this.light2.position.set(...this.params.pointLightBasePosition2);

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
                    // antialias: true
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

                // RGB
                this.rgbShiftShader = new ShaderPass( RGBShiftShader );
				this.rgbShiftShader.uniforms["amount"].value = this.params.postProcs.rgbShifter.min;

				// AFTERIMAGE
                this.afterImage = new AfterimagePass();
				this.afterImage.uniforms["damp"].value = this.params.postProcs.afterImage.max;

                // GLITCH
                this.glitch = new GlitchPass();



                // ADD
                this.composer.addPass(this.afterImage);
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
                this.scene.add(this.light2);

            },

            launchAll(){
                this.fullFillScene();
                this.mainTick();
                this.$parent.backgroundIsLaunched = true;
            },

            mainTick(){

                this.deltaTime += this.clock.getDelta();
                
                // NOW CHECK IF FRAMERATE IS GOOD
                if( this.deltaTime >= this.frameRate ){

                    // console.log("act render");

                    this.computeFPS();
                    
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

            computeFPS(){
				const t = performance.now();
				const dt = t - this.startTime;

				// console.log("dt : ", dt);

				if( dt > this.frameRate ){
					this.currentFPSValue = this.frames * 1000 / dt;

					this.frames = 0;
					this.startTime = t;
				}
				this.frames++;
			},

            updateThings(){
                const elapsedTime = this.clock.getElapsedTime();

                this.mixer.update(this.deltaTime / 10);

                this.light.position.x = this.currentMousePos.x * 25;

                this.light2.position.x = this.currentMousePos.x * 10;
                this.light2.position.y = (this.currentMousePos.y * 25);

                this.camera.position.set(
                    this.currentMousePos.x * 0.75,
                    this.currentMousePos.y * 0.25 + 1,
                    Math.cos(elapsedTime) * 0.05 + this.params.perspectiveCameraBasePosition[2],
                );

                this.camera.lookAt(new THREE.Vector3(
                    this.model.position.x,
                    this.model.position.y + 3.8,
                    this.model.position.z
                ));

                this.updatePostProcs(elapsedTime);


            },

            updatePostProcs( elapsedTime ){
                
                this.updateBlurFocus();

                this.updateGlitch(elapsedTime);
                
                this.updateRGB(elapsedTime);
                
                this.updateAfterImage(elapsedTime);

            },

            updateBlurFocus(){
                const { x, y, z } = this.camera.position;

                // compute distance beetween camera and target
                const distance = new THREE.Vector3(x,y,z).distanceTo({...this.model.position});

                // update focus value in blur effect
                this.blurPass.uniforms.focus.value = distance;
            },

            updateGlitch( elapsedTime ){

                if( 
                    Math.floor(elapsedTime) % this.params.postProcs.glitch.reccurency === 0
                    && !this.params.postProcs.glitch.haveBeenTrigered
                ){
                    
                    this.params.postProcs.glitch.haveBeenTrigered = true;
                    
                    this.composer.addPass(this.glitch);
                    
                    setTimeout(() => {
                        
                        this.composer.removePass(this.glitch);
                        
                        if( this.params.postProcs.glitch.haveBeenTrigered ){
                            this.params.postProcs.glitch.haveBeenTrigered = false;
                        }

                    }, this.params.postProcs.glitch.duration);

                }

            },

            updateRGB( elapsedTime ){

                if( 
                    !this.tweens[this.params.postProcs.rgbShifter.tweenName] 
                    && Math.floor(elapsedTime) % this.params.postProcs.rgbShifter.reccurency === 0 
                    && !this.params.postProcs.rgbShifter.haveBeenTrigered
                ){

                    this.params.postProcs.rgbShifter.haveBeenTrigered = true;

                    this.composer.addPass(this.rgbShiftShader);

                    // do things
                    this.tweenBuilder(
                        this.params.postProcs.rgbShifter.tweenNameOpen,
                        "this.rgbShiftShader.uniforms.amount.value",
                        this.params.postProcs.rgbShifter.min,
                        this.params.postProcs.rgbShifter.max * Math.random(),
                        this.params.postProcs.rgbShifter.durationOpen * Math.random(),
                        "easeIn",
                        // callback (onComplete)
                        () => {
                            this.tweenBuilder(
                                this.params.postProcs.rgbShifter.tweenNameClose,
                                "this.rgbShiftShader.uniforms.amount.value",
                                this.params.postProcs.rgbShifter.max,
                                this.params.postProcs.rgbShifter.min,
                                this.params.postProcs.rgbShifter.durationClose,
                                "elastic",
                                () => {
                                    this.composer.removePass(this.rgbShiftShader);
                                    
                                    this.params.postProcs.rgbShifter.haveBeenTrigered = false;
                                    
                                    this.params.postProcs.rgbShifter.max *= -1
                                }
                            );
                        }
                    );
                   
                }

            },

            updateAfterImage( elapsedTime ){

                if( 
                    !this.tweens[this.params.postProcs.afterImage.tweenName] 
                    && Math.floor(elapsedTime) % this.params.postProcs.afterImage.reccurency === 0 
                    && !this.params.postProcs.afterImage.haveBeenTrigered
                ){

                    this.params.postProcs.afterImage.haveBeenTrigered = true;

                    // do things
                    this.tweenBuilder(
                        this.params.postProcs.afterImage.tweenNameOpen,
                        "this.afterImage.uniforms.damp.value",
                        this.params.postProcs.afterImage.min,
                        this.params.postProcs.afterImage.max,
                        this.params.postProcs.afterImage.durationOpen * Math.random(),
                        "easeOut",
                        // callback (onComplete)
                        () => {
                            this.tweenBuilder(
                                this.params.postProcs.afterImage.tweenNameClose,
                                "this.afterImage.uniforms.damp.value",
                                this.params.postProcs.afterImage.max,
                                this.params.postProcs.afterImage.min,
                                this.params.postProcs.afterImage.durationClose,
                                "easeInOut",
                                () => {
                                    this.params.postProcs.afterImage.haveBeenTrigered = false;
                                }
                            );
                        }
                    );
                   
                }

            },

            tweenBuilder( tweenName, valueToAnimateString, startingValue, endingValue, duration, ease, callback ){

                 const animatedObject = {
                    x: startingValue
                };

                this.tweens[tweenName] = new TimelineLite();

                this.tweens[tweenName].to(animatedObject, duration, {
                    x: endingValue,
                    ease,
                    onUpdate( that, stringPathToTheValue ){
                        const pathToValue = stringPathToTheValue.split(".");

                        that[pathToValue[1]][pathToValue[2]][pathToValue[3]][pathToValue[4]] = animatedObject.x;

                    },
                    onUpdateParams: [this, valueToAnimateString],
                    onComplete( that, callback ){

                        that.tweens[tweenName] = null;

                        // launch closing
                        callback()
                        
                    },
                    onCompleteParams: [this, callback]
                });



            },

            killTweens(){

                Object.keys(this.tweens).forEach(tweenKey => {
                    this.tweens[tweenKey]?.kill();
                    this.tweens[tweenKey] = null;
                })

            },

            mouseUpdate( event ){
                this.currentMousePos = event;
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