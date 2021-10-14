import * as THREE from 'three';

class ThirdPersonCamera {
	constructor(params) {
	  this._params = params;
	  this._camera = params.camera;
  
	  this._currentPosition = new THREE.Vector3();
	  this._currentLookat = new THREE.Vector3();
	}
  
	_CalculateIdealOffset() {
	  const idealOffset = new THREE.Vector3(
		  this._params.specs.offset.x,
		  this._params.specs.offset.y,
		  this._params.specs.offset.z
		);
	  idealOffset.applyQuaternion(this._params.target.Rotation);
	  idealOffset.add(this._params.target.Position);
	  return idealOffset;
	}
  
	_CalculateIdealLookat() {
	  const idealLookat = new THREE.Vector3(
      this._params.specs.lookAt.x,
      this._params.specs.lookAt.y,
      this._params.specs.lookAt.z
		);
	  idealLookat.applyQuaternion(this._params.target.Rotation);
	  idealLookat.add(this._params.target.Position);
	  return idealLookat;
	}
  
	Update(timeElapsed) {
	  const idealOffset = this._CalculateIdealOffset();
	  const idealLookat = this._CalculateIdealLookat();
  
    // t = facteur de latence du positionnement de la camera : 
    // où 1 = straight
	  const t = 0.02;
	  // const t = 4.0 * timeElapsed;
	  // const t = 1.0 - Math.pow(0.1, timeElapsed);
  
	  this._currentPosition.lerp(idealOffset, t);
	  this._currentLookat.lerp(idealLookat, t);

  
	  this._camera.position.copy(this._currentPosition);
	  this._camera.lookAt(this._currentLookat);
	}
	
}

export { ThirdPersonCamera };
