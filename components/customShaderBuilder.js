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
				value: new THREE.Vector2(shaderScale, shaderScale)
			},
		};

        // this.uniforms.iResolution.value.x = shaderScale;
        // this.uniforms.iResolution.value.y = shaderScale;

        // return this.temporaryFunction();

        switch( shaderName ){

            case "galaxy":

                return new THREE.ShaderMaterial({
                    uniforms: this.uniforms,
                    vertexShader: galaxyVertex,
                    fragmentShader: galaxyFragment
                  });

                break;

            case "customPhong":

                return new THREE.ShaderMaterial({
                    uniforms: this.uniforms,
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
                        // 'gl_Position = projectionMatrix * mvPosition;',
                        'fragCoord = mvPosition.xz;',
        
                        '}'
                    ].join( '\n' ),
//                     fragmentShader: [
//                         'uniform float iGlobalTime;',
//                         'uniform vec2 iResolution;',
//                         'varying vec2 fragCoord;',
//                         'varying vec2 vUv;',
//                         'void main()',
//                         '{',
//                         '    float k=0.;',
// '',
//                         '    vec3 d =  vec3(fragCoord,1.0)/1.0-.5, o = d, c=k*d, p;',
// '',
//                         '    for( int i=0; i<99; i++ ){',
//                         '        p = o+sin(iGlobalTime*.1);',
//                         '        for (int j = 0; j < 4; j++) ',
//                         '            p = abs(p.zyx-.4) -.7,k += exp(-6. * abs(dot(p,o)));',
//                         '        k/=3.;',
//                         '        o += d *.05*k;',
//                         '        c = .97*c + .1*k*vec3(k*k,k,1);',
//                         '    }',
// '',
//                         '    c =  .4 *log(1.+c);',
//                         '    ',
//                         '    gl_FragColor.rgb = c;',
//                         '}'
//                     ].join( '\n' ),
                    fragmentShader: [
                        'uniform float iGlobalTime;',
                        'uniform vec2 iResolution;',
                        'uniform vec4      iMouse;',
                        'uniform sampler2D iChannel0;',
                        'varying vec2 fragCoord;',
                        'varying vec2 vUv;',
                        '',
                        'vec2 cmul( vec2 a, vec2 b )  { return vec2( a.x*b.x - a.y*b.y, a.x*b.y + a.y*b.x ); }',
                        '',
                        'vec2 csqr( vec2 a )  { return vec2( a.x*a.x - a.y*a.y, 2.*a.x*a.y  ); }',
                        '',
                        'vec3 dmul( vec3 a, vec3 b )  {',
                        '    float r = length(a);',
                        '    b.xy=cmul(normalize(a.xy), b.xy);',
                        '    b.yz=cmul(normalize(a.yz), b.yz);',
                        '    return r*b;',
                        '}',
                        '',
                        'vec3 pow4( vec3 z){',
                        '    z=dmul(z,z);return dmul(z,z);',
                        '}',
                        '',
                        'vec3 pow3( vec3 z){',
                        '    float r2 = dot(z,z);',
                        '    vec2 a = z.xy;a=csqr(a)/dot( a,a);',
                        '    vec2 b = z.yz;b=csqr(b)/dot( b,b); ',
                        '    vec2 c = z.xz;c=csqr(c)/dot( c,c);',
                        '    z.xy = cmul(a,z.xy);   ',
                        '    z.yz = cmul(b,z.yz);      ',
                        '    z.xz = cmul(c,z.xz);',
                        '    return r2*z;',
                        '}',
                        '',
                        'mat2 rot(float a) {',
                        '    return mat2(cos(a),sin(a),-sin(a),cos(a));  ',
                        '}',
                        '',
                        'float zoom=4.;',
                        '',
                        'float field(in vec3 p) {',
                        '    float res = 0.;',
                        '    vec3 c = p;',
                        '    for (int i = 0; i < 10; ++i) {',
                        '        p = abs(p) / dot(p,p) -1.;',
                        '        p = dmul(p,p)+.7;',
                        '        res += exp(-6. * abs(dot(p,c)-.15));',
                        '    }',
                        '    return max(0., res/3.);',
                        '}',
                        '',
                        'vec3 raycast( in vec3 ro, vec3 rd )',
                        '{',
                        '    float t = 6.0;',
                        '    float dt = .05;',
                        '    vec3 col= vec3(0.);',
                        '    for( int i=0; i<64; i++ )',
                        '    {',
                        '        float c = field(ro+t*rd);               ',
                        '        t+=dt/(.35+c*c);',
                        '        c = max(5.0 * c - .9, 0.0);',
                        '        col = .97*col+ .08*vec3(0.5*c*c*c, .6*c*c, c);',
                        '    }',
                        '    return col;',
                        '}',
                        '',
                        'void main()',
                        '{',
                        '    float time = iGlobalTime;',
                        '    vec2 q = fragCoord.xy / iResolution.xy;',
                        '    vec2 p = -1.0 + 2.0 * q;',
                        '    p.x *= iResolution.x/iResolution.y;',
                        '    vec2 m = vec2(0.);',
                        '    if( iMouse.z>0.0 )m = iMouse.xy/iResolution.xy*3.14;',
                        '    m-=.5;',
                        '    vec3 ro = zoom*vec3(1.);',
                        '    ro.yz*=rot(m.y);',
                        '    ro.xz*=rot(m.x+ 0.1*time);',
                        '    vec3 ta = vec3( 0.0 , 0.0, 0.0 );',
                        '    vec3 ww = normalize( ta - ro );',
                        '    vec3 uu = normalize( cross(ww,vec3(0.0,1.0,0.0) ) );',
                        '    vec3 vv = normalize( cross(uu,ww));',
                        '    vec3 rd = normalize( p.x*uu + p.y*vv + 4.0*ww );',
                        '    vec3 col = raycast(ro,rd);',
                        '    col =  .5 *(log(1.+col));',
                        '    col = clamp(col,0.,1.);',
                        '    gl_FragColor = vec4( sqrt(col), 1.0 );',
                        '}',
                    ].join( '\n' ),
                    skinning: true
                  });

                break;

        }


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
