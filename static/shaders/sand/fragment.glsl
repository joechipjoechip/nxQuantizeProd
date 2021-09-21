uniform sampler2D uTexture;

varying vec2 vUv;
varying float vDigness;

void main()
{
	vec4 textureColor = texture2D(uTexture, vUv);

	textureColor.rgb -= vDigness * 0.75;

	gl_FragColor = vec4(textureColor.rgb, 1.0);

}