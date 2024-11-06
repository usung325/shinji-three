#define MAX_COUNT 100
#define RADIUS 2.0

varying vec3 vPos;
varying vec3 vNormal;
varying mat4 vModelMatrix;

uniform vec3 uPos[MAX_COUNT];
uniform int uCount;
uniform float uTime;
uniform float uStartArr[MAX_COUNT];

uniform vec3 uAtmosphereDay;
uniform vec3 uAtmosphereMid;

const float ANIMATION_DURATION = 1.5;
const float START_RADIUS = 0.0;
const float END_RADIUS = 0.7;

float drawCircle(vec3 point, vec3 center, float radius) {
    float d = distance(center, point);
    return 1.0 - step(radius, d);
}

float getAnimatedRadius(float startTime, float radius) {
    float timeSinceStart = uTime - startTime;
    float progress = clamp(timeSinceStart / ANIMATION_DURATION, 0.0, radius);
    // float easedProgress = easeOutElastic(progress);
    return mix(START_RADIUS, END_RADIUS, progress);
}

void main() {
    vec3 col = vec3(0.996,0.494,0.129);
    vec3 viewDirection = normalize(vPos - cameraPosition);
    vec3 normal = normalize(vNormal);

    //Sun Direciton
    vec3 uSunDirection = vec3(0.0,0.0,1.0);
    float sunOrientation = dot(uSunDirection, normal);

    //alpha
    float edgeAlpha = dot(viewDirection, normal);
    edgeAlpha = smoothstep(0.1, 0.5, edgeAlpha);
    float dayAlpha = smoothstep(-0.5, 0.0, sunOrientation);
    float finalAlpha = edgeAlpha;

    //atmospehre color
    float atmosphereDayMix = smoothstep(-0.5, 1.0, sunOrientation);
    // float atmosphereMidMix = smoothstep(0.5, 1.0, sunOrientation);
    vec3 atmosphereCol = mix(uAtmosphereMid, uAtmosphereDay, atmosphereDayMix);
    // col = atmosphereCol;
    col = mix(col, atmosphereCol, atmosphereDayMix);

    gl_FragColor = vec4(col, finalAlpha) ;
}


