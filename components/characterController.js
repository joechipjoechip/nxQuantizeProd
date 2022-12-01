import * as THREE from 'three';

import { core } from '@/static/config/core.js';

import { 
	DanceState,
	FlyState,
	WalkState,
	WalkStateBack,
	RunState,
	IdleState,
	FloatingState,
	JazzState,
	HiphopState,
	ClimbState
} from '@/components/states.js'

class BasicCharacterControllerProxy {

	constructor(animations) {
		this._animations = animations;
	}

	get animations() {
		return this._animations;
	}
};

class BasicCharacterController {
	constructor(params) {

		this._Init(params);
	}

	async _Init(params) {
		this._params = params;

		this._sceneBuilderThis = params.sceneBuilderThis;
		this._target = params.target;
		this._mixer = params.mixer;
		this._animations = params.animations;
		this._scene = params.scene
		this._isAlice = this._params.isAlice;


		this._decceleration = new THREE.Vector3(-0.0005, -0.0001, -5.0);
		this._acceleration = new THREE.Vector3(
			this._params.bobInfos.velocity.x,
			this._params.bobInfos.velocity.y,
			this._params.bobInfos.velocity.z
		);
		this._velocity = new THREE.Vector3(0, 0, 0);
		this._position = new THREE.Vector3();

		this._input = new BasicCharacterControllerInput(params.vm);

		this._stateMachine = new CharacterFSM(
			new BasicCharacterControllerProxy(this._animations)
		);

		this._raycaster = new THREE.Raycaster();

		this._moveScaledRatio = this._params.bobInfos.scale * 100 * 2;

		this._stateMachine.SetState('idle');

	}

	set Position(coords) {
		this._target.position.copy(coords);
	}

	set Rotation(coords) {
		this._target.rotation.copy(coords);
	}

	get Position() {
		return this._position;
	}

	get Rotation() {
		if (!this._target) {
			return new THREE.Quaternion();
		}
		return this._target.quaternion;
	}

