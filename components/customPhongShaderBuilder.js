import * as THREE from 'three';

class CustomPhongShaderBuilder extends THREE.ShaderMaterial {
    
    // constructor takes appropriate parameters.
    // Default values using object destructuring (ES6)
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#Object_destructuring
	constructor({
		color = 0xffffff,
        emissive = 0x000000,
        specular = 0x111111,
        shininess = 30,
        map = null,
		iGlobalTime = 10.0
	}) {

        // setup our uniforms object.
        // as you can see we're importing a lot of default uniforms.
        // if you want to keep the functionality of a built-in material you have to find the appropriate ones.
        // you can find the uniforms for built-in shaders in the ShaderLib.js file.
        // https://github.com/mrdoob/three.js/blob/dev/src/renderers/shaders/ShaderLib.js
		let uniforms = THREE.UniformsUtils.merge([
            THREE.UniformsLib.common,
            // THREE.UniformsLib.specularmap,
            // THREE.UniformsLib.envmap,
            // THREE.UniformsLib.aomap,
            // THREE.UniformsLib.lightmap,
            // THREE.UniformsLib.emissivemap,
            // THREE.UniformsLib.bumpmap,
            // THREE.UniformsLib.normalmap,
            // THREE.UniformsLib.displacementmap,
            // THREE.UniformsLib.gradientmap,
            // THREE.UniformsLib.fog,
            // THREE.UniformsLib.lights,
            {
                // custom uniforms:
                diffuse: { value: new THREE.Color(color) },
                emissive: { value: new THREE.Color(emissive) },
                specular: { value: new THREE.Color(specular) },
                shininess: { value: shininess },
				iGlobalTime: { value: iGlobalTime }
            }
        ]);

        // we need to pass a defines object
        // the defines variables are used to enable/disable functionality in the glsl shaders.
        let defines = {};

		let vertexShader = `#define PHONG
        varying vec3 vViewPosition;
		attribute vec3 in_Position;
		varying vec2 fragCoord;
		varying vec2 vUv; 

        #include <uv2_pars_vertex>
        #include <displacementmap_pars_vertex>
        #include <envmap_pars_vertex>
        #include <color_pars_vertex>
        #include <fog_pars_vertex>
        #include <morphtarget_pars_vertex>
        #include <skinning_pars_vertex>
        #include <shadowmap_pars_vertex>
        #include <logdepthbuf_pars_vertex>
        #include <clipping_planes_pars_vertex>

        void main() {

            #include <uv2_vertex>
            #include <color_vertex>

            #include <beginnormal_vertex>
            #include <morphnormal_vertex>
            #include <skinbase_vertex>
            #include <skinnormal_vertex>
            #include <defaultnormal_vertex>

            #include <begin_vertex>
            #include <morphtarget_vertex>
            #include <skinning_vertex>
            #include <displacementmap_vertex>
            #include <project_vertex>
            #include <logdepthbuf_vertex>
            #include <clipping_planes_vertex>

            vViewPosition = - mvPosition.xyz;

			vUv = uv;
			// vec4 mvPosition = modelViewMatrix * vec4(position, 1.0 );
			gl_Position = projectionMatrix * mvPosition;
			fragCoord = position.yz;

            #include <worldpos_vertex>
            #include <envmap_vertex>
            #include <shadowmap_vertex>
            #include <fog_vertex>

        }`;

        let fragmentShader = `#define PHONG

        uniform vec3 diffuse;
        uniform vec3 emissive;
        uniform vec3 specular;
        uniform float shininess;
        uniform float opacity;

		uniform float iGlobalTime;
		uniform vec2 iResolution;
		uniform vec4      iMouse;
		uniform sampler2D iChannel0;
		varying vec2 fragCoord;
		varying vec2 vUv;

        #include <common>
        #include <packing>
        #include <dithering_pars_fragment>
        #include <color_pars_fragment>

        #include <uv2_pars_fragment>
        #include <map_pars_fragment>
        #include <alphamap_pars_fragment>
        #include <aomap_pars_fragment>
        #include <lightmap_pars_fragment>
        #include <emissivemap_pars_fragment>
        #include <envmap_pars_fragment>
        #include <gradientmap_pars_fragment>
        #include <fog_pars_fragment>
        #include <bsdfs>
        // #include <lights_pars>
        #include <lights_phong_pars_fragment>
        #include <shadowmap_pars_fragment>
        #include <bumpmap_pars_fragment>
        #include <normalmap_pars_fragment>
        #include <specularmap_pars_fragment>
        #include <logdepthbuf_pars_fragment>
        #include <clipping_planes_pars_fragment>

		vec2 cmul( vec2 a, vec2 b )  { return vec2( a.x*b.x - a.y*b.y, a.x*b.y + a.y*b.x ); }

		vec2 csqr( vec2 a )  { return vec2( a.x*a.x - a.y*a.y, 2.*a.x*a.y  ); }

		vec3 dmul( vec3 a, vec3 b )  {
			float r = length(a);
			b.xy=cmul(normalize(a.xy), b.xy);
			b.yz=cmul(normalize(a.yz), b.yz);
			return r*b;
		}

		vec3 pow4( vec3 z){
			z=dmul(z,z);return dmul(z,z);
		}

		vec3 pow3( vec3 z){
			float r2 = dot(z,z);
			vec2 a = z.xy;a=csqr(a)/dot( a,a);
			vec2 b = z.yz;b=csqr(b)/dot( b,b); 
			vec2 c = z.xz;c=csqr(c)/dot( c,c);
			z.xy = cmul(a,z.xy);   
			z.yz = cmul(b,z.yz);      
			z.xz = cmul(c,z.xz);
			return r2*z;
		}

		mat2 rot(float a) {
			return mat2(cos(a),sin(a),-sin(a),cos(a));  
		}

		float zoom=4.;

		float field(in vec3 p) {
			float res = 0.;
			vec3 c = p;
			for (int i = 0; i < 10; ++i) {
				p = abs(p) / dot(p,p) -1.;
				p = dmul(p,p)+.7;
				res += exp(-6. * abs(dot(p,c)-.15));
			}
			return max(0., res/3.);
		}

		vec3 raycast( in vec3 ro, vec3 rd )
		{
			float t = 6.0;
			float dt = .05;
			vec3 col= vec3(0.);
			for( int i=0; i<64; i++ )
			{
				float c = field(ro+t*rd);               
				t+=dt/(.35+c*c);
				c = max(5.0 * c - .9, 0.0);
				col = .97*col+ .08*vec3(0.5*c*c*c, .6*c*c, c);
			}
			return col;
		}

        void main() {

            #include <clipping_planes_fragment>

            vec4 diffuseColor = vec4( diffuse, opacity );
            ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
            vec3 totalEmissiveRadiance = emissive;

            #include <logdepthbuf_fragment>
            #include <map_fragment>
            #include <color_fragment>
            #include <alphamap_fragment>
            #include <alphatest_fragment>
            #include <specularmap_fragment>
            // #include <normal_fragment>
            #include <emissivemap_fragment>

            // accumulation
            #include <lights_phong_fragment>
            // #include <lights_template>

            // modulation
            #include <aomap_fragment>

            vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;

            #include <envmap_fragment>

			float time = iGlobalTime;
			vec2 q = fragCoord.xy / iResolution.xy;
			vec2 p = -1.0 + 2.0 * q;
			p.x *= iResolution.x/iResolution.y;
			vec2 m = vec2(0.);
			if( iMouse.z>0.0 )m = iMouse.xy/iResolution.xy*3.14;
			m-=.5;
			vec3 ro = zoom*vec3(1.);
			ro.yz*=rot(m.y);
			ro.xz*=rot(m.x+ 0.1*time);
			vec3 ta = vec3( 0.0 , 0.0, 0.0 );
			vec3 ww = normalize( ta - ro );
			vec3 uu = normalize( cross(ww,vec3(0.0,1.0,0.0) ) );
			vec3 vv = normalize( cross(uu,ww));
			vec3 rd = normalize( p.x*uu + p.y*vv + 4.0*ww );
			vec3 col = raycast(ro,rd);
			col =  .5 *(log(1.+col));
			col = clamp(col,0.,1.);
			gl_FragColor = vec4( sqrt(col), 1.0 );

            #include <tonemapping_fragment>
            #include <encodings_fragment>
            #include <fog_fragment>
            #include <premultiplied_alpha_fragment>
            #include <dithering_fragment>

        }`;

        if (map !== null) {
            uniforms.map = {
                type: "t",
                value: map // map is the texture object. (for example loaded with THREE.TextureLoader)
            };

            defines.USE_MAP = ''; // add this if you want to use map.
        }
        
        // if we want to we can add our own textures, and custom defines here.

        // let shaders = TextureSplattingMaterial.getShaders({
        //     length: (textures !== null) ? textures.length : 0
        // });

        super({
            vertexShader, // we use the built in phong shader code
            fragmentShader, // we use the built in phong shader code
            uniforms: uniforms,
            defines: defines,
            fog: false,
            lights: false
        });
        
        // if we want we can replace the vertex or fragmentShader above with a custom one.
        // there are two ways of doing this.
        //    1. Use string concatenation and import code using ShaderChunk
        //    2. Copy the appropriate code from: https://github.com/mrdoob/three.js/tree/dev/src/renderers/shaders/ShaderLib
        //       and edit it to your needs.
        
        // using string concatenation:
        // let vertexShader = [
        //     "#PHONG",
        //     "varying vec3 vViewPosition;",
        //     "#ifndef FLAT_SHADED",
        //     "varying vec3 vNormal;",
        //     "#endif",
        //     THREE.ShaderChunk.common, // add the chunks you want to import.
        //     "// our custom shader stuff",
        //     "vec4 test = vec4(1.0);",
        // ].join("\r\n");
        
        // the problem with string concatenation is that you have to look up what shaderchunks the given shader uses.
        // to do so you must look at the #include <...> directives in the shadercode.
        // https://github.com/mrdoob/three.js/blob/dev/src/renderers/shaders/ShaderLib/meshphong_vert.glsl
        // in the phong vertex shader we can see that "common" and a whole lot of other chunks are included.
	}

