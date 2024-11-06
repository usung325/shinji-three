#define MAX_COUNT 100
#define RADIUS 2.0

varying vec2 vUv;
varying vec3 vPos;
varying vec3 vNormal;
varying mat4 vModelMatrix;

uniform sampler2D uDayTexture;
uniform sampler2D uNightTexture;
uniform sampler2D uCloudTexture;

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
    vec3 dayCol = texture(uDayTexture, vUv).rgb;
    vec3 nightCol = texture(uNightTexture, vUv).rgb;
    vec3 viewDirection = normalize(vPos - cameraPosition);
    vec3 normal = normalize(vNormal);
    vec3 col = vec3(dayCol);

    //Sun Direciton
    vec3 uSunDirection = vec3(0.0,0.0,1.0);
    float sunOrientation = dot(uSunDirection, normal);
    float dayMix = smoothstep(- 0.25, 0.5, sunOrientation);
    // col = vec3(sunOrientation);
    col = mix(nightCol, dayCol,dayMix);

    //cloud color
    vec2 cloudCol = texture(uCloudTexture, vUv).rg;
    float specularNormal = cloudCol.r;
    float cloud = cloudCol.g;
    float cloudMix = smoothstep(0.2, 1.0, cloud);
    col = mix(col, vec3(1.0), cloudMix * dayMix);

    //atmospehre color
    float atmosphereDayMix = smoothstep(-0.5, 1.0, sunOrientation);
    // float atmosphereMidMix = smoothstep(0.5, 1.0, sunOrientation);
    vec3 atmosphereCol = mix(uAtmosphereMid, uAtmosphereDay, atmosphereDayMix);
    // col = atmosphereCol;
    float fresnel = dot(viewDirection, normal) + 1.0;
    fresnel = pow(fresnel, 2.0);
    col = mix(col, atmosphereCol, fresnel * atmosphereDayMix);

    //specular
    vec3 refelction = reflect(- uSunDirection, normal);
    float specular =- dot(refelction, viewDirection);
    specular = max(specular, 0.0);
    specular = pow(specular, 32.0);

    vec3 specularCol = mix(vec3(1.0),  atmosphereCol, fresnel);
    specularCol *= specularNormal;
    col += specular * specularCol;
    // col = mix(col, specularCol, specular);

    vec3 worldPos = (vModelMatrix * vec4(vPos, 1.0)).xyz;
    float circleMask = 0.0;
    for(int i = MAX_COUNT; i > 0; i--){
        if (i <= 0) break;
        float circle = drawCircle(worldPos, uPos[i], getAnimatedRadius(uStartArr[i], RADIUS));
        circleMask += circle * 20.0;
    }
    circleMask = clamp(circleMask, 0.0, 2.0);

    // vec3 circleCol = vec3(0.7, 0.28, 0.14);
    vec3 circleCol = vec3(1.0, 0.3, 0.1);
    col = mix(col, circleCol, circleMask);
    // col = clamp(col, vec3(0.0), circleCol);



    gl_FragColor = vec4(col, 1.0);
}


