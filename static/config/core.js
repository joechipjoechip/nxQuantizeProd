const core = {

	debug: {
		lightsHelpers: {
			light: false,
			shadow: false
		}
	},

	mouse: {
		moveTimeout: 4,
		recenterDuration: 2
	},

	generatedCamerasSpecs: {
		// pos qui vont etre ajoutées à la position de la target (link)
		gtaLike: {
			offset: {
				x: 0,
				y: 0.1,
				z: -0.15
			},
			lookAt: {
				x: 0,
				y: 0.05,
				z: 0.6
			},
			straightness: 0.02,
			mouseOrientationPonderation: {
				x: 1.5,
				y: 1.5
			}
		},
		hips: {
			offset: {
				x: -0.015,
				y: 0.025,
				z: -0.07
			},
			lookAt: {
				x: 0,
				y: 0.025,
				z: 0.6
			},
			straightness: 0.015,
			mouseOrientationPonderation: {
				x: 0.1,
				y: 0.1
			}
		},
		movingHips: {
			offset: {
				x: 0,
				y: 0.025,
				z: -0.07
			},
			lookAt: {
				x: 0,
				y: 0.025,
				z: 0.6
			},
			straightness: 0.05,
			mouseOrientationPonderation: {
				x: 0.045,
				y: 0.045
			},
			motion: {
				// motion will move the camera continuously
				// with a sin() (so -1 to 1)
				// and it's related at the offset values
				x: {
					// ratios
					range: 0.01,
					velocity: 0.62
				},
				y: {
					range: 0.01,
					velocity: 0.65
				},
				z: {
					range: -0.2,
					velocity: 0.2
				},
			},
		},
		helmet: {
			offset: {
				x: 0,
				y: 0.03,
				z: 0.05
			},
			lookAt: {
				x: 0,
				y: 0.015,
				z: -0.6
			},
			straightness: 0.4,
			mouseOrientationPonderation: {
				x: -0.08,
				y: 0.08
			}
		}	
	},
	
	guiConfig: {
		elements: {},
		actions: {
			position: {
				step: 0.001,
				min: -5,
				max: 5
			},
			rotation: {
				step: 0.1,
				min: -5,
				max: 5
			},
			scale: {
				step: 0.000001,
				min: 0,
				max: 0.025
			}
		}
	}

}

export { core };