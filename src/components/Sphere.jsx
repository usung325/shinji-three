import { useRef, useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";
import fragment from "../shaders/sphere/fragment.glsl";
import vertex from "../shaders/sphere/vertex.glsl";
import * as THREE from "three";

export default function Sphere() {
  const clockRef = useRef(new THREE.Clock());

  const meshRef = useRef(null);
  const [points, setPoints] = useState([]);
  const [arrPoints, setArrPoints] = useState(
    new Array(100).fill(new THREE.Vector3(0, 0, 0))
  );
  const [arrStartT, setArrStartT] = useState(new Array(100).fill(0.0));

  ///// gpt //////////// gpt //////////// gpt //////////// gpt //////////// gpt //////////// gpt //////////// gpt ///////
  const calculateRectangleVertices = (point, normal) => {
    const up = new THREE.Vector3(0, 1, 0);
    const width = 0.1; // base width
    const height = 10; // box height
    const depth = width; // making depth same as width for a square base

    // If normal is parallel to up vector, use right vector instead
    if (Math.abs(normal.dot(up)) > 0.99999) {
      up.set(1, 0, 0);
    }

    // Calculate right vector (perpendicular to normal and up)
    const right = new THREE.Vector3().crossVectors(up, normal).normalize();
    // Recalculate up vector to ensure it's perpendicular
    const correctedUp = new THREE.Vector3()
      .crossVectors(normal, right)
      .normalize();

    const halfWidth = width / 2;
    const halfHeight = height / 2;
    const halfDepth = depth / 2;

    // Adjust center point by moving it forward by half depth
    const centerPoint = point
      .clone()
      .add(correctedUp.clone().multiplyScalar(halfDepth));

    // Calculate the 8 corners of the box from the center point
    const frontBottomLeft = new THREE.Vector3()
      .copy(centerPoint)
      .sub(right.clone().multiplyScalar(halfWidth))
      .sub(correctedUp.clone().multiplyScalar(depth))
      .sub(normal.clone().multiplyScalar(halfHeight));
    const frontBottomRight = new THREE.Vector3()
      .copy(centerPoint)
      .add(right.clone().multiplyScalar(halfWidth))
      .sub(correctedUp.clone().multiplyScalar(depth))
      .sub(normal.clone().multiplyScalar(halfHeight));
    const frontTopRight = new THREE.Vector3()
      .copy(centerPoint)
      .add(right.clone().multiplyScalar(halfWidth))
      .sub(correctedUp.clone().multiplyScalar(depth))
      .add(normal.clone().multiplyScalar(halfHeight));
    const frontTopLeft = new THREE.Vector3()
      .copy(centerPoint)
      .sub(right.clone().multiplyScalar(halfWidth))
      .sub(correctedUp.clone().multiplyScalar(depth))
      .add(normal.clone().multiplyScalar(halfHeight));

    // Calculate back vertices
    const backBottomLeft = frontBottomLeft
      .clone()
      .add(correctedUp.clone().multiplyScalar(depth));
    const backBottomRight = frontBottomRight
      .clone()
      .add(correctedUp.clone().multiplyScalar(depth));
    const backTopRight = frontTopRight
      .clone()
      .add(correctedUp.clone().multiplyScalar(depth));
    const backTopLeft = frontTopLeft
      .clone()
      .add(correctedUp.clone().multiplyScalar(depth));

    // Rest of the vertices array remains the same
    return [
      // Front face
      frontBottomLeft.x,
      frontBottomLeft.y,
      frontBottomLeft.z,
      frontBottomRight.x,
      frontBottomRight.y,
      frontBottomRight.z,
      frontTopRight.x,
      frontTopRight.y,
      frontTopRight.z,
      frontBottomLeft.x,
      frontBottomLeft.y,
      frontBottomLeft.z,
      frontTopRight.x,
      frontTopRight.y,
      frontTopRight.z,
      frontTopLeft.x,
      frontTopLeft.y,
      frontTopLeft.z,

      // Back face
      backBottomRight.x,
      backBottomRight.y,
      backBottomRight.z,
      backBottomLeft.x,
      backBottomLeft.y,
      backBottomLeft.z,
      backTopLeft.x,
      backTopLeft.y,
      backTopLeft.z,
      backBottomRight.x,
      backBottomRight.y,
      backBottomRight.z,
      backTopLeft.x,
      backTopLeft.y,
      backTopLeft.z,
      backTopRight.x,
      backTopRight.y,
      backTopRight.z,

      // Top face
      frontTopLeft.x,
      frontTopLeft.y,
      frontTopLeft.z,
      frontTopRight.x,
      frontTopRight.y,
      frontTopRight.z,
      backTopRight.x,
      backTopRight.y,
      backTopRight.z,
      frontTopLeft.x,
      frontTopLeft.y,
      frontTopLeft.z,
      backTopRight.x,
      backTopRight.y,
      backTopRight.z,
      backTopLeft.x,
      backTopLeft.y,
      backTopLeft.z,

      // Bottom face
      frontBottomLeft.x,
      frontBottomLeft.y,
      frontBottomLeft.z,
      backBottomLeft.x,
      backBottomLeft.y,
      backBottomLeft.z,
      backBottomRight.x,
      backBottomRight.y,
      backBottomRight.z,
      frontBottomLeft.x,
      frontBottomLeft.y,
      frontBottomLeft.z,
      backBottomRight.x,
      backBottomRight.y,
      backBottomRight.z,
      frontBottomRight.x,
      frontBottomRight.y,
      frontBottomRight.z,

      // Right face
      frontBottomRight.x,
      frontBottomRight.y,
      frontBottomRight.z,
      backBottomRight.x,
      backBottomRight.y,
      backBottomRight.z,
      backTopRight.x,
      backTopRight.y,
      backTopRight.z,
      frontBottomRight.x,
      frontBottomRight.y,
      frontBottomRight.z,
      backTopRight.x,
      backTopRight.y,
      backTopRight.z,
      frontTopRight.x,
      frontTopRight.y,
      frontTopRight.z,

      // Left face
      backBottomLeft.x,
      backBottomLeft.y,
      backBottomLeft.z,
      frontBottomLeft.x,
      frontBottomLeft.y,
      frontBottomLeft.z,
      frontTopLeft.x,
      frontTopLeft.y,
      frontTopLeft.z,
      backBottomLeft.x,
      backBottomLeft.y,
      backBottomLeft.z,
      frontTopLeft.x,
      frontTopLeft.y,
      frontTopLeft.z,
      backTopLeft.x,
      backTopLeft.y,
      backTopLeft.z,
    ];
  };
  ///// gpt //////////// gpt //////////// gpt //////////// gpt //////////// gpt //////////// gpt //////////// gpt ///////

  const handleClick = (e) => {
    const point = e.intersections[0].point;
    const normal = e.intersections[0].normal;
    setPoints((prev) => [
      ...prev,
      {
        point: point,
        normal: normal,
        vertices: calculateRectangleVertices(point, normal),
      },
    ]);
    setArrStartT((prev) => [...prev, clockRef.current.elapsedTime]);
    setArrPoints((prev) => [...prev, point]);

    console.log(arrPoints);
    console.log(arrStartT);
    console.log(clockRef.current.elapsedTime);
  };

  const uniforms = useRef({
    uPos: { value: arrPoints },
    uCount: { value: 0 },
    uTime: { value: clockRef.current.elapsedTime },
    uStartArr: { value: arrStartT },
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
    <group>
      <mesh ref={meshRef} onClick={(e) => handleClick(e)}>
        <sphereGeometry args={[3, 75, 75]} />
        <shaderMaterial
          vertexShader={vertex}
          fragmentShader={fragment}
          uniforms={uniforms.current}
        />
      </mesh>

      {points.map((data, i) => {
        return (
          <group key={i}>
            <mesh>
              <bufferGeometry>
                <bufferAttribute
                  attach="attributes-position"
                  count={36}
                  array={new Float32Array(data.vertices)}
                  itemSize={3}
                />
              </bufferGeometry>
              <meshBasicMaterial color="#88E19E" side={THREE.DoubleSide} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}
