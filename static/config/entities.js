const entities = {
	bobsMoveFolder: "./assets/3d/persos/moves/smallGuy/",
	bobs: {
		link: {
			name: "link",
			fbxPath: "./assets/3d/persos/bob/bob.fbx",
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
		juan: {
			name: "juan",
			fbxPath: "./assets/3d/persos/bob2/bob.fbx",
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