    // this is an example of a custom Phong shader based on the built in ones, using template strings.
    // it returns the vertexShader and the fragmentShader, simply pass it to the ShaderMaterial as parameters.
    // if the official implementation changes, this may break.
    // on the other hand it is super easy to use.
    // the source of the different built in shaders can be found here:
    // https://github.com/mrdoob/three.js/tree/dev/src/renderers/shaders/ShaderLib
    // static getShaders({ length }) {

    //     let vertexShader = `#define PHONG
    //     varying vec3 vViewPosition;
	// 	attribute vec3 in_Position;
	// 	varying vec2 fragCoord;
	// 	varying vec2 vUv; 

    //     #ifndef FLAT_SHADED
    //         varying vec3 vNormal;
    //     #endif

    //     // custom
    //     #ifdef USE_SPLATMAP
    //         uniform mat3 textureUvTransforms[${length}]; // repeat vector for each texture.
    //         varying vec2 textureUVs[${length}]; // pass to fragment shader.
    //     #endif

    //     #include <common>
        
    //     #if defined( USE_SPLATMAP ) || defined( USE_MAP ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( USE_SPECULARMAP ) || defined( USE_ALPHAMAP ) || defined( USE_EMISSIVEMAP ) || defined( USE_ROUGHNESSMAP ) || defined( USE_METALNESSMAP )

