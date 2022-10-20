const worlds = [

	{
		name: "world1_test",

		main: {

			spaceColor: "#160D54",

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
				type: "blender-points",
				// type: "third-person",
				// cameraType: "movingHips",

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
					duration: 20,
					// isUsingTarget indicate that we need a plan-1.0-target point in the glb
					isUsingTarget: true,
					steps: [
						// n steps are possibles
						// n has nothing to do with the number of points for the curve
						{
							// this amount is a percent of the global duration
							amount: 10,
							fov: 85,
							stepEase: "linear"
						},
						{
							// this amount is a percent of the global duration
							amount: 90,
							fov: 15,
							stepEase: "linear"
						},
						
					]
				},

				postproc: [
					
				]

			},
			{
				id: "1.1",
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
					space: true
				},

				postproc: [
					// {
					// 	type: "glitch"
					//},

					// {
					// 	type: "sobel"
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

			},
			{
				id: "1.2",
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
					shift: true
				},

				postproc: [
					
				]

			}
		]

	},

]

export { worlds };