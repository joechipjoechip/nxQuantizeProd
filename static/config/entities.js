const entities = {
	bobsMoveFolder: "./assets/3d/persos/moves/smallGuy/",
	bobs: {
		link: {
			name: "link",
			// fbxPath: "./assets/3d/persos/link.fbx",
			fbxPath: "./assets/3d/persos/sasuke/sasukewoke.fbx",
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
			},
			options: {
				emissiveEnabled: false,
				emissive: {
					one: {
						color: "#FF9000",
						intensity: 0.5
					},
					two: {
						color: "#6812FF",
						intensity: 0.4
					}
				}
			}
		},
		linkShader: {
			name: "linkShader",
			fbxPath: "./assets/3d/persos/link.fbx",
			infos: {
				scale: 0.0015,
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
			fbxPath: "./assets/3d/persos/link.fbx",
			infos: {
				scale: 0.0015,
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
					shaderScale: 1,
					shaderAxe: "xz",
					specificShaderName: "plastic",
					shaderTimeRatio: 0.25,
					isCameraPositionInfluenced: false,
					sin: true,
					sinAmplitude: 260
				}
			}
		},
		juan: {
			name: "juan",
			// fbxPath: "./assets/3d/persos/juan.fbx",
			fbxPath: "./assets/3d/persos/sasuke/sasukewoke.fbx",
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
			},
			options: {
				emissiveEnabled: true,
				emissive: {
					one: {
						color: "#FF9000",
						intensity: 0.5
					},
					two: {
						color: "#6812FF",
						intensity: 0.4
					},
					three: {
						color: "#FFFFFF",
						intensity: 10
					}
				}
			}
		},
		queen: {
			name: "queen",
			fbxPath: "./assets/3d/persos/queen.fbx",
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
		},
		queenShader: {
			name: "queenShader",
			fbxPath: "./assets/3d/persos/queen.fbx",
			infos: {
				scale: 0.0008,
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