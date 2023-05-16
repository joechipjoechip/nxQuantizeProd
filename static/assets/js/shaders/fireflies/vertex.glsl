uniform float uPixelRatio;
uniform float uSize;
uniform float uDownScale;
uniform float uTime;
uniform float uTimeratio;

attribute float aScale;

void main(){
	vec4 modelPosition = modelMatrix * vec4(position, 1.0);
	modelPosition.y += ((sin((uTime * uTimeratio) + modelPosition.x * 10.0)) / 10.0) * aScale * 0.8;

	vec4 viewPosition = viewMatrix * modelPosition;
	vec4 projectionPosition = projectionMatrix * viewPosition;

	gl_Position = projectionPosition;

	gl_PointSize = (uSize * aScale * uPixelRatio) / uDownScale;
	gl_PointSize *= (1.0 / - viewPosition.z);
}