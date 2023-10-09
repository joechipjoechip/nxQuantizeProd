import { core } from '@/static/config/core.js';

import * as THREE from 'three';
import { TimelineLite } from 'gsap';

class ThirdPersonCamera {

	constructor(params) {

		this._params = params;
		this._name = params.name;
		this._camera = params.camera;
		this._cameraType = params.cameraType;
    	this._specs = core.generatedCamerasSpecs[params.cameraType];
		this._scene = params.scene;
  
		this._currentPosition = new THREE.Vector3();
		this._currentPosition.copy(this._camera.position);
		this._currentLookat = new THREE.Vector3();
		this._raycaster = new THREE.Raycaster();
		this._raycasterDirection = new THREE.Vector3(0,-1,0);

		this._ratioAcceleration = 1;
		this._accelerationRunning = false;
		
		this._raycaster.set(
			new THREE.Vector3(
				this._camera.position.x,
				this._camera.position.y,
				this._camera.position.z
			),
			this._raycasterDirection
		);


		this._camera.name = `third-person-camera_${this._name}`;
	}

	_animateAccelerationRatio(){

		console.log("tween acceleration triggered")

		this._accelerationRunning = true;

		const animatedObject = {
			ratio: 1
		};

		const tl = new TimelineLite();

		tl.to(animatedObject, 0.75, {
			ratio: 15,
			ease: "linear",
			onUpdate( that ){
				console.log("animated object ratio : ", animatedObject.ratio)
				that._ratioAcceleration = animatedObject.ratio;
			},
			onUpdateParams: [this],
			onComplete( that ){
				console.log("onComplete")
				tl.reverse()
				// that._ratioAcceleration = 1;
				// that._accelerationRunning = false;
			},
			onCompleteParams: [this, tl],
			onReverseComplete(that, tl){
				console.log("onReverseComplete")

				setTimeout(() => {
					that._accelerationRunning = false;
				}, 1500)
			},
			onReverseCompleteParams: [this]

		})

	}
  
	_CalculateIdealOffset( timeElapsed ){

		let idealOffset;

		if( this._specs.motion ){

			if( this._specs.acceleration ){

				if( !this._accelerationRunning ){
					this._animateAccelerationRatio()
				}

				console.log("camera accelerated spotted")
				
				idealOffset = new THREE.Vector3(
					this._specs.offset.x + (Math.sin(timeElapsed * this._ratioAcceleration * this._specs.motion.x.velocity) * this._specs.motion.x.range),
					this._specs.offset.y + (Math.sin(timeElapsed * this._ratioAcceleration * this._specs.motion.y.velocity) * this._specs.motion.y.range),
					this._specs.offset.z + (Math.abs((Math.sin(timeElapsed * this._ratioAcceleration * this._specs.motion.z.velocity)) * -1) * this._specs.motion.z.range)
				);

			} else {
				console.log("camera accelerated not spotted : ", this)

				idealOffset = new THREE.Vector3(
					this._specs.offset.x + (Math.sin(timeElapsed * this._specs.motion.x.velocity) * this._specs.motion.x.range),
					this._specs.offset.y + (Math.sin(timeElapsed * this._specs.motion.y.velocity) * this._specs.motion.y.range),
					this._specs.offset.z + (Math.abs((Math.sin(timeElapsed * this._specs.motion.z.velocity)) * -1) * this._specs.motion.z.range)
				);

			}


		} else {

			idealOffset = new THREE.Vector3(
				this._specs.offset.x,
				this._specs.offset.y,
				this._specs.offset.z
			);

		}

		this.yPositionMotionWhileGroundHandling = idealOffset.y;

		idealOffset.applyQuaternion(this._params.target.Rotation);

		idealOffset.add(this._params.target.Position);

		return idealOffset;
	}
  
	_CalculateIdealLookat( mousePos ){

		const mouseVector = new THREE.Vector3(
			mousePos.x * this._specs.mouseOrientationPonderation.x * -1, 
			mousePos.y * this._specs.mouseOrientationPonderation.y,
			0
		);

		const idealLookat = new THREE.Vector3(
			this._specs.lookAt.x,  
			this._specs.lookAt.y,
			this._specs.lookAt.z
		);


		mouseVector.applyQuaternion(this._params.target.Rotation);
		idealLookat.applyQuaternion(this._params.target.Rotation);

		idealLookat.add(this._params.target.Position);
		idealLookat.add(mouseVector);

		return idealLookat;
	}
  
	Update( triggerTime, timeElapsed, mousePos, optionsObj ){
		
		const realTime = timeElapsed - triggerTime;
	
		const idealOffset = this._CalculateIdealOffset(realTime);
		const idealLookat = this._CalculateIdealLookat(mousePos);
	
		// t = facteur de latence du positionnement de la camera : 
		// où 1 = straight

		// best implementation :
		const t = (1.0 - Math.pow(0.1, timeElapsed)) * (optionsObj.isCurrentlyTransitionning ? 1 : this._specs.straightness);
	
		this._currentPosition.lerp(idealOffset, t);
		this._currentLookat.lerp(idealLookat, t);

		if( optionsObj.cameraNeedsToHandleGround ){

			this._raycaster.set(
					new THREE.Vector3(
						this._currentPosition.x, 
						this._currentPosition.y + 1, 
						this._currentPosition.z, 
					),
					new THREE.Vector3(0,-1,0)
				);
	
			this.HandlerGround();

		}

		this._camera.position.copy(this._currentPosition);
		this._camera.lookAt(this._currentLookat);

	}

	HandlerGround(){

		const hit = this._raycaster
				.intersectObjects(this._scene.children)
				?.find(intersected => {
					return (intersected.object.name === "landscape" && intersected.object.name !== "shadow") || intersected.object.name.includes("ground")
				});

		if( hit?.distance && hit.distance > 0.5){
			this._currentPosition.y = hit.point.y + this._specs.offset.y + 0.01 + Math.abs(this.yPositionMotionWhileGroundHandling);
		} else {
			this._currentPosition.y = this._specs.offset.y;
		}

	}
	
}

export { ThirdPersonCamera };
