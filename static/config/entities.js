const entities = {
	bobsMoveFolder: "./assets/3d/persos/moves/smallGuy/",
	bobs: {
		link: {
			name: "link",
			// fbxPath: "./assets/3d/persos/link.fbx",
			fbxPath: "./assets/3d/persos/sasuke/sasukewoke.fbx",
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
					skin: {
						color: "#FFFFFF",
						intensity: 4,
						enabled: true
					}
				}
			}
		},
		linkShine: {
			name: "linkShine",
			// fbxPath: "./assets/3d/persos/link.fbx",
			fbxPath: "./assets/3d/persos/sasuke/sasukewoke.fbx",
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
						color: "#00FCFF",
						intensity: 0.3,
						enabled: true
					},
					two: {
						color: "#5C31FF",
						intensity: 0.2,
						enabled: false
					},
					three: {
						color: "#FFEEF1",
						intensity: 500,
						enabled: true
					},
					skin: {
						color: "#FFFFFF",
						intensity: 4,
						enabled: false
					}
				}
			}
		},
		linkShader: {
			name: "linkShader",
			// fbxPath: "./assets/3d/persos/link.fbx",
			fbxPath: "./assets/3d/persos/sasuke/sasukewoke.fbx",
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
			// fbxPath: "./assets/3d/persos/link.fbx",
			fbxPath: "./assets/3d/persos/sasuke/sasukewoke.fbx",
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
					shaderScale: 0.5,
					shaderAxe: "xy",
					specificShaderName: "plastic",
					shaderTimeRatio: 0.25,
					isCameraPositionInfluenced: true,
					sin: false,
					sinAmplitude: 260
				}
			}
		},
		hinata: {
			name: "hinata",
			// fbxPath: "./assets/3d/persos/juan.fbx",
			fbxPath: "./assets/3d/persos/hinata/hinata.fbx",
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
						color: "#693B1B",
						intensity: 0.1,
						enabled: false
					}
				}
			}
		},
		hinataShine: {
			name: "hinataShine",
			// fbxPath: "./assets/3d/persos/juan.fbx",
			fbxPath: "./assets/3d/persos/hinata/hinata.fbx",
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
						color: "#693B1B",
						intensity: 0.1,
						enabled: false
					}
				}
			}
		},
		queen: {
			name: "queen",
			// fbxPath: "./assets/3d/persos/queen.fbx",
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
			// fbxPath: "./assets/3d/persos/queen.fbx",
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
		}
	}
};


export { entities };