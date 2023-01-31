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
		name: "world_0",

		main: {

			// spaceColor: "#160D54",
			// spaceColorDarker: "#0D063B",
			// spaceColorWithBloom: "#040116",
			spaceColor: "#140040",
			spaceColorDarker: "#0A001F",
			spaceColorWithBloom: "#05000F",

			ambient: {
				sunColor: "#FFFFFF",
				intensity: 0.6,
				groundColor: "#04007A"
			},

			fog: {
				enabled: false,
				color: 0xff9500,
				intensity: .15
			},

			particles: [
				{
					type: "fireflies",
					count: 200,
					particleSize: 30,
					additive: true,
					timeRatio: 1.0,
					blockSize: {
						x: 8,
						y: 1.5,
						z: 14
					}
				}
			],
			
			meshInfos: {

				glbPath: "/assets/3d/worlds/veryLowPoly/veryLowPoly.glb",
				imagePath: {
					landscape: "/assets/3d/worlds/veryLowPoly/veryLowPolyBake.jpg"
				},
				options: {
					metalness: 0.2,
					roughness: 0.85
				}

			},

		},

		sequences: [
			{
				id: "1.0",
				baseFov: 65,
				fovTransition: true,
				sequenceBobName: "link",

				type: "fake-orbit",

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

				alice: {
					handleGround: false,
					name: "queen",
					move: {
						jazz: true
					},
					scale: 0.35,
					offset: {
						x: 0,
						y: -9,
						z: 0
					},
					rotate: {
						x: 0,
						y: 10,
						z: 0
					},
					slowmo: 25
				},

				tubeInfos: {
					duration: 5,
					// isUsingTarget indicate that we need a plan-1.0-target point in the glb
					isUsingTarget: true,
					steps: [
						// n steps are possibles
						// n has nothing to do with the number of points for the curve
						{
							// this amount is a percent of the global duration
							amount: 2,
							fov: 65,
							stepEase: "linear"
						},
						{
							// this amount is a percent of the global duration
							amount: 30,
							fov: 30,
							stepEase: "linear"
						},
						{
							// this amount is a percent of the global duration
							amount: 70,
							fov: 30,
							stepEase: "linear"
						},
						
					]
				},

				postproc: [
					{
						type: "bloom",
						value: {
							strength: .7,
							threshold: 0.045,
							radius: 0.1
						}
					},
				]

			},
			{
				id: "1.1",
				baseFov: 27,
				fovTransition: true,
				sequenceBobName: "link",

				// type: "blender-points",
				type: "third-person",
				cameraTriggerTimeDecay: 6,
				cameraType: "movingHips",

				animatedMesh: false,

				helpers: {
					orbit: true,
					tubes: false,
					timelines: false
				},
				
				fog: {
					enabled: true,
					color: "#05000F",
					intensity: .45
				},

				alice: {
					handleGround: false,
					name: "queen",
					move: {
						jazz: true
					},
					scale: 0.35,
					offset: {
						x: 0,
						y: -9,
						z: 0
					},
					rotate: {
						x: 0,
						y: 10,
						z: 0
					},
					slowmo: 25
				},

				bobImposedMoves: {
					forward: true
				},

				postproc: [

					{
						type: "bloom",
						value: {
							strength: .7,
							threshold: 0.045,
							radius: 0.1
						}
					},
					
				]

			},
			{
				id: "1.2",
				baseFov: Math.PI/0.1,
				fovTransition: false,
				sequenceBobName: "link",

				type: "third-person",
				cameraType: "movingHips",
				cameraTriggerTimeDecay: 10,

				animatedMesh: false,

				helpers: {
					orbit: true,
					tubes: false,
					timelines: false
				},
				
				fog: {
					enabled: false,
					color: "#040116",
					intensity: .15
				},

				alice: {
					handleGround: false,
					name: "queen",
					move: {
						floating: true
					},
					scale: 0.35,
					offset: {
						x: 0,
						y: -9,
						z: 0
					},
					rotate: {
						x: 0,
						y: 10,
						z: 0
					},
					slowmo: 25
				},

				bobImposedMoves: {
					forward: true,
					shift: true,
					left: false,
					right: false
				},

				slowmo: 5,

				postproc: [
					{
						type: "bloom",
						value: {
							strength: .7,
							threshold: 0.045,
							radius: 0.1
						}
					},
				]

			},
			{
				id: "1.3",
				baseFov: Math.PI/0.09,
				fovTransition: true,
				sequenceBobName: "link",

				
				type: "third-person",
				cameraTriggerTimeDecay: 10,
				cameraType: "movingHips",

				animatedMesh: false,

				helpers: {
					orbit: true,
					tubes: false,
					timelines: false
				},
				
				fog: {
					enabled: false,
					color: "#160D54",
					intensity: .2
				},

				alice: {
					handleGround: false,
					name: "queen",
					move: {
						jazz: true
					},
					scale: 0.35,
					offset: {
						x: 0,
						y: -9,
						z: 0
					},
					rotate: {
						x: 0,
						y: 10,
						z: 0
					},
					slowmo: 35
				},

				bobImposedMoves: {},

				postproc: [
					// {
					// 	type: "bloom",
					// 	value: {
					// 		strength: .4,
					// 		threshold: 0.095,
					// 		radius: 0.2
					// 	}
					// },
				],

			},
			{
				id: "1.4",
				baseFov: 95,
				fovTransition: true,
				sequenceBobName: "link",

				type: "third-person",
				cameraTriggerTimeDecay: 3,
				cameraType: "hips",

				animatedMesh: false,

				helpers: {
					orbit: true,
					tubes: false,
					timelines: false
				},
				
				fog: {
					enabled: true,
					color: "#FFFFFF",
					intensity: .35
				},

				alice: {
					handleGround: false,
					name: "queen",
					move: {
						jazz: true
					},
					scale: 0.35,
					offset: {
						x: 0,
						y: -9,
						z: 0
					},
					rotate: {
						x: 0,
						y: 10,
						z: 0
					},
					slowmo: 25
				},

				bobImposedMoves: {
					// climb: true,
					fly: true,
					// left: false,
					// right: false,
					// space: false,
					shift: false
				},

				postproc: [
					{
						type: "bloom",
						value: {
							strength: .7,
							threshold: 0.045,
							radius: 0.6
						}
					},
				]

			}
		]

	},

	{
		name: "world_0-5",

		main: {

			spaceColor: "#03000D",
			spaceColorDarker: "#010005",
			spaceColorWithBloom: "#010003",

			ambient: {
				sunColor: "#03000D",
				intensity: 0.5,
				groundColor: "#0A0067"
			},

			fog: {
				enabled: false,
				color: 0x0A0067,
				intensity: .25
			},

			particles: [
				{
					type: "fireflies",
					count: 200,
					particleSize: 30,
					additive: true,
					timeRatio: 1.0,
					blockSize: {
						x: 8,
						y: 2,
						z: 13
					}
				}
			],
			
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
				id: "1.0",
				baseFov: 65,
				fovTransition: true,
				sequenceBobName: "link",

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
							amount: 5,
							fov: 90,
							stepEase: "linear"
						},
						{
							// this amount is a percent of the global duration
							amount: 95,
							fov: 35,
							stepEase: "linear"
						},
						
					]
				},

				postproc: [
			
					{
						type: "bloom",
						value: {
							strength: .5,
							threshold: 0.45,
							radius: 0.01
						}
					},

				]

			},
			{
				id: "1.1",
				baseFov: 27,
				fovTransition: true,
				sequenceBobName: "link",

				type: "third-person",
				cameraTriggerTimeDecay: 2,
				cameraType: "gtaLike",

				animatedMesh: false,

				helpers: {
					orbit: true,
					tubes: false,
					timelines: false
				},
				
				fog: {
					enabled: true,
					color: "#010005",
					intensity: .55
				},

				bobImposedMoves: {
					forward: true,
					left: false,
					right: false
				},

				postproc: [

					{
						type: "bloom",
						value: {
							strength: 0.6,
							threshold: 0.35,
							radius: 0.99
						}
					},
					
				]

			},
			{
				id: "1.2",
				baseFov: 35,
				fovTransition: true,
				sequenceBobName: "link",

				type: "third-person",
				cameraType: "movingHips",
				cameraTriggerTimeDecay: 10,

				animatedMesh: false,

				helpers: {
					orbit: true,
					tubes: false,
					timelines: false
				},
				
				fog: {
					enabled: true,
					color: "#010005",
					intensity: .25
				},

				alice: {
					handleGround: false,
					name: "queen",
					move: {
						floating: true
					},
					offset: {
						x: 0.2,
						y: -0.15,
						z: 0
					},
					scale: 0.008,
					slowmo: 1
				},

				slowmo: 1,

				bobImposedMoves: {
					// forward: true
				},

				postproc: [

					{
						type: "blur",
						focusTarget: "queen",
						value: {
							focus: 1,
							aperture: 0.025,
							maxblur: 0.008
						}
					},

				]

			},
			{
				id: "1.3",
				baseFov: 35,
				fovTransition: true,
				sequenceBobName: "link",

				
				type: "third-person",
				cameraTriggerTimeDecay: 10,
				cameraType: "movingHips",

				animatedMesh: false,

				helpers: {
					orbit: true,
					tubes: false,
					timelines: false
				},
				
				fog: {
					enabled: false,
					color: "#160D54",
					intensity: .2
				},

				alice: {
					handleGround: false,
					name: "queen",
					move: {
						jazz: true
					},
					scale: 0.003,
					slowmo: 9
				},

				bobImposedMoves: {
					hiphop: true,
					forward: false,
					backward: false,
					shift: false
					// shift: false
				},

				postproc: [

					{
						type: "blur",
						focusTarget: "queen",
						value: {
							focus: 1,
							aperture: 0.025,
							maxblur: 0.005
						}
					},
					
				],

			},
			{
				id: "1.4",
				baseFov: 35,
				fovTransition: true,
				sequenceBobName: "link",

				type: "third-person",
				cameraTriggerTimeDecay: 14,
				cameraType: "movingFly",

				animatedMesh: false,

				helpers: {
					orbit: true,
					tubes: false,
					timelines: false
				},
				
				fog: {
					enabled: true,
					color: "#010005",
					intensity: .3
				},

				bobImposedMoves: {
					fly: true
				},

				postproc: []

			}
		]

	},
	
	{
		name: "world_1",

		main: {

			spaceColor: "#000000",
			spaceColorDarker: "#000000",
			spaceColorWithBloom: "#000000",

			ambient: {
				sunColor: "#FF4E00",
				intensity: 0.5,
				groundColor: "#000000"
			},

			fog: {
				enabled: true,
				color: 0xff9500,
				intensity: .25
			},

			particles: [
				{
					type: "fireflies",
					count: 200,
					particleSize: 30,
					additive: true,
					timeRatio: 1.0,
					blockSize: {
						x: 3,
						y: 5,
						z: 10
					}
				}
			],
			
			meshInfos: {

				glbPath: "/assets/3d/worlds/epicFly/epicFly.glb",
				imagePath: {
					landscape: "/assets/3d/worlds/epicFly/epicFlyBake.jpg"
				}
			},


			entities: ["link", "juan", "queen"],

		},

		sequences: [
			{
				id: "1.0",
				baseFov: 65,
				fovTransition: true,
				sequenceBobName: "link",

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
					duration: 15,
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

				postproc: [
		
					{
						type: "bloom",
						value: {
							strength: .5,
							threshold: 0.45,
							radius: 0.01
						}
					},

				]

			},
			{
				id: "1.1",
				baseFov: 27,
				fovTransition: true,
				sequenceBobName: "link",

				type: "third-person",
				cameraTriggerTimeDecay: 2,
				cameraType: "movingHips",

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
					forward: true
				},

				postproc: [

					{
						type: "bloom",
						value: {
							strength: 0.3,
							threshold: 0.35,
							radius: 0.99
						}
					},
					
				]

			},
			{
				id: "1.2",
				baseFov: 35,
				fovTransition: true,
				sequenceBobName: "link",

				type: "third-person",
				cameraType: "movingHips",
				cameraTriggerTimeDecay: 10,

				animatedMesh: false,

				helpers: {
					orbit: true,
					tubes: false,
					timelines: false
				},
				
				fog: {
					enabled: false,
					color: "#040116",
					intensity: .15
				},

				bobImposedMoves: {
					forward: true,
					shift: true
				},

				postproc: [

					{
						type: "vignette",
						darkness: 1.5,
						offset: 1.15
					},

				]

			},
			{
				id: "1.3",
				baseFov: 35,
				fovTransition: true,
				sequenceBobName: "link",

				
				type: "third-person",
				cameraTriggerTimeDecay: 10,
				cameraType: "movingHips",

				animatedMesh: false,

				helpers: {
					orbit: true,
					tubes: false,
					timelines: false
				},
				
				fog: {
					enabled: false,
					color: "#160D54",
					intensity: .2
				},

				bobImposedMoves: {
					hiphop: true,
					forward: false,
					backward: false,
					shift: false
					// shift: false
				},

				postproc: [

					{
						type: "bloom",
						value: {
							strength: 0.3,
							threshold: 0.35,
							radius: 0.99
						}
					},
					
				],

			},
			{
				id: "1.4",
				baseFov: 35,
				fovTransition: true,
				sequenceBobName: "link",

				type: "third-person",
				cameraTriggerTimeDecay: 3,
				cameraType: "behindFly",

				animatedMesh: false,

				helpers: {
					orbit: true,
					tubes: false,
					timelines: false
				},
				
				fog: {
					enabled: true,
					color: "#000000",
					intensity: .1
				},

				bobImposedMoves: {
					fly: true,
					shift: true
				},

				// slowmo: 5,

				postproc: []

			}
		]

	},

	{
		name: "world_2",

		main: {

			spaceColor: "#000000",
			spaceColorDarker: "#000000",
			spaceColorWithBloom: "#000000",

			ambient: {
				sunColor: "#FF4E00",
				intensity: 0.5,
				groundColor: "#000000"
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
					particleSize: 30,
					additive: true,
					timeRatio: 1.0,
					blockSize: {
						x: 5,
						y: 2,
						z: 5
					}
				}
			],
			
			meshInfos: {

				glbPath: "/assets/3d/worlds/swift/swift.glb",
				imagePath: {
					landscape: "/assets/3d/worlds/swift/swiftBake.jpg"
				}
			},


			entities: ["link", "juan", "queen"],

		},

		sequences: [
			{
				id: "1.0",
				baseFov: 65,
				fovTransition: true,
				sequenceBobName: "link",

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
					duration: 15,
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

				postproc: [
			
					{
						type: "bloom",
						value: {
							strength: .5,
							threshold: 0.45,
							radius: 0.01
						}
					},

				]

			},
			{
				id: "1.1",
				baseFov: 27,
				fovTransition: true,
				sequenceBobName: "link",

				// type: "blender-points",
				type: "third-person",
				cameraTriggerTimeDecay: 2,
				cameraType: "movingHips",

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
					forward: true
				},

				postproc: [

					{
						type: "bloom",
						value: {
							strength: 0.3,
							threshold: 0.35,
							radius: 0.99
						}
					},
					
				]

			},
			{
				id: "1.2",
				baseFov: 35,
				fovTransition: true,
				sequenceBobName: "link",

				type: "third-person",
				cameraType: "movingHips",
				cameraTriggerTimeDecay: 10,

				animatedMesh: false,

				helpers: {
					orbit: true,
					tubes: false,
					timelines: false
				},
				
				fog: {
					enabled: false,
					color: "#040116",
					intensity: .15
				},

				bobImposedMoves: {
					forward: true,
					shift: true
				},

				// slowmo: 5,

				postproc: [
				
					{
						type: "vignette",
						darkness: 1.5,
						offset: 1.15
					},

				]

			},
			{
				id: "1.3",
				baseFov: 35,
				fovTransition: true,
				sequenceBobName: "link",

				
				type: "third-person",
				cameraTriggerTimeDecay: 10,
				cameraType: "movingHips",

				animatedMesh: false,

				helpers: {
					orbit: true,
					tubes: false,
					timelines: false
				},
				
				fog: {
					enabled: false,
					color: "#160D54",
					intensity: .2
				},

				bobImposedMoves: {
					hiphop: true,
					forward: false,
					backward: false,
					shift: false
				},

				postproc: [

					{
						type: "bloom",
						value: {
							strength: 0.3,
							threshold: 0.35,
							radius: 0.99
						}
					},
					
				],

			},
			{
				id: "1.4",
				baseFov: 95,
				fovTransition: true,
				sequenceBobName: "link",

				type: "third-person",
				cameraTriggerTimeDecay: 3,
				cameraType: "movingFly",

				animatedMesh: false,

				helpers: {
					orbit: true,
					tubes: false,
					timelines: false
				},
				
				fog: {
					enabled: false,
					color: "#000000",
					intensity: .15
				},

				bobImposedMoves: {
					fly: true
				},

				slowmo: 5,

				postproc: [
				
					
					{
						type: "bloom",
						value: {
							strength: 0.3,
							threshold: 0.35,
							radius: 0.99
						}
					},
					
				]

			}
		]

	},

	{
		name: "world_2",

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

			particles: [
				{
					type: "fireflies",
					count: 200,
					particleSize: 30,
					additive: true,
					timeRatio: 1.0,
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
				id: "1.0",
				baseFov: 65,
				fovTransition: true,
				sequenceBobName: "link",

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
					duration: 5,
					// isUsingTarget indicate that we need a plan-1.0-target point in the glb
					isUsingTarget: true,
					steps: [
						// n steps are possibles
						// n has nothing to do with the number of points for the curve
						{
							// this amount is a percent of the global duration
							amount: 50,
							fov: 60,
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
				id: "1.1",
				baseFov: 27,
				fovTransition: true,
				sequenceBobName: "link",

				// type: "blender-points",
				type: "third-person",
				cameraTriggerTimeDecay: 2,
				cameraType: "movingHips",

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
					forward: true
				},

				postproc: [

					{
						type: "vignette",
						darkness: 1.5,
						offset: 1.04
					},

					{
						type: "bloom",
						value: {
							strength: 0.3,
							threshold: 0.35,
							radius: 0.99
						}
					},

					{
						type: "glitch"
					},

				]

			},
			{
				id: "1.2",
				baseFov: 35,
				fovTransition: true,
				sequenceBobName: "link",

				// type: "blender-points",
				type: "third-person",
				cameraType: "movingHips",
				cameraTriggerTimeDecay: 10,

				animatedMesh: false,

				helpers: {
					orbit: true,
					tubes: false,
					timelines: false
				},
				
				fog: {
					enabled: false,
					color: "#040116",
					intensity: .15
				},

				bobImposedMoves: {
					forward: true,
					shift: true
				},

				// slowmo: 5,

				postproc: [
					
					{
						type: "vignette",
						darkness: 1.5,
						offset: 1.15
					},

				]

			},
			{
				id: "1.3",
				baseFov: 35,
				fovTransition: true,
				sequenceBobName: "link",

				
				type: "third-person",
				cameraTriggerTimeDecay: 10,
				cameraType: "movingHips",

				animatedMesh: false,

				helpers: {
					orbit: true,
					tubes: false,
					timelines: false
				},
				
				fog: {
					enabled: false,
					color: "#160D54",
					intensity: .2
				},

				bobImposedMoves: {
					hiphop: true,
					forward: false,
					backward: false,
					shift: false
				},

				postproc: [

					{
						type: "bloom",
						value: {
							strength: 0.3,
							threshold: 0.35,
							radius: 0.99
						}
					},

				],

			},
			{
				id: "1.4",
				baseFov: 95,
				fovTransition: true,
				sequenceBobName: "link",

				type: "third-person",
				cameraTriggerTimeDecay: 3,
				cameraType: "movingFly",

				animatedMesh: false,

				helpers: {
					orbit: true,
					tubes: false,
					timelines: false
				},
				
				fog: {
					enabled: false,
					color: "#000000",
					intensity: .15
				},

				bobImposedMoves: {
					fly: true
				},

				slowmo: 5,

				postproc: [
					
					{
						type: "bloom",
						value: {
							strength: 0.3,
							threshold: 0.35,
							radius: 0.99
						}
					},
					
				]

			}
		]

	},

	{
		name: "world_3",

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

				glbPath: "/assets/3d/worlds/epicValley/epicValley.glb",
				imagePath: {
					landscape: "/assets/3d/worlds/epicValley/epicValleyBake.jpg"
				}

			},

			entities: ["link", "juan"],

		},

		sequences: [
			{
				id: "1.0",
				baseFov: 65,
				fovTransition: true,
				sequenceBobName: "link",

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
					duration: 5,
					// isUsingTarget indicate that we need a plan-1.0-target point in the glb
					isUsingTarget: true,
					steps: [
						// n steps are possibles
						// n has nothing to do with the number of points for the curve
						{
							// this amount is a percent of the global duration
							amount: 50,
							fov: 60,
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
				id: "1.1",
				baseFov: 27,
				fovTransition: true,
				sequenceBobName: "juan",

				type: "third-person",
				cameraTriggerTimeDecay: 6,
				cameraType: "movingHips",

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

				bobImposedMoves: {},

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
			{
				id: "1.2",
				baseFov: 35,
				fovTransition: true,
				sequenceBobName: "link",

				type: "third-person",
				cameraType: "movingHips",
				cameraTriggerTimeDecay: 10,

				animatedMesh: false,

				helpers: {
					orbit: true,
					tubes: false,
					timelines: false
				},
				
				fog: {
					enabled: false,
					color: "#040116",
					intensity: .15
				},

				bobImposedMoves: {
					forward: true,
					shift: true,
					left: false,
					right: false
				},

				slowmo: 5,

				postproc: [

					{
						type: "vignette",
						darkness: 1.5,
						offset: 1.15
					},

				]

			},
			{
				id: "1.3",
				baseFov: 35,
				fovTransition: true,
				sequenceBobName: "juan",

				
				type: "third-person",
				cameraTriggerTimeDecay: 10,
				cameraType: "movingHips",

				animatedMesh: false,

				helpers: {
					orbit: true,
					tubes: false,
					timelines: false
				},
				
				fog: {
					enabled: false,
					color: "#160D54",
					intensity: .2
				},

				bobImposedMoves: {},

				postproc: [

					{
						type: "bloom",
						value: {
							strength: 0.3,
							threshold: 0.35,
							radius: 0.99
						}
					},
					
				],

			},
			{
				id: "1.4",
				baseFov: 95,
				fovTransition: true,
				sequenceBobName: "link",

				type: "third-person",
				cameraTriggerTimeDecay: 3,
				cameraType: "movingFly",

				animatedMesh: false,

				helpers: {
					orbit: true,
					tubes: false,
					timelines: false
				},
				
				fog: {
					enabled: false,
					color: "#000000",
					intensity: .15
				},

				bobImposedMoves: {
					fly: true
				},

				postproc: [
					
					{
						type: "bloom",
						value: {
							strength: 0.9,
							threshold: 0.35,
							radius: 0.999
						}
					},
					
				]

			}
		]

	},


	
]

export { worlds };