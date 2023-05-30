const psycheFragment = `
uniform float iGlobalTime;
uniform vec2 iResolution;
varying vec2 fragCoord;
varying vec2 vUv;

void main(){
    vec2 uv =  (2.0 * fragCoord - iResolution.xy) / min(iResolution.x, iResolution.y);

    for(float i = 1.0; i < 10.0; i++){
        uv.x += 0.6 / i * cos(i * 2.5* uv.y + iGlobalTime);
        uv.y += 0.6 / i * cos(i * 1.5 * uv.x + iGlobalTime);
    }
    
    gl_FragColor = vec4(vec3(0.1)/abs(sin(iGlobalTime-uv.y-uv.x)),1.0);
}
`;

export { psycheFragment };