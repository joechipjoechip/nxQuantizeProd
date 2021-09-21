const params = {

	lights: {
		ambientLight: {
			color: 0x000099,
			intensity: 0.45
		},
		spotlight0: {
			color: 0xaa00ff,
			intensity: 1.2,
			distance: 0,
			angle: 1,
			penumbra: 0.37,
			decay: 0.68,
			position: {
				x: -1.5,
				y: -8.9,
				z: 5.6
			}
		},
		spotlight1: {
			color: 0x5a00f,
			intensity: 1.6,
			distance: 0,
			angle: 1,
			penumbra: 0.74,
			decay: 0.44,
			position: {
				x: -6,
				y: 4.1,
				z: 6.4
			}
		}
	},
	shaders: {
		dig: {
			deepmax: 150,
			specular: 0xffffff,
			vertex: {
				common: `
					#include <common>
		
					uniform float uDeepMax;
		
					uniform sampler2D uCanvasDigTexture;
		
					varying float vDigness;
				`,
				normal: `
					#include <beginnormal_vertex>
	
					float digRed = texture2D(uCanvasDigTexture, uv).g + texture2D(uCanvasDigTexture, uv).r;
					float digAlpha = texture2D(uCanvasDigTexture, uv).a;
					float currentDignessImpact = (digRed / 2.0) * digAlpha;
					float amountToDig = min(currentDignessImpact, uDeepMax);
	
					objectNormal.z -= amountToDig;
				`,
				beginVertex: `
					#include <begin_vertex>

					transformed.z -= amountToDig;

					vUv = uv;

					vDigness = currentDignessImpact;
				`
			},
			fragment: {
				common: `
					#include <common>

					uniform sampler2D uTexture;

					varying float vDigness;
				`,
				color: `
					#include <color_fragment>

					vec4 textureColor = texture2D(uTexture, vUv);

					textureColor.rgb -= (vDigness / 1.3);

					diffuseColor = vec4(textureColor.rgb, 1.0);
				`
			}
		}
	}

}

export { params };