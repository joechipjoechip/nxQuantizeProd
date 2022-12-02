import * as THREE from 'three';
import { TimelineLite } from 'gsap';

class BlenderTubes{

	constructor(params){

		this._scene = params.scene;
		this._camera = params.camera;

		this._sequenceInfos = params.sequenceInfos;
		this._sequenceInfosID = params.sequenceInfos.id.replace(".", "-");

		console.log("Blender tubes build for : ", this._sequenceInfosID);

		this._blenderPoints = this._ParseBlenderPoints(params.blenderPoints);
		this._target = params.blenderPoints.find(point => (point.name.includes("_target") && point.name.includes(this._sequenceInfosID)));

		this._tube = null;
		this._tubeTravelTargetPosition = null;

		this._debug = {
			displayTube: this._sequenceInfos.helpers.tubes,
			timelines: this._sequenceInfos.helpers.timelines
		};

		this._fakeOrbitPoint = 0;
	
		this._Inits();

	}

	_ParseBlenderPoints( blenderPoints ){

		// return blenderPoints reOrdered :
		// because blender glb exports mess it all

		// plan-1-1_0
		// plan-1-1_target
		// (eventuellement : bob-position)

		const curvePoints = blenderPoints.filter(point => ( 
			point.name.indexOf("plan-") !== -1 
			&& !point.name.includes("_target")
			&& point.name.includes(this._sequenceInfosID)
		));

		const result = [];

		curvePoints.forEach((point, index) => {

			const pointIndex = parseInt(point.name.split("_")[1]);

			result[pointIndex] = point;

		});

		return result;

	}

	_Inits(){

		if( !this._blenderPoints ){ return; }

		const smoothedCurvePoints = 
			this._blenderPoints
				.map(object3d => new THREE.Vector3(object3d.position.x, object3d.position.y, object3d.position.z))
				.filter(obj => obj);

		// Et Ensuite on construit tout ça :
		const tubeParentPath = new THREE.Object3D();
		tubeParentPath.name = "tubeParentPath";

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

	_FakeOrbit(mousePos){

		const reformatedMousePos = {
			x: (mousePos.x + 1) / 2,
			y: (mousePos.y + 1) / 2
		};

		const pos1 = this._tube.geometry.parameters.path.getPointAt(reformatedMousePos.x);
		
		this._camera.position.copy(pos1);

	}

	_TweenBuilder(){

		const tlToReturn = new TimelineLite();

		const tlSequence = new TimelineLite();

		const globalDuration = this._sequenceInfos.tubeInfos.duration;

		this._sequenceInfos.tubeInfos.steps.forEach((step, index) => {
			
			const tlStep = new TimelineLite();

			const thisStepDuration = ((globalDuration / 100) * step.amount);

			const alreadyPlayedStep = this._sequenceInfos.tubeInfos.steps.filter((onStep, indexSeq) => {

				if( indexSeq <  index ){
					return onStep;
				}

			});

			let alreadyPlayedDuration = alreadyPlayedStep.reduce((acc, step) => {

				const specificStepDuration = ((globalDuration / 100) * step.amount);

				return acc + specificStepDuration;

			}, 0);

			console.log("steps : ", alreadyPlayedDuration)

			const animatedObject = {
				time: alreadyPlayedDuration,
				customFov: index === 0 ? this._camera.getEffectiveFOV() : this._sequenceInfos.tubeInfos.steps[index - 1].fov
			};

			const timeToReach = alreadyPlayedDuration + thisStepDuration;

			tlStep.to(
				animatedObject, 
				thisStepDuration, 
				{
					time: timeToReach,
					customFov: step.fov,

					ease: step.stepEase,

					onUpdate: () => {

						// const time = animatedObject.time;
						const { time, customFov } = animatedObject;

						const looptime = globalDuration;

						const t = ((time % looptime) / looptime);
						
						const pos1 = this._tube.geometry.parameters.path.getPointAt(t);     
						
						this._camera.position.copy(pos1);

						this._camera.setFocalLength(customFov);

						// this._camera.updateProjectionMatrix();
						
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

						// if( this._debug.timelines ){
						// 	console.log("timeline update triggered");
						// }

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
