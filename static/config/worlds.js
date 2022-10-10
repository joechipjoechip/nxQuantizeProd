const worlds = [

	{
		name: "world1_test",

		main: {

			spaceColor: "#493F62",

			fog: {
				enabled: true,
				color: 0xff9500,
				intensity: .15
			},
			
			meshInfos: {

				world: {
					glbPath: "/assets/3d/worlds/oula/oula3.glb",
					imagePath: {
						landscape: "/assets/3d/worlds/oula/oula.jpg",
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

				tubeInfos: {
					duration: 4,
					// isUsingTarget indicate that we need a plan-1.0-target point in the glb
					isUsingTarget: true,
					steps: [
						// n steps are possibles
						// n has nothing to do with the number of points for the curve
						{
							// this amount is a percent of the global duration
							amount: 30,
							fov: 25,
							stepEase: "linear"
						},
						{
							// this amount is a percent of the global duration
							amount: 40,
							fov: 95,
							stepEase: "linear"
						},
						{
							amount: 29,
							fov: 28,
							stepEase: "power4.InOut"
						}
					]
				},

				postproc: [
					// {
					// 	type: "glitch"
					// },
					
					// {
					// 	type: "blur",
					// 	value: {
					// 		focus: 160,
					// 		aperture: 8.2,
					// 		maxblur: 0.01,
					// 	}
					// },

					// {
					// 	type: "sobel"
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
				

			}
		]

	},

]

export { worlds };