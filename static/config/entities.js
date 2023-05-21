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
			fbxPath: "./assets/3d/persos/linkShader.fbx",
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
					shaderName: "galaxy",
					shaderScale: 0.5
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
		}
	}
};


export { entities };