// {
// 	type: "bloom",
// 	value: {
// 		strength: .85,
// 		threshold: 0.045,
// 		radius: 0.1
// 	}
// },

// {
// 	type: "kaleidoscope",
// 	sides: 1,
// 	angle: -45
// },

// {
// 	type: "vignette",
// 	darkness: 1.5,
// 	offset: 1.04
// },

// {
// 	type: "kaleidoscope",
// 	sides: 1,
// 	angle: -25
// },

// {
// 	type: "bloom",
// 	value: {
// 		strength: .5,
// 		threshold: 0.45,
// 		radius: 0.01
// 	}
// },

// {
// 	type: "sepia",
// 	amount: 1
// },

// {
// 	type: "rgbShift",
// 	amount: 0.12
// },

// {
// 	type: "dotscreen",
// 	dotSize: 4
// },

// {
// 	type: "bloom",
// 	value: {
// 		strength: 0.9,
// 		threshold: 0.35,
// 		radius: 0.3
// 	}
// },

// {
// 	type: "glitch"
// },

// {
// 	obscurci
// 	type: "bleach",
// 	amount: 0.5
// }

// {
// 	type: "afterimage",
// 	damp: 0.8
// }

// {
// 	type: "pixel",
// 	pixelSize: 1
// }

// {
// 	type: "sobel"
// },

