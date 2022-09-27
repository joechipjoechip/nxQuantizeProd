const worlds = [

	{
		name: "base002",

		main: {

			fog: {
				enabled: true,
				color: 0xff9500,
				intensity: .15
			},
			
			meshInfos: {

				world: {
					glbPath: "/blender/worlds/mountainTwo/mountainTwo-scaled.glb",
					imagePath: {
						landscape: "/blender/worlds/mountainTwo/mountainTwo.jpg",
						// sky: "/blender/worlds/base002/baked002.jpg"
					}
				},

				// bob: {
				// 	glbPath: "/blender/worlds/base002/link-001.glb"
				// }

			}

		},

		sequences: [
			{
				id: "1.0",
				type: "manual-camera-positionning",
				animatedMesh: false,
				
				config: {

					fog: {
						enabled: true,
						color: 0x000000,
						intensity: .15
					},
					// lights
					// material

				},

				changeMode: {
					duration: .75,
					ease: "power2.inOut"
				},
				
				paths: {
					initialTarget: {
						x:0, y:0, z:0
					},
					initial: {
						position: {
							x: -2.0649971226973243,
							y: 6.0882867983570295,
							z: 2.3004400166546777,
						},
						rotation: {
							x: 0.17906205038942194,
							y: 0.31644162721870206,
							z: -0.056265581323121254,
						},
						fov: {
							value: 35
						}
					},

					places: [
						{
							id: "farAway",
							position: {
								x: -4.148056974161086,
								y: 0.4381372147125346,
								z: 3.1953272756404276,
								duration: 100,
								startRef: 0,
								ease: "power3.inOut"
							},
							fov: {
								value: 175,
								duration: 90,
								startRef: 0,
								ease: "power3.inOut"
							}
						},
						{
							id: "soClose",
							position: {
								x: -0.729176082379386,
								y: -0.2162811981479167,
								z: 0.8024181097065985,
								duration: 100,
								startRef: 0,
								ease: "power4.inOut"
							},
							fov: {
								value: 75,
								duration: 100,
								startRef: 0,
								ease: "elastic.inOut"
							}
						}

					],

					steps: [
						{
							global: {
								duration: 3.5,
								placeString: "farAway",
								isUsingTarget: false
							}
						},
						{
							global: {
								duration: 7,
								placeString: "soClose",
								isUsingTarget: true
							}
						},
					]

				}

			}
		]

	},

]

export { worlds };