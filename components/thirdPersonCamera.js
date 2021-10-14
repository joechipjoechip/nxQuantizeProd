import * as THREE from 'three';

function _LerpOverFrames(frames, t) {
	const s = new THREE.Vector3(0, 0, 0);
	const e = new THREE.Vector3(100, 0, 0);
	const c = s.clone();
  
	for (let i = 0; i < frames; i++) {
	  c.lerp(e, t);
	}
	return c;
  }
  
  function _TestLerp(t1, t2) {
	const v1 = _LerpOverFrames(100, t1);
	const v2 = _LerpOverFrames(50, t2);
	// console.log(v1.x + ' | ' + v2.x);
  }
  
  _TestLerp(0.01, 0.01);
  _TestLerp(1.0 / 100.0, 1.0 / 50.0);
  _TestLerp(1.0 - Math.pow(0.3, 1.0 / 100.0), 
			1.0 - Math.pow(0.3, 1.0 / 50.0));

class ThirdPersonCamera {
	constructor(params) {
	  this._params = params;
	  this._camera = params.camera;
  
	  this._currentPosition = new THREE.Vector3();
	  this._currentLookat = new THREE.Vector3();
	}
  
	_CalculateIdealOffset() {

	  // console.log("dans le calulculateIdealOffset : le this._params : ", this._params.target.rotation);

	  const idealOffset = new THREE.Vector3(-1.5, 2, -3);
	  idealOffset.applyQuaternion(this._params.target.Rotation);
	  idealOffset.add(this._params.target.Position);
	  return idealOffset;
	}
  
	_CalculateIdealLookat() {
	  const idealLookat = new THREE.Vector3(0, 1, 5);
	  idealLookat.applyQuaternion(this._params.target.Rotation);
	  idealLookat.add(this._params.target.Position);
	  return idealLookat;
	}
  
	Update(timeElapsed) {
	  const idealOffset = this._CalculateIdealOffset();
	  const idealLookat = this._CalculateIdealLookat();
  
	  // const t = 0.05;
	  // const t = 4.0 * timeElapsed;
	  const t = 1.0 - Math.pow(0.001, timeElapsed);
  
	  this._currentPosition.lerp(idealOffset, t);
	  this._currentLookat.lerp(idealLookat, t);

  
	  this._camera.position.copy(this._currentPosition);
	  this._camera.lookAt(this._currentLookat);
	}
	
}

export { ThirdPersonCamera };
