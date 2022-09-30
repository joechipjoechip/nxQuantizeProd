import * as THREE from 'three';
import { TimelineMax } from 'gsap';

class BlenderTubes{

	constructor(params){

		
		this._scene = params.scene;
		this._camera = params.camera;

		this._sequenceInfos = params.sequenceInfos;
		this._blenderPoints = params.blenderPoints.filter(point => point.name.indexOf("-target") === -1);
		this._target = params.blenderPoints.find(point => point.name.indexOf("-target") !== -1);

		this._tube = null;
		this._tubeTravelTargetPosition = null;

		this._debug = {
			displayTube: this._sequenceInfos.helpers.tubes,
			timelines: this._sequenceInfos.helpers.timelines
		};
	
		this._Inits();

	}

	_Inits(){

		const smoothedCurvePoints = this._blenderPoints?.map(object3d => {

			return new THREE.Vector3(
				object3d.position.x, 
				object3d.position.y, 
				object3d.position.z
			);

		});

		// Et Ensuite on construit tout ça :
		const tubeParentPath = new THREE.Object3D({ name: "tubeParentPath" });

		const curve = new THREE.CatmullRomCurve3(smoothedCurvePoints || 0, false, "chordal");

		// ADD TUBE
		const tubeGeometry = new THREE.TubeGeometry(curve, 64, 0.06, 8);

		// ADD GEOMETRY
		const material = new THREE.MeshLambertMaterial({ 
			color: 0xff00ff, 
			side: THREE.DoubleSide,
			wireframe: this._debug.displayTube,
			visible: this._debug.displayTube
		});

		this._tube = new THREE.Mesh( tubeGeometry, material );

		this._tube.name = "tube";

		tubeParentPath.add( this._tube );

		this._scene.add(tubeParentPath);

	}

	_TweenBuilder(){

		const tlToReturn = new TimelineMax();

		const tlSequence = new TimelineMax();

		const globalDuration = this._sequenceInfos.path.duration;

		this._sequenceInfos.path.steps.forEach((step, index) => {
			
			const tlStep = new TimelineMax();

			const thisStepDuration = ((globalDuration / 100) * step.amount);

			const alreadyPlayedStep = this._sequenceInfos.path.steps.filter((onStep, indexSeq) => {

				if( indexSeq <  index ){
					return onStep;
				}

			});

			let alreadyPlayedDuration = alreadyPlayedStep.reduce((acc, step) => {

				const specificStepDuration = ((globalDuration / 100) * step.amount);

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
						
						this._camera.position.copy(pos1);
						
						if( this._target ){
							
							// avec _controls : c'est bob
							// sans _controls : c'est un blender empty point
							this._tubeTravelTargetPosition = this._target._controls ? this._target._controls.Position : this._target.position;
							
						} else {
							
							// sans target, on regarde simplement devant soi sur le tube
							const t2 = (((time + 0.2) % looptime) / looptime);

							const pos2 = this._tube.geometry.parameters.path.getPointAt(t2);
							
							this._tubeTravelTargetPosition = pos2;

						}

						if( this._debug.timelines ){
							console.log("timeline update triggered");
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