	Update(timeInSeconds, mousePos, optionsObj) {
		if (!this._target) {
			return;
		}

		if( this._isAlice ){

			this._input._keys.forward =  false;
			this._input._keys.backward =  false;
			this._input._keys.left =  false;
			this._input._keys.right =  false;
			this._input._keys.space =  false;
			this._input._keys.shift =  false;

		}

		this._stateMachine.Update(timeInSeconds, this._input);

		const velocity = this._velocity;
		const frameDecceleration = new THREE.Vector3(
			velocity.x * this._decceleration.x,
			velocity.y * this._decceleration.y,
			velocity.z * this._decceleration.z
		);
		frameDecceleration.multiplyScalar(timeInSeconds);
		frameDecceleration.z = Math.sign(frameDecceleration.z) * Math.min(
			Math.abs(frameDecceleration.z), 
			Math.abs(velocity.z)
		);

		velocity.add(frameDecceleration);

		const controlObject = this._target;
		const _Q = new THREE.Quaternion();
		const _A = new THREE.Vector3();
		const _R = controlObject.quaternion.clone();

		const acc = this._acceleration.clone();

		if( !this._isAlice ){

			if (this._input._keys.shift && !this._input._keys.fly ) {
				acc.multiplyScalar(3.0);
			}
	
			if(this._input._keys.fly ){
				acc.multiplyScalar(30.0);
			}
	
			if (this._stateMachine._currentState?.Name == 'dance') {
				acc.multiplyScalar(0.0);
			}
	
			if( this._input._keys.hiphop ){
				velocity.z += acc.z * timeInSeconds / 3.5;
			}
	
			if( this._input._keys.climb ){
				acc.multiplyScalar(0.05);
				velocity.y += acc.y * timeInSeconds / 3.5;
			}
	
			if (this._input._keys.forward || this._input._keys.fly) {
				velocity.z += acc.z * timeInSeconds;
			}
	
			if (this._input._keys.backward) {
				velocity.z -= acc.z * timeInSeconds;
			}
	
			if (this._input._keys.left) {
				_A.set(0, 1, 0);
				_Q.setFromAxisAngle(_A, 4.0 * Math.PI * timeInSeconds * this._acceleration.y * 0.4);
				_R.multiply(_Q);
			}
	
			if (this._input._keys.right) {
				_A.set(0, 1, 0);
				_Q.setFromAxisAngle(_A, 4.0 * -Math.PI * timeInSeconds * this._acceleration.y * 0.4);
				_R.multiply(_Q);
			}
	
	
			// if( mousePos.x === 0 ){
			// 	// console.log("mouse centered");
			// } else {
	
			// 	if( mousePos.x < 0 ){
			// 		const rotateLeft = THREE.MathUtils.clamp(
			// 			4.0 * Math.PI * timeInSeconds * (this._acceleration.y * Math.abs(mousePos.x / core.mouse.orientationClamp.divideRatio)),
			// 			core.mouse.orientationClamp.start,
			// 			core.mouse.orientationClamp.end
			// 		);
			// 		_A.set(0, 1, 0);
			// 		_Q.setFromAxisAngle(_A, rotateLeft);
			// 		_R.multiply(_Q);
		
			// 		// console.log("turning left : ", rotateLeft);
			// 	} else if( mousePos.x > 0 ){
			// 		const rotateRight = THREE.MathUtils.clamp(
			// 			4.0 * -Math.PI * timeInSeconds * (this._acceleration.y * Math.abs(mousePos.x / core.mouse.orientationClamp.divideRatio)),
			// 			core.mouse.orientationClamp.end * -1,
			// 			core.mouse.orientationClamp.start * -1
			// 		);
			// 		_A.set(0, 1, 0);
			// 		_Q.setFromAxisAngle(_A, rotateRight);
			// 		_R.multiply(_Q);
		
			// 		// console.log("turning right : ", rotateRight);
			// 	}
	
			// }
	
			controlObject.quaternion.copy(_R);
	
			const oldPosition = new THREE.Vector3();
			oldPosition.copy(controlObject.position);
	
			const forward = new THREE.Vector3(0, 0, 1);
			forward.applyQuaternion(controlObject.quaternion);
			forward.normalize();
	
			const sideways = new THREE.Vector3(1, 0, 0);
			sideways.applyQuaternion(controlObject.quaternion);
			sideways.normalize();
	
			const upway = new THREE.Vector3(0, 1, 0);
			upway.applyQuaternion(controlObject.quaternion);
			upway.normalize();
			
			sideways.multiplyScalar(velocity.x * timeInSeconds);
			forward.multiplyScalar((velocity.z * timeInSeconds) * (this._moveScaledRatio));
			upway.multiplyScalar(velocity.y * timeInSeconds * this._moveScaledRatio);
	
			controlObject.position.add(forward);
			controlObject.position.add(sideways);
			controlObject.position.add(upway);

		}

		if( optionsObj.bobNeedsToHandleGround ){

			this._raycaster.set(
				new THREE.Vector3(
					controlObject.position.x, 
					controlObject.position.y + 0.1, 
					controlObject.position.z, 
				),
				new THREE.Vector3(0,-1,0)
			);
	
			controlObject.position.y = this.HandleGravity(controlObject);

		} 

		this._position.copy(controlObject.position);

		if (this._mixer) {
			this._mixer.update(timeInSeconds);
		}
	}

	HandleGravity( controlObject ){

		// const currentY = controlObject.position.y;

		return this._raycaster
				.intersectObjects( this._scene.children )
				.find(intersected => {
					return intersected.object.name === "landscape" || intersected.object.name.includes("ground")
				})?.point.y || controlObject.position.y;
		

		// finalement pas besoin de faire tout ça, j'ai juste replacé le raycaster juste au dessus de la tete de bob
		// mais sait-on jamais, je laisse ça là

		
		// if( newY ){

		// 	const diff = Math.abs(currentY - newY);
	
		// 	if( diff > 0.01 ){
		// 		// écart trop grand : on garde le courant
		// 		return currentY;
		// 	} else {
		// 		return newY;
		// 	}

		// } else {

		// 	return currentY;

		// }


	}

	UpdateDynamicLightShadowCamera( lightsToUpdateShadowCamera, currentSequenceID ){

		// console.log("- - - au update de la shadow on recois : ", lightsToUpdateShadowCamera)

		const lightToUpdate = lightsToUpdateShadowCamera.find(light => light.name.includes("for-bob-shadow") && light.name.includes(currentSequenceID));
		
		if( lightToUpdate ){
			
			lightToUpdate.target.position.copy(this._position);
			// lightToUpdate.needsUpdate = true;

			if( core.debug.lightsHelpers.light || core.debug.lightsHelpers.shadow ){

				this._params.scene?.children
					.filter(child =>  child.name.toLowerCase().includes("light") && child.name.toLowerCase().includes("helper"))
						?.forEach(helper => {
						// console.log("helpers : ", helper.name)
						helper.update();
					});	

			}

		}

	}

};

