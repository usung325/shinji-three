
varying vec3 vPos;
varying mat4 vModelMatrix;
varying vec3 vNormal;

void main(){
    vPos= position;
    vModelMatrix = modelMatrix;

    vNormal = (modelMatrix * vec4(normal, 0.0)).xyz;
    
    vec4 pos = modelMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * viewMatrix * pos;
}