import * as THREE from 'three';

import { galaxyVertex } from "../static/assets/js/shaders/galaxy/vertex";
import { galaxyFragment } from "../static/assets/js/shaders/galaxy/fragment";

import { plasticVertex } from '../static/assets/js/shaders/plastic/vertex';
import { plasticFragment } from "../static/assets/js/shaders/plastic/fragment";
import { plasticFragment2 } from "../static/assets/js/shaders/plastic/fragment2";

import { psycheVertex } from "../static/assets/js/shaders/psyche/vertex";
import { psycheFragment } from "../static/assets/js/shaders/psyche/fragment";

import { kaleiVertex } from "../static/assets/js/shaders/kalei/vertex";
import { kaleiFragment } from "../static/assets/js/shaders/kalei/fragment";

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
                    fragmentShader: this.giveSpecificShader(shaderName)
                  });

                break;

            case "plastic":
            case "plastic2":

                return new THREE.ShaderMaterial({
                    uniforms,
                    vertexShader: plasticVertex.replace("fragCoord = position.xy;", `fragCoord = position.${shaderAxe};`),
                    fragmentShader: this.giveSpecificShader(shaderName)
                  });

                break;

            case "psyche":

                return new THREE.ShaderMaterial({
                    uniforms,
                    vertexShader: psycheVertex.replace("fragCoord = position.xy;", `fragCoord = position.${shaderAxe};`),
                    fragmentShader: this.giveSpecificShader(shaderName)
                  });

                break;

            case "kalei":

                return new THREE.ShaderMaterial({
                    uniforms,
                    vertexShader: kaleiVertex.replace("fragCoord = position.xy;", `fragCoord = position.${shaderAxe};`),
                    fragmentShader: this.giveSpecificShader(shaderName)
                  });

                break;

            case "bobShader":
            case "aliceShader":

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

            case "plastic2":

                return plasticFragment2;

                break;

            case "psyche":

                return psycheFragment;

                break;

            case "kalei":

                return kaleiFragment;

                break;

        
        }

    }

}

export { CustomShaderBuilder };
