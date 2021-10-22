import { TimelineMax } from 'gsap';

class SpecificManualCameraTweenBuilder{

	constructor(params){

		this._currentPlaces = params.currentPlaces;
		this._currentCamera = params.currentCamera;
		this._currentStep = params.currentStep;

		return this._Inits();

	}

	_Inits(){

		const currentPlace = this._currentPlaces.find(place => place.id === this._currentStep.global.placeString);
		const tl = new TimelineMax();

		// TODO : refaire le system de target (avec des Vector3 (/dynamiques))
		// pour éviter de passer par de fastidieux rotation{} (qui on été cleané du core.js de toute façons^^)

		// POSITION
		if( currentPlace.position ){

			const animatedObject = {};

			animatedObject.position = this._currentCamera.position;
			animatedObject.position = this._currentCamera.position;

			tl.to(
				animatedObject.position, 
				{
					duration: currentPlace.position.duration * (this._currentStep.global.duration / 100), 
					x : currentPlace.position.x,
					y : currentPlace.position.y,
					z : currentPlace.position.z,
					ease: currentPlace.position.ease,

					onUpdate: (that) => {

						// and at update we update the real camera position
						that._currentCamera.position.set(
							animatedObject.position.x,
							animatedObject.position.y,
							animatedObject.position.z
						);

					},
					onUpdateParams: [this],
					onComplete: () => {

						console.log("onComplete du tween de position");

					}
				}, 
				currentPlace.position.startRef * (this._currentStep.global.duration / 100)
			);

		}

		// FOV : 
		if( currentPlace.fov && this.oldFov ){

			const animatedObject = {};

			// _currentCamera.updateProjectionMatrix();

			animatedObject.fov = this.oldFov;

			tl.to(
				animatedObject, 
				{
					duration: currentPlace.fov.duration * (this._currentStep.global.duration / 100), 
					fov : currentPlace.fov.value,
					ease: currentPlace.fov.ease,

					onUpdate: (that, currentFov) => {

						// console.log("onUpdate : currentFov : ", currentFov);

						that.oldFov = currentFov;

						that._currentCamera.fov = currentFov;

						that._currentCamera.updateProjectionMatrix();

					},
					onUpdateParams: [this, animatedObject.fov]
				},
				currentPlace.fov.startRef * (this._currentStep.global.duration / 100)
			);

		}

		return tl;

	}

}

export { SpecificManualCameraTweenBuilder };
