import * as THREE from 'three';

import { galaxyVertex } from "../static/assets/js/shaders/galaxy/vertex";
import { galaxyFragment } from "../static/assets/js/shaders/galaxy/fragment";

import { plasticVertex } from '../static/assets/js/shaders/plastic/vertex';
import { plasticFragment } from "../static/assets/js/shaders/plastic/fragment";

class CustomShaderBuilder {

    constructor( shaderName, shaderScale = 0.5 ){

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

        uniforms.iResolution.value.x = shaderScale;
        uniforms.iResolution.value.y = shaderScale;


        switch( shaderName ){

            case "galaxy":

                return new THREE.ShaderMaterial({
                    uniforms: uniforms,
                    vertexShader: plasticVertex,
                    fragmentShader: plasticFragment
                  });

                // return new THREE.ShaderMaterial({
                //     uniforms: uniforms,
                //     vertexShader: galaxyVertex,
                //     fragmentShader: galaxyFragment
                //   });

                break;

        }


    }

}

export { CustomShaderBuilder };
