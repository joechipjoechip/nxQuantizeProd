<template>
	<div>
		<canvas id="canvasIndex" ref="canvasIndex"></canvas>
	</div>
</template>

<script>

    import * as THREE from 'three';
    import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';

	export default {
		data(){
            return {
                canvasSizeRef: { 
					width: window.innerWidth, 
					height: window.innerHeight
				},
                frameRate: 1/60,
                deltaTime: 0,

                animate: true,

                params: {
                    hemisphereLight: [0xFFFFFF, 0x000000, 0.1],
                    pointLight: [ 0xFFFFFF, 0.7],
                    pointLightBasePosition: [0, 1, 4],
                    perspectiveCamera: [75, window.innerWidth / window.innerHeight, 0.1, 100],
                    perspectiveCameraBasePosition: [0,0,3],
                    model: {
                        name: "marie",
                        scale: 0.1,
                        basePosition: [0,-3.5,0],
                        animName: "floating"
                    },
                    render: {
                        bgColor: "#000000"
                    }
                }
            }
        },
        // watch: {

        // },
        mounted(){

            console.log("mounted");

            this.createScene();

            this.initRenderer();

        },
        methods: {

            async createScene(){

                // SCENE
                this.scene = new THREE.Scene();
                
                // CAMERA
				this.camera = new THREE.PerspectiveCamera(...this.params.perspectiveCamera);
				this.camera.position.set(...this.params.perspectiveCameraBasePosition)
                
                // LIGHT
				this.hemisphericLight = new THREE.HemisphereLight(...this.params.hemisphereLight);

				this.light = new THREE.PointLight(...this.params.pointLight);

                this.light.position.set(...this.params.pointLightBasePosition);

                this.loadModel().then(
                    model => {
                        this.model = model;

                        // load moves 
                        this._LoadMoves(this.model).then(() => {

                            const clip = this.model.animations[this.params.model.animName].clip;

                            const action = this.mixer.clipAction(clip);

                            action.play();

                            this.mixer.clipAction(clip).play();

                            // olright let's go
                            this.fullFillScene();
                            this.mainTick();

                        });


                    }, 
                    error => {
                        //
                    }
                );
                
				
            },

            fullFillScene(){

                // then add theses to the scene
				this.scene.add(this.model);
				this.scene.add(this.camera);
				this.scene.add(this.hemisphericLight);
				this.scene.add(this.light);

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
                        });

                        target = fbx;
                        target.name = this.params.model.name;
                        
                        target.position.copy(new THREE.Vector3(...this.params.model.basePosition));
                        // target.rotation.copy(new THREE.Vector3(0,Math.PI / 2,0));

                        // if( mainObj.infos.shader ){

                        //     const shaderInfos = mainObj.infos.shader;

                        //     const targetMesh = target.children.find(child => child.name !== "Armature");

                        //     targetMesh.material = new CustomShaderBuilder(shaderInfos);

                        // }

                        res(target);

                    });

                });

            },

            async _LoadMoves( target ){

                return new Promise(res => {

                    const manager = new THREE.LoadingManager();
                    const loader = new FBXLoader(manager);
                    
                    this.mixer = new THREE.AnimationMixer(target);

                    manager.onLoad = () => {
                        res();
                    };

                    const _OnLoad = (animName, anim) => {
                        
                        const clip = anim.animations[0];

                        const action = this.mixer.clipAction(clip);

                        action.time = 0.0;
                        action.setEffectiveTimeScale(1.0);
                        action.setEffectiveWeight(1.0);

                        target.animations[animName] = {
                            clip: clip,
                            action: action
                        };

                    };

                    loader.setPath("./../assets/3d/persos/moves/smallGuy/");

                    loader.load(`${this.params.model.animName}.fbx`, (a) => { _OnLoad(this.params.model.animName, a); });

                });

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

            mainTick(){

                console.log("mainTick");

                this.deltaTime += this.clock.getDelta();
                
                // NOW CHECK IF FRAMERATE IS GOOD
                if( this.deltaTime >= this.frameRate ){

                    console.log("act render");
                    
                    this.updateThings();

                    // NOW COMPUTE RENDER
                    this.renderer.render(this.scene, this.camera);

                    this.deltaTime = this.deltaTime % this.frameRate;

                }

                if( this.animate ){
                    window.requestAnimationFrame(this.mainTick);
                } else {
                    // pour voir une frame sans animer pour autant
                    this.renderer.render(this.scene, this.camera);
                }

            },

            updateThings(){

                this.mixer.update(
                    // Math.sin( this.clock.getElapsedTime() ) / 100
                    // this.clock.getElapsedTime() / 100
                    this.deltaTime / 10
                );

                console.log("deltatime : ", this.deltaTime);

                this.light.position.set(
                    Math.sin(this.clock.getElapsedTime()) * 15,
                    Math.sin(this.clock.getElapsedTime()) * 5,
                    Math.sin(this.clock.getElapsedTime()) * 2
                );

            }

        }

	}

</script>

<style lang="scss" scoped>
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