const worlds = [

	{
		name: "world_000",

		main: {

			spaceColor: "#1E1E1E",
			spaceColorDarker: "#080808",
			spaceColorWithBloom: "#080808",

			ambient: {
				sunColor: "#7AFF00",
				intensity: 0.6,
				groundColor: "#0025FF"
			},

			fog: {
				enabled: true,
				color: "#0025FF",
				intensity: .75
			},

			particles: [
				{
					type: "fireflies",
					count: 250,
					particleSize: 20,
					additive: true,
					timeRatio: 36.0,
					blockSize: {
						x: 3,
						y: 2,
						z: 2
					}
				}
			],
			
			meshInfos: {

				glbPath: "/assets/3d/worlds/lightHouse/lightHouse.glb",
				imagePath: {
					landscape: "/assets/3d/worlds/lightHouse/lightHouseBake.jpg"
				},
				// options: {
				// 	metalness: 0.2,
				// 	// roughness: 1,
				// 	reflectivity: 0.7,
				// 	shininess: 20,
				// 	specular: 0xFF0000,
				// }

			},

			entities: ["link"],

		},

		sequences: [
			{
				id: "1.0",
				baseFov: 5,
				fovTransition: false,
				sequenceBobName: "link",
				until: 14,
				nextInstruction: "switch-sequence",

				type: "blender-points",

				animatedMesh: false,

				helpers: {
					orbit: false,
					tubes: false,
					timelines: false
				},
				
				fog: {
					enabled: true,
					color: "#000000",
					intensity: .25
				},

				tubeInfos: {
					duration: 18,
					// isUsingTarget indicate that we need a plan-1.0-target point in the glb
					isUsingTarget: true,
					steps: [
						// n steps are possibles
						// n has nothing to do with the number of points for the curve
						{
							// this amount is a percent of the global duration
							amount: 100,
							fov: 100,
							stepEase: "linear"
						},
						
					]
				},

				slowmo: 9,

				bobImposedMoves: {
					forward: true,
					left: false,
					right: false,
					dance: false,
					backward: false,
					shift: false
				},

				postproc: [
					// {
					// 	type: "bloom",
					// 	value: {
					// 		strength: 0.5,
					// 		threshold: 0.35,
					// 		radius: 0.4
					// 	}
					// },
				]

			},
			{
				id: "1.1",
				baseFov: 27,
				fovTransition: false,
				sequenceBobName: "link",

				type: "third-person",
				cameraTriggerTimeDecay: 5,
				cameraType: "helmet-low-leave-house",

				until: 26.5,
				nextInstruction: "switch-scene",

				animatedMesh: false,

				helpers: {
					orbit: false,
					tubes: false,
					timelines: false
				},
				
				fog: {
					enabled: true,
					color: "#000000",
					intensity: .68
				},

				slowmo: 6,

				bobImposedMoves: {
					forward: true,
					// left: false,
					// right: false,
					dance: false,
					// backward: false,
					// shift: false
				},

				postproc: [

					// {
					// 	type: "bloom",
					// 	value: {
					// 		strength: 0.5,
					// 		threshold: 0.35,
					// 		radius: 0.4
					// 	}
					// },

				]

			}

		]

	},

	{
		name: "world_005",

		main: {

			spaceColor: "#002038",
			spaceColorDarker: "#001220",
			spaceColorWithBloom: "#000B14",

			ambient: {
				sunColor: "#FFFFFF",
				intensity: 0.6,
				groundColor: "#04007A"
			},

			particles: [
				{
					type: "fireflies",
					count: 150,
					particleSize: 15,
					additive: true,
					timeRatio: 8.0,
					blockSize: {
						x: 4,
						y: 5,
						z: 4
					}
				}
			],

			fog: {
				enabled: true,
				color: 0xff9500,
				intensity: .15
			},
			
			meshInfos: {

				glbPath: "/assets/3d/worlds/epicValley/epicValley.glb",
				imagePath: {
					landscape: "/assets/3d/worlds/epicValley/epicValleyBake.jpg"
				}

			},

			entities: ["link", "juan"],

		},

		sequences: [
			{
				id: "2.1",
				baseFov: 35,
				fovTransition: false,
				sequenceBobName: "link",
				until: 37,
				nextInstruction: "switch-sequence",

				type: "blender-points",

				animatedMesh: false,

				helpers: {
					orbit: true,
					tubes: false,
					timelines: false
				},
				
				fog: {
					enabled: false,
					color: "#0D063B",
					intensity: .15
				},

				tubeInfos: {
					duration: 10,
					// isUsingTarget indicate that we need a plan-1.0-target point in the glb
					isUsingTarget: true,
					steps: [
						// n steps are possibles
						// n has nothing to do with the number of points for the curve
						{
							// this amount is a percent of the global duration
							amount: 50,
							fov: 30,
							stepEase: "linear"
						},
						{
							// this amount is a percent of the global duration
							amount: 50,
							fov: 40,
							stepEase: "linear"
						},
						
					]
				},

				postproc: []

			},
			{
				id: "2.2",
				baseFov: 27,
				fovTransition: true,
				sequenceBobName: "juan",

				type: "third-person",
				cameraTriggerTimeDecay: 12,
				cameraType: "movingHips",

				until: 44,
				nextInstruction: "drop-and-load-and-switch",

				animatedMesh: false,

				helpers: {
					orbit: true,
					tubes: false,
					timelines: false
				},
				
				fog: {
					enabled: true,
					color: "#0D063B",
					intensity: .3
				},

				bobImposedMoves: {
					backward: false,
					forward: false,
					shift: false,
					dance: false
				},

				postproc: [

				]

			},
			{
				id: "3.4",
				baseFov: 23,
				fovTransition: true,
				sequenceBobName: "juan",

				type: "third-person",
				cameraTriggerTimeDecay: 6,
				cameraType: "movingHips",

				until: 65,
				nextInstruction: "switch-scene",

				animatedMesh: false,

				helpers: {
					orbit: true,
					tubes: false,
					timelines: false
				},
				
				fog: {
					enabled: false,
					color: "#0D063B",
					intensity: .3
				},

				bobImposedMoves: {
					backward: false,
					forward: true,
					shift: true,
					dance: false
				},

				postproc: [

					{
						type: "bloom",
						value: {
							strength: 0.9,
							threshold: 0.35,
							radius: 0.3
						}
					},

				]

			},
			
		]

	},

	{
		name: "world_010",

		main: {

			spaceColor: "#3B3B3B",
			spaceColorDarker: "#1E1E1E",
			spaceColorWithBloom: "#1E1E1E",

			ambient: {
				sunColor: "#1E1E1E",
				intensity: 0.4,
				groundColor: "#3B3B3B"
			},

			fog: {
				enabled: false,
				color: 0xff9500,
				intensity: .85
			},
			
			meshInfos: {

				glbPath: "/assets/3d/worlds/caveEntrance/caveEntrance.glb",
				imagePath: {
					landscape: "/assets/3d/worlds/caveEntrance/caveEntranceBake.jpg"
				}

			},

			entities: ["link", "juan", "queen"],

		},

		sequences: [
			{
				id: "2.3",
				baseFov: 15,
				fovTransition: false,
				sequenceBobName: "link",
				until: 54,
				nextInstruction: "switch-sequence",

				type: "blender-points",

				animatedMesh: false,

				helpers: {
					orbit: false,
					tubes: false,
					timelines: false
				},
				
				fog: {
					enabled: false,
					color: "#0D063B",
					intensity: .55
				},

				alice: {
					handleGround: false,
					name: "queen",
					move: {
						floating: true
					},
					offset: {
						x: 0,
						y: -0.15,
						z: 0
					},
					scale: 0.008,
					slowmo: 5
				},

				tubeInfos: {
					duration: 10,
					// isUsingTarget indicate that we need a plan-1.0-target point in the glb
					isUsingTarget: true,
					steps: [
						// n steps are possibles
						// n has nothing to do with the number of points for the curve
						{
							// this amount is a percent of the global duration
							amount: 100,
							fov: 35,
							stepEase: "linear"
						}
						
					]
				},

				postproc: [
					{
						type: "blur",
						focusTarget: "queen",
						value: {
							focus: 1,
							aperture: 0.055,
							maxblur: 0.04
						}
					},
				]

			},
			{
				id: "2.4",
				baseFov: 40,
				fovTransition: true,
				sequenceBobName: "juan",

				type: "third-person",
				cameraTriggerTimeDecay: 14,
				cameraType: "movingHips",

				until: 56.7,
				nextInstruction: "switch-scene",

				animatedMesh: false,

				helpers: {
					orbit: false,
					tubes: false,
					timelines: false
				},
				
				fog: {
					enabled: false,
					color: "#0D063B",
					intensity: .4
				},

				alice: {
					handleGround: false,
					name: "queen",
					move: {
						floating: true
					},
					offset: {
						x: 0,
						y: -0.15,
						z: 0
					},
					scale: 0.008,
					slowmo: 5
				},

				slowmo: 2.5,

				bobImposedMoves: {
					forward: true,
					// shift: false
				},

				postproc: [

					{
						type: "blur",
						focusTarget: "queen",
						value: {
							focus: 1,
							aperture: 0.025,
							maxblur: 0.01
						}
					},

				]

			},
			{
				id: "4.4",
				baseFov: 25,
				fovTransition: false,
				sequenceBobName: "juan",

				type: "third-person",
				cameraTriggerTimeDecay: 6,
				cameraType: "movingHips-oula",

				until: 69,
				nextInstruction: "drop-and-load-and-switch",

				animatedMesh: false,

				helpers: {
					orbit: false,
					tubes: false,
					timelines: false
				},
				
				fog: {
					enabled: false,
					color: "#0D063B",
					intensity: .4
				},

				alice: {
					handleGround: false,
					name: "queen",
					move: {
						floating: true
					},
					offset: {
						x: 0,
						y: -0.15,
						z: 0
					},
					scale: 0.008,
					slowmo: 3
				},

				// slowmo: 3,

				bobImposedMoves: {
					forward: true,
					shift: true,
					backward: false,
					dance: false
				},

				postproc: [

					{
						type: "blur",
						focusTarget: "queen",
						value: {
							focus: 1,
							aperture: 0.025,
							maxblur: 0.01
						}
					},

				]

			},
			
		]

	},

	{
		name: "world_015",

		main: {

			spaceColor: "#000000",
			spaceColorDarker: "#000000",
			spaceColorWithBloom: "#000000",

			ambient: {
				sunColor: "#FF7400",
				intensity: 0.55,
				groundColor: "#6200FF"
			},

			fog: {
				enabled: true,
				color: 0x000000,
				intensity: .85
			},

			particles: [
				{
					type: "fireflies",
					count: 650,
					particleSize: 25,
					additive: true,
					timeRatio: 400.0,
					blockSize: {
						x: 2,
						y: 3,
						z: 2
					}
				}
			],
			
			meshInfos: {

				glbPath: "/assets/3d/worlds/swift/swift.glb",
				imagePath: {
					landscape: "/assets/3d/worlds/swift/swiftBake.jpg"
				}
			},


			entities: ["link", "juan"],

		},

		sequences: [

			{
				id: "4.5",
				baseFov: 35,
				fovTransition: true,
				sequenceBobName: "link",

				type: "third-person",
				cameraTriggerTimeDecay: 15,
				cameraType: "climb-view",

				until: 76.5,
				nextInstruction: "switch-sequence",

				animatedMesh: false,

				helpers: {
					orbit: false,
					tubes: false,
					timelines: false
				},
				
				fog: {
					enabled: false,
					color: "#000000",
					intensity: .75
				},

				bobImposedMoves: {
					forward: false,
					shift: false,
					backward: false,
					hiphop: false,
					left: false,
					right: false,
					climb: true
				},

				slowmo: 1.3,

				postproc: [
					// {
					// 	type: "rgbShift",
					// 	amount: 0.006
					// },
					{
						type: "blur",
						focusTarget: "link",
						value: {
							focus: 1,
							aperture: 0.4,
							maxblur: 0.045
						}
					},
				]

			},

			{
				id: "4.6",
				baseFov: 35,
				fovTransition: false,
				sequenceBobName: "juan",

				type: "third-person",
				cameraTriggerTimeDecay: 5,
				cameraType: "helmet-low-moving",

				until: 85.5,
				nextInstruction: "drop-and-load-and-switch",

				animatedMesh: false,

				helpers: {
					orbit: false,
					tubes: false,
					timelines: false
				},
				
				fog: {
					enabled: false,
					color: "#0D063B",
					intensity: .15
				},

				alice: {
					handleGround: false,
					name: "link",
					move: {
						climb: true
					},
					offset: {
						x: 0,
						y: 0,
						z: 0
					},
					scale: 0.0015,
					slowmo: 1.3
				},

				bobImposedMoves: {
					forward: false,
					shift: false,
					backward: false,
					housedance: true,
					left: false,
					right: false,
				},

				slowmo: 3.5,

				postproc: [
			
					{
						type: "bloom",
						value: {
							strength: .5,
							threshold: 0.45,
							radius: 0.05
						}
					},
					{
						type: "blur",
						focusTarget: "link",
						value: {
							focus: 1,
							aperture: 0.025,
							maxblur: 0.015
						}
					},

				]

			},
			
		]

	},

	{
		name: "world_020",

		main: {

			spaceColor: "#FFFFFF",
			spaceColorDarker: "#FFFFFF",
			spaceColorWithBloom: "#FFFFFF",

			ambient: {
				sunColor: "#FFFFFF",
				intensity: 0.6,
				groundColor: "#04007A"
			},

			fog: {
				enabled: true,
				color: 0xff9500,
				intensity: .15
			},

			particles: [
				{
					type: "fireflies",
					count: 200,
					particleSize: 20,
					additive: true,
					timeRatio: 3.0,
					blockSize: {
						x: 5,
						y: 2,
						z: 5
					}
				}
			],
			
			meshInfos: {

				glbPath: "/assets/3d/worlds/forestWing/forestWing.glb",
				imagePath: {
					landscape: "/assets/3d/worlds/forestWing/forestWingBake.jpg"
				}
			},


			entities: ["link", "juan", "queen"],

		},

		sequences: [
			{
				id: "4.7",
				baseFov: 40,
				fovTransition: false,
				sequenceBobName: "juan",

				// type: "blender-points",
				type: "third-person",
				cameraTriggerTimeDecay: 8,
				cameraType: "movingHips-lookUp",

				until: 92,
				nextInstruction: "switch-sequence",

				animatedMesh: false,

				helpers: {
					orbit: false,
					tubes: false,
					timelines: false
				},
				
				fog: {
					enabled: false,
					color: "#FFFFFF",
					intensity: .43
				},

				bobImposedMoves: {
					shift: true,
					forward: true
				},

				postproc: [

					{
						type: "vignette",
						darkness: -1.5,
						offset: 1.1
					}

				]

			},
			{
				id: "4.8",
				baseFov: 35,
				fovTransition: true,
				sequenceBobName: "juan",

				// type: "blender-points",
				type: "third-person",
				cameraTriggerTimeDecay: 4,
				cameraType: "movingHips-lookUp",

				until: 101,
				nextInstruction: "switch-sequence",

				animatedMesh: false,

				helpers: {
					orbit: false,
					tubes: false,
					timelines: false
				},
				
				fog: {
					enabled: false,
					color: "#000000",
					intensity: .43
				},

				alice: {
					handleGround: false,
					name: "queen",
					move: {
						housedance: true
					},
					offset: {
						x: 0,
						y: -0.55,
						z: 0
					},
					scale: 0.25,
					slowmo: 8
				},

				bobImposedMoves: {
					shift: false,
					// forward: true,
					backward: false,
					hiphop: false
				},

				postproc: [
					{
						type: "vignette",
						darkness: -0.8,
						offset: 0.8
					},
					{
						type: "blur",
						focusTarget: "queen",
						value: {
							focus: 1,
							aperture: 0.025,
							maxblur: 0.025
						}
					},
				]

			},
			{
				id: "4.9",
				baseFov: 30,
				fovTransition: true,
				sequenceBobName: "link",

				// type: "blender-points",
				type: "third-person",
				cameraTriggerTimeDecay: 4,
				cameraType: "helmet-low-moving-2",

				until: 107.5,
				nextInstruction: "drop-and-load-and-switch",

				animatedMesh: false,

				helpers: {
					orbit: false,
					tubes: false,
					timelines: false
				},
				
				fog: {
					enabled: true,
					color: "#000000",
					intensity: .43
				},

				bobImposedMoves: {
					hiphop: true,
					// forward: false,
					// left: false,
					// right: false,
					// shift: false,
					// backward: false
				},

				slowmo: 1.15,

				postproc: [

					{
						type: "bloom",
						value: {
							strength: 0.2,
							threshold: 0.005,
							radius: 0.2
						}
					},
					{
						type: "blur",
						focusTarget: "link",
						value: {
							focus: 1,
							aperture: 0.025,
							maxblur: 0.025
						}
					},

				]

			},
			
		]

	},

	{
		name: "world_025",

		main: {

			spaceColor: "#002038",
			spaceColorDarker: "#001220",
			spaceColorWithBloom: "#000B14",

			ambient: {
				sunColor: "#FFFFFF",
				intensity: 0.6,
				groundColor: "#04007A"
			},

			fog: {
				enabled: true,
				color: 0xff9500,
				intensity: .15
			},
			
			meshInfos: {

				glbPath: "/assets/3d/worlds/oula/oula.glb",
				imagePath: {
					landscape: "/assets/3d/worlds/oula/oulaBake.jpg"
				}
			},


			entities: ["link", "juan"],

		},

		sequences: [
			{
				id: "4.10",
				baseFov: 50,
				fovTransition: false,
				sequenceBobName: "juan",

				type: "third-person",
				cameraTriggerTimeDecay: 14,
				cameraType: "movingHips-oula",

				until: 114.5,
				nextInstruction: "drop-and-load-and-switch",

				animatedMesh: false,

				helpers: {
					orbit: false,
					tubes: false,
					timelines: false
				},
				
				fog: {
					enabled: false,
					color: "#FFFFFF",
					intensity: .43
				},

				bobImposedMoves: {
					forward: true
				},

				postproc: []

			},
			
		]

	},

	{
		name: "world_030",

		main: {

			spaceColor: "#002038",
			spaceColorDarker: "#001220",
			spaceColorWithBloom: "#000000",

			ambient: {
				sunColor: "#2700FF",
				intensity: 0.5,
				groundColor: "#FF3700"
			},

			fog: {
				enabled: false,
				color: 0xff9500,
				intensity: .15
			},
			
			meshInfos: {

				glbPath: "/assets/3d/worlds/faceMountain/faceMountain.glb",
				imagePath: {
					landscape: "/assets/3d/worlds/faceMountain/faceMountainBake.jpg"
				}
			},


			entities: ["link", "juan"],

		},

		sequences: [
			{
				id: "4.11",
				baseFov: 10,
				fovTransition: false,
				sequenceBobName: "link",

				type: "blender-points",

				until: 121.5,
				nextInstruction: "switch-sequence",

				animatedMesh: false,

				helpers: {
					orbit: false,
					tubes: false,
					timelines: false
				},
				
				fog: {
					enabled: false,
					color: "#FFFFFF",
					intensity: .43
				},

				tubeInfos: {
					duration: 8,
					// isUsingTarget indicate that we need a plan-1.0-target point in the glb
					isUsingTarget: true,
					steps: [
						// n steps are possibles
						// n has nothing to do with the number of points for the curve
						{
							// this amount is a percent of the global duration
							amount: 100,
							fov: 35,
							stepEase: "linear"
						},
						
					]
				},

				alice: {
					handleGround: false,
					name: "juan",
					move: {
						climb: true,
						forward: false,
						backward: false,
						left: false,
						right: false,
						hiphop: false,
						housedance: false
					},
					offset: {
						x: 0,
						y: 0,
						z: 0
					},
					scale: 0.001,
					slowmo: 1.5
				},

				// bobImposedMoves: {
				// 	forward: false,
				// 	backward: false,
				// 	left: false,
				// 	right: false,
				// 	climb: false,
				// 	housedance: false,
				// 	hiphop: false
				// },

				postproc: [
					{
						type: "bloom",
						value: {
							strength: .65,
							threshold: 0.05,
							radius: 0.4
						}
					},
					{
						type: "blur",
						focusTarget: "juan",
						value: {
							focus: 1,
							aperture: 0.015,
							maxblur: 0.028
						}
					},
				]

			},
			{
				id: "4.12",
				baseFov: 50,
				fovTransition: true,
				sequenceBobName: "link",

				type: "third-person",
				cameraTriggerTimeDecay: 16,
				cameraType: "movingHips-lookUp",

				until: 141.5,
				nextInstruction: "drop-and-load-and-switch",

				animatedMesh: false,

				helpers: {
					orbit: false,
					tubes: false,
					timelines: false
				},
				
				fog: {
					enabled: false,
					color: "#FFFFFF",
					intensity: .43
				},

				alice: {
					handleGround: false,
					name: "juan",
					move: {
						climb: true
					},
					offset: {
						x: 0,
						y: 0,
						z: 0
					},
					scale: 0.0011,
					slowmo: 1.3
				},

				bobImposedMoves: {
					housedance: false,
					climb: false,
					hiphop: false,
					fly: false,
					floating: false,
					forward: true,
					shift: true
				},

				postproc: [
					{
						type: "bloom",
						value: {
							strength: .65,
							threshold: 0.05,
							radius: 0.4
						}
					},
					{
						type: "blur",
						focusTarget: "juan",
						value: {
							focus: 1,
							aperture: 0.015,
							maxblur: 0.028
						}
					},
				]

			},
			
		]

	},

	{
		name: "world_030",

		main: {

			spaceColor: "#FFFFFF",
			spaceColorDarker: "#FFFFFF",
			spaceColorWithBloom: "#FFFFFF",

			ambient: {
				sunColor: "#FFFFFF",
				intensity: 0.4,
				groundColor: "#1f165e"
			},

			fog: {
				enabled: false,
				color: 0xff9500,
				intensity: .15
			},
			
			meshInfos: {

				glbPath: "/assets/3d/worlds/five/five.glb",
				imagePath: {
					landscape: "/assets/3d/worlds/five/fiveBake.jpg"
				}
			},


			entities: ["link"],

		},

		sequences: [
			{
				id: "4.13",
				baseFov: 13,
				fovTransition: false,
				sequenceBobName: "link",

				type: "third-person",
				cameraTriggerTimeDecay: 20,
				cameraType: "movingFly",

				until: 154.5,
				nextInstruction: "switch-sequence",

				animatedMesh: false,

				helpers: {
					orbit: false,
					tubes: false,
					timelines: false
				},

				landscapeMove: {
					x: 0,
					y: 0.0015,
					z: -0.0015
				},
				
				fog: {
					enabled: true,
					color: "#FFFFFF",
					intensity: .02
				},

				bobImposedMoves: {
					// forward: true
					fly: true,
					forward: false,
					backward: false,
					shift: false
				},

				slowmo: 3,

				postproc: [
					{
						type: "bloom",
						value: {
							strength: .49,
							threshold: 0.047,
							radius: 0.26
						}
					},
				]

			},
			{
				id: "4.14",
				baseFov: 45,
				fovTransition: false,
				sequenceBobName: "link",

				type: "third-person",
				cameraTriggerTimeDecay: 35,
				cameraType: "movingFly-helmet",

				until: 292.5,
				nextInstruction: "switch-sequence",

				animatedMesh: false,

				helpers: {
					orbit: false,
					tubes: false,
					timelines: false
				},

				landscapeMove: {
					x: 0,
					y: -0.01,
					z: 0
				},
				
				fog: {
					enabled: true,
					color: "#FFFFFF",
					intensity: .01
				},

				bobImposedMoves: {
					// forward: true
					fly: true,
					forward: false,
					backward: false,

				},

				postproc: [
					{
						type: "bloom",
						value: {
							strength: .49,
							threshold: 0.047,
							radius: 0.26
						}
					},
				]

			},
			
		]

	},

]



export { worlds };