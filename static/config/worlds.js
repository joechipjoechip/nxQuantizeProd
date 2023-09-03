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

			spaceColor: "#000211",
			spaceColorDarker: "#000211",
			spaceColorWithBloom: "#000211",

			ambient: {
				sunColor: "#ffffff",
				intensity: 0.13,
				groundColor: "#000a54"
			},

			fog: {
				enabled: false,
				color: "#0025FF",
				intensity: .75
			},

			particles: [
				{
					type: "fireflies",
					count: 100,
					particleSize: 180,
					additive: true,
					timeRatio: 36.0,
					blockSize: {
						x: 3,
						y: 3,
						z: 3
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

			meshCustomShaderOptions: {
				enabled: true,
				shaderTimeRatio: 10,
				shaderName: "plastic2",
				shaderScale: 16,
				shaderAxe: "xy"
			},

		},

		sequences: [
			{
				id: "1.0",
				baseFov: 5,
				fovTransition: false,
				sequenceBobName: "marie",
				until: 7.3,
				nextInstruction: "switch-sequence",

				type: "blender-points",

				animatedMesh: false,

				cameraInvert: {
					x: false,
					y: true
				},

				helpers: {
					orbit: false,
					tubes: false,
					timelines: false
				},

				customShaderOptions: {
					timeRatio: 2.15
				},

				fog: {
					enabled: true,
					color: "#ffffff",
					intensity: .05
				},

				tubeInfos: {
					duration: 12,
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

				slowmo: 2.7,

				bobImposedMoves: {
					forward: true,
					dance: false,
					backward: false,
					shift: false,
					left: false,
					right: false,
				},

				postproc: [
					{
						type: "bloom",
						value: {
							strength: 0.7,
							threshold: 0.00035,
							radius: 0.7
						}
					},
				]

			},
			{
				id: "1.1",
				baseFov: 27,
				fovTransition: false,
				sequenceBobName: "marie",

				type: "third-person",
				cameraTriggerTimeDecay: 5,
				cameraType: "helmet-low-leave-house",

				until: 10.8,
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
					intensity: .68
				},

				slowmo: 2.7,

				bobImposedMoves: {
					forward: true,
					dance: false,
					left: false,
					right: false,
				},

				postproc: [

					{
						type: "bloom",
						value: {
							strength: 0.7,
							threshold: 0.00035,
							radius: 0.7
						}
					},

				]

			},
			{
				id: "1.2",
				baseFov: 20,
				fovTransition: false,
				sequenceBobName: "marie",

				type: "third-person",
				cameraTriggerTimeDecay: 6,
				cameraType: "movingHips-lookUp",

				until: 12.65,
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
					intensity: .68
				},

				slowmo: 1.85,

				bobImposedMoves: {
					forward: true,
					dance: false
				},

				postproc: [

					{
						type: "bloom",
						value: {
							strength: 0.7,
							threshold: 0.00035,
							radius: 0.7
						}
					},

				]

			},
			{
				id: "1.3",
				baseFov: 25,
				fovTransition: false,
				sequenceBobName: "marie",

				type: "third-person",
				cameraTriggerTimeDecay: 10,
				cameraType: "movingHips-lookUp",

				until: 14.2,
				nextInstruction: "switch-scene",

				animatedMesh: false,

				helpers: {
					orbit: false,
					tubes: false,
					timelines: false
				},

				fog: {
					enabled: false,
					color: "#000000",
					intensity: .68
				},

				slowmo: 1.85,

				bobImposedMoves: {
					forward: true,
					shift: false
				},

				postproc: [
					{
						type: "bloom",
						value: {
							strength: 0.8,
							threshold: 0.00035,
							radius: 0.45
						}
					},
					
				]

			},

		]

	},

	{
		name: "world_005",

		main: {

			spaceColor: "#002038",
			spaceColorDarker: "#001220",
			spaceColorWithBloom: "#000005",

			ambient: {
				sunColor: "#FFFFFF",
				intensity: 0.12,
				groundColor: "#FFFFFF"
			},

			particles: [
				{
					type: "fireflies",
					count: 150,
					particleSize: 70,
					additive: true,
					timeRatio: 8.0,
					blockSize: {
						x: 7,
						y: 12,
						z: 5
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

		},

		sequences: [
			{
				id: "2.3",
				baseFov: 15,
				fovTransition: false,
				sequenceBobName: "link",
				until: 21.5,
				nextInstruction: "switch-sequence",

				type: "blender-points",

				cameraInvert: {
					x: false,
					y: true
				},

				animatedMesh: false,

				helpers: {
					orbit: true,
					tubes: false,
					timelines: false
				},

				fog: {
					enabled: false,
					color: "#22ffa2",
					intensity: 15
				},

				bobImposedMoves: {
					backward: false,
					forward: true,
					shift: false,
					dance: false,
					left: false,
					right: false
				},

				slowmo: 2.3,

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
							fov: 30,
							stepEase: "linear"
						},

					]
				},

				// alice: {
				// 	handleGround: false,
				// 	name: "queenShader",
				// 	move: {
				// 		floating: true
				// 	},
				// 	offset: {
				// 		x: 0,
				// 		y: 0,
				// 		z: 0
				// 	},
				// 	scale: 0.035,
				// 	slowmo: 9,
				// 	customShaderOptions: {
				// 		shaderTimeRatio: 0.5,
				// 		shaderTimeDecay: 4,
				// 		isCameraPositionInfluenced: false,
				// 		sin: false,
				// 		sinAmplitude: 60
				// 	}
				// },

				postproc: [
					{
						type: "bloom",
						value: {
							strength: 0.7,
							threshold: 0.00035,
							radius: 0.7
						}
					},
				]

			},
			{
				id: "2.4",
				baseFov: 27,
				fovTransition: true,
				sequenceBobName: "link",

				type: "third-person",
				cameraTriggerTimeDecay: 10,
				cameraType: "movingHips-link-edge",

				until: 28.5,
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
					dance: false,
					teeter: true,
					left: false,
					right: false
				},

				slowmo: 1.9,

				postproc: [
					{
						type: "bloom",
						value: {
							strength: 0.7,
							threshold: 0.00035,
							radius: 0.7
						}
					}
				]

			},

			// drop du run ! 
			{
				id: "3.7",
				baseFov: 28,
				fovTransition: true,
				sequenceBobName: "link",

				type: "third-person",
				cameraTriggerTimeDecay: 6,
				cameraType: "movingHips-lookUp-xDecayed",

				until: 64.58,
				nextInstruction: "switch-scene",

				animatedMesh: false,

				helpers: {
					orbit: true,
					tubes: false,
					timelines: false
				},

				fog: {
					enabled: false,
					color: "#22ffa2",
					intensity: 15
				},

				bobImposedMoves: {
					backward: false,
					forward: true,
					shift: true,
					dance: false
				},

				alice: {
					handleGround: false,
					name: "queenShader",
					move: {
						floating: true,
						left: false,
						right: false
					},
					offset: {
						x: 0,
						y: -0.25,
						z: 0
					},
					scale: 0.03,
					slowmo: 2,
					customShaderOptions: {
						shaderTimeRatio: 0.08,
						shaderTimeDecay: 12,
						isCameraPositionInfluenced: false,
						sin: true,
						sinAmplitude: 20
					}
				},

				postproc: [

					{
						type: "bloom",
						value: {
							strength: 0.8,
							threshold: 0.00035,
							radius: 0.7
						}
					},

				]

			},
			{
				id: "5.9",
				baseFov: 30,
				fovTransition: false,
				sequenceBobName: "link",

				type: "third-person",
				cameraTriggerTimeDecay: 6,
				cameraType: "movingHips-lookUp",

				until: 91,
				nextInstruction: "switch-sequence",

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
					forward: false,
					shift: false,
					dance: false,
					enjoy: true
				},

				slowmo: 1.1,

				alice: {
					handleGround: false,
					name: "queenShader",
					move: {
						floating: true,
						left: false,
						right: false
					},
					offset: {
						x: 0,
						y: -0.25,
						z: 0
					},
					scale: 0.03,
					slowmo: 2,
					customShaderOptions: {
						shaderTimeRatio: 0.1,
						shaderTimeDecay: 12,
						isCameraPositionInfluenced: false,
						sin: true,
						sinAmplitude: 20
					}
				},

				postproc: [

					{
						type: "bloom",
						value: {
							strength: 0.8,
							threshold: 0.00035,
							radius: 0.7
						}
					},

				]

			},
			{
				id: "5.10",
				baseFov: 20,
				fovTransition: false,
				sequenceBobName: "link",

				type: "blender-points",

				until: 93.85,
				nextInstruction: "switch-sequence",

				cameraInvert: {
					x: false,
					y: true
				},

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
					forward: false,
					shift: false,
					dance: false,
					enjoy: true,
					left: false,
					right: false,
				},

				slowmo: 1.1,

				alice: {
					handleGround: false,
					name: "queenShader",
					move: {
						floating: true,
						left: false,
						right: false
					},
					offset: {
						x: 0,
						y: -0.275,
						z: 0
					},
					scale: 0.03,
					slowmo: 2,
					customShaderOptions: {
						shaderTimeRatio: 0.01,
						shaderTimeDecay: 12,
						isCameraPositionInfluenced: false,
						sin: true,
						sinAmplitude: 20
					}
				},

				tubeInfos: {
					duration: 6,
					// isUsingTarget indicate that we need a plan-1.0-target point in the glb
					isUsingTarget: true,
					steps: [
						// n steps are possibles
						// n has nothing to do with the number of points for the curve
						{
							// this amount is a percent of the global duration
							amount: 100,
							fov: 18,
							stepEase: "linear"
						},

					]
				},

				postproc: [

					{
						type: "bloom",
						value: {
							strength: 0.8,
							threshold: 0.00035,
							radius: 0.7
						}
					},

				]

			},
			{
				id: "5.11",
				baseFov: 90,
				fovTransition: false,
				sequenceBobName: "link",

				type: "blender-points",

				until: 99.6,
				nextInstruction: "drop-and-load-and-switch",

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
					forward: false,
					shift: false,
					dance: false,
					enjoy: true
				},

				slowmo: 2,

				alice: {
					handleGround: false,
					name: "queenShader",
					move: {
						floating: true
					},
					offset: {
						x: 0,
						y: -0.25,
						z: 0
					},
					scale: 0.03,
					slowmo: 2,
					customShaderOptions: {
						shaderTimeRatio: 0.01,
						shaderTimeDecay: 12,
						isCameraPositionInfluenced: false,
						sin: true,
						sinAmplitude: 20
					}
				},

				tubeInfos: {
					duration: 7,
					// isUsingTarget indicate that we need a plan-1.0-target point in the glb
					isUsingTarget: true,
					steps: [
						// n steps are possibles
						// n has nothing to do with the number of points for the curve
						{
							// this amount is a percent of the global duration
							amount: 32,
							fov: 25,
							stepEase: "easeInOut"
						},
						{
							// this amount is a percent of the global duration
							amount: 25,
							fov: 55,
							stepEase: "easeInOut"
						},
						{
							// this amount is a percent of the global duration
							amount: 43,
							fov: 5,
							stepEase: "easeIn"
						},

					]
				},

				postproc: [

					{
						type: "bloom",
						value: {
							strength: 0.8,
							threshold: 0.00035,
							radius: 0.7
						}
					},

				]

			},
			{
				id: "6.12",
				baseFov: 10,
				fovTransition: false,
				bobRestoreSize: 0.0008,

				type: "blender-points",

				cameraInvert: {
					x: false,
					y: true
				},

				until: 122.35,
				nextInstruction: "switch-scene",

				animatedMesh: false,

				helpers: {
					orbit: false,
					tubes: false,
					timelines: false
				},

				fog: {
					enabled: false,
					color: "#000005",
					intensity: .3
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
							fov: 25,
							stepEase: "linear"
						}

					]
				},

				slowmo: 2,

				bobImposedMoves: {
					forward: false,
					shift: false,
					backward: true,
					hiphop: false,
					left: false,
					right: false,
				},

				alice: {
					handleGround: true,
					name: "linkShaderPlastic",
					move: {
						housedance: true
					},
					offset: {
						x: 0,
						y: 0,
						z: 0
					},
					scale: 0.01,
					slowmo: 2,
					customShaderOptions: {
						shaderTimeRatio: 1.5,
						shaderTimeDecay: 5,
						isCameraPositionInfluenced: false,
						sin: false,
						sinAmplitude: 60
					}
				},

				postproc: [

					// {
					// 	type: "kaleidoscope",
					// 	sides: 1,
					// 	angle: -25
					// },

					{
						type: "bloom",
						value: {
							strength: 0.7,
							threshold: 0.00035,
							radius: 0.3
						}
					},

					// {
					// 	type: "blur",
					// 	focusTarget: "linkShader",
					// 	value: {
					// 		focus: 1,
					// 		aperture: 0.025,
					// 		maxblur: 0.05
					// 	}
					// },

				]

			},

		]

	},

	{
		name: "world_010",

		main: {

			spaceColor: "#000211",
			spaceColorDarker: "#000211",
			spaceColorWithBloom: "#000211",

			ambient: {
				sunColor: "#1d00a7",
				intensity: 0.16,
				groundColor: "#370090"
			},

			fog: {
				enabled: false,
				color: 0xff9500,
				intensity: .05
			},

			meshInfos: {

				glbPath: "/assets/3d/worlds/caveEntrance/caveEntrance.glb",
				imagePath: {
					landscape: "/assets/3d/worlds/caveEntrance/caveEntranceBake.jpg"
				}

			},

			meshCustomShaderOptions: {
				enabled: true,
				shaderTimeRatio: 1,
				shaderName: "plastic",
				shaderScale: 2,
				shaderAxe: "zy"
			},

		},

		sequences: [
			{
				id: "2.5",
				baseFov: 350,
				fovTransition: false,
				sequenceBobName: "marie",
				until: 36,
				nextInstruction: "switch-sequence",

				type: "blender-points",

				cameraInvert: {
					x: false,
					y: true
				},

				animatedMesh: false,

				helpers: {
					orbit: false,
					tubes: false,
					timelines: false
				},

				fog: {
					enabled: true,
					color: "#22ffa2",
					intensity: .15
				},

				bobImposedMoves: {
					forward: true,
					// shift: false
					left: false,
					right: false,
				},

				slowmo: 2.3,

				alice: {
					handleGround: false,
					name: "queenShader",
					move: {
						floating: true,
						left: false,
						right: false
					},
					offset: {
						x: 0,
						y: -0.15,
						z: 0
					},
					scale: 0.008,
					slowmo: 5,
					customShaderOptions: {
						shaderTimeRatio: 0.01,
						shaderTimeDecay: 8,
						isCameraPositionInfluenced: false,
						sin: true,
						sinAmplitude: 60
					}
				},

				tubeInfos: {
					duration: 7,
					// isUsingTarget indicate that we need a plan-1.0-target point in the glb
					isUsingTarget: true,
					steps: [
						// n steps are possibles
						// n has nothing to do with the number of points for the curve
						{
							// this amount is a percent of the global duration
							amount: 100,
							fov: 15,
							stepEase: "linear"
						}

					]
				},

				postproc: [

					{
						type: "bloom",
						value: {
							strength: 0.7,
							threshold: 0.00035,
							radius: 0.7
						}
					},
					// {
					// 	type: "blur",
					// 	focusTarget: "queen",
					// 	value: {
					// 		focus: 1,
					// 		aperture: 0.055,
					// 		maxblur: 0.004
					// 	}
					// },
				]

			},
			{
				id: "2.6",
				baseFov: 85,
				fovTransition: false,
				sequenceBobName: "marie",

				type: "third-person",
				cameraTriggerTimeDecay: 8,
				cameraType: "movingHips-4",

				until: 43,

				nextInstruction: "switch-sequence",

				animatedMesh: false,

				helpers: {
					orbit: false,
					tubes: false,
					timelines: false
				},

				fog: {
					enabled: true,
					color: "#22ffa2",
					intensity: .15
				},

				alice: {
					handleGround: false,
					name: "queenShader",
					move: {
						floating: true,
						left: false,
						right: false
					},
					offset: {
						x: 0,
						y: -0.15,
						z: 0
					},
					scale: 0.008,
					slowmo: 5,
					customShaderOptions: {
						shaderTimeRatio: 0.02,
						shaderTimeDecay: 8,
						isCameraPositionInfluenced: false,
						sin: true,
						sinAmplitude: 160
					}
				},

				slowmo: 2,

				bobImposedMoves: {
					forward: true,
					shift: false
				},

				postproc: [

					{
						type: "bloom",
						value: {
							strength: 0.55,
							threshold: 0.00035,
							radius: 0.45
						}
					},

					{
						type: "glitch"
					},

					// {
					// 	type: "blur",
					// 	focusTarget: "queenShader",
					// 	value: {
					// 		focus: 1,
					// 		aperture: 0.0025,
					// 		maxblur: 0.06
					// 	}
					// },

				]

			},
			{
				id: "2.7",
				baseFov: 30,
				fovTransition: false,
				sequenceBobName: "marie",

				type: "third-person",
				cameraTriggerTimeDecay: 6,
				cameraType: "movingHips-lookUp",

				// drop du run ! timer
				until: 56.7,

				nextInstruction: "switch-scene",

				animatedMesh: false,

				helpers: {
					orbit: false,
					tubes: false,
					timelines: false
				},

				fog: {
					enabled: true,
					color: "#22ffa2",
					intensity: .3
				},

				slowmo: 1.2,

				bobImposedMoves: {
					forward: true,
					shift: false,
					// enjoy: true
				},

				alice: {
					handleGround: false,
					name: "queenShader",
					move: {
						floating: true,
						left: false,
						right: false
					},
					offset: {
						x: 0,
						y: -0.15,
						z: 0
					},
					scale: 0.008,
					slowmo: 5,
					customShaderOptions: {
						shaderTimeRatio: 0.02,
						shaderTimeDecay: 8,
						isCameraPositionInfluenced: false,
						sin: true,
						sinAmplitude: 160
					}
				},

				postproc: [

					{
						type: "bloom",
						value: {
							strength: 0.6,
							threshold: 0.00035,
							radius: 0.7
						}
					},

					// {
					// 	type: "blur",
					// 	focusTarget: "queenShader",
					// 	value: {
					// 		focus: 1,
					// 		aperture: 0.025,
					// 		maxblur: 0.0004
					// 	}
					// },

				]

			},
			{
				id: "4.7",
				baseFov: 32,
				fovTransition: false,
				sequenceBobName: "marie",

				type: "third-person",
				cameraTriggerTimeDecay: 6,
				cameraType: "movingHips-lookUp-xDecayed",

				until: 72,
				nextInstruction: "switch-sequence",

				animatedMesh: false,

				helpers: {
					orbit: false,
					tubes: false,
					timelines: false
				},

				fog: {
					enabled: true,
					color: "#22ffa2",
					intensity: .2
				},

				alice: {
					handleGround: false,
					name: "queenShader",
					move: {
						floating: true,
						left: false,
						right: false
					},
					offset: {
						x: 0,
						y: -0.15,
						z: 0
					},
					scale: 0.008,
					slowmo: 5,
					customShaderOptions: {
						shaderTimeRatio: 0.02,
						shaderTimeDecay: 8,
						isCameraPositionInfluenced: false,
						sin: true,
						sinAmplitude: 160
					}
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
						type: "bloom",
						value: {
							strength: 0.8,
							threshold: 0.00035,
							radius: 0.4
						}
					},

					// {
					// 	type: "blur",
					// 	focusTarget: "queenShader",
					// 	value: {
					// 		focus: 1,
					// 		aperture: 0.025,
					// 		maxblur: 0.02
					// 	}
					// },

				]

			},
			{
				id: "4.8",
				baseFov: 20,
				fovTransition: false,
				sequenceBobName: "marie",

				type: "blender-points",
				// type: "fake-orbit",
				cameraInvert: {
					x: true,
					y: false
				},

				until: 78.9,
				nextInstruction: "switch-sequence",

				animatedMesh: false,

				helpers: {
					orbit: false,
					tubes: false,
					timelines: false
				},

				fog: {
					enabled: true,
					color: "#22ffa2",
					intensity: .15
				},

				alice: {
					handleGround: false,
					name: "queenShader",
					move: {
						floating: true,
						left: false,
						right: false
					},
					offset: {
						x: 0,
						y: -0.15,
						z: 0
					},
					scale: 0.008,
					slowmo: 5,
					customShaderOptions: {
						shaderTimeRatio: 0.02,
						shaderTimeDecay: 8,
						isCameraPositionInfluenced: false,
						sin: true,
						sinAmplitude: 160
					}
				},

				slowmo: 2,

				bobImposedMoves: {
					forward: true,
					shift: true,
					backward: false,
					dance: false,
					left: false,
					right: false,
				},

				tubeInfos: {
					duration: 8,
					// isUsingTarget indicate that we need a plan-1.0-target point in the glb
					isUsingTarget: "marie",
					steps: [
						// n steps are possibles
						// n has nothing to do with the number of points for the curve
						{
							// this amount is a percent of the global duration
							amount: 25,
							fov: 90,
							stepEase: "easeInOut"
						},
						{
							// this amount is a percent of the global duration
							amount: 20,
							fov: 25,
							stepEase: "easeIn"
						},
						{
							// this amount is a percent of the global duration
							amount: 55,
							fov: 85,
							stepEase: "easeOut"
						},

					]
				},

				postproc: [

					{
						type: "bloom",
						value: {
							strength: 0.8,
							threshold: 0.00035,
							radius: 0.7
						}
					},

					// {
					// 	type: "blur",
					// 	focusTarget: "link",
					// 	value: {
					// 		focus: 1,
					// 		aperture: 0.015,
					// 		maxblur: 0.07
					// 	}
					// },

				]

			},
			{
				id: "4.9",
				baseFov: 32,
				fovTransition: false,
				sequenceBobName: "marie",

				type: "third-person",
				cameraTriggerTimeDecay: 10,
				cameraType: "movingHips",

				until: 86,
				nextInstruction: "switch-scene",

				animatedMesh: false,

				helpers: {
					orbit: false,
					tubes: false,
					timelines: false
				},

				fog: {
					enabled: true,
					color: "#22ffa2",
					intensity: .35
				},

				alice: {
					handleGround: false,
					name: "queenShader",
					move: {
						floating: true,
						left: false,
						right: false
					},
					offset: {
						x: 0,
						y: -0.15,
						z: 0
					},
					scale: 0.008,
					slowmo: 3,
					customShaderOptions: {
						shaderTimeRatio: 0.02,
						shaderTimeDecay: 8,
						isCameraPositionInfluenced: false,
						sin: true,
						sinAmplitude: 160
					}
				},

				slowmo: 2.3,

				bobImposedMoves: {
					forward: true,
					shift: false,
					backward: false,
					dance: false
				},

				postproc: [

					{
						type: "bloom",
						value: {
							strength: 0.8,
							threshold: 0.00035,
							radius: 0.7
						}
					},

					// {
					// 	type: "blur",
					// 	focusTarget: "queenShader",
					// 	value: {
					// 		focus: 1,
					// 		aperture: 0.025,
					// 		maxblur: 0.09
					// 	}
					// },

				]

			},

		]

	},

	{
		name: "world_016",

		main: {

			spaceColor: "#051442",
			spaceColorDarker: "#051442",
			spaceColorWithBloom: "#000105",

			ambient: {
				sunColor: "#FFFFFF",
				intensity: 0.35,
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
					count: 550,
					particleSize: 70,
					additive: true,
					timeRatio: 400.0,
					blockSize: {
						x: 5,
						y: 5,
						z: 5
					}
				}
			],

			meshInfos: {

				glbPath: "/assets/3d/worlds/greenMountain/greenMountain.glb",
				imagePath: {
					landscape: "/assets/3d/worlds/greenMountain/greenMountainBake.jpg"
				}
			},


			entities: ["link", "marie"],

		},

		sequences: [

			{
				id: "5.12",
				baseFov: 23,
				fovTransition: true,
				sequenceBobName: "link",
				bobRestoreSize: 0.0009,

				type: "third-person",
				cameraTriggerTimeDecay: 5,
				cameraType: "movingHips-lookUp",

				until: 115,
				nextInstruction: "switch-scene",

				animatedMesh: false,

				helpers: {
					orbit: false,
					tubes: false,
					timelines: false
				},

				fog: {
					enabled: true,
					color: "#000105",
					intensity: .2
				},

				alice: {
					handleGround: true,
					name: "marie",
					move: {
						hiphop: true
					},
					offset: {
						x: 0,
						y: 0,
						z: 0
					},
					scale: 0.035,
					slowmo: 3.6,
					// customShaderOptions: {
					// 	shaderTimeRatio: 0.1,
					// 	shaderTimeDecay: 12,
					// 	isCameraPositionInfluenced: false,
					// 	sin: true,
					// 	sinAmplitude: 120
					// }
				},

				bobImposedMoves: {
					forward: true,
					shift: true,
				},

				slowmo: 1.4,

				postproc: [

					{
						type: "bloom",
						value: {
							strength: .7,
							threshold: 0.00045,
							radius: 0.07
						}
					},
					// {
					// 	type: "blur",
					// 	focusTarget: "marie",
					// 	value: {
					// 		focus: 1,
					// 		aperture: 0.0025,
					// 		maxblur: 0.3
					// 	}
					// },

				]

			},
			{
				id: "7.12",
				baseFov: 15,
				fovTransition: false,
				sequenceBobName: "link",

				type: "third-person",
				cameraTriggerTimeDecay: 5,
				cameraType: "movingHips-lookUp",

				until: 134,
				nextInstruction: "switch-sequence",

				animatedMesh: false,

				helpers: {
					orbit: false,
					tubes: false,
					timelines: false
				},

				fog: {
					enabled: false,
					color: "#000105",
					intensity: .2
				},

				alice: {
					handleGround: true,
					name: "linkShaderPlastic",
					move: {
						// idle: true,
						shift: false,
						forward: true,
						// left: false,
						// right: false
					},
					customShaderOptions: {
						shaderTimeRatio: 0.8,
						shaderTimeDecay: 12,
						isCameraPositionInfluenced: false,
						sin: false,
						sinAmplitude: 20
					},
					offset: {
						x: 0,
						y: 0,
						z: 0
					},
					scale: 0.015,
					slowmo: 3.4,
				},

				bobImposedMoves: {
					forward: true,
					shift: true
				},

				slowmo: 1.3,

				postproc: [

					{
						type: "bloom",
						value: {
							strength: 0.45,
							threshold: 0.0035,
							radius: 0.5
						}
					},
					// {
					// 	type: "blur",
					// 	focusTarget: "linkShaderPlastic",
					// 	value: {
					// 		focus: 1,
					// 		aperture: 0.025,
					// 		maxblur: 0.015
					// 	}
					// },

				]

			},
			{
				id: "7.13",
				baseFov: 120,
				fovTransition: false,
				sequenceBobName: "link",

				type: "blender-points",

				until: 144,
				nextInstruction: "drop-and-load-and-switch",

				animatedMesh: false,

				cameraInvert: {
					x: false,
					y: true
				},

				helpers: {
					orbit: false,
					tubes: false,
					timelines: false
				},

				fog: {
					enabled: false,
					color: "#000105",
					intensity: .2
				},

				tubeInfos: {
					duration: 10.2,
					// isUsingTarget indicate that we need a plan-1.0-target point in the glb
					isUsingTarget: true,
					steps: [
						// n steps are possibles
						// n has nothing to do with the number of points for the curve
						// {
						// 	// this amount is a percent of the global duration
						// 	amount: 100,
						// 	fov: 20,
						// 	stepEase: "linear"
						// },

						
						{
							// this amount is a percent of the global duration
							amount: 20,
							fov: 20,
							stepEase: "easeInOut"
						},
						
						{
							// this amount is a percent of the global duration
							amount: 40,
							fov: 55,
							stepEase: "easeIn"
						},

						{
							// this amount is a percent of the global duration
							amount: 40,
							fov: 190,
							stepEase: "easeInOut"
						},

					]
				},

				alice: {
					handleGround: false,
					name: "linkShaderPlastic",
					move: {
						floating: true,
						forward: false,
						left: false,
						right: true,
						shift: false
					},
					customShaderOptions: {
						shaderTimeRatio: 0.8,
						shaderTimeDecay: 12,
						isCameraPositionInfluenced: false,
						sin: false,
						sinAmplitude: 20
					},
					offset: {
						x: 0,
						y: 0,
						z: 0
					},
					scale: 0.015,
					slowmo: 3.5,
				},

				bobImposedMoves: {
					forward: false,
					floating: true,
					left: false,
					right: true
				},

				slowmo: 3.5,

				postproc: [

					{
						type: "bloom",
						value: {
							strength: 0.4,
							threshold: 0.00035,
							radius: 0.3
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
		name: "world_035",

		main: {

			spaceColor: "#05000b",
			spaceColorDarker: "#05000b",
			spaceColorWithBloom: "#05000b",

			ambient: {
				sunColor: "#eeeeee",
				intensity: 0.25,
				groundColor: "#eeeeee"
			},

			fog: {
				enabled: false,
				color: 0xff9500,
				intensity: .15
			},

			particles: [
				{
					type: "fireflies",
					count: 500,
					particleSize: 70,
					additive: true,
					timeRatio: 36.0,
					blockSize: {
						x: 10,
						y: 10,
						z: 15
					}
				}
			],

			meshInfos: {

				glbPath: "/assets/3d/worlds/five/five.glb",
				imagePath: {
					landscape: "/assets/3d/worlds/five/fiveBake.jpg"
				}
			},

		},

		sequences: [
			{
				id: "7.14",
				baseFov: 23,
				fovTransition: true,
				sequenceBobName: "marie",
				bobRestoreSize: 0.00075,

				type: "third-person",
				cameraTriggerTimeDecay: 45,
				cameraType: "movingFly",

				until: 188.8,
				nextInstruction: "switch-sequence",

				// customShaderOptions: {
				// 	timeRatio: 2.15
				// },

				animatedMesh: false,

				helpers: {
					orbit: false,
					tubes: false,
					timelines: false
				},

				// landscapeMove: {
				// 	x: 0,
				// 	y: 0.0015,
				// 	z: -0.0015
				// },

				fog: {
					enabled: true,
					color: "#05000b",
					intensity: .06
				},

				bobImposedMoves: {
					// forward: true
					fly: true,
					forward: false,
					backward: false,
					// shift: false,
					// left: false,
					// right: false
				},

				slowmo: 1,
				
				alice: {
					handleGround: false,
					name: "linkShaderFlying",
					move: {
						prayup: true,
						shift: false,
						left: false,
						right: false
					},
					offset: {
						x: 0,
						y: -6.4,
						z: -0.8
					},
					scale: 0.165,
					slowmo: 2,
					customShaderOptions: {
						shaderTimeRatio: 0.18,
						shaderTimeDecay: 20,
						sin: false,
						sinAmplitude: 60
					}
				},

				postproc: [
					{
						type: "bloom",
						value: {
							strength: .4,
							threshold: 0.0004,
							radius: 0.45
						}
					},
					// {
					// 	type: "blur",
					// 	focusTarget: "marie",
					// 	value: {
					// 		focus: 1,
					// 		aperture: 0.015,
					// 		maxblur: 0.0038
					// 	}
					// },
				]

			},
			
		]

	},

	{
		name: "world_040",

		main: {

			spaceColor: "#000000",
			spaceColorDarker: "#000000",
			spaceColorWithBloom: "#000000",

			ambient: {
				sunColor: "#000000",
				// intensity: 0.17,
				intensity: 0.15,
				groundColor: "#7400FF"
			},

			fog: {
				enabled: false,
				color: 0xff9500,
				intensity: .15
			},

			meshInfos: {

				glbPath: "/assets/3d/worlds/choice/choice.glb",
				imagePath: {
					landscape: "/assets/3d/worlds/choice/choiceBake.jpg"
				}
			},

			particles: [
				{
					type: "fireflies",
					count: 50,
					particleSize: 60,
					additive: true,
					timeRatio: 400.0,
					blockSize: {
						x: 3,
						y: 3,
						z: 3
					}
				}
			],


		},

		sequences: [
			{
				id: "7.15",
				baseFov: 22,
				fovTransition: true,
				sequenceBobName: "marie",
				bobRestoreSize: 0.0012,

				type: "third-person",
				cameraTriggerTimeDecay: 45,
				cameraType: "movingHips-lookUp-choice",

				until: 288.8,
				nextInstruction: "switch-sequence",

				choiceSequence: true,

				animatedMesh: false,

				helpers: {
					orbit: false,
					tubes: false,
					timelines: false
				},

				fog: {
					enabled: false,
					color: "#ffffff",
					intensity: .14
				},

				bobImposedMoves: {
					fly: false,
					forward: true,
					backward: false,
					left: false,
					right: false,
					shift: false
				},

				slowmo: 1.6,

				alice: {
					handleGround: true,
					name: "link",
					move: {
						fly: false,
						forward: true,
						backward: false,
						left: false,
						right: false,
						shift: false
					},
					offset: {
						x: 0,
						y: 0,
						z: 0
					},
					scale: 0.0012,
					slowmo: 1.2
				},

				postproc: [
					{
						type: "blur",
						focusTarget: "link",
						value: {
							focus: 1,
							aperture: 0.035,
							maxblur: 0.009
						}
					},
				]

			},
			
		]

	},

	{
		name: "world_050",

		main: {

			spaceColor: "#000000",
			spaceColorDarker: "#000000",
			spaceColorWithBloom: "#000000",

			ambient: {
				sunColor: "#FF5A00",
				// intensity: 0.17,
				intensity: 0.3,
				groundColor: "#1B00FF"
			},

			fog: {
				enabled: false,
				color: 0xff9500,
				intensity: .15
			},

			meshInfos: {

				glbPath: "/assets/3d/worlds/end01/end01.glb",
				imagePath: {
					landscape: "/assets/3d/worlds/end01/end01Bake.jpg"
				}
			},

			meshCustomShaderOptions: {
				enabled: true,
				shaderTimeRatio: 1.85,
				shaderName: "plastic",
				shaderScale: 16,
				shaderAxe: "zy"
			},

			particles: [
				{
					type: "fireflies",
					count: 1500,
					particleSize: 70,
					additive: true,
					timeRatio: 500.0,
					blockSize: {
						x: 3,
						y: 3,
						z: 3
					}
				}
			],

		},

		sequences: [
			{
				id: "7.16",
				baseFov: 28,
				fovTransition: false,
				sequenceBobName: "linkShaderFlying",
				bobRestoreSize: 0.0014,
				isEndSequence: true,

				type: "third-person",
				cameraTriggerTimeDecay: 16,
				cameraType: "movingFlyEnd",

				until: 288.8,
				nextInstruction: "switch-sequence",

				// customShaderOptions: {
				// 	timeRatio: 2.15
				// },
				cameraInvert: {
					x: false,
					y: true
				},

				

				customShaderOptions: {
					shaderTimeRatio: 0.2,
					shaderTimeDecay: 10,
					sin: false,
					sinAmplitude: 60
				},

				animatedMesh: false,

				helpers: {
					orbit: false,
					tubes: false,
					timelines: false
				},

				// landscapeMove: {
				// 	x: 0,
				// 	y: 0.0015,
				// 	z: -0.0015
				// },

				fog: {
					enabled: false,
					color: "#ffffff",
					intensity: .14
				},

				bobImposedMoves: {
					fly: true,
					forward: false,
					backward: false,
					left: false,
					right: false
				},

				alice: {
					handleGround: false,
					name: "marie",
					move: {
						fly: true,
						forward: false,
						backward: false,
					},
					offset: {
						x: 0,
						y: 0.35,
						z: 0.25
					},
					scale: 0.057,
					slowmo: 1
				},

				slowmo: 1,

				postproc: [
					{
						type: "bloom",
						value: {
							strength: 0.45,
							threshold: 0.0035,
							radius: 0.1
						}
					},
					// {
					// 	type: "blur",
					// 	focusTarget: "queenFinal",
					// 	value: {
					// 		focus: 1,
					// 		aperture: 0.035,
					// 		maxblur: 0.009
					// 	}
					// },
				]

			},
			
		]

	}

]



export { worlds };