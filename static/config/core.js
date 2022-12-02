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
		moveTimeout: 0.5,
		recenterDuration: 1,
		orientationClamp: {
			start: 0.00001,
			end: 0.1,
			divideRatio: 50
		}
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
				x: 0.4,
				y: 0.6
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
		fly: {
			offset: {
				x: 0.03,
				y: 0.035,
				z: -0.035
			},
			lookAt: {
				x: 0,
				y: 0,
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
				z: 0.02
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