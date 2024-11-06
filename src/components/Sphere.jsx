import { useRef, useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { EffectComposer, SelectiveBloom } from "@react-three/postprocessing";
import fragment from "../shaders/sphere/fragment.glsl";
import vertex from "../shaders/sphere/vertex.glsl";
import * as THREE from "three";
import Cross from "./Cross";
import { Cross2 } from "./TestCross";
import { Cross3 } from "./Test2Cross";
import { Cross4 } from "./Test3Cross";

export default function Sphere() {
  const clockRef = useRef(new THREE.Clock());

  const meshRef = useRef(null);
  const lightRef = useRef(null);
  const groupRef = useRef(null);
  const [points, setPoints] = useState([]);
  const [arrPoints, setArrPoints] = useState(
    new Array(100).fill(new THREE.Vector3(0, 0, 0))
  );
  const [arrStartT, setArrStartT] = useState(new Array(100).fill(0.0));

  // TEXTURES //
  const textureLoader = new THREE.TextureLoader();
  const textureDay = textureLoader.load("/textures/day.jpg");
  textureDay.anisotropy = 8; //sharpness of texture
  const textureNight = textureLoader.load("/textures/night.jpg");
  textureNight.anisotropy = 8;
  const textureClouds = textureLoader.load("/textures/specular.jpg");
  textureDay.colorSpace = THREE.SRGBColorSpace;
  textureNight.colorSpace = THREE.SRGBColorSpace;
  textureClouds.colorSpace = THREE.SRGBColorSpace;

  const handleClick = (e) => {
    e.stopPropagation();
    // console.log(clockRef.current.elapsedTime % 2.0);
    if (clockRef.current.elapsedTime % 0.2 <= 0.01) {
    }
    const point = e.intersections[0].point;
    const normal = e.intersections[0].normal;
    setPoints((prev) => [
      ...prev,
      {
        point: point,
        normal: normal,
      },
    ]);
    setArrStartT((prev) => [...prev, clockRef.current.elapsedTime]);
    setArrPoints((prev) => [...prev, point]);
  };

  const earthParams = {};
  earthParams.dayCol = "#00aaff";
  earthParams.midCol = "#ff6600";

  const uniforms = useRef({
    uPos: { value: arrPoints },
    uCount: { value: 0 },
    uTime: { value: clockRef.current.elapsedTime },
    uStartArr: { value: arrStartT },
    uDayTexture: { value: textureDay },
    uNightTexture: { value: textureNight },
    uCloudTexture: { value: textureClouds },
    uAtmosphereDay: { value: new THREE.Color(earthParams.dayCol) },
    uAtmosphereMid: { value: new THREE.Color(earthParams.midCol) },
  });

  useEffect(() => {
    if (points.count <= 100) {
      meshRef.current.material.uniforms.uPos.value = arrPoints;
      meshRef.current.material.uniforms.uStartArr.value = arrStartT;
    } else {
      setArrPoints((prevArr) => prevArr.slice(1));
      meshRef.current.material.uniforms.uPos.value = arrPoints;
      setArrStartT((prevArr) => prevArr.slice(1));
      meshRef.current.material.uniforms.uStartArr.value = arrStartT;
    }

    meshRef.current.material.uniforms.uCount.value = arrPoints.length;
  }, [points]);

  useFrame(() => {
    meshRef.current.material.uniforms.uTime.value =
      clockRef.current.getElapsedTime();
  });

  return (
    <group ref={groupRef}>
      {/* or onClick */}
      <mesh ref={meshRef} onClick={(e) => handleClick(e)}>
        <sphereGeometry args={[13, 100, 100]} />
        <shaderMaterial
          vertexShader={vertex}
          fragmentShader={fragment}
          uniforms={uniforms.current}
          wireframe={false}
        />
      </mesh>

      {points.map((data, i = 0) => {
        // console.log(data);
        return (
          <group key={i} position={data.point} scale={0.2}>
            <Cross4 normalVec3={data.normal} />
            {/* <Cross3 normalVec3={data.normal} /> */}
            {/* <Cross normalVec3={data.normal} /> */}
            {/* <Cross2 normalVec3={data.normal} /> */}
            {/* <mesh>
              <bufferGeometry>
                <bufferAttribute
                  attach="attributes-position"
                  count={36}
                  array={new Float32Array(data.vertices)}
                  itemSize={3}
                />
              </bufferGeometry>
              <meshBasicMaterial color="#88E19E" side={THREE.DoubleSide} />
            </mesh> */}
          </group>
        );
      })}
    </group>
  );
}