class BasicCharacterControllerInput {
	constructor(vm) {
		this._imposedMoves = {};  
		this._Init(); 

		// vm.$nuxt.$on("bob-inputs-update", this._UpdateBobStickedInputs);
	}

	_UpdateBobStickedInputs( newInputs ){
		console.log("dans le basicInputPerso : ", newInputs);
		this._keys = newInputs;
	}

	_Init() {
		
		this._keys = {
			forward: false || this._imposedMoves.forward,
			backward: false || this._imposedMoves.backward,
			left: false || this._imposedMoves.left,
			right: false || this._imposedMoves.right,
			space: false || this._imposedMoves.space,
			shift: false || this._imposedMoves.shift,
			fly: false || this._imposedMoves.fly,
			floating: false || this._imposedMoves.floating,
			jazz: false || this._imposedMoves.jazz,
			hiphop: false || this._imposedMoves.hiphop,
			climb: false || this._imposedMoves.climb,
		};

		document.addEventListener('keydown', ( event ) => this._onKeyDown( event ), false);
		document.addEventListener('keyup', ( event ) => this._onKeyUp( event ), false);

	}

	_onKeyDown(event) {

		switch (event.keyCode) {
			case 90: // z
				this._keys.forward = this._imposedMoves.hasOwnProperty("forward") ? this._imposedMoves.forward : true;
				break;
			case 81: // q
				this._keys.left = this._imposedMoves.hasOwnProperty("left") ? this._imposedMoves.left : true;
				break;
			case 83: // s
				this._keys.backward = this._imposedMoves.hasOwnProperty("backward") ? this._imposedMoves.backward : true;
				break;
			case 68: // d
				this._keys.right = this._imposedMoves.hasOwnProperty("right") ? this._imposedMoves.right : true;
				break;
			case 32: // SPACE
				this._keys.space = this._imposedMoves.hasOwnProperty("space") ? this._imposedMoves.space : true;
				break;
			case 16: // SHIFT
				this._keys.shift = this._imposedMoves.hasOwnProperty("shift") ? this._imposedMoves.shift : true;
			break;
		}

	}

	_onKeyUp(event) {

		switch(event.keyCode) {
			case 90: // z
				this._keys.forward = false || this._imposedMoves.forward;
				break;
			case 81: // q
				this._keys.left = false || this._imposedMoves.left;
				break;
			case 83: // s
				this._keys.backward = false || this._imposedMoves.backward;
				break;
			case 68: // d
				this._keys.right = false || this._imposedMoves.right;
				break;
			case 32: // SPACE
				this._keys.space = false || this._imposedMoves.space;
				break;
			case 16: // SHIFT
				this._keys.shift = false || this._imposedMoves.shift;
			break;
		}
	}

};

class FiniteStateMachine {
	constructor() {
		this._states = {};
		this._currentState = null;
	}

	_AddState(name, type) {
		this._states[name] = type;
	}

	SetState(name) {
		const prevState = this._currentState;
		
		if (prevState) {
			if (prevState.Name == name) {
				return;
			}
			prevState.Exit();
		}

		const state = new this._states[name](this);

		this._currentState = state;
		state.Enter(prevState);
	}

	Update(timeElapsed, input) {
		if (this._currentState) {
			this._currentState.Update(timeElapsed, input);
		}
	}
};

class CharacterFSM extends FiniteStateMachine {
	constructor(proxy) {
		super();
		this._proxy = proxy;
		this._Init();
	}

	_Init() {
		this._AddState('idle', IdleState);
		this._AddState('walk', WalkState);
		this._AddState('walk-back', WalkStateBack);
		this._AddState('run', RunState);
		this._AddState('dance', DanceState);
		this._AddState('fly', FlyState);

		this._AddState('floating', FloatingState);
		this._AddState('jazz', JazzState);
		this._AddState('hiphop', HiphopState);
		this._AddState('climb', ClimbState);
	}
};


class CharacterController {

	constructor(params) {

		this._controls = new BasicCharacterController(params);

	}

}

export { CharacterController };
