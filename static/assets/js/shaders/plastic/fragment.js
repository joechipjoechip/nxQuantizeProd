const plasticFragment = `
uniform float iGlobalTime;
uniform vec2 iResolution;
uniform vec4      iMouse;
uniform sampler2D iChannel0;
varying vec2 fragCoord;
varying vec2 vUv;
void main()
{
    float k=0.;

    vec3 d =  vec3(fragCoord,1.0)/1.0-.5, o = d, c=k*d, p;

    for( int i=0; i<99; i++ ){
        p = o+sin(iGlobalTime*.1);
        for (int j = 0; j < 3; j++) 
            p = abs(p.zyx-.4) -.7,k += exp(-6. * abs(dot(p,o)));
        k/=3.;
        o += d *.05*k;
        c = .97*c + .1*k*vec3(k*k,k,1);
    }

    c =  .4 *log(1.+c);
    
    gl_FragColor.rgb = c;
}
`;



export { plasticFragment };
