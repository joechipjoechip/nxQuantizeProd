import * as THREE from 'three';

import { veinsFragment } from "../static/assets/js/shaders/veins/fragment";
import { veinsVertex } from "../static/assets/js/shaders/veins/vertex";

class CustomShaderBuilder {

    constructor( shaderName ){

        const uniforms = {
			iGlobalTime: {
				type: "f",
				value: 1.0
			},
			iResolution: {
				type: "v2",
				value: new THREE.Vector2()
			},
		};

        uniforms.iResolution.value.x = 0.5;
        uniforms.iResolution.value.y = 0.5;

		return new THREE.ShaderMaterial({
			uniforms: uniforms,
			vertexShader: veinsVertex,
			fragmentShader: veinsFragment
		  });

    }

}

export { CustomShaderBuilder };