    //         varying vec2 vUv;
    //         uniform mat3 uvTransform;

    //     #endif

    //     #include <uv2_pars_vertex>
    //     #include <displacementmap_pars_vertex>
    //     #include <envmap_pars_vertex>
    //     #include <color_pars_vertex>
    //     #include <fog_pars_vertex>
    //     #include <morphtarget_pars_vertex>
    //     #include <skinning_pars_vertex>
    //     #include <shadowmap_pars_vertex>
    //     #include <logdepthbuf_pars_vertex>
    //     #include <clipping_planes_pars_vertex>

    //     void main() {

    //         // custom
    //         // #ifdef USE_SPLATMAP
    //         //     for (int i = 0; i < ${length}; i++) {
    //         //         textureUVs[i] = (textureUvTransforms[i] * vec3(uv, 1)).xy;
    //         //     }
    //         // #endif

    //         // #if defined( USE_SPLATMAP ) || defined( USE_MAP ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( USE_SPECULARMAP ) || defined( USE_ALPHAMAP ) || defined( USE_EMISSIVEMAP ) || defined( USE_ROUGHNESSMAP ) || defined( USE_METALNESSMAP )

    //         //     vUv = ( uvTransform * vec3( uv, 1 ) ).xy;

    //         // #endif

    //         #include <uv2_vertex>
    //         #include <color_vertex>

