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
					shaderScale: 1,
					shaderAxe: "yz",
					specificShaderName: "galaxy",
					shaderTimeRatio: 1.25,
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
						intensity: 10,
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
	}
};


export { entities };