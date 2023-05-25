const entities = {
	bobsMoveFolder: "./assets/3d/persos/moves/smallGuy/",
	bobs: {
		link: {
			name: "link",
			fbxPath: "./assets/3d/persos/link.fbx",
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
		linkShader: {
			name: "linkShader",
			fbxPath: "./assets/3d/persos/link.fbx",
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
					shaderName: "bobShader",
					shaderScale: 0.2,
					shaderAxe: "zy",
					specificShaderName: "galaxy",
					shaderTimeRatio: 6,
					isCameraPositionInfluenced: false,
					sin: false,
					sinAmplitude: 60
				}
			}
		},
		juan: {
			name: "juan",
			fbxPath: "./assets/3d/persos/juan.fbx",
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
					specificShaderName: "galaxy",
					shaderTimeRatio: 1,
					isCameraPositionInfluenced: false,
					sin: false,
					sinAmplitude: 60
				}
			}
		}
	}
};


export { entities };