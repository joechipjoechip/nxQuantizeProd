void main(){
	float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
	float strength = 0.01 / distanceToCenter - 0.01 * 2.0;
	gl_FragColor = vec4(1.0, 1.0, 1.0, strength);
}