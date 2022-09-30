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
					glbPath: "/assets/3d/worlds/oula/oula.glb",
					imagePath: {
						landscape: "/assets/3d/worlds/oula/oula.jpg",
						// sky: "/assets/3d/worlds/bones/skyBake.jpg"
					}
				},

				// bob: {
				// 	glbPath: "/assets/3d/worlds/base002/link-001.glb"
				// }

			}

		},

		sequences: [
			{
				id: "1.0",
				type: "blender-points",
				animatedMesh: false,
				
				config: {
					fog: {
						enabled: true,
						color: 0x000000,
						intensity: .15
					},
				},

				path: {
					duration: 24,
					// isUsingTarget indicate that we need a plan-1.0-target point in the glb
					isUsingTarget: true,
					steps: [
						// n steps are possibles
						// n has nothing to do with the number of points for the curve
						{
							// this amount is a percent of the global duration
							amount: 70,
							stepEase: "linear"
						},
						{
							amount: 30,
							stepEase: "power4.InOut"
						}
					]
				}
				

			}
		]

	},

]

export { worlds };