import * as THREE from 'three';

import { galaxyFragment } from "../static/assets/js/shaders/galaxy/fragment";
import { galaxyVertex } from "../static/assets/js/shaders/galaxy/vertex";

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


        switch( shaderName ){
            case "galaxy":
                return new THREE.ShaderMaterial({
                    uniforms: uniforms,
                    vertexShader: galaxyVertex,
                    fragmentShader: galaxyFragment
                  });
                break;
        }


    }

}

export { CustomShaderBuilder };
