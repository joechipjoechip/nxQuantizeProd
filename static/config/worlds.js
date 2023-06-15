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

			spaceColor: "#051442",
			spaceColorDarker: "#051442",
			spaceColorWithBloom: "#000105",

			ambient: {
				sunColor: "#FFFFFF",
				intensity: 0.12,
				groundColor: "#FFFFFF"
			},

			fog: {
				enabled: false,
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

			meshCustomShaderOptions: {
				enabled: true,
				shaderTimeRatio: 0.3,
				shaderName: "plastic",
				shaderScale: 3,
				shaderAxe: "xy"
			},

		},

		sequences: [
			{
				id: "1.0",
				baseFov: 5,
				fovTransition: false,
				sequenceBobName: "hinata",
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
					enabled: false,
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

				slowmo: 5,

				bobImposedMoves: {
					forward: true,
					dance: false,
					backward: false,
					shift: false
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
				sequenceBobName: "hinata",

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

				slowmo: 6,

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
				id: "1.2",
				baseFov: 20,
				fovTransition: false,
				sequenceBobName: "hinata",

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

				slowmo: 6,

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
				sequenceBobName: "hinata",

				type: "third-person",
				cameraTriggerTimeDecay: 15,
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

				slowmo: 20,

				bobImposedMoves: {
					forward: true,
					shift: false
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
					particleSize: 25,
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
					color: "#0D063B",
					intensity: .15
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

				// alice: {
				// 	handleGround: false,
				// 	name: "queenShader",
				// 	move: {
				// 		floating: true
				// 	},
				// 	offset: {
				// 		x: 0,
				// 		y: -0.01,
				// 		z: 0
				// 	},
				// 	scale: 0.035,
				// 	slowmo: 9,
				// 	customShaderOptions: {
				// 		shaderTimeRatio: 0.5,
				// 		shaderTimeDecay: 5,
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

			// drop du run ! 
			{
				id: "3.7",
				baseFov: 28,
				fovTransition: true,
				sequenceBobName: "link",

				type: "third-person",
				cameraTriggerTimeDecay: 6,
				cameraType: "movingHips-lookUp-xDecayed",

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
				baseFov: 35,
				fovTransition: false,
				sequenceBobName: "link",

				type: "third-person",
				cameraTriggerTimeDecay: 6,
				cameraType: "movingHips-lookUp",

				until: 93.9,
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

				slowmo: 1.3,

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

				until: 97.3,
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
					enjoy: true
				},

				slowmo: 1.4,

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
					duration: 80,
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
				baseFov: 40,
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
					duration: 3,
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

				until: 124.7,
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
					duration: 12,
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
					scale: 0.009,
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

			spaceColor: "#040101",
			spaceColorDarker: "#040101",
			spaceColorWithBloom: "#040101",

			ambient: {
				sunColor: "#8700a7",
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
				sequenceBobName: "hinata",
				until: 36,
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

				bobImposedMoves: {
					forward: true,
					// shift: false
				},

				slowmo: 2.3,

				alice: {
					handleGround: false,
					name: "queenShader",
					move: {
						floating: true
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
				sequenceBobName: "hinata",

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
					enabled: false,
					color: "#0D063B",
					intensity: .4
				},

				alice: {
					handleGround: false,
					name: "queenShader",
					move: {
						floating: true
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
							strength: 0.8,
							threshold: 0.00035,
							radius: 0.7
						}
					},

					{
						type: "blur",
						focusTarget: "queenShader",
						value: {
							focus: 1,
							aperture: 0.0025,
							maxblur: 0.06
						}
					},

				]

			},
			{
				id: "2.7",
				baseFov: 30,
				fovTransition: false,
				sequenceBobName: "hinata",

				type: "third-person",
				cameraTriggerTimeDecay: 3,
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
					enabled: false,
					color: "#0D063B",
					intensity: .4
				},

				slowmo: 1.4,

				bobImposedMoves: {
					forward: true,
					shift: false,
					// enjoy: true
				},

				alice: {
					handleGround: false,
					name: "queenShader",
					move: {
						floating: true
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
							strength: 0.8,
							threshold: 0.00035,
							radius: 0.7
						}
					},

					{
						type: "blur",
						focusTarget: "queenShader",
						value: {
							focus: 1,
							aperture: 0.025,
							maxblur: 0.0004
						}
					},

				]

			},
			{
				id: "4.7",
				baseFov: 32,
				fovTransition: false,
				sequenceBobName: "hinata",

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
					enabled: false,
					color: "#0D063B",
					intensity: .4
				},

				alice: {
					handleGround: false,
					name: "queenShader",
					move: {
						floating: true
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
							radius: 0.7
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
				baseFov: 25,
				fovTransition: false,
				sequenceBobName: "hinata",

				// type: "blender-points",
				type: "fake-orbit",
				cameraInvert: {
					x: false,
					y: true
				},

				until: 79.1,
				nextInstruction: "switch-sequence",

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
					name: "queenShader",
					move: {
						floating: true
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

				// slowmo: 6,

				bobImposedMoves: {
					forward: true,
					shift: true,
					backward: false,
					dance: false
				},

				tubeInfos: {
					duration: 12,
					// isUsingTarget indicate that we need a plan-1.0-target point in the glb
					isUsingTarget: "link",
					steps: [
						// n steps are possibles
						// n has nothing to do with the number of points for the curve
						{
							// this amount is a percent of the global duration
							amount: 100,
							fov: 20,
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
				sequenceBobName: "hinata",

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
					enabled: false,
					color: "#0D063B",
					intensity: .4
				},

				alice: {
					handleGround: false,
					name: "queenShader",
					move: {
						floating: true
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
					particleSize: 25,
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


			entities: ["link", "hinata"],

		},

		sequences: [

			{
				id: "5.12",
				baseFov: 32,
				fovTransition: true,
				sequenceBobName: "linkShine",

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
					name: "hinataShine",
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
					forward: true
				},

				// slowmo: 1.6,

				postproc: [

					{
						type: "bloom",
						value: {
							strength: .7,
							threshold: 0.00045,
							radius: 0.07
						}
					},
					{
						type: "blur",
						focusTarget: "hinataShine",
						value: {
							focus: 1,
							aperture: 0.025,
							maxblur: 0.004
						}
					},

				]

			},
			{
				id: "7.12",
				baseFov: 22,
				fovTransition: true,
				sequenceBobName: "link",

				type: "third-person",
				cameraTriggerTimeDecay: 5,
				cameraType: "movingHips-lookUp",

				until: 136.5,
				nextInstruction: "drop-and-load-and-switch",

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
						// floating: true
						// shift: false,
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
					scale: 0.03,
					slowmo: 2.5,
				},

				bobImposedMoves: {
					forward: true
				},

				slowmo: 1,

				postproc: [

					{
						type: "bloom",
						value: {
							strength: 0.7,
							threshold: 0.0035,
							radius: 0.7
						}
					},
					{
						type: "blur",
						focusTarget: "linkShaderPlastic",
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
	// {
	// 	name: "world_015",

	// 	main: {

	// 		spaceColor: "#000000",
	// 		spaceColorDarker: "#000000",
	// 		spaceColorWithBloom: "#000000",

	// 		ambient: {
	// 			sunColor: "#FF7400",
	// 			intensity: 0.55,
	// 			groundColor: "#6200FF"
	// 		},

	// 		fog: {
	// 			enabled: true,
	// 			color: 0x000000,
	// 			intensity: .85
	// 		},

	// 		particles: [
	// 			{
	// 				type: "fireflies",
	// 				count: 650,
	// 				particleSize: 25,
	// 				additive: true,
	// 				timeRatio: 400.0,
	// 				blockSize: {
	// 					x: 2,
	// 					y: 3,
	// 					z: 2
	// 				}
	// 			}
	// 		],

	// 		meshInfos: {

	// 			glbPath: "/assets/3d/worlds/swift/swift.glb",
	// 			imagePath: {
	// 				landscape: "/assets/3d/worlds/swift/swiftBake.jpg"
	// 			}
	// 		},


	// 		entities: ["link", "hinata"],

	// 	},

	// 	sequences: [

	// 		{
	// 			id: "4.5",
	// 			baseFov: 35,
	// 			fovTransition: true,
	// 			sequenceBobName: "link",

	// 			type: "third-person",
	// 			cameraTriggerTimeDecay: 15,
	// 			cameraType: "climb-view",

	// 			until: 78,
	// 			nextInstruction: "switch-sequence",

	// 			animatedMesh: false,

	// 			helpers: {
	// 				orbit: false,
	// 				tubes: false,
	// 				timelines: false
	// 			},

	// 			fog: {
	// 				enabled: false,
	// 				color: "#000000",
	// 				intensity: .75
	// 			},

	// 			bobImposedMoves: {
	// 				forward: false,
	// 				shift: false,
	// 				backward: false,
	// 				climb: true,
	// 				left: false,
	// 				right: false
	// 			},

	// 			slowmo: 1.3,

	// 			postproc: [
	// 				// {
	// 				// 	type: "rgbShift",
	// 				// 	amount: 0.006
	// 				// },
	// 				{
	// 					type: "blur",
	// 					focusTarget: "link",
	// 					value: {
	// 						focus: 1,
	// 						aperture: 0.4,
	// 						maxblur: 0.045
	// 					}
	// 				},
	// 			]

	// 		},

	// 		{
	// 			id: "4.6",
	// 			baseFov: 32,
	// 			fovTransition: true,
	// 			sequenceBobName: "hinata",

	// 			type: "third-person",
	// 			cameraTriggerTimeDecay: 5,
	// 			cameraType: "helmet-low-moving",

	// 			until: 85.5,
	// 			nextInstruction: "drop-and-load-and-switch",

	// 			animatedMesh: false,

	// 			helpers: {
	// 				orbit: false,
	// 				tubes: false,
	// 				timelines: false
	// 			},

	// 			fog: {
	// 				enabled: false,
	// 				color: "#0D063B",
	// 				intensity: .15
	// 			},

	// 			alice: {
	// 				handleGround: false,
	// 				name: "link",
	// 				move: {
	// 					climb: true
	// 				},
	// 				offset: {
	// 					x: 0,
	// 					y: 0,
	// 					z: 0
	// 				},
	// 				scale: 0.001,
	// 				slowmo: 1.3
	// 			},

	// 			bobImposedMoves: {
	// 				forward: false,
	// 				shift: false,
	// 				backward: false,
	// 				housedance: true,
	// 				left: false,
	// 				right: false
	// 			},

	// 			slowmo: 1.6,

	// 			postproc: [

	// 				{
	// 					type: "bloom",
	// 					value: {
	// 						strength: .5,
	// 						threshold: 0.45,
	// 						radius: 0.05
	// 					}
	// 				},
	// 				{
	// 					type: "blur",
	// 					focusTarget: "link",
	// 					value: {
	// 						focus: 1,
	// 						aperture: 0.025,
	// 						maxblur: 0.015
	// 					}
	// 				},

	// 			]

	// 		},

	// 	]

	// },

	// {
	// 	name: "world_020",

	// 	main: {

	// 		spaceColor: "#FFFFFF",
	// 		spaceColorDarker: "#FFFFFF",
	// 		spaceColorWithBloom: "#FFFFFF",

	// 		ambient: {
	// 			sunColor: "#FFFFFF",
	// 			intensity: 0.6,
	// 			groundColor: "#8ff5f5"
	// 		},

	// 		fog: {
	// 			enabled: true,
	// 			color: 0xff9500,
	// 			intensity: .15
	// 		},

	// 		particles: [
	// 			{
	// 				type: "fireflies",
	// 				count: 200,
	// 				particleSize: 20,
	// 				additive: true,
	// 				timeRatio: 3.0,
	// 				blockSize: {
	// 					x: 5,
	// 					y: 2,
	// 					z: 5
	// 				}
	// 			}
	// 		],

	// 		meshInfos: {

	// 			glbPath: "/assets/3d/worlds/forestWing/forestWing.glb",
	// 			imagePath: {
	// 				landscape: "/assets/3d/worlds/forestWing/forestWingBake.jpg"
	// 			}
	// 		},


	// 		entities: ["link", "hinata", "queen"],

	// 	},

	// 	sequences: [
	// 		{
	// 			id: "4.7",
	// 			baseFov: 35,
	// 			fovTransition: true,
	// 			sequenceBobName: "link",

	// 			// type: "blender-points",
	// 			type: "third-person",
	// 			cameraTriggerTimeDecay: 18,
	// 			cameraType: "movingHips-3",

	// 			until: 94,
	// 			nextInstruction: "switch-sequence",

	// 			animatedMesh: false,

	// 			helpers: {
	// 				orbit: false,
	// 				tubes: false,
	// 				timelines: false
	// 			},

	// 			fog: {
	// 				enabled: true,
	// 				color: "#8ff5f5",
	// 				intensity: .65
	// 			},

	// 			bobImposedMoves: {
	// 				// shift: true,
	// 				// forward: true,
	// 				enjoy: true
	// 			},

	// 			postproc: [

	// 				{
	// 					type: "vignette",
	// 					darkness: -0.9,
	// 					offset: 0.8
	// 				}

	// 			]

	// 		},
	// 		{
	// 			id: "4.8",
	// 			baseFov: 35,
	// 			fovTransition: true,
	// 			sequenceBobName: "hinata",

	// 			// type: "blender-points",
	// 			type: "third-person",
	// 			cameraTriggerTimeDecay: 4,
	// 			cameraType: "movingHips-lookUp",

	// 			until: 101,
	// 			nextInstruction: "switch-sequence",

	// 			animatedMesh: false,

	// 			helpers: {
	// 				orbit: false,
	// 				tubes: false,
	// 				timelines: false
	// 			},

	// 			fog: {
	// 				enabled: true,
	// 				color: "#8ff5f5",
	// 				intensity: .12
	// 			},

	// 			alice: {
	// 				handleGround: false,
	// 				name: "queen",
	// 				move: {
	// 					housedance: true
	// 				},
	// 				offset: {
	// 					x: 0,
	// 					y: -0.55,
	// 					z: 0
	// 				},
	// 				scale: 0.25,
	// 				slowmo: 8
	// 			},

	// 			bobImposedMoves: {
	// 				enjoy: true
	// 			},

	// 			postproc: [
	// 				{
	// 					type: "blur",
	// 					focusTarget: "queen",
	// 					value: {
	// 						focus: 1,
	// 						aperture: 0.025,
	// 						maxblur: 0.025
	// 					}
	// 				},
	// 				{
	// 					type: "vignette",
	// 					darkness: -0.8,
	// 					offset: 0.8
	// 				},

	// 			]

	// 		},
	// 		{
	// 			id: "4.9",
	// 			baseFov: 30,
	// 			fovTransition: true,
	// 			sequenceBobName: "link",

	// 			// type: "blender-points",
	// 			type: "third-person",
	// 			cameraTriggerTimeDecay: 4,
	// 			cameraType: "helmet-low-moving-2",

	// 			until: 107.5,
	// 			nextInstruction: "drop-and-load-and-switch",

	// 			animatedMesh: false,

	// 			helpers: {
	// 				orbit: false,
	// 				tubes: false,
	// 				timelines: false
	// 			},

	// 			fog: {
	// 				enabled: true,
	// 				color: "#000000",
	// 				intensity: .43
	// 			},

	// 			bobImposedMoves: {
	// 				hiphop: true,
	// 				left: false,
	// 				right: false
	// 			},

	// 			slowmo: 0.85,

	// 			postproc: [

	// 				{
	// 					type: "bloom",
	// 					value: {
	// 						strength: 0.2,
	// 						threshold: 0.005,
	// 						radius: 0.2
	// 					}
	// 				},
	// 				{
	// 					type: "blur",
	// 					focusTarget: "link",
	// 					value: {
	// 						focus: 1,
	// 						aperture: 0.025,
	// 						maxblur: 0.025
	// 					}
	// 				},

	// 			]

	// 		},

	// 	]

	// },

	// {
	// 	name: "world_025",

	// 	main: {

	// 		spaceColor: "#002038",
	// 		spaceColorDarker: "#001220",
	// 		spaceColorWithBloom: "#000B14",

	// 		ambient: {
	// 			sunColor: "#FFFFFF",
	// 			intensity: 0.6,
	// 			groundColor: "#04007A"
	// 		},

	// 		fog: {
	// 			enabled: true,
	// 			color: 0xff9500,
	// 			intensity: .15
	// 		},

	// 		meshInfos: {

	// 			glbPath: "/assets/3d/worlds/oula/oula.glb",
	// 			imagePath: {
	// 				landscape: "/assets/3d/worlds/oula/oulaBake.jpg"
	// 			}
	// 		},

	// 		particles: [
	// 			{
	// 				type: "fireflies",
	// 				count: 250,
	// 				particleSize: 10,
	// 				additive: true,
	// 				timeRatio: 36.0,
	// 				blockSize: {
	// 					x: 7,
	// 					y: 3,
	// 					z: 2
	// 				}
	// 			}
	// 		],


	// 		entities: ["hinata", "link"],

	// 	},

	// 	sequences: [
	// 		{
	// 			id: "4.10",
	// 			baseFov: 35,
	// 			fovTransition: true,
	// 			sequenceBobName: "hinata",

	// 			type: "third-person",
	// 			cameraTriggerTimeDecay: 8,
	// 			cameraType: "gtaLike-oula",

	// 			until: 122.8,
	// 			nextInstruction: "drop-and-load-and-switch",

	// 			animatedMesh: false,

	// 			helpers: {
	// 				orbit: false,
	// 				tubes: false,
	// 				timelines: false
	// 			},

	// 			fog: {
	// 				enabled: false,
	// 				color: "#FFFFFF",
	// 				intensity: .43
	// 			},

	// 			bobImposedMoves: {
	// 				forward: true,
	// 				shift: true,
	// 				housedance: false,
	// 				hiphop: false,
	// 				climb: false,
	// 				floating: false
	// 			},

	// 			postproc: []

	// 		},

	// 	]

	// },

	{
		name: "world_030",

		main: {

			spaceColor: "#002038",
			spaceColorDarker: "#001220",
			spaceColorWithBloom: "#000000",

			ambient: {
				sunColor: "#FFFFFF",
				intensity: 0.12,
				groundColor: "#FFFFFF"
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

		},

		sequences: [
			{
				id: "7.13",
				baseFov: 90,
				fovTransition: false,
				sequenceBobName: "link",

				type: "blender-points",
				cameraInvert: {
					x: false,
					y: true
				},

				until: 137,
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
							fov: 15,
							stepEase: "linear"
						},

					]
				},

				alice: {
					handleGround: false,
					name: "hinata",
					move: {
						climb: true,
						forward: false,
						backward: false,
						left: false,
						right: false
					},
					offset: {
						x: 0,
						y: 0,
						z: 0
					},
					scale: 0.001,
					slowmo: 1.5
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
					// {
					// 	type: "blur",
					// 	focusTarget: "hinata",
					// 	value: {
					// 		focus: 1,
					// 		aperture: 0.015,
					// 		maxblur: 0.028
					// 	}
					// },
				]

			},
			{
				id: "7.14",
				baseFov: 35,
				fovTransition: true,
				sequenceBobName: "linkShader",

				type: "third-person",
				cameraTriggerTimeDecay: 5,
				cameraType: "movingHips-2",

				until: 143.8,
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
					handleGround: true,
					name: "link",
					move: {
						// climb: true
						forward: true
					},
					offset: {
						x: 0,
						y: 0,
						z: 0
					},
					scale: 0.008,
					slowmo: 1
				},

				bobImposedMoves: {
					forward: true
				},

				// slowmo: 1,

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
						focusTarget: "link",
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
		name: "world_035",

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

				glbPath: "/assets/3d/worlds/falling/falling.glb",
				imagePath: {
					landscape: "/assets/3d/worlds/falling/fallingBake.jpg"
				}
			},

			meshCustomShaderOptions: {
				enabled: true,
				shaderTimeRatio: 0.5,
				shaderName: "galaxy",
				shaderScale: 1,
				shaderAxe: "xz"
			},

		},

		sequences: [
			{
				id: "7.15",
				baseFov: 30,
				fovTransition: true,
				sequenceBobName: "hinata",
				bobRestoreSize: 0.0012,

				type: "third-person",
				cameraTriggerTimeDecay: 45,
				cameraType: "movingFly-queen",

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
					color: "#FFFFFF",
					intensity: .02
				},

				bobImposedMoves: {
					// forward: true
					fly: true,
					// forward: false,
					backward: false,
					shift: false
				},

				slowmo: 1,

				postproc: [
					// {
					// 	type: "bloom",
					// 	value: {
					// 		strength: .3,
					// 		threshold: 0.0047,
					// 		radius: 0.26
					// 	}
					// },
				]

			},
			// {
			// 	id: "4.14",
			// 	baseFov: 45,
			// 	fovTransition: false,
			// 	sequenceBobName: "link",

			// 	type: "third-person",
			// 	cameraTriggerTimeDecay: 35,
			// 	cameraType: "movingFly-helmet",

			// 	until: 292.5,
			// 	nextInstruction: "switch-sequence",

			// 	animatedMesh: false,

			// 	helpers: {
			// 		orbit: false,
			// 		tubes: false,
			// 		timelines: false
			// 	},

			// 	landscapeMove: {
			// 		x: 0,
			// 		y: -0.01,
			// 		z: 0
			// 	},

			// 	fog: {
			// 		enabled: true,
			// 		color: "#FFFFFF",
			// 		intensity: .01
			// 	},

			// 	bobImposedMoves: {
			// 		// forward: true
			// 		fly: true,
			// 		forward: false,
			// 		backward: false,
			// 		left: false,
			// 		right: false,

			// 	},

			// 	postproc: [
			// 		{
			// 			type: "bloom",
			// 			value: {
			// 				strength: .49,
			// 				threshold: 0.047,
			// 				radius: 0.26
			// 			}
			// 		},
			// 	]

			// },

		]

	},

]



export { worlds };