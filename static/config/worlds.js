
// {
// 	type: "kaleidoscope",
// 	sides: 1,
// 	angle: -45
// },

const worlds = [

	{

		name: "world_000",

		main: {

			spaceColor: "#010101",
			spaceColorDarker: "#010101",
			spaceColorWithBloom: "#010101",

			ambient: {
				sunColor: "#ffffff",
				intensity: 0.25,
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
					landscape: "/assets/3d/worlds/lightHouse/lightHouseBake"
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
				baseFov: 100,
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
				cameraTriggerTimeDecay: 0,
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
					landscape: "/assets/3d/worlds/epicValley/epicValleyBake"
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
				cameraTriggerTimeDecay: 3,
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
				baseFov: 34,
				fovTransition: true,
				sequenceBobName: "marie",

				type: "third-person",
				cameraTriggerTimeDecay: 6,
				cameraType: "movingHips-lookUp-xDecayed",

				until: 71.9,
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
				baseFov: 12,
				fovTransition: false,
				sequenceBobName: "link",

				type: "blender-points",

				until: 94.3,
				nextInstruction: "switch-sequence",

				animatedMesh: false,

				cameraInvert: {
					x: false,
					y: true
				},

				tubeInfos: {
					duration: 8.4,
					// isUsingTarget indicate that we need a plan-1.0-target point in the glb
					isUsingTarget: true,
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
					enjoy: true,
					left: false,
					right: false,
				},

				slowmo: 0.918,

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
							strength: 0.6,
							threshold: 0.00035,
							radius: 0.55
						}
					},

				]

			},
			{
				id: "5.10",
				baseFov: 14,
				fovTransition: false,
				sequenceBobName: "link",

				type: "blender-points",

				until: 97.85,
				nextInstruction: "switch-sequence",

				cameraInvert: {
					x: false,
					y: true
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
							fov: 14,
							stepEase: "linear"
						},

					]
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
					enjoy: true,
					left: false,
					right: false,
				},

				slowmo: 0.918,

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
				id: "5.11",
				baseFov: 14,
				fovTransition: false,
				sequenceBobName: "link",

				type: "blender-points",

				until: 99.6,
				nextInstruction: "drop-and-load-and-switch",

				cameraInvert: {
					x: false,
					y: true
				},

				animatedMesh: false,

				tubeInfos: {
					duration: 6.5,
					// isUsingTarget indicate that we need a plan-1.0-target point in the glb
					isUsingTarget: true,
					steps: [
						// n steps are possibles
						// n has nothing to do with the number of points for the curve
						{
							// this amount is a percent of the global duration
							amount: 100,
							fov: 14,
							stepEase: "linear"
						},

					]
				},

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
					enjoy: true,
					left: false,
					right: false,
				},

				slowmo: 0.92,

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
				id: "6.12",
				baseFov: 20,
				fovTransition: false,
				sequenceBobName: "marie",
				bobRestoreSize: 0.01,

				type: "blender-points",

				cameraInvert: {
					x: false,
					y: false
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
					duration: 7.5,
					// isUsingTarget indicate that we need a plan-1.0-target point in the glb
					isUsingTarget: true,
					steps: [
						// n steps are possibles
						// n has nothing to do with the number of points for the curve
						{
							// this amount is a percent of the global duration
							amount: 100,
							fov: 20,
							stepEase: "linear"
						}
						

					]
				},

				slowmo: 2,

				bobImposedMoves: {
					floating: true,
					forward: false,
					shift: false,
					hiphop: false,
					left: false,
					right: false,
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
						shaderTimeRatio: 0.1,
						shaderTimeDecay: 12,
						isCameraPositionInfluenced: false,
						sin: true,
						sinAmplitude: 20
					}
				},

				// alice: {
				// 	handleGround: true,
				// 	name: "link",
				// 	move: {
				// 		hiphop: true
				// 	},
				// 	offset: {
				// 		x: 0,
				// 		y: 0,
				// 		z: 0
				// 	},
				// 	scale: 0.01,
				// 	slowmo: 1.8,
				// 	// customShaderOptions: {
				// 	// 	shaderTimeRatio: 1.5,
				// 	// 	shaderTimeDecay: 5,
				// 	// 	isCameraPositionInfluenced: false,
				// 	// 	sin: false,
				// 	// 	sinAmplitude: 60
				// 	// }
				// },

				postproc: [

					// {
					// 	type: "kaleidoscope",
					// 	sides: 1,
					// 	angle: -25
					// },

					{
						type: "bloom",
						value: {
							strength: 0.2,
							threshold: 0.00035,
							radius: 0.15
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
				sunColor: "#ffffff",
				intensity: 0.12,
				groundColor: "#ffffff"
			},

			fog: {
				enabled: false,
				color: 0xff9500,
				intensity: .05
			},

			meshInfos: {

				glbPath: "/assets/3d/worlds/caveEntrance/caveEntrance.glb",
				imagePath: {
					landscape: "/assets/3d/worlds/caveEntrance/caveEntranceBake"
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
					intensity: .06
				},

				bobImposedMoves: {
					forward: true,
					// shift: false
					// left: false,
					// right: false,
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
					intensity: .05
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
					shift: false,
					// left: true,
					// right: true
				},

				postproc: [
					{
						type: "bloom",
						value: {
							strength: 0.65,
							threshold: 0.00035,
							radius: 0.55
						}
					}
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
					intensity: .025
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
							strength: 0.65,
							threshold: 0.00035,
							radius: 0.55
						}
					},

					// {
					// 	type: "blur",
					// 	focusTarget: "queenShader",
					// 	value: {
					// 		focus: 1,
					// 		aperture: 0.025,
					// 		maxblur: 0.012
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

				until: 72.42,
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
					intensity: .11
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

				slowmo: 1,

				bobImposedMoves: {
					forward: true,
					shift: true,
					backward: false,
				},

				postproc: [

					{
						type: "bloom",
						value: {
							strength: 0.6,
							threshold: 0.00035,
							radius: 0.4
						}
					},

				]

			},
			{
				id: "4.8",
				baseFov: 20,
				fovTransition: false,
				sequenceBobName: "marie",

				type: "blender-points",

				cameraInvert: {
					x: false,
					y: true
				},

				until: 79.9,
				nextInstruction: "switch-sequence",

				animatedMesh: false,

				tubeInfos: {
					duration: 9,
					// isUsingTarget indicate that we need a plan-1.0-target point in the glb
					// isUsingTarget: "marie",
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

				helpers: {
					orbit: false,
					tubes: false,
					timelines: false
				},

				fog: {
					enabled: true,
					color: "#22ffa2",
					intensity: .1
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

				slowmo: 1.2,

				bobImposedMoves: {
					forward: true,
					shift: true,
					backward: false,
					// left: false,
					// right: false,
				},

				postproc: [

					{
						type: "bloom",
						value: {
							strength: 0.65,
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
					intensity: .08
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
					landscape: "/assets/3d/worlds/greenMountain/greenMountainBake"
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
					slowmo: 5,
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
				baseFov: 36,
				fovTransition: false,
				sequenceBobName: "link",
				bobRestoreSize: 0.0012,

				type: "third-person",
				cameraTriggerTimeDecay: 5,
				cameraType: "movingHips",

				until: 137.2,
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
					name: "marie",
					move: {
						// idle: true,
						shift: false,
						forward: true,
						// left: false,
						// right: false
					},
					// customShaderOptions: {
					// 	shaderTimeRatio: 0.8,
					// 	shaderTimeDecay: 12,
					// 	isCameraPositionInfluenced: false,
					// 	sin: false,
					// 	sinAmplitude: 20
					// },
					offset: {
						x: 0,
						y: 0,
						z: 0
					},
					scale: 0.03,
					slowmo: 2.5,
				},

				bobImposedMoves: {
					forward: true,
					shift: true
				},

				slowmo: 1,

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

				until: 144.3,
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
					duration: 7.75,
					// isUsingTarget indicate that we need a plan-1.0-target point in the glb
					isUsingTarget: true,
					steps: [
						{
							// this amount is a percent of the global duration
							amount: 100,
							fov: 20,
							stepEase: "linear"
						}
					]
				},

				alice: {
					handleGround: false,
					name: "marie",
					move: {
						floating: true,
						forward: false,
						left: false,
						right: true,
						shift: false
					},
					// customShaderOptions: {
					// 	shaderTimeRatio: 0.8,
					// 	shaderTimeDecay: 12,
					// 	isCameraPositionInfluenced: false,
					// 	sin: false,
					// 	sinAmplitude: 20
					// },
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
							strength: .7,
							threshold: 0.00045,
							radius: 0.07
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

			spaceColor: "#020202",
			spaceColorDarker: "#020202",
			spaceColorWithBloom: "#020202",

			ambient: {
				sunColor: "#ffffff",
				intensity: 0.24,
				groundColor: "#ffffff"
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
					landscape: "/assets/3d/worlds/five/fiveBake"
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

				animatedMesh: false,

				helpers: {
					orbit: false,
					tubes: false,
					timelines: false
				},

				fog: {
					enabled: true,
					color: "#000000",
					intensity: .1
				},

				bobImposedMoves: {
					// forward: true
					fly: true,
					forward: false,
					backward: false,
					translateZ1: true
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
						y: -6.6,
						z: -0.8
					},
					scale: 0.165,
					slowmo: 2,
					customShaderOptions: {
						shaderTimeRatio: 0.016,
						shaderTimeDecay: 10,
						sin: true,
						sinAmplitude: 37
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
				sunColor: "#ffffff",
				// intensity: 0.17,
				intensity: 0.27,
				groundColor: "#ffffff"
			},

			fog: {
				enabled: false,
				color: 0xff9500,
				intensity: .15
			},

			meshInfos: {

				glbPath: "/assets/3d/worlds/choice/choice.glb",
				imagePath: {
					landscape: "/assets/3d/worlds/choice/choiceBake"
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
		name: "world_050_end01",

		main: {
			// spaceColor: "#090016",
			spaceColor: "#04000b",
			spaceColorDarker: "#04000b",
			spaceColorWithBloom: "#04000b",

			ambient: {
				sunColor: "#8a4300",
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
					landscape: "/assets/3d/worlds/end01/end01Bake"
				}
			},

			meshCustomShaderOptions: {
				enabled: true,
				shaderTimeRatio: 1.85,
				shaderName: "plastic",
				shaderScale: 12,
				shaderAxe: "zy"
			},

			particles: [
				{
					type: "fireflies",
					count: 2500,
					particleSize: 70,
					additive: true,
					timeRatio: 500.0,
					blockSize: {
						x: 4,
						y: 8,
						z: 18
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
				cameraTriggerTimeDecay: 8,
				cameraType: "movingFlyEnd",

				until: 17.9,
				// until: 4,
				nextInstruction: "switch-sequence",

				cameraInvert: {
					x: false,
					y: true
				},

				bobCustomShader: {
					shaderTimeRatio: 0.025,
					shaderTimeDecay: 0,
					sin: true,
					sinAmplitude: 30
				},

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
					fly: true,
					forward: false,
					backward: false,
					left: false,
					right: false,
				},

				// bobCustomShader: {
				// 	shaderTimeRatio: 0.038,
				// 	shaderTimeDecay: 0,
				// 	sin: true,
				// 	sinAmplitude: 32
				// },

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
					}
				]

			},
			{
				id: "7.17",
				baseFov: 27,
				fovTransition: false,
				sequenceBobName: "linkShaderFlying",
				bobRestoreSize: 0.0012,

				type: "third-person",
				cameraTriggerTimeDecay: 2,
				cameraType: "movingFlyLeft",

				until: 24.6,
				// until: 18,
				nextInstruction: "switch-sequence",

				cameraInvert: {
					x: false,
					y: true
				},

				bobCustomShader: {
					shaderTimeRatio: 0.04,
					shaderTimeDecay: 0,
					sin: true,
					sinAmplitude: 20
				},

				animatedMesh: false,

				helpers: {
					orbit: false,
					tubes: false,
					timelines: false
				},

				fog: {
					enabled: false,
					color: "#8a4300",
					intensity: .14
				},

				bobImposedMoves: {
					fly: true,
					forward: false,
					backward: false,
					// left: false,
					// right: false
					translateZ1: true
				},

				slowmo: 1,

				postproc: [
					{
						type: "bloom",
						value: {
							strength: 0.45,
							threshold: 0.0035,
							radius: 0.6
						}
					}
				]

			},
			{
				id: "7.18",
				baseFov: 9,
				fovTransition: false,
				sequenceBobName: "linkShaderFlying",
				bobRestoreSize: 0.0012,

				type: "blender-points",
				
				until: 39.5,
				// until: 25,
				nextInstruction: "switch-sequence",

				cameraInvert: {
					x: false,
					y: true
				},

				tubeInfos: {
					duration: 16.5,
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

				animatedMesh: false,

				helpers: {
					orbit: false,
					tubes: false,
					timelines: false
				},

				fog: {
					enabled: false,
					color: "#8a4300",
					intensity: .24
				},

				bobImposedMoves: {
					fly: true,
					forward: false,
					backward: false,
					left: false,
					right: false,
				},

				bobCustomShader: {
					shaderTimeRatio: 0.08,
					shaderTimeDecay: 0,
					sin: true,
					sinAmplitude: 15
				},

				slowmo: 1,

				postproc: [
					{
						type: "bloom",
						value: {
							strength: 0.55,
							threshold: 0.0035,
							radius: 0.85
						}
					}
				]

			},
			{
				id: "7.19",
				baseFov: 5,
				fovTransition: false,
				sequenceBobName: "linkShaderFlying",
				bobRestoreSize: 0.0012,

				type: "blender-points",

				until: 46.7,
				// until: 35,
				nextInstruction: "switch-sequence",

				cameraInvert: {
					x: false,
					y: true
				},

				tubeInfos: {
					duration: 7.4,
					// isUsingTarget indicate that we need a plan-1.0-target point in the glb
					isUsingTarget: true,
					steps: [
						// n steps are possibles
						// n has nothing to do with the number of points for the curve
						{
							// this amount is a percent of the global duration
							amount: 100,
							fov: 190,
							stepEase: "linear"
						},

					]
				},

				customShaderOptions: {
					shaderTimeRatio: 3,
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

				fog: {
					enabled: false,
					color: "#8a4300",
					intensity: .3
				},

				bobImposedMoves: {
					fly: true,
					forward: false,
					backward: false,
					left: false,
					right: false,
					translateZ1: true
				},

				bobCustomShader: {
					shaderTimeRatio: 0.18,
					shaderTimeDecay: 0,
					sin: true,
					sinAmplitude: 7
				},

				slowmo: 1,

				postproc: [
					{
						type: "bloom",
						value: {
							strength: 0.65,
							threshold: 0.0035,
							radius: 0.85
						}
					}
				]

			},
			{
				id: "7.20",
				baseFov: 22,
				fovTransition: false,
				sequenceBobName: "linkShaderFlying",
				bobRestoreSize: 0.0012,

				type: "third-person",
				cameraTriggerTimeDecay: 16,
				cameraType: "movingFly",

				until: 54,
				// until: 35,
				nextInstruction: "switch-sequence",

				cameraInvert: {
					x: false,
					y: true
				},

				customShaderOptions: {
					shaderTimeRatio: 3,
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

				fog: {
					enabled: false,
					color: "#8a4300",
					intensity: .3
				},

				bobImposedMoves: {
					fly: true,
					forward: false,
					backward: false,
					// left: false,
					// right: false
					translateZ1: true
				},

				bobCustomShader: {
					shaderTimeRatio: 0.18,
					shaderTimeDecay: 0,
					sin: true,
					sinAmplitude: 7
				},

				alice: {
					handleGround: false,
					name: "marieShaderFlying",
					move: {
						left: false,
						right: false,
						kiss: true
					},
					offset: {
						x: 0,
						y: -5.5,
						z: -2
					},
					scale: 0.085,
					slowmo: 26,
					customShaderOptions: {
						shaderTimeRatio: 1.8,
						shaderTimeDecay: 12,
						isCameraPositionInfluenced: false,
						sin: false,
						sinAmplitude: 20
					}
				},

				slowmo: 1,

				postproc: [
					{
						type: "bloom",
						value: {
							strength: 0.75,
							threshold: 0.0035,
							radius: 0.85
						}
					},
					{
						type: "glitch"
					},
				]

			},
			{
				id: "7.21",
				baseFov: 15,
				fovTransition: false,
				sequenceBobName: "linkShaderFlying",
				bobRestoreSize: 0.0012,

				type: "blender-points",

				until: 60.9,
				// until: 35,
				nextInstruction: "switch-sequence",

				cameraInvert: {
					x: true,
					y: false
				},

				tubeInfos: {
					duration: 8.5,
					// isUsingTarget indicate that we need a plan-1.0-target point in the glb
					isUsingTarget: true,
					steps: [
						// n steps are possibles
						// n has nothing to do with the number of points for the curve
						{
							// this amount is a percent of the global duration
							amount: 100,
							fov: 10,
							stepEase: "linear"
						},

					]
				},

				customShaderOptions: {
					shaderTimeRatio: 3,
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

				fog: {
					enabled: false,
					color: "#8a4300",
					intensity: .3
				},

				bobImposedMoves: {
					fly: true,
					forward: false,
					backward: false,
					left: false,
					right: false,
					// translateZ1: true
				},

				bobCustomShader: {
					shaderTimeRatio: 0.18,
					shaderTimeDecay: 0,
					sin: true,
					sinAmplitude: 7
				},

				alice: {
					handleGround: false,
					name: "marieShaderFlying",
					move: {
						left: false,
						right: false,
						kiss: true
					},
					offset: {
						x: 0,
						y: -5.5,
						z: -2
					},
					scale: 0.085,
					slowmo: 12,
					customShaderOptions: {
						shaderTimeRatio: 0.011,
						shaderTimeDecay: 10,
						sin: true,
						sinAmplitude: 37
					}
				},

				slowmo: 1,

				postproc: [
					{
						type: "bloom",
						value: {
							strength: 0.75,
							threshold: 0.0035,
							radius: 0.85
						}
					}
				]

			},
			{
				id: "7.22",
				baseFov: 230,
				fovTransition: false,
				sequenceBobName: "linkShaderFlying",
				bobRestoreSize: 0.0012,

				type: "blender-points",

				until: 68.5,
				// until: 35,
				nextInstruction: "switch-sequence",

				cameraInvert: {
					x: false,
					y: true
				},

				tubeInfos: {
					duration: 7.7,
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

				customShaderOptions: {
					shaderTimeRatio: 3,
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

				fog: {
					enabled: false,
					color: "#8a4300",
					intensity: .3
				},

				bobImposedMoves: {
					fly: true,
					forward: false,
					backward: false,
					left: false,
					right: false,
					// translateZ1: true
				},

				bobCustomShader: {
					shaderTimeRatio: 0.18,
					shaderTimeDecay: 0,
					sin: true,
					sinAmplitude: 7
				},

				alice: {
					handleGround: false,
					name: "marie",
					move: {
						fly: true,
						forward: false,
						backward: false
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
							strength: 0.8,
							threshold: 0.0035,
							radius: 0.9
						}
					},
					{
						type: "glitch"
					},
				]

			},
			{
				id: "7.23",
				baseFov: 25,
				fovTransition: false,
				sequenceBobName: "linkShaderFlying",
				bobRestoreSize: 0.0012,

				type: "blender-points",

				until: 75.75,
				// until: 35,
				nextInstruction: "switch-sequence",

				cameraInvert: {
					x: false,
					y: true
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

				customShaderOptions: {
					shaderTimeRatio: 3,
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

				fog: {
					enabled: false,
					color: "#8a4300",
					intensity: .3
				},

				bobImposedMoves: {
					fly: true,
					forward: false,
					backward: false,
					left: false,
					right: false,
					// translateZ1: true
				},

				bobCustomShader: {
					shaderTimeRatio: 0.18,
					shaderTimeDecay: 0,
					sin: true,
					sinAmplitude: 7
				},

				alice: {
					handleGround: false,
					name: "marie",
					move: {
						fly: true,
						forward: false,
						backward: false
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
							strength: 0.85,
							threshold: 0.0035,
							radius: 0.95
						}
					}
				]

			},
			{
				id: "7.24",
				baseFov: 35,
				fovTransition: false,
				sequenceBobName: "linkShaderFlying",
				bobRestoreSize: 0.0012,

				type: "blender-points",

				until: 185,
				// until: 35,
				nextInstruction: "drop-and-load-and-switch",

				cameraInvert: {
					x: false,
					y: true
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
							fov: 65,
							stepEase: "linear"
						},

					]
				},

				customShaderOptions: {
					shaderTimeRatio: 3,
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

				fog: {
					enabled: false,
					color: "#8a4300",
					intensity: .3
				},

				bobImposedMoves: {
					fly: true,
					forward: false,
					backward: false,
					left: false,
					right: false,
					// translateZ1: true
				},

				bobCustomShader: {
					shaderTimeRatio: 0.18,
					shaderTimeDecay: 0,
					sin: true,
					sinAmplitude: 7
				},

				alice: {
					handleGround: false,
					name: "marie",
					move: {
						fly: true,
						forward: false,
						backward: false
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
							strength: 0.65,
							threshold: 0.0035,
							radius: 0.85
						}
					}
				]

			},
			
		]

	},

	{

		name: "world_060_end02",
	
		main: {
			// spaceColor: "#090016",
			spaceColor: "#030303",
			spaceColorDarker: "#030303",
			spaceColorWithBloom: "#030303",
	
			ambient: {
				sunColor: "#FFFFFF",
				// intensity: 0.17,
				intensity: 0.2,
				groundColor: "#ffc054"
			},
	
			fog: {
				enabled: false,
				color: 0xff9500,
				intensity: .15
			},
	
			meshInfos: {
	
				glbPath: "/assets/3d/worlds/end02/end02.glb",
				imagePath: {
					landscape: "/assets/3d/worlds/end02/end02Bake"
				}
			},
	
			meshCustomShaderOptions: {
				enabled: true,
				shaderTimeRatio: 2.8,
				shaderName: "plastic",
				shaderScale: 1,
				shaderAxe: "yz"
			},
	
			particles: [
				{
					type: "fireflies",
					count: 2500,
					particleSize: 70,
					additive: true,
					timeRatio: 500.0,
					blockSize: {
						x: 4,
						y: 10,
						z: 18
					}
				}
			],
	
		},
	
		sequences: [
			{
				id: "7.17",
				// baseFov: 39,
				baseFov: 30,
				fovTransition: false,
				sequenceBobName: "marieShaderFlying",
				bobRestoreSize: 0.0012,
				isEndSequence: true,
	
				type: "third-person",
				cameraTriggerTimeDecay: 11,
				cameraType: "movingFlyEndMarie",
	
				until: 21.65,
				// until: 3,

				nextInstruction: "switch-sequence",
	
				cameraInvert: {
					x: false,
					y: true
				},
	
				bobCustomShader: {
					shaderTimeRatio: 0.025,
					shaderTimeDecay: 5,
					sin: true,
					sinAmplitude: 50
				},
	
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
					fly: true,
					forward: false,
					backward: false,
					left: false,
					right: false,
					// translateZ1: true
				},
	
	
				alice: {
					handleGround: false,
					name: "link",
					move: {
						fly: true,
						forward: false,
						backward: false,
						translateZ1: true
					},
					offset: {
						x: 0,
						y: 0,
						z: 0
					},
					// customShaderOptions: {
					// 	shaderTimeRatio: 0.08,
					// 	shaderTimeDecay: 12,
					// 	isCameraPositionInfluenced: false,
					// 	sin: true,
					// 	sinAmplitude: 20
					// },
					scale: 0.035,
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
					}
				]
	
			},
			{
				id: "7.18",
				baseFov: 30,
				fovTransition: false,
				sequenceBobName: "marieShaderFlying",
				bobRestoreSize: 0.0012,
				isEndSequence: true,
	
				type: "third-person",
				cameraTriggerTimeDecay: 14,
				cameraType: "movingFlyLeft",
	
				until: 28.8,
				// until: 4.5,

				nextInstruction: "switch-sequence",
	
				cameraInvert: {
					x: false,
					y: true
				},
	
				bobCustomShader: {
					shaderTimeRatio: 0.025,
					shaderTimeDecay: 0,
					sin: true,
					sinAmplitude: 30
				},
	
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
					fly: true,
					forward: false,
					backward: false,
					// left: false,
					// right: false,
					translateZ1: true
				},
	
				slowmo: 1,
	
				postproc: [
					{
						type: "bloom",
						value: {
							strength: 0.55,
							threshold: 0.0035,
							radius: 0.1
						}
					}
				]
	
			},
			{
				id: "7.19",
				baseFov: 25,
				fovTransition: false,
				sequenceBobName: "marieShaderFlying",
				bobRestoreSize: 0.0011,
				isEndSequence: true,
	
				type: "third-person",
				cameraTriggerTimeDecay: 8,
				cameraType: "movingFlyMarie",
	
				until: 35.9,
				// until: 5.5,

				nextInstruction: "switch-sequence",
	
				cameraInvert: {
					x: false,
					y: true
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
							fov: 130,
							stepEase: "linear"
						},

					]
				},
	
				bobCustomShader: {
					shaderTimeRatio: 0.025,
					shaderTimeDecay: 0,
					sin: true,
					sinAmplitude: 30
				},
	
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
					fly: true,
					forward: false,
					backward: false,
					// left: false,
					// right: false,
					translateZ1: true
				},
	
				slowmo: 1,
	
				postproc: [
					{
						type: "bloom",
						value: {
							strength: 0.55,
							threshold: 0.0035,
							radius: 0.1
						}
					},
					{
						type: "glitch"
					},
				]
	
			},
			{
				id: "7.20",
				baseFov: 20,
				fovTransition: false,
				sequenceBobName: "marieShaderFlying",
				bobRestoreSize: 0.0011,
				isEndSequence: true,
	
				type: "blender-points",
	
				until: 43.35,
				// until: 9,

				nextInstruction: "switch-sequence",
	
				cameraInvert: {
					x: true,
					y: false
				},
	
				bobCustomShader: {
					shaderTimeRatio: 0.025,
					shaderTimeDecay: 0,
					sin: true,
					sinAmplitude: 30
				},

				tubeInfos: {
					duration: 9,
					// isUsingTarget indicate that we need a plan-1.0-target point in the glb
					isUsingTarget: true,
					steps: [
						// n steps are possibles
						// n has nothing to do with the number of points for the curve
						{
							// this amount is a percent of the global duration
							amount: 70,
							fov: 20,
							stepEase: "linear"
						},
						{
							// this amount is a percent of the global duration
							amount: 30,
							fov: 190,
							stepEase: "easeInOut"
						},

					]
				},
	
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
					fly: true,
					forward: false,
					backward: false,
					left: false,
					right: false,
					translateZ1: true
				},
	
				slowmo: 1,

				alice: {
					handleGround: false,
					name: "linkShaderFlying",
					move: {
						left: false,
						right: false,
						kiss: true
					},
					offset: {
						x: 0,
						y: -5.5,
						z: -2
					},
					scale: 0.085,
					slowmo: 30,
					customShaderOptions: {
						shaderTimeRatio: 1.8,
						shaderTimeDecay: 12,
						isCameraPositionInfluenced: false,
						sin: false,
						sinAmplitude: 20
					}
				},
	
				postproc: [
					{
						type: "bloom",
						value: {
							strength: 0.55,
							threshold: 0.0035,
							radius: 0.1
						}
					}
				]
	
			},
			{
				id: "7.21",
				baseFov: 18,
				fovTransition: false,
				sequenceBobName: "marieShaderFlying",
				bobRestoreSize: 0.0011,
				isEndSequence: true,
	
				type: "third-person",
				cameraTriggerTimeDecay: 8,
				cameraType: "movingFlyRightKiss",
	
				until: 50.55,
				// until: 60.55,

				nextInstruction: "switch-sequence",
	
				cameraInvert: {
					x: false,
					y: true
				},
	
				bobCustomShader: {
					shaderTimeRatio: 0.025,
					shaderTimeDecay: 0,
					sin: true,
					sinAmplitude: 30
				},
	
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
					fly: true,
					forward: false,
					backward: false,
					left: false,
					right: false,
					translateZ1: true
				},
	
				slowmo: 1,

				alice: {
					handleGround: false,
					name: "linkShaderFlying",
					move: {
						left: false,
						right: false,
						kiss: true
					},
					offset: {
						x: 0,
						y: -2,
						z: 0
					},
					scale: 0.08,
					slowmo: 12,
					customShaderOptions: {
						shaderTimeRatio: 0.011,
						shaderTimeDecay: 10,
						sin: true,
						sinAmplitude: 37
					}
				},
	
				postproc: [
					{
						type: "bloom",
						value: {
							strength: 0.55,
							threshold: 0.0035,
							radius: 0.1
						}
					},
					{
						type: "glitch"
					},
					
				]
	
			},
			{
				id: "7.22",
				baseFov: 45,
				fovTransition: false,
				sequenceBobName: "marieShaderFlying",
				bobRestoreSize: 0.0011,
				isEndSequence: true,
	
				type: "blender-points",
	
				until: 58,
				// until: 4,
				nextInstruction: "switch-sequence",
	
				cameraInvert: {
					x: false,
					y: false
				},
	
				bobCustomShader: {
					shaderTimeRatio: 0.025,
					shaderTimeDecay: 0,
					sin: true,
					sinAmplitude: 30
				},

				tubeInfos: {
					duration: 13,
					// isUsingTarget indicate that we need a plan-1.0-target point in the glb
					isUsingTarget: true,
					steps: [
						// n steps are possibles
						// n has nothing to do with the number of points for the curve
						{
							// this amount is a percent of the global duration
							amount: 40,
							fov: 20,
							stepEase: "linear"
						},
						{
							// this amount is a percent of the global duration
							amount: 60,
							fov: 160,
							stepEase: "linear"
						}
					]
				},
	
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
					fly: true,
					forward: false,
					backward: false,
					left: false,
					right: false,
					// translateZ1: true
				},
	
				slowmo: 1,
	
				postproc: [
					{
						type: "bloom",
						value: {
							strength: 0.55,
							threshold: 0.0035,
							radius: 0.1
						}
					}
				]
	
			},
			{
				id: "7.23",
				baseFov: 25,
				fovTransition: false,
				sequenceBobName: "marieShaderFlying",
				bobRestoreSize: 0.0011,
				isEndSequence: true,
	
				type: "third-person",
				cameraTriggerTimeDecay: 8,
				cameraType: "movingFlyMarie",
	
				until: 62,
				// until: 4,
				nextInstruction: "switch-sequence",
	
				cameraInvert: {
					x: false,
					y: true
				},
	
				bobCustomShader: {
					shaderTimeRatio: 0.025,
					shaderTimeDecay: 0,
					sin: true,
					sinAmplitude: 30
				},
	
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
					fly: true,
					forward: false,
					backward: false,
					// left: false,
					// right: false,
					// translateZ1: true
				},
	
				slowmo: 1,
	
				postproc: [
					{
						type: "bloom",
						value: {
							strength: 0.55,
							threshold: 0.0035,
							radius: 0.1
						}
					},
					{
						type: "glitch"
					}
					
				]
	
			},
			{
				id: "7.24",
				baseFov: 250,
				fovTransition: false,
				sequenceBobName: "marieShaderFlying",
				bobRestoreSize: 0.0011,
				isEndSequence: true,
	
				type: "blender-points",
	
				until: 72,
				// until: 4,
				nextInstruction: "switch-sequence",
	
				cameraInvert: {
					x: false,
					y: true
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
							fov: 90,
							stepEase: "linear"
						}
					]
				},
	
				bobCustomShader: {
					shaderTimeRatio: 0.025,
					shaderTimeDecay: 0,
					sin: true,
					sinAmplitude: 30
				},
	
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
					fly: true,
					forward: false,
					backward: false,
					left: false,
					right: false,
					// translateZ1: true
				},
	
				slowmo: 1,
	
				postproc: [
					{
						type: "bloom",
						value: {
							strength: 0.55,
							threshold: 0.0035,
							radius: 0.1
						}
					},
					
				]
	
			},
			{
				id: "7.25",
				baseFov: 15,
				fovTransition: false,
				sequenceBobName: "marieShaderFlying",
				bobRestoreSize: 0.0011,
				isEndSequence: true,
	
				type: "blender-points",
	
				until: 79,
				// until: 4,
				nextInstruction: "switch-sequence",
	
				cameraInvert: {
					x: true,
					y: false
				},

				tubeInfos: {
					duration: 13,
					// isUsingTarget indicate that we need a plan-1.0-target point in the glb
					isUsingTarget: true,
					steps: [
						// n steps are possibles
						// n has nothing to do with the number of points for the curve
						{
							// this amount is a percent of the global duration
							amount: 80,
							fov: 40,
							stepEase: "linear"
						},
						{
							// this amount is a percent of the global duration
							amount: 20,
							fov: 70,
							stepEase: "easeInOut"
						}
					]
				},
	
				bobCustomShader: {
					shaderTimeRatio: 0.025,
					shaderTimeDecay: 0,
					sin: true,
					sinAmplitude: 30
				},
	
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
					fly: true,
					forward: false,
					backward: false,
					left: false,
					right: false,
					// translateZ1: true
				},
	
				slowmo: 1,
	
				postproc: [
					{
						type: "bloom",
						value: {
							strength: 0.55,
							threshold: 0.0035,
							radius: 0.1
						}
					},
					{
						type: "glitch"
					},
				]
	
			},
			{
				id: "7.26",
				baseFov: 100,
				fovTransition: false,
				sequenceBobName: "marieShaderFlying",
				bobRestoreSize: 0.0011,
				isEndSequence: true,
	
				type: "blender-points",
	
				until: 86.7,
				// until: 4,
				nextInstruction: "switch-sequence",
	
				cameraInvert: {
					x: true,
					y: true
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
						},
					]
				},
	
				bobCustomShader: {
					shaderTimeRatio: 0.025,
					shaderTimeDecay: 0,
					sin: true,
					sinAmplitude: 30
				},
	
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
					fly: true,
					forward: false,
					backward: false,
					left: false,
					right: false,
					// translateZ1: true
				},
	
				slowmo: 1,
	
				postproc: [
					{
						type: "bloom",
						value: {
							strength: 0.55,
							threshold: 0.0035,
							radius: 0.1
						}
					},
					
				]
	
			},
			{
				id: "7.27",
				baseFov: 25,
				fovTransition: false,
				sequenceBobName: "marieShaderFlying",
				bobRestoreSize: 0.0011,
				isEndSequence: true,
	
				type: "third-person",
				cameraTriggerTimeDecay: 8,
				cameraType: "movingFlyMarie",
	
				until: 93.4,
				// until: 4,
				nextInstruction: "switch-sequence",
	
				cameraInvert: {
					x: false,
					y: true
				},
	
				bobCustomShader: {
					shaderTimeRatio: 0.025,
					shaderTimeDecay: 0,
					sin: true,
					sinAmplitude: 30
				},
	
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
					fly: true,
					forward: false,
					backward: false,
					// left: false,
					// right: false,
					// translateZ1: true
				},
	
				slowmo: 1,

				alice: {
					handleGround: false,
					name: "link",
					move: {
						fly: false,
						forward: true,
						backward: false,
						translateZ1: false
					},
					offset: {
						x: 0,
						y: 0,
						z: 0
					},
					// customShaderOptions: {
					// 	shaderTimeRatio: 0.08,
					// 	shaderTimeDecay: 12,
					// 	isCameraPositionInfluenced: false,
					// 	sin: true,
					// 	sinAmplitude: 20
					// },
					scale: 0.035,
					slowmo: 1
				},
	
				postproc: [
					{
						type: "bloom",
						value: {
							strength: 0.55,
							threshold: 0.0035,
							radius: 0.1
						}
					},
					{
						type: "glitch"
					},
				]
	
			},
			{
				id: "7.28",
				baseFov: 8,
				fovTransition: false,
				sequenceBobName: "marieShaderFlying",
				bobRestoreSize: 0.0011,
				isEndSequence: true,
	
				type: "blender-points",
	
				until: 134.5,
				// until: 4,
				nextInstruction: "drop-and-load-and-switch",
	
				cameraInvert: {
					x: true,
					y: false
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
							fov: 20,
							stepEase: "linear"
						}
					]
				},
	
				bobCustomShader: {
					shaderTimeRatio: 0.025,
					shaderTimeDecay: 0,
					sin: true,
					sinAmplitude: 30
				},
	
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
					fly: true,
					forward: false,
					backward: false,
					left: false,
					right: false,
					// translateZ1: true
				},
	
				slowmo: 1,
	
				postproc: [
					{
						type: "bloom",
						value: {
							strength: 0.55,
							threshold: 0.0035,
							radius: 0.1
						}
					}
				]
	
			},
		]
	
	},

	{

		name: "world_070_finish",
	
		main: {
			// spaceColor: "#090016",
			spaceColor: "#666666",
			spaceColorDarker: "#666666",
			spaceColorWithBloom: "#666666",
	
			ambient: {
				sunColor: "#FFFFFF",
				// intensity: 0.17,
				intensity: 0.35,
				groundColor: "#8d00ff"
			},
	
			fog: {
				enabled: false,
				color: 0xff9500,
				intensity: .15
			},
	
			meshInfos: {
	
				glbPath: "/assets/3d/worlds/finish/finish.glb",
				imagePath: {
					landscape: "/assets/3d/worlds/finish/finishBake"
				}
			},

		},
	
		sequences: [
			{
				id: "7.24",
				// baseFov: 39,
				baseFov: 15,
				fovTransition: false,
				sequenceBobName: "link",
				bobRestoreSize: 0.023,
				isEndSequence: true,
	
				type: "blender-points",
	
				until: 999,
				// until: 3,

				// nextInstruction: "switch-sequence",
	
				cameraInvert: {
					x: true,
					y: false
				},

				tubeInfos: {
					duration: 60,
					// isUsingTarget indicate that we need a plan-1.0-target point in the glb
					isUsingTarget: true,
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
					forward: false,
					backward: false,
					translateZ1: false,
					left: false,
					right: false,
					twistleft: true
				},
	
	
				alice: {
					handleGround: true,
					name: "linkShaderPlastic",
					move: {
						fly: false,
						forward: false,
						backward: false,
						translateZ1: false,
						left: false,
						right: false,
						twistright: true
					},
					offset: {
						x: 0,
						y: 0,
						z: 0
					},
					// customShaderOptions: {
					// 	shaderTimeRatio: 0.8,
					// 	shaderTimeDecay: 12,
					// 	isCameraPositionInfluenced: false,
					// 	sin: false,
					// 	sinAmplitude: 20
					// },
					scale: 0.023,
					slowmo: 18
				},
	
				slowmo: 18,
	
				postproc: [
					{
						type: "bloom",
						value: {
							strength: 0.25,
							threshold: 0.0035,
							radius: 0.2
						}
					}
				]
	
			},
			{
				id: "7.28",
				// baseFov: 39,
				baseFov: 15,
				fovTransition: false,
				sequenceBobName: "link",
				bobRestoreSize: 0.023,
				isEndSequence: true,
	
				type: "blender-points",
	
				until: 999,
				// until: 3,

				// nextInstruction: "switch-sequence",
	
				cameraInvert: {
					x: true,
					y: false
				},

				tubeInfos: {
					duration: 60,
					// isUsingTarget indicate that we need a plan-1.0-target point in the glb
					isUsingTarget: true,
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
					forward: false,
					backward: false,
					translateZ1: false,
					left: false,
					right: false,
					twistleft: true
				},
	
	
				alice: {
					handleGround: true,
					name: "linkShaderPlastic",
					move: {
						fly: false,
						forward: false,
						backward: false,
						translateZ1: false,
						left: false,
						right: false,
						twistright: true
					},
					offset: {
						x: 0,
						y: 0,
						z: 0
					},
					// customShaderOptions: {
					// 	shaderTimeRatio: 0.08,
					// 	shaderTimeDecay: 12,
					// 	isCameraPositionInfluenced: false,
					// 	sin: false,
					// 	sinAmplitude: 20
					// },
					scale: 0.023,
					slowmo: 18
				},
	
				slowmo: 18,
	
				postproc: [
					{
						type: "bloom",
						value: {
							strength: 0.25,
							threshold: 0.0035,
							radius: 0.2
						}
					}
				]
	
			},
			
		]
	
	}

]



export { worlds };