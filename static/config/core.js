const core = {

	debug: {
		lightsHelpers: {
			light: false,
			shadow: false
		}
	},

	mouse: {
		moveTimeout: 2.5,
		recenterDuration: 1,
		orientationClamp: {
			start: 0.00001,
			end: 0.1,
			divideRatio: 50
		}
	},
	stick: {
		moveTimeout: 0.2,
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
			"walk-back",
			"run",
			"idle",
			"dance",
			"fly",
			"floating",
			"jazz",
			"hiphop",
			"housedance",
			"climb"
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
		hips: {
			offset: {
				x: -0.012,
				y: 0.014,
				z: -0.045
			},
			lookAt: {
				x: -0.01,
				y: 0.008,
				z: 2
			},
			straightness: 0.015,
			mouseOrientationPonderation: {
				x: 0.8,
				y: 0.5
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
		"movingHips-oula": {
			offset: {
				x: 0,
				y: 0.011,
				z: -0.035
			},
			lookAt: {
				x: 0,
				y: 0.015,
				z: 0.05
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
					range: 0,
					velocity: 1
				},
				z: {
					range: -0.05,
					velocity: 0.2
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

		"movingHips-2": {
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
				x: 0.15,
				y: 0.26
			},
			motion: {
				// motion will move the camera continuously
				// with a sin() (so -1 to 1)
				// and it's related at the offset values
				x: {
					// ratios
					range: 0.035,
					velocity: 0.4
				},
				y: {
					range: 0.02,
					velocity: 0.15
				},
				z: {
					range: -0.4,
					velocity: 0.4
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
		"helmet-low-moving": {
			offset: {
				x: 0,
				y: 0.0011,
				z: 0.04
			},
			lookAt: {
				x: 0,
				y: 0.035,
				z: -0.15
			},
			straightness: 0.04,
			mouseOrientationPonderation: {
				x: -0.04,
				y: 0.04
			},
			motion: {
				// motion will move the camera continuously
				// with a sin() (so -1 to 1)
				// and it's related at the offset values
				x: {
					// ratios
					range: -0.08,
					velocity: 0.2
				},
				y: {
					range: 0.01,
					velocity: 0.1
				},
				z: {
					range: 0.25,
					velocity: 0.1
				},
			},
		},
		"helmet-low-moving-2": {
			offset: {
				x: 0.08,
				y: 0.015,
				z: 0.13
			},
			lookAt: {
				x: 0,
				y: 0.018,
				z: -0.01
			},
			straightness: 0.04,
			mouseOrientationPonderation: {
				x: -0.01,
				y: 0.01
			},
			motion: {
				// motion will move the camera continuously
				// with a sin() (so -1 to 1)
				// and it's related at the offset values
				x: {
					// ratios
					range: -0.08,
					velocity: 0.15
				},
				y: {
					range: 0.02,
					velocity: 0.2
				},
				z: {
					range: 0.08,
					velocity: 0.05
				},
			},
		},

		"climb-view": {
			offset: {
				x: -0.35,
				y: 0.01,
				z: -1
			},
			lookAt: {
				x: 0,
				y: -0.02,
				z: 0
			},
			straightness: 0.025,
			mouseOrientationPonderation: {
				x: 0.05,
				y: 0.085
			},
			motion: {
				// motion will move the camera continuously
				// with a sin() (so -1 to 1)
				// and it's related at the offset values
				x: {
					// ratios
					range: 0.25,
					velocity: 0.15
				},
				y: {
					range: 0.1,
					velocity: 0.1
				},
				z: {
					range: 0.95,
					velocity: 0.18
				},
			},
		},

		fly: {
			offset: {
				x: 0.03,
				y: 0.035,
				z: -0.045
			},
			lookAt: {
				x: 0,
				y: -0.05,
				z: 0.05
			},
			straightness: 0.03,
			mouseOrientationPonderation: {
				x: 0.02,
				y: 0.02
			},
		},
		behindFly: {
			offset: {
				x: 0.015,
				y: 0.015,
				z: 0.015
			},
			lookAt: {
				x: 0,
				y: 0,
				z: 0.5
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
					range: -0.03,
					velocity: 0.15
				},
				y: {
					range: -0.03,
					velocity: 0.25
				},
				z: {
					range: -0.12,
					velocity: 0.1
				},
			},
		},
		movingFly: {
			offset: {
				x: 0,
				y: 0.03,
				z: -0.04
			},
			lookAt: {
				x: 0,
				y: 0,
				z: 0.001
			},
			straightness: 0.04,
			mouseOrientationPonderation: {
				x: 0.025,
				y: 0.025
			},
			motion: {
				// motion will move the camera continuously
				// with a sin() (so -1 to 1)
				// and it's related at the offset values
				x: {
					// ratios
					range: 0.04,
					velocity: 0.25
				},
				y: {
					range: 0.015,
					velocity: 0.5
				},
				z: {
					range: 0.01,
					velocity: 0.4
				},
			},
		},

		"movingFly-helmet": {
			offset: {
				x: 0,
				y: 0.015,
				z: 0.065
			},
			lookAt: {
				x: 0,
				y: 0,
				z: 0
			},
			straightness: 0.04,
			mouseOrientationPonderation: {
				x: 0.015,
				y: 0.015
			},
			motion: {
				// motion will move the camera continuously
				// with a sin() (so -1 to 1)
				// and it's related at the offset values
				x: {
					// ratios
					range: 0.07,
					velocity: 0.35
				},
				y: {
					range: -0.09,
					velocity: 0.3
				},
				z: {
					range: 0.25,
					velocity: 0.1
				},
			},
			
		},

		movingFloating: {
			offset: {
				x: 0,
				y: 0.025,
				z: -0.03
			},
			lookAt: {
				x: 0,
				y: 0,
				z: 0.05
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
					range: 0.06,
					velocity: 0.4
				},
				y: {
					range: 0.015,
					velocity: 0.1
				},
				z: {
					range: -0.04,
					velocity: 0.1
				},
			},
		},
	}

}

export { core };