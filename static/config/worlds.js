const worlds = [

	{
		name: "world1_test",

		main: {

			spaceColor: "#160D54",
			spaceColorWithBloom: "#040116",

			sun: {
				color: "#FFFFFF",
				intensity: 0.07
			},

			fog: {
				enabled: true,
				color: 0xff9500,
				intensity: .15
			},
			
			meshInfos: {

				world: {
					glbPath: "/assets/3d/worlds/five/five.glb",
					imagePath: {
						landscape: "/assets/3d/worlds/five/fiveBake.jpg",
						// sky: "/assets/3d/worlds/bones/skyBake.jpg"
					}
				},

				bob: {
					glbPath: "/assets/3d/persos/bob/bob.fbx",
					infos: {
						scale: 0.0008,
						// scale: 1,z
						velocity: {
							// x & z -> displacement
							x: 0.5,
							z: 0.5,
							// y -> rotation
							y: 0.1,
						}
					}
				}

			}

		},

		sequences: [
			{
				id: "1.0",
				baseFov: 65,

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
					enabled: true,
					color: 0x000000,
					intensity: .15
				},

				tubeInfos: {
					duration: 25,
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
					
				]

			},
			{
				id: "1.1",
				baseFov: 27,

				// type: "blender-points",
				type: "third-person",
				cameraType: "hips",

				animatedMesh: false,

				helpers: {
					orbit: true,
					tubes: false,
					timelines: false
				},
				
				config: {
					fog: {
						enabled: true,
						color: 0x000000,
						intensity: .15
					},
				},

				bobImposedMoves: {
					// forward: true,
					// shift: true
				},

				postproc: [

					

					// {
					// 	type: "dotscreen",
					// 	dotSize: 400
					// },


					// {
					// 	type: "sepia",
					// 	amount: 1
					// },
					// {
					// 	type: "glitch"
					// },

					// {
					// 	type: "rgbShift",
					// 	amount: 0.006
					// },
					
					// {
					// 	type: "vignette",
					// 	darkness: 1.5,
					// 	offset: 1.3
					// },


					
					

					// {
					// 	type: "sobel"
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
					// 	type: "bloom",
					// 	value: {
					// 		strength: 0.9,
					// 		threshold: 0.35,
					// 		radius: 0.3
					// 	}
					// },
				]

			},
			{
				id: "1.2",
				baseFov: 35,

				// type: "blender-points",
				type: "third-person",
				cameraType: "movingHips",

				animatedMesh: false,

				helpers: {
					orbit: true,
					tubes: false,
					timelines: false
				},
				
				config: {
					fog: {
						enabled: true,
						color: 0x000000,
						intensity: .15
					},
				},

				bobImposedMoves: {
					forward: true,
					shift: false
				},

				postproc: [
					
					{
						type: "grain"
					}
					
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
					// 	type: "bloom",
					// 	value: {
					// 		strength: 0.9,
					// 		threshold: 0.35,
					// 		radius: 0.3
					// 	}
					// },
				]

			},
			{
				id: "1.3",
				baseFov: 95,

				// type: "blender-points",
				type: "third-person",
				cameraType: "movingHips",

				animatedMesh: false,

				helpers: {
					orbit: true,
					tubes: false,
					timelines: false
				},
				
				config: {
					fog: {
						enabled: true,
						color: 0x000000,
						intensity: .15
					},
				},

				bobImposedMoves: {
					forward: true,
					shift: false
				},

				postproc: [
					
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
						type: "bloom",
						value: {
							strength: 0.9,
							threshold: 0.35,
							radius: 0.3
						}
					},
				]

			}
		]

	},

]

export { worlds };