import * as dat from 'dat.gui';
import * as THREE from 'three';

class GuiManager {

	constructor(params){

		this._mainConfig = params.core;
		this._debug = params.debug;
		this._elementsAtInit = params.elementsAtInit;
		this._orbit = params.orbit;

		this._scene = params.scene;

		this._Inits();

	}

	_Inits(){

		this.gui = new dat.GUI({
			closed: true,
			width: 250
		});

		// ANIMATION
		this.gui
			.add(this._debug, "animated")
			.name("run animation");

		// FOG
		if( this._mainConfig.fog.enabled ){

			this.gui
				.add(this._mainConfig.fog, "intensity")
				.min(0)
				.max(2)
				.step(0.1)
				.name("scene fog")
				.onChange(() => {

					this._scene.fog = new THREE.FogExp2(
							this._mainConfig.fog.color, 
							this._mainConfig.fog.intensity
					);

			});

			this.gui
				.addColor(this._mainConfig.fog, "color")
				.name("fog color")
				.onChange(() => {

					this._scene.fog = new THREE.FogExp2(
							this._mainConfig.fog.color, 
							this._mainConfig.fog.intensity
					);

			});
			
		}

		// ELEMENTS
		if( this._mainConfig.guiConfig ){

			Object.keys(this._elementsAtInit).forEach(key => {

				const currentGuiFolder = this.gui.addFolder(key);

				this._mainConfig.guiConfig.elements[key] = {};

				// position / rotation

				Object.keys(this._mainConfig.guiConfig.actions).forEach(actionKey => {

					const currentGuiSubFolder = currentGuiFolder.addFolder(actionKey);

					this._mainConfig.guiConfig.elements[key][actionKey] = { x: 0, y: 0, z: 0 };

					Object.keys(this._mainConfig.guiConfig.elements[key][actionKey]).forEach(subKey => {

						currentGuiSubFolder
							.add(this._mainConfig.guiConfig.elements[key][actionKey], subKey)
							.name(`-> ${subKey}`)
							.min(this._mainConfig.guiConfig.actions[actionKey].min)
							.max(this._mainConfig.guiConfig.actions[actionKey].max)
							.step(this._mainConfig.guiConfig.actions[actionKey].step)
							.onChange(() => {

								console.log("onChange : ", this._elementsAtInit[key]);
								// this._elementsAtInit[key][actionKey].set(this._mainConfig.guiConfig.elements[key][actionKey]);
								this._elementsAtInit[key][actionKey][subKey] = this._mainConfig.guiConfig.elements[key][actionKey][subKey];

							});

					});

				});

			});



			// FUNCTIONS :

			// reveal infos camera :
			this._mainConfig.guiConfig.camera = {};

			// position
			this._mainConfig.guiConfig.camera.revealPosition = () => {

				const realCamera = this._scene.children.find(child => child instanceof THREE.PerspectiveCamera );

				console.log(realCamera);

			};
			this.gui.add(this._mainConfig.guiConfig.camera, "revealPosition").name("revealPosition()");

			// fov
			this._mainConfig.guiConfig.camera.revealFov = () => {

				const realCamera = this._scene.children.find(child => child instanceof THREE.PerspectiveCamera );

				console.log(realCamera.fov);

			};
			this.gui.add(this._mainConfig.guiConfig.camera, "revealFov").name("revealFov()");


			// play intro
			this._mainConfig.guiConfig.playIntro = () => {

				// seq 1.0
				// this.timelines.camera = this.buildTubeTravellingTween();

				// seq 1.1
				// this.timelines.camera = this.buildGeneralManualCameraTween(this.currentSequence.paths.steps);

				// en gros : ça c'est le lancement de séquence :
				// this.timelines.camera.play();

			};
			this.gui.add(this._mainConfig.guiConfig, "playIntro").name("playIntro()");


			// enable/disable _orbit :
			this._mainConfig.guiConfig._orbitEnabler = () => {

				this._orbit.enabled = !this._orbit.enabled;

			};
			this.gui.add(this._mainConfig.guiConfig, "_orbitEnabler").name("_orbitEnabler()");

		}

	}
}

export { GuiManager };
