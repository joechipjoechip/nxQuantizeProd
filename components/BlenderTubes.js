import * as THREE from 'three';
import { TimelineMax } from 'gsap';

class BlenderTubes{

	constructor(params){


		this._gltf = params.gltf;
		this._currentSequence = params.currentSequence;
		this._scene = params.scene;
		this._currentCamera = params.currentCamera;
		this._target = params.target;

		this._tube = null;
		this._tubeTravelTargetPosition = null;
	
		this._Inits();

	}

	_Inits(){

		const pathName = this._currentSequence?.pathName;

		const curvePoints = [];

		if( !pathName || !this._gltf ){ return; }

		// D'abord on récupère les objets vides créés dans blender
		this._gltf[0].scene.traverse(child => {

			if( child.name.indexOf(pathName) ){

				curvePoints.push(child);

			}

		});
		
		const smoothedCurvePoints = curvePoints?.map(object3d => {

			return new THREE.Vector3(
				object3d.position.x, 
				object3d.position.y, 
				object3d.position.z
			);

		});

		// Et Ensuite on construit tout ça :
		const parentPath = new THREE.Object3D();

		parentPath.name = "parentPath";

		const curve = new THREE.CatmullRomCurve3(smoothedCurvePoints || 0, false, "chordal");

		// ADD TUBE
		const tubeGeometry = new THREE.TubeGeometry(curve, 64, 0.06, 8);

		// ADD GEOMETRY
		const material = new THREE.MeshLambertMaterial({ 
			color: 0xff00ff, 
			side: THREE.DoubleSide,
			wireframe: true,
			visible: true
		});

		this._tube = new THREE.Mesh( tubeGeometry, material );

		this._tube.name = "tube";

		parentPath.add( this._tube );

		this._scene.add(parentPath);

	}

	_TweenBuilder(){

		const tlToReturn = new TimelineMax();

		const tlSequence = new TimelineMax();

		const globalDuration = this._currentSequence.global.duration;

		this._currentSequence.curveSteps.forEach((step, index) => {
			
			const tlStep = new TimelineMax();

			const thisStepDuration = ((globalDuration / 100) * step.duration);

			const alreadyPlayedStep = this._currentSequence.curveSteps.filter((onStep, indexSeq) => {

				if( indexSeq <  index ){
					return onStep;
				}

			});

			let alreadyPlayedDuration = alreadyPlayedStep.reduce((acc, step) => {

				const specificStepDuration = ((globalDuration / 100) * step.duration);

				return acc + specificStepDuration;

			}, 0);

			const animatedObject = {
				time: alreadyPlayedDuration
			};

			const timeToReach = alreadyPlayedDuration + thisStepDuration;

			tlStep.to(
				animatedObject, 
				thisStepDuration, 
				{
					time: timeToReach,
					ease: step.stepEase,

					onUpdate: () => {

						const time = animatedObject.time;

						const looptime = globalDuration;

						const t = ((time % looptime) / looptime);
						
						const pos1 = this._tube.geometry.parameters.path.getPointAt(t);     
						
						this._currentCamera.position.copy(pos1);
						
						if( this._target ){
							
							this._tubeTravelTargetPosition = this._target._controls.Position;
							
						} else {
							
							// sans target, on regarde simplement devant soi sur le tube
							const t2 = (((time + 0.2) % looptime) / looptime);

							const pos2 = this._tube.geometry.parameters.path.getPointAt(t2);
							
							this._tubeTravelTargetPosition = pos2;

						}

						// enfin : 
						// le this._tubeTravelTargetPosition sera utilisé dans le render principal
						// (dans world.vue)

					},

					onComplete: () => {

						console.log("this specific step is done : ", index);

						this._tubeTravelTargetPosition = false;

					}

				}

			);

			tlSequence.add(tlStep);

		});

		tlToReturn.add(tlSequence);

		tlToReturn.pause();

		return tlToReturn;

	}
}

export { BlenderTubes };
