const entities = {
	bobsMoveFolder: "./assets/3d/persos/moves/smallGuy/",
	bobs: {
		link: {
			name: "link",
			fbxPath: "./assets/3d/persos/joseph/joseph.fbx",
			infos: {
				scale: 0.0012,
				// scale: 1,z
				velocity: {
					// x & z -> displacement
					x: 0.35,
					z: 0.35,
					// y -> rotation
					y: 0.1,
				}
			},
			options: {
				emissiveEnabled: true,
				emissive: {
					// skin: {
					// 	color: "#FFFFFF",
					// 	intensity: 4,
					// 	enabled: true
					// }
					one: {
						color: "#557072",
						intensity: 0.3,
						enabled: false
					},
					two: {
						color: "#465E7A",
						intensity: 0.2,
						enabled: false
					},
					three: {
						color: "#FFFFFF",
						intensity: 500,
						enabled: true
					},
					skin: {
						color: "#FFFFFF",
						intensity: 4,
						enabled: false
					},
					eyes: {
						color: "#FFFFFF",
						intensity: 10,
						enabled: false
					}
				}
			}
		},
		linkShine: {
			name: "linkShine",
			fbxPath: "./assets/3d/persos/joseph/joseph.fbx",
			infos: {
				scale: 0.0012,
				// scale: 1,z
				velocity: {
					// x & z -> displacement
					x: 0.35,
					z: 0.35,
					// y -> rotation
					y: 0.1,
				}
			},
			options: {
				emissiveEnabled: true,
				emissive: {
					one: {
						color: "#557072",
						intensity: 0.35,
						enabled: true
					},
					two: {
						color: "#465E7A",
						intensity: 0.2,
						enabled: true
					},
					three: {
						color: "#FFFFFF",
						intensity: 500,
						enabled: false
					},
					skin: {
						color: "#FFFFFF",
						intensity: 4,
						enabled: false
					},
					eyes: {
						color: "#FFFFFF",
						intensity: 10,
						enabled: false
					}
				}
			}
		},
		linkShineEyes: {
			name: "linkShineEyes",
			fbxPath: "./assets/3d/persos/joseph/joseph.fbx",
			infos: {
				scale: 0.0012,
				// scale: 1,z
				velocity: {
					// x & z -> displacement
					x: 0.35,
					z: 0.35,
					// y -> rotation
					y: 0.1,
				}
			},
			options: {
				emissiveEnabled: true,
				emissive: {
					one: {
						color: "#557072",
						intensity: 0.35,
						enabled: false
					},
					two: {
						color: "#465E7A",
						intensity: 0.2,
						enabled: false
					},
					three: {
						color: "#FFFFFF",
						intensity: 500,
						enabled: true
					},
					skin: {
						color: "#FFFFFF",
						intensity: 4,
						enabled: false
					},
					eyes: {
						color: "#FFFFFF",
						intensity: 10,
						enabled: true
					}
				}
			}
		},
		linkShineSkin: {
			name: "linkShineSkin",
			fbxPath: "./assets/3d/persos/joseph/joseph.fbx",
			infos: {
				scale: 0.0012,
				// scale: 1,z
				velocity: {
					// x & z -> displacement
					x: 0.35,
					z: 0.35,
					// y -> rotation
					y: 0.1,
				}
			},
			options: {
				emissiveEnabled: true,
				emissive: {
					one: {
						color: "#557072",
						intensity: 0.35,
						enabled: false
					},
					two: {
						color: "#465E7A",
						intensity: 0.2,
						enabled: false
					},
					three: {
						color: "#FFFFFF",
						intensity: 500,
						enabled: false
					},
					skin: {
						color: "#FFFFFF",
						intensity: 500,
						enabled: true
					},
					eyes: {
						color: "#FFFFFF",
						intensity: 10,
						enabled: false
					}
				}
			}
		},
		linkShader: {
			name: "linkShader",
			fbxPath: "./assets/3d/persos/joseph/joseph.fbx",
			infos: {
				scale: 0.0012,
				// scale: 1,z
				velocity: {
					// x & z -> displacement
					x: 0.35,
					z: 0.35,
					// y -> rotation
					y: 0.1,
				},
				shader: {
					shaderName: "bobShader",
					shaderScale: 0.2,
					shaderAxe: "zy",
					specificShaderName: "kalei",
					shaderTimeRatio: 0.25,
					isCameraPositionInfluenced: false,
					sin: false,
					sinAmplitude: 60
				}
			}
		},
		linkShaderPlastic: {
			name: "linkShaderPlastic",
			fbxPath: "./assets/3d/persos/joseph/joseph.fbx",
			infos: {
				scale: 0.0012,
				// scale: 1,z
				velocity: {
					// x & z -> displacement
					x: 0.35,
					z: 0.35,
					// y -> rotation
					y: 0.1,
				},
				shader: {
					shaderName: "bobShader",
					shaderScale: 1,
					shaderAxe: "xy",
					specificShaderName: "plastic",
					shaderTimeRatio: 0.25,
					isCameraPositionInfluenced: true,
					sin: false,
					sinAmplitude: 260
				}
			}
		},
		linkShaderPlasticTwo: {
			name: "linkShaderPlasticTwo",
			fbxPath: "./assets/3d/persos/joseph/joseph.fbx",
			infos: {
				scale: 0.0012,
				// scale: 1,z
				velocity: {
					// x & z -> displacement
					x: 0.35,
					z: 0.35,
					// y -> rotation
					y: 0.1,
				},
				shader: {
					shaderName: "bobShader",
					shaderScale: 1,
					shaderAxe: "zz",
					specificShaderName: "plastic",
					shaderTimeRatio: 0.25,
					isCameraPositionInfluenced: false,
					sin: true,
					sinAmplitude: 120
				}
			}
		},
		linkShaderFlying: {
			name: "linkShaderFlying",
			fbxPath: "./assets/3d/persos/joseph/joseph.fbx",
			infos: {
				scale: 0.0012,
				// scale: 1,z
				velocity: {
					// x & z -> displacement
					x: 0.35,
					z: 0.35,
					// y -> rotation
					y: 0.1,
				},
				shader: {
					shaderName: "bobShader",
					shaderScale: 7,
					shaderAxe: "zy",
					specificShaderName: "galaxy",
					shaderTimeRatio: 1.5,
					isCameraPositionInfluenced: false,
					sin: false,
					sinAmplitude: 5260
				}
			}
		},
		marie: {
			name: "marie",
			fbxPath: "./assets/3d/persos/marie/marie.fbx",
			infos: {
				scale: 0.0012,
				// scale: 1,z
				velocity: {
					// x & z -> displacement
					x: 0.5,
					z: 0.5,
					// y -> rotation
					y: 0.1,
				}
			},
			options: {
				emissiveEnabled: true,
				emissive: {
					one: {
						color: "#71E79B",
						intensity: 0.3,
						enabled: false
					},
					two: {
						color: "#5CE7E4",
						intensity: 0.2,
						enabled: false
					},
					three: {
						color: "#FFFFFF",
						intensity: 500,
						enabled: true
					},
					skin: {
						color: "#FFFFFF",
						intensity: 0.1,
						enabled: false
					},
					eyes: {
						color: "#FFFFFF",
						intensity: 10,
						enabled: false
					}
				}
			}
		},
		marieShine: {
			name: "marieShine",
			fbxPath: "./assets/3d/persos/marie/marie.fbx",
			infos: {
				scale: 0.0012,
				// scale: 1,z
				velocity: {
					// x & z -> displacement
					x: 0.5,
					z: 0.5,
					// y -> rotation
					y: 0.1,
				}
			},
			options: {
				emissiveEnabled: true,
				emissive: {
					one: {
						color: "#71E79B",
						intensity: 0.2,
						enabled: false
					},
					two: {
						color: "#5CE7E4",
						intensity: 0.5,
						enabled: true
					},
					three: {
						color: "#FFFFFF",
						intensity: 500,
						enabled: false
					},
					skin: {
						color: "#FFFFFF",
						intensity: 0.1,
						enabled: false
					},
					eyes: {
						color: "#FFFFFF",
						intensity: 10,
						enabled: true
					}
				}
			}
		},
		marieShineSkin: {
			name: "marieShineSkin",
			fbxPath: "./assets/3d/persos/marie/marie.fbx",
			infos: {
				scale: 0.0012,
				// scale: 1,z
				velocity: {
					// x & z -> displacement
					x: 0.5,
					z: 0.5,
					// y -> rotation
					y: 0.1,
				}
			},
			options: {
				emissiveEnabled: true,
				emissive: {
					one: {
						color: "#71E79B",
						intensity: 0.2,
						enabled: false
					},
					two: {
						color: "#5CE7E4",
						intensity: 0.5,
						enabled: false
					},
					three: {
						color: "#FFFFFF",
						intensity: 500,
						enabled: false
					},
					skin: {
						color: "#FFFFFF",
						intensity: 500,
						enabled: true
					},
					eyes: {
						color: "#FFFFFF",
						intensity: 10,
						enabled: false
					}
				}
			}
		},
		marieShineEyes: {
			name: "marieShineEyes",
			fbxPath: "./assets/3d/persos/marie/marie.fbx",
			infos: {
				scale: 0.0012,
				// scale: 1,z
				velocity: {
					// x & z -> displacement
					x: 0.5,
					z: 0.5,
					// y -> rotation
					y: 0.1,
				}
			},
			options: {
				emissiveEnabled: true,
				emissive: {
					one: {
						color: "#71E79B",
						intensity: 0.2,
						enabled: false
					},
					two: {
						color: "#5CE7E4",
						intensity: 0.5,
						enabled: false
					},
					three: {
						color: "#FFFFFF",
						intensity: 500,
						enabled: true
					},
					skin: {
						color: "#FFFFFF",
						intensity: 500,
						enabled: false
					},
					eyes: {
						color: "#FFFFFF",
						intensity: 10,
						enabled: true
					}
				}
			}
		},
		marieShader: {
			name: "marieShader",
			fbxPath: "./assets/3d/persos/marie/marie.fbx",
			infos: {
				scale: 0.0012,
				// scale: 1,z
				velocity: {
					// x & z -> displacement
					x: 0.5,
					z: 0.5,
					// y -> rotation
					y: 0.1,
				},
				shader: {
					shaderName: "bobShader",
					shaderScale: 0.2,
					shaderAxe: "zy",
					specificShaderName: "galaxy",
					shaderTimeRatio: 0.25,
					isCameraPositionInfluenced: false,
					sin: false,
					sinAmplitude: 60
				}
			}
		},
		marieShaderFlying: {
			name: "marieShaderFlying",
			fbxPath: "./assets/3d/persos/marie/marie.fbx",
			infos: {
				scale: 0.0012,
				// scale: 1,z
				velocity: {
					// x & z -> displacement
					x: 0.35,
					z: 0.35,
					// y -> rotation
					y: 0.1,
				},
				shader: {
					shaderName: "bobShader",
					shaderScale: 2,
					shaderAxe: "xy",
					specificShaderName: "galaxy",
					shaderTimeRatio: 4.5,
					isCameraPositionInfluenced: false,
					sin: false,
					sinAmplitude: 5260
				}
			}
		},
		queen: {
			name: "queen",
			fbxPath: "./assets/3d/persos/realqueen/realqueen.fbx",
			infos: {
				scale: 0.0012,
				// scale: 1,z
				velocity: {
					// x & z -> displacement
					x: 0.5,
					z: 0.5,
					// y -> rotation
					y: 0.1,
				}
			}
		},
		queenShader: {
			name: "queenShader",
			fbxPath: "./assets/3d/persos/realqueen/realqueen.fbx",
			infos: {
				scale: 0.0012,
				// scale: 1,z
				velocity: {
					// x & z -> displacement
					x: 0.5,
					z: 0.5,
					// y -> rotation
					y: 0.1,
				},
				shader: {
					shaderName: "aliceShader",
					shaderScale: 0.1,
					shaderAxe: "zy",
					specificShaderName: "galaxy"
				}
			}
		},
		
		queenShaderFlying: {
			name: "queenShaderFlying",
			fbxPath: "./assets/3d/persos/realqueen/realqueen.fbx",
			infos: {
				scale: 0.0012,
				// scale: 1,z
				velocity: {
					// x & z -> displacement
					x: 0.5,
					z: 0.5,
					// y -> rotation
					y: 0.1,
				},
				shader: {
					shaderName: "aliceShader",
					shaderScale: 1,
					shaderAxe: "zy",
					specificShaderName: "kalei",
					shaderTimeRatio: 0.15,
					isCameraPositionInfluenced: false,
					sin: false,
					sinAmplitude: 5260
				}
			}
		},
		queenFinal: {
			name: "queenFinal",
			fbxPath: "./assets/3d/persos/realqueen/realqueen-final2.fbx",
			infos: {
				scale: 0.0012,
				// scale: 1,z
				velocity: {
					// x & z -> displacement
					x: 0.5,
					z: 0.5,
					// y -> rotation
					y: 0.1,
				},
				shader: {
					shaderName: "aliceShader",
					shaderScale: 1,
					shaderAxe: "xy",
					specificShaderName: "plastic2",
					shaderTimeRatio: 20,
					isCameraPositionInfluenced: false,
					sin: false,
					sinAmplitude: 560
				}
			}
		}
	}
};


export { entities };