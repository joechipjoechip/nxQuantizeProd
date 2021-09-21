import * as THREE from 'three';

export default class ThirdPersonCamera {

	constructor( params ){

		this._params = params;
		this._camera = params.camera;

		this._currentPosition = new THREE.Vector3();
		this._currentLookAt = new THREE.Vector3();

	}

	_CalculateIdealOffset(){

		const idealOffset = new THREE.Vector3(0, -0.01, -0.01);
		
		idealOffset.applyQuaternion(this._params.target.quaternion);
		idealOffset.add(this._params.target.position);

		return idealOffset;
	}

	_CalculateIdealLookAt(){

		const idealLookAt = new THREE.Vector3(0, 0.15, 0.5);

		idealLookAt.applyQuaternion(this._params.target.quaternion);
		idealLookAt.add(this._params.target.position);

		return idealLookAt;
	}

	Update( elapsedTime ){

		const idealOffset = this._CalculateIdealOffset();
		const idealLookAt = this._CalculateIdealLookAt();

		this._currentPosition.copy(idealOffset);
		this._currentLookAt.copy(idealLookAt);

		this._camera.position.copy(this._currentPosition);
		this._camera.lookAt(this._currentLookAt);

	}

}