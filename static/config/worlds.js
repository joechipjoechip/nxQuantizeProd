const worlds = [

	{
		name: "world_0",

		main: {

			// spaceColor: "#160D54",
			// spaceColorDarker: "#0D063B",
			// spaceColorWithBloom: "#040116",
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
						x: 8,
						y: 1.5,
						z: 14
					}
				}
			],
			
			meshInfos: {

				glbPath: "/assets/3d/worlds/veryLowPoly/veryLowPoly.glb",
				imagePath: {
					landscape: "/assets/3d/worlds/veryLowPoly/veryLowPolyBake.jpg",
					// sky: "/assets/3d/worlds/bones/skyBake.jpg"
				},
				options: {
					metalness: 0.2,
					roughness: 0.85
				}

			},

			entities: ["link", "juan"],

		},

		sequences: [
			{
				id: "1.0",
				baseFov: 65,
				sequenceBobName: "link",

				type: "blender-points",
				// type: "third-person",
				// cameraType: "movingHips",

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
							amount: 2,
							fov: 150,
							stepEase: "linear"
						},
						{
							// this amount is a percent of the global duration
							amount: 30,
							fov: 15,
							stepEase: "linear"
						},
						{
							// this amount is a percent of the global duration
							amount: 70,
							fov: 35,
							stepEase: "linear"
						},
						
					]
				},

				postproc: [
					// {
					// 	type: "afterimage",
					// 	damp: 0.99
					// }
					// {
					// 	type: "kaleidoscope",
					// 	sides: 1,
					// 	angle: 90
					// },

					// {
					// 	type: "bloom",
					// 	value: {
					// 		strength: .5,
					// 		threshold: 0.45,
					// 		radius: 0.01
					// 	}
					// },

				]

			},
			{
				id: "1.1",
				baseFov: 27,
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
					enabled: false,
					color: "#0D063B",
					intensity: .3
				},

				bobImposedMoves: {
					forward: true,
					// shift: true,
					// fly: true
				},

				postproc: [

					

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


					

					{
						type: "bloom",
						value: {
							strength: 0.9,
							threshold: 0.35,
							radius: 0.3
						}
					},

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
				

					
				]

			},
			{
				id: "1.2",
				baseFov: 35,
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
					shift: true,
					left: false,
					right: false
				},

				slowmo: 5,

				postproc: [
					
					// {
					// 	type: "grain",
					// 	amount: 0.75
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
					// 	type: "blur",
					// 	focusTarget: "bob",
					// 	value: {
					// 		focus: 1,
					// 		aperture: 0.025,
					// 		maxblur: 0.005
					// 	}
					// },

					// {
					// 	type: "vignette",
					// 	darkness: 1.5,
					// 	offset: 1.15
					// },



				]

			},
			{
				id: "1.3",
				baseFov: 35,
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

				bobImposedMoves: {
					// forward: true,
					// shift: false
				},

				postproc: [

				


					// {
					// 	type: "bloom",
					// 	value: {
					// 		strength: 0.3,
					// 		threshold: 0.35,
					// 		radius: 0.99
					// 	}
					// },

					// {
					// 	type: "blur",
					// 	focusTarget: "bob",
					// 	value: {
					// 		focus: 1,
					// 		aperture: 0.025,
					// 		maxblur: 0.005
					// 	}
					// },

					
					// {
					// 	type: "rgbShift",
					// 	amount: 0.12
					// },
					// {
					// 	type: "grayscale"
					// },
					// {
					// 	type: "film",
					// 	linesAmount: 650,
					// 	opacity: 0.8,
					// 	aberration: 0.2
					// },
					// {
					// 	type: "pixel",
					// 	pixelSize: 0.5
					// },
					
				],

			},
			{
				id: "1.4",
				baseFov: 95,
				sequenceBobName: "juan",

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
					enabled: false,
					color: "#000000",
					intensity: .15
				},

				bobImposedMoves: {
					climb: true,
					left: false,
					right: false,
					space: false,
					shift: false
				},

				postproc: [
					
					// {
					// 	type: "blur",
					// 	focusTarget: "bob",
					// 	value: {
					// 		focus: 1,
					// 		aperture: 0.025,
					// 		maxblur: 0.008
					// 	}
					// },
					// {
					// 	type: "pixel",
					// 	pixelSize: 1
					// },
					
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

	{
		name: "world_1",

		main: {

			// spaceColor: "#160D54",
			// spaceColorDarker: "#0D063B",
			// spaceColorWithBloom: "#040116",
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

			// particles: [
			// 	{
			// 		type: "fireflies",
			// 		count: 200,
			// 		particleSize: 50,
			// 		additive: false,
			// 		blockSize: {
			// 			x: 8,
			// 			y: -0.5,
			// 			z: 14
			// 		}
			// 	}
			// ],
			
			meshInfos: {

				glbPath: "/assets/3d/worlds/epicValley/epicValley.glb",
				imagePath: {
					landscape: "/assets/3d/worlds/epicValley/epicValleyBake.jpg",
					// sky: "/assets/3d/worlds/bones/skyBake.jpg"
				}
			},


			entities: ["link", "juan", "queen"],

			// bobsMoveFolder: "./assets/3d/persos/moves/smallGuy/",
			// bobs: {
			// 	link: {
			// 		name: "link",
			// 		fbxPath: "./assets/3d/persos/bob/bob.fbx",
			// 		infos: {
			// 			scale: 0.0008,
			// 			// scale: 1,z
			// 			velocity: {
			// 				// x & z -> displacement
			// 				x: 0.5,
			// 				z: 0.5,
			// 				// y -> rotation
			// 				y: 0.1,
			// 			}
			// 		}
			// 	},
			// 	juan: {
			// 		name: "juan",
			// 		fbxPath: "./assets/3d/persos/bob2/bob.fbx",
			// 		infos: {
			// 			scale: 0.0008,
			// 			// scale: 1,z
			// 			velocity: {
			// 				// x & z -> displacement
			// 				x: 0.5,
			// 				z: 0.5,
			// 				// y -> rotation
			// 				y: 0.1,
			// 			}
			// 		}
			// 	}
			// }

		},

		sequences: [
			{
				id: "1.0",
				baseFov: 65,
				sequenceBobName: "link",

				type: "blender-points",
				// type: "third-person",
				// cameraType: "movingHips",

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

				postproc: [
					// {
					// 	type: "afterimage",
					// 	damp: 0.99
					// }
					// {
					// 	type: "kaleidoscope",
					// 	sides: 4,
					// 	angle: 90
					// }

					// {
					// 	type: "bloom",
					// 	value: {
					// 		strength: .5,
					// 		threshold: 0.45,
					// 		radius: 0.01
					// 	}
					// },

				]

			},
			{
				id: "1.1",
				baseFov: 27,
				sequenceBobName: "juan",

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
					enabled: false,
					color: "#0D063B",
					intensity: .3
				},

				bobImposedMoves: {
					forward: true,
					// shift: true,
					// fly: true
				},

				postproc: [

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
					// 	type: "rgbShift",
					// 	amount: 0.12
					// },

					// {
					// 	type: "dotscreen",
					// 	dotSize: 4
					// },


					// {
					// 	type: "sepia",
					// 	amount: 1
					// },

					{
						type: "bloom",
						value: {
							strength: 0.9,
							threshold: 0.35,
							radius: 0.3
						}
					},

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
				

					
				]

			},
			{
				id: "1.2",
				baseFov: 35,
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
					shift: true,
					left: false,
					right: false
				},

				slowmo: 5,

				postproc: [
					
					// {
					// 	type: "grain",
					// 	amount: 0.75
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
					// 	type: "blur",
					// 	focusTarget: "bob",
					// 	value: {
					// 		focus: 1,
					// 		aperture: 0.025,
					// 		maxblur: 0.005
					// 	}
					// },

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

				bobImposedMoves: {
					// forward: true,
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

					// {
					// 	type: "blur",
					// 	focusTarget: "bob",
					// 	value: {
					// 		focus: 1,
					// 		aperture: 0.025,
					// 		maxblur: 0.005
					// 	}
					// },

					
					// {
					// 	type: "rgbShift",
					// 	amount: 0.12
					// },
					// {
					// 	type: "grayscale"
					// },
					// {
					// 	type: "film",
					// 	linesAmount: 650,
					// 	opacity: 0.8,
					// 	aberration: 0.2
					// },
					// {
					// 	type: "pixel",
					// 	pixelSize: 0.5
					// },
					
				],

			},
			{
				id: "1.4",
				baseFov: 95,
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
					
					// {
					// 	type: "blur",
					// 	focusTarget: "bob",
					// 	value: {
					// 		focus: 1,
					// 		aperture: 0.025,
					// 		maxblur: 0.008
					// 	}
					// },
					// {
					// 	type: "pixel",
					// 	pixelSize: 1
					// },
					
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

	{
		name: "world_2",

		main: {

			// spaceColor: "#160D54",
			// spaceColorDarker: "#0D063B",
			// spaceColorWithBloom: "#040116",
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

			// particles: [
			// 	{
			// 		type: "fireflies",
			// 		count: 200,
			// 		particleSize: 50,
			// 		additive: false,
			// 		blockSize: {
			// 			x: 8,
			// 			y: -0.5,
			// 			z: 14
			// 		}
			// 	}
			// ],
			
			meshInfos: {

				glbPath: "/assets/3d/worlds/epicValley/epicValley.glb",
				imagePath: {
					landscape: "/assets/3d/worlds/epicValley/epicValleyBake.jpg",
					// sky: "/assets/3d/worlds/bones/skyBake.jpg"
				}

			},

			entities: ["link", "juan"],

			// bobsMoveFolder: "./assets/3d/persos/moves/smallGuy/",
			// bobs: {
			// 	link: {
			// 		name: "link",
			// 		fbxPath: "./assets/3d/persos/bob/bob.fbx",
			// 		infos: {
			// 			scale: 0.0008,
			// 			// scale: 1,z
			// 			velocity: {
			// 				// x & z -> displacement
			// 				x: 0.5,
			// 				z: 0.5,
			// 				// y -> rotation
			// 				y: 0.1,
			// 			}
			// 		}
			// 	},
			// 	juan: {
			// 		name: "juan",
			// 		fbxPath: "./assets/3d/persos/bob2/bob.fbx",
			// 		infos: {
			// 			scale: 0.0008,
			// 			// scale: 1,z
			// 			velocity: {
			// 				// x & z -> displacement
			// 				x: 0.5,
			// 				z: 0.5,
			// 				// y -> rotation
			// 				y: 0.1,
			// 			}
			// 		}
			// 	}
			// }

		},

		sequences: [
			{
				id: "1.0",
				baseFov: 65,
				sequenceBobName: "link",

				type: "blender-points",
				// type: "third-person",
				// cameraType: "movingHips",

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

				postproc: [
					// {
					// 	type: "afterimage",
					// 	damp: 0.99
					// }
					// {
					// 	type: "kaleidoscope",
					// 	sides: 4,
					// 	angle: 90
					// }

					// {
					// 	type: "bloom",
					// 	value: {
					// 		strength: .5,
					// 		threshold: 0.45,
					// 		radius: 0.01
					// 	}
					// },

				]

			},
			{
				id: "1.1",
				baseFov: 27,
				sequenceBobName: "juan",

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
					enabled: false,
					color: "#0D063B",
					intensity: .3
				},

				bobImposedMoves: {
					// forward: true,
					// shift: true,
					// fly: true
				},

				postproc: [

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
					// 	type: "rgbShift",
					// 	amount: 0.12
					// },

					// {
					// 	type: "dotscreen",
					// 	dotSize: 4
					// },


					// {
					// 	type: "sepia",
					// 	amount: 1
					// },

					{
						type: "bloom",
						value: {
							strength: 0.9,
							threshold: 0.35,
							radius: 0.3
						}
					},

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
				

					
				]

			},
			{
				id: "1.2",
				baseFov: 35,
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
					shift: true,
					left: false,
					right: false
				},

				slowmo: 5,

				postproc: [
					
					// {
					// 	type: "grain",
					// 	amount: 0.75
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
					// 	type: "blur",
					// 	focusTarget: "bob",
					// 	value: {
					// 		focus: 1,
					// 		aperture: 0.025,
					// 		maxblur: 0.005
					// 	}
					// },

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

				bobImposedMoves: {
					// forward: true,
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

					// {
					// 	type: "blur",
					// 	focusTarget: "bob",
					// 	value: {
					// 		focus: 1,
					// 		aperture: 0.025,
					// 		maxblur: 0.005
					// 	}
					// },

					
					// {
					// 	type: "rgbShift",
					// 	amount: 0.12
					// },
					// {
					// 	type: "grayscale"
					// },
					// {
					// 	type: "film",
					// 	linesAmount: 650,
					// 	opacity: 0.8,
					// 	aberration: 0.2
					// },
					// {
					// 	type: "pixel",
					// 	pixelSize: 0.5
					// },
					
				],

			},
			{
				id: "1.4",
				baseFov: 95,
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
					
					// {
					// 	type: "blur",
					// 	focusTarget: "bob",
					// 	value: {
					// 		focus: 1,
					// 		aperture: 0.025,
					// 		maxblur: 0.008
					// 	}
					// },
					// {
					// 	type: "pixel",
					// 	pixelSize: 1
					// },
					
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