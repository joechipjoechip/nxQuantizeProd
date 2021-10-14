const core = {

	main: {
		fog: {
			enabled: true,
			color: 0xff9500,
			intensity: .5
		},
		colors: {
			lights: {
				purple: "#821EFF",
				green: "#ABFFC7"
			}
		},
		generatedCamerasSpecs: {
			// pos qui vont etre ajoutées à la position de la target (link)
			gtaLike: {
				offset: {
					x: 0,
					y: 0.2,
					z: -0.3
				},
				lookAt: {
					x: 0,
					y: 0.1,
					z: 1.2
				}
			}	
		},
		guiConfig: {
			elements: {},
			actions: {
				position: {
					step: 0.001,
					min: -5,
					max: 5
				},
				rotation: {
					step: 0.1,
					min: -5,
					max: 5
				},
				scale: {
					step: 0.000001,
					min: 0,
					max: 0.025
				}
			}
		}
	},

	worlds: {

		mountainTwo: {
			

			base: {

				fog: {
					enabled: true,
					color: 0xff9500,
					intensity: .15
				},
				
				meshsInfos: {
					map: {
						url: "/blender/worlds/mountainTwo/mountainTwo-scaled.glb",
						name: "mainMapMerged",
						baked: "/blender/worlds/mountainTwo/lastMountainTwo.jpg",
					}
				},

			},

			
			sequences: [
				{
					id: "1.0",
					type: "blender-tube",
					animatedMesh: true,
					link: true,

					config: {

						fog: {
							enabled: true,
							color: 0xff0000,
							intensity: .15
						},
						// lights
						// material
						material: {
							url: "/blender/wrongBaked.jpg"
						}

					},

					// blenderCurvesAndTubes: true,

					// si target : donner le nom
					targetName: "link",

					// si path : donner le nom
					pathName: "cameraPoint",
					
					debug: {
						seeTube: false
					},
					global: {
						duration: 4,
						globalEase: "power4.inOut"
					},
					curveSteps: [
						{
							// cette duration est un pourcentage de la duration globale
							duration: 20,
							stepEase: "power4.inOut"
						},
						{
							duration: 30,
							stepEase: "elastic.inOut"
						},
						{
							duration: 40,
							stepEase: "power4.inOut"
						},
						{
							duration: 10,
							stepEase: "power4.inOut"
						}
					],

				},
				{
					id: "1.1",
					type: "manual-camera-positionning",
					animatedMesh: true,

					link: {
						scale: 0.0005,
						velocity: {
							// x: monter/descendre (inutile pour l'instant)
							x: 1,
							// y: tourner (left/right)
							y: 0.25,
							// z: avancer/reculer
							z: 0.4
						}
					},
					
					config: {

						fog: {
							enabled: true,
							color: 0xff0000,
							intensity: .2
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
								y: 3.0882867983570295,
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
								rotation: {
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
									x: -0.698,
									y: -0.195,
									z: 0.71,
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
									duration: .5,
									placeString: "farAway",
									isUsingTarget: false
								}
							},
							{
								global: {
									duration: 0.75,
									placeString: "soClose",
									isUsingTarget: true
								},
								onComplete: {
									// duration of this is in this
									// chapter camera seeting
									//  ./.../camera->changeMode->duration
									action: "change-target",
									// (cause this action is a mode changer)
									targetString: "link",
									options: {
										orbitLimits: {
											x: Math.PI / 2,
											y: Math.PI / 2,
											z: Math.PI / 2
										}
									}
								}
							},
						]
	
					}

				}

			]

		},

		portal: {

			base: {

				fog: {
					enabled: true,
					color: 0xff9500,
					intensity: .15
				},
				
				meshsInfos: {
					map: {
						url: "/blender/worlds/portal/merged4.glb",
						name: "mainMapMerged",
						baked: "/blender/worlds/portal/bakedBetter.jpg"
					}
				}

			},

			sequences: [
				{
					id: "1.2",
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
								rotation: {
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
								},
								onComplete: {
									// duration of this is in this
									// chapter camera seeting
									//  ./.../camera->changeMode->duration
									action: "change-target",
									// (cause this action is a mode changer)
									targetString: "link",
									options: {
										orbitLimits: {
											x: Math.PI / 2,
											y: Math.PI / 2,
											z: Math.PI / 2
										}
									}
								}
							},
						]
	
					}

				}

			]

		},

		keyframesScene: {

			base: {

				fog: {
					enabled: true,
					color: 0xff9500,
					intensity: .15
				},
				
				meshsInfos: {
					map: {
						url: "/blender/worlds/keyframesScene/sceneTestingKeyframes-link.glb",
						name: "mainMapMerged"
					}
				}

			},

			sequences: [
				{
					id: "1.3",
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
								z: 1.3004400166546777,
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
								rotation: {
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
								},
								onComplete: {
									// duration of this is in this
									// chapter camera seeting
									//  ./.../camera->changeMode->duration
									action: "change-target",
									// (cause this action is a mode changer)
									targetString: "link",
									options: {
										orbitLimits: {
											x: Math.PI / 2,
											y: Math.PI / 2,
											z: Math.PI / 2
										}
									}
								}
							},
						]
	
					}

				}

			]

		}

	}

}

export { core };