    //         #include <beginnormal_vertex>
    //         #include <morphnormal_vertex>
    //         #include <skinbase_vertex>
    //         #include <skinnormal_vertex>
    //         #include <defaultnormal_vertex>

    //         #ifndef FLAT_SHADED // Normal computed with derivatives when FLAT_SHADED

    //             vNormal = normalize( transformedNormal );

    //         #endif

    //         #include <begin_vertex>
    //         #include <morphtarget_vertex>
    //         #include <skinning_vertex>
    //         #include <displacementmap_vertex>
    //         #include <project_vertex>
    //         #include <logdepthbuf_vertex>
    //         #include <clipping_planes_vertex>

    //         vViewPosition = - mvPosition.xyz;

	// 		vUv = uv;
	// 		// vec4 mvPosition = modelViewMatrix * vec4(position, 1.0 );
	// 		gl_Position = projectionMatrix * mvPosition;
	// 		fragCoord = position.yz;

    //         #include <worldpos_vertex>
    //         #include <envmap_vertex>
    //         #include <shadowmap_vertex>
    //         #include <fog_vertex>

    //     }`;

    //     let fragmentShader = `#define PHONG

    //     uniform vec3 diffuse;
    //     uniform vec3 emissive;
    //     uniform vec3 specular;
    //     uniform float shininess;
    //     uniform float opacity;

	// 	uniform float iGlobalTime;
	// 	uniform vec2 iResolution;
	// 	uniform vec4      iMouse;
	// 	uniform sampler2D iChannel0;
	// 	varying vec2 fragCoord;
	// 	varying vec2 vUv;

    //     #include <common>
    //     #include <packing>
    //     #include <dithering_pars_fragment>
    //     #include <color_pars_fragment>
        
    //     // added splatmap as condition to declare vUv
    //     #if defined( USE_SPLATMAP ) || defined( USE_MAP ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( USE_SPECULARMAP ) || defined( USE_ALPHAMAP ) || defined( USE_EMISSIVEMAP ) || defined( USE_ROUGHNESSMAP ) || defined( USE_METALNESSMAP )

    //         varying vec2 vUv;

    //     #endif

    //     #include <uv2_pars_fragment>
    //     #include <map_pars_fragment>
    //     #include <alphamap_pars_fragment>
    //     #include <aomap_pars_fragment>
    //     #include <lightmap_pars_fragment>
    //     #include <emissivemap_pars_fragment>
    //     #include <envmap_pars_fragment>
    //     #include <gradientmap_pars_fragment>
    //     #include <fog_pars_fragment>
    //     #include <bsdfs>
    //     #include <lights_pars>
    //     #include <lights_phong_pars_fragment>
    //     #include <shadowmap_pars_fragment>
    //     #include <bumpmap_pars_fragment>
    //     #include <normalmap_pars_fragment>
    //     #include <specularmap_pars_fragment>
    //     #include <logdepthbuf_pars_fragment>
    //     #include <clipping_planes_pars_fragment>

    //     #ifdef USE_SPLATMAP
    //         uniform sampler2D textures[${length}];
    //         uniform sampler2D splatMaps[${length - 1}]; // one less splatmap than textures.

    //         varying vec2 textureUVs[${length}]; // computed in vertexshader
    //     #endif

	// 	vec2 cmul( vec2 a, vec2 b )  { return vec2( a.x*b.x - a.y*b.y, a.x*b.y + a.y*b.x ); }

	// 	vec2 csqr( vec2 a )  { return vec2( a.x*a.x - a.y*a.y, 2.*a.x*a.y  ); }

	// 	vec3 dmul( vec3 a, vec3 b )  {
	// 		float r = length(a);
	// 		b.xy=cmul(normalize(a.xy), b.xy);
	// 		b.yz=cmul(normalize(a.yz), b.yz);
	// 		return r*b;
	// 	}

	// 	vec3 pow4( vec3 z){
	// 		z=dmul(z,z);return dmul(z,z);
	// 	}

	// 	vec3 pow3( vec3 z){
	// 		float r2 = dot(z,z);
	// 		vec2 a = z.xy;a=csqr(a)/dot( a,a);
	// 		vec2 b = z.yz;b=csqr(b)/dot( b,b); 
	// 		vec2 c = z.xz;c=csqr(c)/dot( c,c);
	// 		z.xy = cmul(a,z.xy);   
	// 		z.yz = cmul(b,z.yz);      
	// 		z.xz = cmul(c,z.xz);
	// 		return r2*z;
	// 	}

