import * as THREE from 'three';

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

class FloatingState extends State {
	constructor(parent) {
		super(parent);
	}

	get Name() {
		return 'floating';
	}

	Enter(prevState) {
		const curAction = this._parent._proxy._animations['floating'].action;
		if (prevState) {
			const prevAction = this._parent._proxy._animations[prevState.Name].action;

			curAction.enabled = true;

			curAction.time = 0.0;
			curAction.setEffectiveTimeScale(1.0);
			curAction.setEffectiveWeight(1.0);

			curAction.crossFadeFrom(prevAction, 0.5, true);
			curAction.play();
		} else {
			curAction.play();
		}
	}

	Exit() {
	}

	Update(timeElapsed, input) {

		if (input._keys.floating) {
			this._parent.SetState('floating');
			return;
		}

		this._parent.SetState('idle');
	}
};

class JazzState extends State {
	constructor(parent) {
		super(parent);
	}

	get Name() {
		return 'jazz';
	}

	Enter(prevState) {
		const curAction = this._parent._proxy._animations['jazz'].action;
		if (prevState) {
			const prevAction = this._parent._proxy._animations[prevState.Name].action;

			curAction.enabled = true;

			curAction.time = 0.0;
			curAction.setEffectiveTimeScale(1.0);
			curAction.setEffectiveWeight(1.0);

			curAction.crossFadeFrom(prevAction, 0.5, true);
			curAction.play();
		} else {
			curAction.play();
		}
	}

	Exit() {
	}

	Update(timeElapsed, input) {

		if (input._keys.jazz) {
			this._parent.SetState('jazz');
			return;
		}

		this._parent.SetState('idle');
	}
};

class HiphopState extends State {
	constructor(parent) {
		super(parent);
	}

	get Name() {
		return 'hiphop';
	}

	Enter(prevState) {
		const curAction = this._parent._proxy._animations['hiphop'].action;
		if (prevState) {
			const prevAction = this._parent._proxy._animations[prevState.Name].action;

			curAction.enabled = true;

			curAction.time = 0.0;
			curAction.setEffectiveTimeScale(1.0);
			curAction.setEffectiveWeight(1.0);

			curAction.crossFadeFrom(prevAction, 0.005, true);
			curAction.play();
		} else {
		}
		curAction.play();
	}

	Exit() {
	}

	Update(timeElapsed, input) {

		if (input._keys.hiphop) {
			this._parent.SetState('hiphop');
			return;
		}

		this._parent.SetState('idle');
	}
};

class HousedanceState extends State {
	constructor(parent) {
		super(parent);
	}

	get Name() {
		return 'housedance';
	}

	Enter(prevState) {
		const curAction = this._parent._proxy._animations['housedance'].action;
		if (prevState) {
			const prevAction = this._parent._proxy._animations[prevState.Name].action;

			curAction.enabled = true;

			curAction.time = 0.0;
			curAction.setEffectiveTimeScale(1.0);
			curAction.setEffectiveWeight(1.0);

			curAction.crossFadeFrom(prevAction, 0.5, true);
			curAction.play();
		} else {
			curAction.play();
		}
	}

	Exit() {
	}

	Update(timeElapsed, input) {

		if (input._keys.housedance) {
			this._parent.SetState('housedance');
			return;
		}

		this._parent.SetState('idle');
	}
};

class TeeterState extends State {
	constructor(parent) {
		super(parent);
	}

	get Name() {
		return 'teeter';
	}

	Enter(prevState) {
		const curAction = this._parent._proxy._animations['teeter'].action;
		curAction.play();
	}

	Exit() {
	}

	Update(timeElapsed, input) {

		if (input._keys.teeter) {
			this._parent.SetState('teeter');
			return;
		}

		this._parent.SetState('idle');
	}
};

class EnjoyState extends State {
	constructor(parent) {
		super(parent);
	}

	get Name() {
		return 'enjoy';
	}

	Enter(prevState) {
		const curAction = this._parent._proxy._animations['enjoy'].action;
		if (prevState) {
			const prevAction = this._parent._proxy._animations[prevState.Name].action;

			curAction.enabled = true;

			curAction.time = 0.0;
			curAction.setEffectiveTimeScale(1.0);
			curAction.setEffectiveWeight(1.0);

			curAction.crossFadeFrom(prevAction, 0.5, true);
			curAction.play();
		} else {
			curAction.play();
		}
	}

	Exit() {
	}

	Update(timeElapsed, input) {

		if (input._keys.enjoy) {
			this._parent.SetState('enjoy');
			return;
		}

		this._parent.SetState('idle');
	}
};

class ClimbState extends State {
	constructor(parent) {
		super(parent);
	}

	get Name() {
		return 'climb';
	}

	Enter(prevState) {
		const curAction = this._parent._proxy._animations['climb'].action;
		if (prevState) {
			const prevAction = this._parent._proxy._animations[prevState.Name].action;

			curAction.enabled = true;

			curAction.time = 0.0;
			curAction.setEffectiveTimeScale(1.0);
			curAction.setEffectiveWeight(1.0);

			curAction.crossFadeFrom(prevAction, 0.5, true);
			curAction.play();
		} else {
			curAction.play();
		}
	}

	Exit() {
	}

	Update(timeElapsed, input) {

		if (input._keys.climb) {
			this._parent.SetState('climb');
			return;
		}

		this._parent.SetState('idle');
	}
};


class FlyState extends State {
	constructor(parent) {
		super(parent);
	}

	get Name() {
		return 'fly';
	}

	Enter(prevState) {
		const curAction = this._parent._proxy._animations['fly'].action;
		curAction.play();
	}

	Exit() {
	}

	Update(timeElapsed, input) {

		if (input._keys.fly) {
			this._parent.SetState('fly');
			return;
		}

		this._parent.SetState('idle');
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

		if (input._keys.forward) {

			if (input._keys.shift) {
				this._parent.SetState('run');
			}
			
			return;
		}

		this._parent.SetState('idle');
	}
};

class WalkStateBack extends State {
	constructor(parent) {
		super(parent);
	}

	get Name() {
		return 'walk-back';
	}

	Enter(prevState) {
		const curAction = this._parent._proxy._animations['walk-back'].action;
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

		if (input._keys.backward) {
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
		if (input._keys.forward) {
			if (!input._keys.shift) {
				this._parent.SetState('walk');
			}
			return;
		} else if( input._keys.backward && input._keys.shift ) {
			this._parent.SetState('walk-back');
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
		if (input._keys.forward) {
			this._parent.SetState('walk');
		} else if( input._keys.backward ) {
			this._parent.SetState('walk-back');
		} else if (input._keys.space) {
			this._parent.SetState('dance');
		} else if( input._keys.fly){
			this._parent.SetState('fly');
		} else if( input._keys.floating){
			this._parent.SetState('floating');
		} else if( input._keys.jazz){
			this._parent.SetState('jazz');
		} else if( input._keys.housedance){
			this._parent.SetState('housedance');
		} else if( input._keys.hiphop){
			this._parent.SetState('hiphop');
		} else if( input._keys.climb){
			this._parent.SetState('climb');
		} else if( input._keys.enjoy){
			this._parent.SetState('enjoy');
		} else if( input._keys.teeter){
			this._parent.SetState('teeter');
		}
	}
};


export {
	State,
	DanceState,
	FlyState,
	WalkState,
	WalkStateBack,
	RunState,
	IdleState,

	FloatingState,
	JazzState,
	HiphopState,
	HousedanceState,
	ClimbState,
	EnjoyState,
	TeeterState
};