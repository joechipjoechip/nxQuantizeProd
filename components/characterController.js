import * as THREE from 'three';

import { core } from '@/static/config/core.js';

import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';

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
		this._decceleration = new THREE.Vector3(-0.0005, -0.0001, -5.0);
		this._acceleration = new THREE.Vector3(
			this._params.bobInfos.velocity.x,
			this._params.bobInfos.velocity.y,
			this._params.bobInfos.velocity.z
		);
		this._velocity = new THREE.Vector3(0, 0, 0);
		this._position = new THREE.Vector3();

		this._animations = {};
		this._input = new BasicCharacterControllerInput();
		this._stateMachine = new CharacterFSM(
			new BasicCharacterControllerProxy(this._animations)
		);
		this._raycaster = new THREE.Raycaster();
		this._moveScaledRatio = this._params.bobInfos.scale * 100 * 2;

		this._LoadModels();
	}

	_LoadModels() {

		const loader = new FBXLoader();

		loader.setPath(`.${this._params.file.path}/`);

		loader.load(this._params.file.name, (fbx) => {

			fbx.scale.setScalar(this._params.bobInfos.scale);

			fbx.traverse(c => {
				// console.log("c : ", c);
				if( c.type !== "Bone" ){
					c.castShadow = true;
					c.receiveShadow = true;
				}

			});

			this._target = fbx;
			this._target.name = "bob";
			this._params.scene.add(this._target);

			this._target.position.copy(this._params.bobInfos.start.position);
			this._target.rotation.copy(this._params.bobInfos.start.rotation);

			this._mixer = new THREE.AnimationMixer(this._target);

			this._manager = new THREE.LoadingManager();
			this._manager.onLoad = () => {
				this._stateMachine.SetState('idle');
				this._sceneBuilderThis.onceBobIsLoaded();
			};

			const _OnLoad = (animName, anim) => {
				const clip = anim.animations[0];
				const action = this._mixer.clipAction(clip);

				this._animations[animName] = {
					clip: clip,
					action: action,
				};
			};

			const loader = new FBXLoader(this._manager);
			loader.setPath(`.${this._params.file.path}/`);
			loader.load('walk.fbx', (a) => { _OnLoad('walk', a); });
			loader.load('run.fbx', (a) => { _OnLoad('run', a); });
			loader.load('idle.fbx', (a) => { _OnLoad('idle', a); });
			loader.load('dance.fbx', (a) => { _OnLoad('dance', a); });

		});

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

	Update(timeInSeconds, mousePos) {
		if (!this._target) {
			return;
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

		if (this._input._keys.shift) {
			acc.multiplyScalar(3.0);
		}

		if (this._stateMachine._currentState?.Name == 'dance') {
			acc.multiplyScalar(0.0);
		}

		if (this._input._keys.forward) {
			velocity.z += acc.z * timeInSeconds;
		}

		if (this._input._keys.backward) {
			velocity.z -= acc.z * timeInSeconds;
		}

		// if (this._input._keys.left) {
		// 	_A.set(0, 1, 0);
		// 	_Q.setFromAxisAngle(_A, 4.0 * Math.PI * timeInSeconds * this._acceleration.y);
		// 	_R.multiply(_Q);
		// }

		// if (this._input._keys.right) {
		// 	_A.set(0, 1, 0);
		// 	_Q.setFromAxisAngle(_A, 4.0 * -Math.PI * timeInSeconds * this._acceleration.y);
		// 	_R.multiply(_Q);
		// }
		if( mousePos.x === 0 ){
			console.log("mouse centered");
		} else {

			if( mousePos.x < 0 ){
				const rotateLeft = THREE.MathUtils.clamp(
					4.0 * Math.PI * timeInSeconds * (this._acceleration.y * Math.abs(mousePos.x / core.mouse.orientationClamp.divideRatio)),
					core.mouse.orientationClamp.start,
					core.mouse.orientationClamp.end
				);
				_A.set(0, 1, 0);
				_Q.setFromAxisAngle(_A, rotateLeft);
				_R.multiply(_Q);
	
				// console.log("turning left : ", rotateLeft);
			} else if( mousePos.x > 0 ){
				const rotateRight = THREE.MathUtils.clamp(
					4.0 * -Math.PI * timeInSeconds * (this._acceleration.y * Math.abs(mousePos.x / core.mouse.orientationClamp.divideRatio)),
					core.mouse.orientationClamp.end * -1,
					core.mouse.orientationClamp.start * -1
				);
				_A.set(0, 1, 0);
				_Q.setFromAxisAngle(_A, rotateRight);
				_R.multiply(_Q);
	
				// console.log("turning right : ", rotateRight);
			}

		}

		controlObject.quaternion.copy(_R);

		const oldPosition = new THREE.Vector3();
		oldPosition.copy(controlObject.position);

		const forward = new THREE.Vector3(0, 0, 1);
		forward.applyQuaternion(controlObject.quaternion);
		forward.normalize();

		const sideways = new THREE.Vector3(1, 0, 0);
		sideways.applyQuaternion(controlObject.quaternion);
		sideways.normalize();

		sideways.multiplyScalar(velocity.x * timeInSeconds);
		forward.multiplyScalar((velocity.z * timeInSeconds) * (this._moveScaledRatio));

		controlObject.position.add(forward);
		controlObject.position.add(sideways);

		this._raycaster.set(
			new THREE.Vector3(
				controlObject.position.x, 
				controlObject.position.y + 1, 
				controlObject.position.z, 
			),
			new THREE.Vector3(0,-1,0)
		);

		controlObject.position.y = this._raycaster
		.intersectObjects( this._params.scene.children )
		.find(intersected => intersected.object.name === "landscape")?.point.y || controlObject.position.y;

		this._position.copy(controlObject.position);

		if (this._mixer) {
			this._mixer.update(timeInSeconds);
		}
	}

	UpdateDynamicLightShadowCamera( lightsToUpdateShadowCamera ){

		// console.log("(vide pour linstant) hey le UpdateDynamicLightShadowCamera, this._position.x : ", lightsToUpdateShadowCamera);

		lightsToUpdateShadowCamera.forEach(lightToUpdate => {

			// lightToUpdate.shadow.camera.target = new THREE.Object3D({ 
			//   name: "craftedTarget", 
			//   position: this._position 
			// });
			
			// console.log("look at this : ", this._position);
			
			lightToUpdate.shadow.camera.lookAt(this._position);
			
		})


	}


};

class BasicCharacterControllerInput {
	constructor() {
		this._imposedMoves = {};  
		this._Init();  
	}

	_Init() {
		
		this._keys = {
			forward: false || this._imposedMoves.forward,
			backward: false || this._imposedMoves.backward,
			left: false || this._imposedMoves.left,
			right: false || this._imposedMoves.right,
			space: false || this._imposedMoves.space,
			shift: false || this._imposedMoves.shift,
		};

		document.addEventListener('keydown', ( event ) => this._onKeyDown( event ), false);
		document.addEventListener('keyup', ( event ) => this._onKeyUp( event ), false);

	}

	_onKeyDown(event) {

		switch (event.keyCode) {
			case 90: // z
				this._keys.forward = true;
				break;
			case 81: // q
				this._keys.left = true;
				break;
			case 83: // s
				this._keys.backward = true;
				break;
			case 68: // d
				this._keys.right = true;
				break;
			case 32: // SPACE
				this._keys.space = true;
				break;
			case 16: // SHIFT
				this._keys.shift = true;
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
		this._AddState('run', RunState);
		this._AddState('dance', DanceState);
	}
};


class State {
	constructor(parent) {
		this._parent = parent;
	}

	Enter() {}
	Exit() {}
	Update() {}
};


class DanceState extends State {
	constructor(parent) {
		super(parent);

		this._FinishedCallback = () => {
		this._Finished();
		}
	}

	get Name() {
		return 'dance';
	}

	Enter(prevState) {
		const curAction = this._parent._proxy._animations['dance'].action;
		const mixer = curAction.getMixer();
		mixer.addEventListener('finished', this._FinishedCallback);

		if (prevState) {
		const prevAction = this._parent._proxy._animations[prevState.Name].action;

		curAction.reset();  
		curAction.setLoop(THREE.LoopOnce, 1);
		curAction.clampWhenFinished = true;
		curAction.crossFadeFrom(prevAction, 0.2, true);
		curAction.play();
		} else {
		curAction.play();
		}
	}

	_Finished() {
		this._Cleanup();
		this._parent.SetState('idle');
	}

	_Cleanup() {
		const action = this._parent._proxy._animations['dance'].action;
		
		action.getMixer().removeEventListener('finished', this._CleanupCallback);
	}

	Exit() {
		this._Cleanup();
	}

	Update(_) {
	}
};


class WalkState extends State {
	constructor(parent) {
		super(parent);
	}

	get Name() {
		return 'walk';
	}

	Enter(prevState) {
		const curAction = this._parent._proxy._animations['walk'].action;
		if (prevState) {
			const prevAction = this._parent._proxy._animations[prevState.Name].action;

			curAction.enabled = true;

			if (prevState.Name == 'run') {
				const ratio = curAction.getClip().duration / prevAction.getClip().duration;
				curAction.time = prevAction.time * ratio;
			} else {
				curAction.time = 0.0;
				curAction.setEffectiveTimeScale(1.0);
				curAction.setEffectiveWeight(1.0);
			}

			curAction.crossFadeFrom(prevAction, 0.5, true);
			curAction.play();
		} else {
			curAction.play();
		}
	}

	Exit() {
	}

	Update(timeElapsed, input) {

		if (input._keys.forward || input._keys.backward) {

			if (input._keys.shift) {
				this._parent.SetState('run');
			}
			
			return;
		}

		this._parent.SetState('idle');
	}
};


class RunState extends State {
	constructor(parent) {
		super(parent);
	}

	get Name() {
		return 'run';
	}

	Enter(prevState) {
		const curAction = this._parent._proxy._animations['run'].action;

		if (prevState) {
			const prevAction = this._parent._proxy._animations[prevState.Name].action;

			curAction.enabled = true;

			if (prevState.Name == 'walk') {
				const ratio = curAction.getClip().duration / prevAction.getClip().duration;
				curAction.time = prevAction.time * ratio;
			} else {
				curAction.time = 0.0;
				curAction.setEffectiveTimeScale(1.0);
				curAction.setEffectiveWeight(1.0);
			}

			curAction.crossFadeFrom(prevAction, 0.5, true);
			curAction.play();
		} else {
			curAction.play();
		}

	}

	Exit() {
	}

	Update(timeElapsed, input) {
		if (input._keys.forward || input._keys.backward) {
			if (!input._keys.shift) {
				this._parent.SetState('walk');
			}
			return;
		}

		this._parent.SetState('idle');
	}
};


class IdleState extends State {
	constructor(parent) {
		super(parent);
	}

	get Name() {
		return 'idle';
	}

	Enter(prevState) {
		const idleAction = this._parent._proxy._animations['idle'].action;
		if (prevState) {
		const prevAction = this._parent._proxy._animations[prevState.Name].action;
		idleAction.time = 0.0;
		idleAction.enabled = true;
		idleAction.setEffectiveTimeScale(1.0);
		idleAction.setEffectiveWeight(1.0);
		idleAction.crossFadeFrom(prevAction, 0.5, true);
		idleAction.play();
		} else {
		idleAction.play();
		}
	}

	Exit() {
	}

	Update(_, input) {
		if (input._keys.forward || input._keys.backward) {
		this._parent.SetState('walk');
		} else if (input._keys.space) {
		this._parent.SetState('dance');
		}
	}
};

class CharacterController {

	constructor(params) {

		this._controls = new BasicCharacterController(params);

	}

}

export { CharacterController };
