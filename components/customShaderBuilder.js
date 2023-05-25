import * as THREE from 'three';

import { galaxyVertex } from "../static/assets/js/shaders/galaxy/vertex";
import { galaxyFragment } from "../static/assets/js/shaders/galaxy/fragment";

import { plasticVertex } from '../static/assets/js/shaders/plastic/vertex';
import { plasticFragment } from "../static/assets/js/shaders/plastic/fragment";

class CustomShaderBuilder {

    constructor( shaderInfos ){

        const { shaderName, shaderScale, shaderAxe } = shaderInfos;

        const uniforms = {
			iGlobalTime: {
				type: "f",
				value: 1.0
			},
			iResolution: {
				type: "v2",
				value: new THREE.Vector2(shaderScale, shaderScale)
			},
		};

        switch( shaderName ){

            case "galaxy":

                return new THREE.ShaderMaterial({
                    uniforms,
                    vertexShader: galaxyVertex.replace("fragCoord = position.yz;", `fragCoord = position.${shaderAxe};`),
                    fragmentShader: galaxyFragment
                  });

                break;

            case "bobShader":

                return new THREE.ShaderMaterial({
                    uniforms,
                    vertexShader: [
                        '#include <skinning_pars_vertex>',
                        'varying vec2 fragCoord;',
                        'varying vec2 vUv;',
        
                        'void main() {',
        
                        '#include <skinbase_vertex>',
                        '#include <begin_vertex>',
                        '#include <skinning_vertex>',
                        '#include <project_vertex>',

                        'vUv = uv;',
                        'mvPosition = modelViewMatrix * vec4(position, 1.0 );',
                        `fragCoord = ${shaderInfos.isCameraPositionInfluenced ? 'mvPosition' : 'position'}.${shaderAxe};`,
                        '}'
                    ].join( '\n' ),
                    fragmentShader: this.giveSpecificShader(shaderInfos.specificShaderName),
                    skinning: true
                  });

                break;

        }


    }

    giveSpecificShader( specificShaderName ){

        switch(specificShaderName){

            case "galaxy":

                return galaxyFragment;
                
                break;
                
            case "plastic":

                return plasticFragment;

                break;

        
        }

    }

}

export { CustomShaderBuilder };
