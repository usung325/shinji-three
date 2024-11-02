#define MAX_COUNT 100

varying vec2 vUv;
varying vec3 vPos;
varying mat4 vModelMatrix;

uniform vec3 uPos[MAX_COUNT];
uniform int uCount;
uniform float uTime;
uniform float uStartArr[MAX_COUNT];

const float ANIMATION_DURATION = 0.2;
const float START_RADIUS = 0.0;
const float END_RADIUS = 0.7;

float drawCircle(vec3 point, vec3 center, float radius) {
    float d = distance(center, point);
    return 1.0 - step(radius, d);
}

float getAnimatedRadius(float startTime) {
    float timeSinceStart = uTime - startTime;
    float progress = clamp(timeSinceStart / ANIMATION_DURATION, 0.0, 1.0);
    // float easedProgress = easeOutElastic(progress);
    return mix(START_RADIUS, END_RADIUS, progress);
}

void main() {
    vec3 col = vec3(vUv.x, vUv.y, 0.0);

    vec3 worldPos = (vModelMatrix * vec4(vPos, 1.0)).xyz;

    float circleMask = 0.0;


    for(int i = MAX_COUNT; i > 0; i--){
        if (i <= 0) break;
        float circle = drawCircle(worldPos, uPos[i], getAnimatedRadius(uStartArr[i]));
        circleMask += circle;
    }
    vec3 circleCol = vec3(1.0, 0.4, 0.2);
    col = mix(col, circleCol, circleMask);


    gl_FragColor = vec4(col, 1.0);
}