	// 	mat2 rot(float a) {
	// 		return mat2(cos(a),sin(a),-sin(a),cos(a));  
	// 	}

	// 	float zoom=4.;

	// 	float field(in vec3 p) {
	// 		float res = 0.;
	// 		vec3 c = p;
	// 		for (int i = 0; i < 10; ++i) {
	// 			p = abs(p) / dot(p,p) -1.;
	// 			p = dmul(p,p)+.7;
	// 			res += exp(-6. * abs(dot(p,c)-.15));
	// 		}
	// 		return max(0., res/3.);
	// 	}

	// 	vec3 raycast( in vec3 ro, vec3 rd )
	// 	{
	// 		float t = 6.0;
	// 		float dt = .05;
	// 		vec3 col= vec3(0.);
	// 		for( int i=0; i<64; i++ )
	// 		{
	// 			float c = field(ro+t*rd);               
	// 			t+=dt/(.35+c*c);
	// 			c = max(5.0 * c - .9, 0.0);
	// 			col = .97*col+ .08*vec3(0.5*c*c*c, .6*c*c, c);
	// 		}
	// 		return col;
	// 	}

    //     void main() {

    //         #include <clipping_planes_fragment>

    //         vec4 diffuseColor = vec4( diffuse, opacity );
    //         ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
    //         vec3 totalEmissiveRadiance = emissive;

    //         #ifdef USE_SPLATMAP

    //             float splatSum = 0.0;

    //             for (int i = 0; i < ${length - 1}; i++) {
    //                 splatSum += texture2D(splatMaps[i], vUv).r;
    //             }

    //             vec4 accumulated = texture2D(textures[0], textureUVs[0]).rgba * (1.0 - splatSum);

    //             for (int i = 1; i < ${length}; i++) {
    //                 vec4 texel = texture2D(textures[i], textureUVs[0]);
    //                 vec4 splatTexel = texture2D(splatMaps[i - 1], vUv);

    //                 accumulated = mix(accumulated, texel, splatTexel.r);
    //             }

    //             //accumulated = mapTexelToLinear(accumulated);
    //             diffuseColor *= accumulated;
    //         #endif

    //         #include <logdepthbuf_fragment>
    //         #include <map_fragment>
    //         #include <color_fragment>
    //         #include <alphamap_fragment>
    //         #include <alphatest_fragment>
    //         #include <specularmap_fragment>
    //         #include <normal_fragment>
    //         #include <emissivemap_fragment>

    //         // accumulation
    //         #include <lights_phong_fragment>
    //         #include <lights_template>

    //         // modulation
    //         #include <aomap_fragment>

    //         vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;

    //         #include <envmap_fragment>

	// 		float time = iGlobalTime;
	// 		vec2 q = fragCoord.xy / iResolution.xy;
	// 		vec2 p = -1.0 + 2.0 * q;
	// 		p.x *= iResolution.x/iResolution.y;
	// 		vec2 m = vec2(0.);
	// 		if( iMouse.z>0.0 )m = iMouse.xy/iResolution.xy*3.14;
	// 		m-=.5;
	// 		vec3 ro = zoom*vec3(1.);
	// 		ro.yz*=rot(m.y);
	// 		ro.xz*=rot(m.x+ 0.1*time);
	// 		vec3 ta = vec3( 0.0 , 0.0, 0.0 );
	// 		vec3 ww = normalize( ta - ro );
	// 		vec3 uu = normalize( cross(ww,vec3(0.0,1.0,0.0) ) );
	// 		vec3 vv = normalize( cross(uu,ww));
	// 		vec3 rd = normalize( p.x*uu + p.y*vv + 4.0*ww );
	// 		vec3 col = raycast(ro,rd);
	// 		col =  .5 *(log(1.+col));
	// 		col = clamp(col,0.,1.);
	// 		gl_FragColor = vec4( sqrt(col), 1.0 );

    //         #include <tonemapping_fragment>
    //         #include <encodings_fragment>
    //         #include <fog_fragment>
    //         #include <premultiplied_alpha_fragment>
    //         #include <dithering_fragment>

    //     }`;

    //     return {
    //         vertexShader,
    //         fragmentShader
    //     };
    // }
}

export { CustomPhongShaderBuilder };
