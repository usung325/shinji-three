varying vec2 vUv;
varying vec3 vPos;
varying mat4 vModelMatrix;

void main(){
    vUv = uv;
    vPos= position;
    vModelMatrix = modelMatrix;
    
    vec4 pos = modelMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * viewMatrix * pos;
}