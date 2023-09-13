const core = {

	debug: {
		lightsHelpers: {
			light: false,
			shadow: false
		}
	},

	mouse: {
		moveTimeout: 1,
		recenterDuration: 1,
		orientationClamp: {
			start: 0.00001,
			end: 0.1,
			divideRatio: 50
		}
	},
	stick: {
		moveTimeout: 0,
		recenterDuration: 1,
		orientationClamp: {
			start: 0.00001,
			end: 0.1,
			divideRatio: 50
		},
		inputThreshold: 0.5
	},

	movesSpecs: {
		smallGuy: [
			"walk",
			"run",
			"idle",
			"fly",
			"floating",
			"hiphop",
			"enjoy",
			"teeter",
			"prayup"
		]
	},

	generatedCamerasSpecs: {
		// pos qui vont etre ajoutées à la position de la target (link)
		gtaLike: {
			offset: {
				x: 0,
				y: 0.033,
				z: -0.08
			},
			lookAt: {
				x: 0,
				y: 0.05,
				z: 1.45
			},
			straightness: 0.014,
			mouseOrientationPonderation: {
				x: 0.92,
				y: 0.92
			},
			motion: {
				// motion will move the camera continuously
				// with a sin() (so -1 to 1)
				// and it's related at the offset values
				x: {
					// ratios
					range: 0.03,
					velocity: 0.4
				},
				y: {
					range: 0,
					velocity: 0
				},
				z: {
					range: -0.05,
					velocity: 0.2
				},
			}
		},
		movingHips: {
			offset: {
				x: 0,
				y: 0.015,
				z: -0.035
			},
			lookAt: {
				x: 0,
				y: 0.017,
				z: 0.01
			},
			straightness: 0.015,
			mouseOrientationPonderation: {
				x: 0.015,
				y: 0.026
			},
			motion: {
				// motion will move the camera continuously
				// with a sin() (so -1 to 1)
				// and it's related at the offset values
				x: {
					// ratios
					range: 0.03,
					velocity: 0.4
				},
				y: {
					range: 0.01,
					velocity: 0.8
				},
				z: {
					range: -0.05,
					velocity: 0.2
				},
			},
		},
		"movingHips-link-edge": {
			offset: {
				x: 0.03,
				y: 0.01,
				z: -0.035
			},
			lookAt: {
				x: 0,
				y: 0.03,
				z: 0.01
			},
			straightness: 0.015,
			mouseOrientationPonderation: {
				x: 0.015,
				y: 0.026
			},
			motion: {
				// motion will move the camera continuously
				// with a sin() (so -1 to 1)
				// and it's related at the offset values
				x: {
					// ratios
					range: -0.05,
					velocity: 0.45
				},
				y: {
					range: 0.001,
					velocity: 0.4
				},
				z: {
					range: -0.055,
					velocity: 0.1
				},
			},
		},
		"movingHips-lookUp": {
			offset: {
				x: 0,
				y: 0.0001,
				z: -0.035
			},
			lookAt: {
				x: 0,
				y: 0.03,
				z: 0.01
			},
			straightness: 0.015,
			mouseOrientationPonderation: {
				x: 0.015,
				y: 0.026
			},
			motion: {
				// motion will move the camera continuously
				// with a sin() (so -1 to 1)
				// and it's related at the offset values
				x: {
					// ratios
					range: 0.03,
					velocity: 0.4
				},
				y: {
					range: 0.001,
					velocity: 0.4
				},
				z: {
					range: -0.05,
					velocity: 0.2
				},
			},
		},
		"movingHips-lookUp-choice": {
			offset: {
				x: 0.01,
				y: 0.0005,
				z: -0.045
			},
			lookAt: {
				x: 0,
				y: 0.03,
				z: 0.05
			},
			straightness: 0.035,
			mouseOrientationPonderation: {
				x: 0.035,
				y: 0.07
			},
			mouseOrientationLimits: {
				x: {
					min: -1,
					max: 1
				},
				y: {
					min: -0.1,
					max: 1
				},
			},
			motion: {
				// motion will move the camera continuously
				// with a sin() (so -1 to 1)
				// and it's related at the offset values
				x: {
					// ratios
					range: -0.02,
					velocity: 0.15
				},
				y: {
					range: 0.01,
					velocity: 0.2
				},
				z: {
					range: -0.04,
					velocity: 0.25
				},
			},
		},
		"movingHips-lookUp-xDecayed": {
			offset: {
				x: 0.025,
				y: 0.007,
				z: -0.01
			},
			lookAt: {
				x: 0,
				y: 0.15,
				z: 0.5
			},
			straightness: 0.01,
			mouseOrientationPonderation: {
				x: 0.1,
				y: 0.25
			},
			motion: {
				// motion will move the camera continuously
				// with a sin() (so -1 to 1)
				// and it's related at the offset values
				x: {
					// ratios
					range: -0.06,
					velocity: 0.75
				},
				y: {
					range: 0.001,
					velocity: 0.8
				},
				z: {
					range: -0.08,
					velocity: 0.5
				},
			},
		},
		"movingHips-4": {
			offset: {
				x: 0,
				y: 0.015,
				z: 0.04
			},
			lookAt: {
				x: 0,
				y: 0.017,
				z: 0.1
			},
			straightness: 0.015,
			mouseOrientationPonderation: {
				x: 0.04,
				y: 0.08
			},
			motion: {
				// motion will move the camera continuously
				// with a sin() (so -1 to 1)
				// and it's related at the offset values
				x: {
					// ratios
					range: 0.015,
					velocity: 0.5
				},
				y: {
					range: 0.02,
					velocity: 0.25
				},
				z: {
					range: -0.4,
					velocity: 0.25
				},
			},
		},
		"helmet-low-leave-house": {
			offset: {
				x: -0.05,
				y: 0.001,
				z: 0.09
			},
			lookAt: {
				x: 0,
				y: 0.017,
				z: 0
			},
			straightness: 0.04,
			mouseOrientationPonderation: {
				x: -0.05,
				y: 0.05
			},
			motion: {
				x: {
					range: 0.1,
					velocity: 0.17
				},
				y: {
					range: 0,
					velocity: 0
				},
				z: {
					range: 0,
					velocity: 0
				},
			}
		},
		movingFlyMarie: {
			offset: {
				x: -0.01,
				y: 0.068,
				z: -0.067
			},
			lookAt: {
				x: 0,
				y: 0.04,
				z: 0.055
			},
			straightness: 0.04,
			mouseOrientationPonderation: {
				x: 0.03,
				y: 0.03
			},
			motion: {
				// motion will move the camera continuously
				// with a sin() (so -1 to 1)
				// and it's related at the offset values
				x: {
					// ratios
					range: 0.025,
					velocity: 0.25
				},
				y: {
					range: -0.011,
					velocity: 0.5
				},
				z: {
					range: -0.01,
					velocity: 0.4
				},
			},
		},
		movingFly: {
			offset: {
				x: -0.01,
				y: 0.038,
				z: -0.027
			},
			lookAt: {
				x: 0,
				y: 0.025,
				z: 0.035
			},
			straightness: 0.04,
			mouseOrientationPonderation: {
				x: 0.03,
				y: 0.03
			},
			motion: {
				// motion will move the camera continuously
				// with a sin() (so -1 to 1)
				// and it's related at the offset values
				x: {
					// ratios
					range: 0.025,
					velocity: 0.25
				},
				y: {
					range: -0.011,
					velocity: 0.5
				},
				z: {
					range: -0.01,
					velocity: 0.4
				},
			},
		},
		movingFlyLeft: {
			offset: {
				x: 1.5,
				y: 0.038,
				z: 0
			},
			lookAt: {
				x: 0,
				y: 0.025,
				z: 0.005
			},
			straightness: 0.04,
			mouseOrientationPonderation: {
				x: 0.02,
				y: 0.06
			},
			motion: {
				// motion will move the camera continuously
				// with a sin() (so -1 to 1)
				// and it's related at the offset values
				x: {
					// ratios
					range: -1.4,
					velocity: 0.55
				},
				y: {
					range: -0.011,
					velocity: 0.5
				},
				z: {
					range: 0,
					velocity: 0.4
				},
			},
		},
		movingFlyRight: {
			offset: {
				x: -0.1,
				y: 0.038,
				z: 0
			},
			lookAt: {
				x: 0,
				y: 0.025,
				z: 0.005
			},
			straightness: 0.04,
			mouseOrientationPonderation: {
				x: 0.02,
				y: 0.02
			},
			motion: {
				// motion will move the camera continuously
				// with a sin() (so -1 to 1)
				// and it's related at the offset values
				x: {
					// ratios
					range: -0.05,
					velocity: 0.35
				},
				y: {
					range: -0.011,
					velocity: 0.5
				},
				z: {
					range: 0,
					velocity: 0.4
				},
			},
		},
		movingFlyEnd: {
			offset: {
				x: 0.05,
				y: 0.07,
				z: 0.085,
			},
			lookAt: {
				x: 0,
				z: 0.025,
				y: 0.035
			},
			straightness: 0.04,
			mouseOrientationPonderation: {
				x: 0.02,
				y: 0.02
			},
			motion: {
				// motion will move the camera continuously
				// with a sin() (so -1 to 1)
				// and it's related at the offset values
				x: {
					// ratios
					range: -0.15,
					velocity: 0.09
				},
				y: {
					range: -0.22,
					velocity: 0.15
				},
				z: {
					range: -0.2,
					velocity: 0.06
				},
				
			},
		},
		movingFlyEndMarie: {
			offset: {
				x: 0.05,
				y: 0.07,
				z: 0.045,
			},
			lookAt: {
				x: 0,
				z: 0.015,
				y: 0.055
			},
			straightness: 0.04,
			mouseOrientationPonderation: {
				x: 0.02,
				y: 0.02
			},
			motion: {
				// motion will move the camera continuously
				// with a sin() (so -1 to 1)
				// and it's related at the offset values
				x: {
					// ratios
					range: -0.15,
					velocity: 0.09
				},
				y: {
					range: -0.22,
					velocity: 0.15
				},
				z: {
					range: -0.2,
					velocity: 0.06
				},
				
			},
		}
	}

}

export { core };