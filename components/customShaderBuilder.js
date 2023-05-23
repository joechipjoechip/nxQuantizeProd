import * as THREE from 'three';

import { galaxyVertex } from "../static/assets/js/shaders/galaxy/vertex";
import { galaxyFragment } from "../static/assets/js/shaders/galaxy/fragment";

import { plasticVertex } from '../static/assets/js/shaders/plastic/vertex';
import { plasticFragment } from "../static/assets/js/shaders/plastic/fragment";

class CustomShaderBuilder {

    constructor( shaderName, shaderScale = 0.1 ){

        this.uniforms = {
			iGlobalTime: {
				type: "f",
				value: 1.0
			},
			iResolution: {
				type: "v2",
				value: new THREE.Vector2()
			},
		};

        this.uniforms.iResolution.value.x = shaderScale;
        this.uniforms.iResolution.value.y = shaderScale;

        return this.temporaryFunction();

        // switch( shaderName ){

        //     case "galaxy":


        //         return new THREE.ShaderMaterial({
        //             uniforms: this.uniforms,
        //             vertexShader: galaxyVertex,
        //             fragmentShader: galaxyFragment
        //           });

        //         break;

        // }


    }

    temporaryFunction(){

        // const textureLoader = new THREE.TextureLoader();
        // const someTexture = textureLoader.load(`assets/3d/textures/gradient.jpg`);

        // this.uniforms.iChannel0 = {};
        // this.uniforms.iChannel0.value = someTexture;

        return new THREE.ShaderMaterial({
            uniforms: this.uniforms,
            vertexShader: plasticVertex,
            fragmentShader: plasticFragment
          });


    }

}

export { CustomShaderBuilder };
