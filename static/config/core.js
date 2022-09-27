const core = {

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
			orientationPonderation: {
				x: 1.5,
				y: 1.5
			}
		},
		hips: {
			offset: {
				x: -0.05,
				y: 0.025,
				z: -0.06
			},
			lookAt: {
				x: 0,
				y: 0.025,
				z: 0.6
			},
			straightness: 0.02,
			orientationPonderation: {
				x: 0.5,
				y: 0.5
			}
		},
		movingHips: {
			offset: {
				x: 0,
				y: 0.025,
				z: -0.06
			},
			lookAt: {
				x: 0,
				y: 0.025,
				z: 0.6
			},
			motion: {
				x: {
					// ratios
					range: 0.4,
					velocity: 0.15
				},
				y: {
					range: 0,
					velocity: 1
				},
				z: {
					range: -0.4,
					velocity: 0.35
				},
			},
			straightness: 0.02,
			orientationPonderation: {
				x: 0.3,
				y: 0.3
			}
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
			orientationPonderation: {
				x: -0.5,
				y: 0.5
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