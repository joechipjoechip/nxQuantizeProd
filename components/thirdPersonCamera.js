import { core } from '@/static/config/core.js';

import * as THREE from 'three';

class ThirdPersonCamera {

	constructor(params) {

	  this._params = params;
	  this._camera = params.camera;
    this._specs = core.generatedCamerasSpecs[params.cameraType]
  
	  this._currentPosition = new THREE.Vector3();
    // console.log("dans la class third person : this._camera.position : ", this._camera.position);
	  this._currentPosition.copy(this._camera.position);
	  this._currentLookat = new THREE.Vector3();

	}
  
	_CalculateIdealOffset( timeElapsed ){

    let idealOffset;

    if( this._specs.motion ){

      idealOffset = new THREE.Vector3(
        this._specs.offset.x + (Math.sin(timeElapsed * this._specs.motion.x.velocity) * this._specs.motion.x.range),
        this._specs.offset.y + (Math.sin(timeElapsed * this._specs.motion.y.velocity) * this._specs.motion.y.range),
        this._specs.offset.z + (Math.abs((Math.sin(timeElapsed * this._specs.motion.z.velocity)) * -1) * this._specs.motion.z.range)
      );

    } else {

      idealOffset = new THREE.Vector3(
        this._specs.offset.x,
        this._specs.offset.y,
        this._specs.offset.z
      );

    }

	  idealOffset.applyQuaternion(this._params.target.Rotation);
	  idealOffset.add(this._params.target.Position);
	  return idealOffset;
	}
  
	_CalculateIdealLookat( mousePos ){

    const mouseVector = new THREE.Vector3(
      mousePos.x * this._specs.orientationPonderation.x * -1, 
      mousePos.y * this._specs.orientationPonderation.y,
      0
    );
    let idealLookat;

    if( this._specs.motion ){

      idealLookat = new THREE.Vector3(0,0.05,0);

    } else {

      idealLookat = new THREE.Vector3(
        this._specs.lookAt.x,  
        this._specs.lookAt.y,
        this._specs.lookAt.z
      );

    }

	  mouseVector.applyQuaternion(this._params.target.Rotation);
	  idealLookat.applyQuaternion(this._params.target.Rotation);

	  idealLookat.add(this._params.target.Position);
	  idealLookat.add(mouseVector);

	  return idealLookat;
	}
  
	Update( timeElapsed, mousePos ){

	  const idealOffset = this._CalculateIdealOffset(timeElapsed);
	  const idealLookat = this._CalculateIdealLookat(mousePos);
  
	  // t = facteur de latence du positionnement de la camera : 
    // où 1 = straight
	  // const t = 0.02;
	  // const t = 4.0 * timeElapsed;
    // best implementation :
	  const t = (1.0 - Math.pow(0.1, timeElapsed)) * this._specs.straightness;
  
	  this._currentPosition.lerp(idealOffset, t);
	  this._currentLookat.lerp(idealLookat, t);

  
	  this._camera.position.copy(this._currentPosition);
	  this._camera.lookAt(this._currentLookat);

	}
	
}

export { ThirdPersonCamera };
