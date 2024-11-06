import React, { useRef, useEffect } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import * as THREE from "three";

export function Cross3({ normalVec3 }) {
  const group = useRef();
  const { nodes, materials, animations } = useGLTF("/models/cross.glb");
  const { actions } = useAnimations(animations, group);
  //   console.log(actions);
  //   console.log(useGLTF("/models/cross.glb"));

  useEffect(() => {
    if (!actions.Expand) {
      console.log("actions not loaded");
      return;
    }

    const expand = actions.Expand;

    // expand.reset();
    expand.repetitions = false;
    expand.clampWhenFinished = true;
    expand.play();

    // return () => {
    //   expand.stop();
    // };
  }, []);

  useEffect(() => {
    /////GPT//////////GPT//////////[IT KIND OF WORKS]/////////GPT//////////GPT/////
    // Convert normal to orientation vectors
    const up = new THREE.Vector3(0, 1, 0);

    // Calculate the rotation axis by crossing the up vector with the normal
    const rotationAxis = new THREE.Vector3().crossVectors(up, normalVec3);

    // Calculate the angle between the up vector and normal
    const angle = Math.acos(up.dot(normalVec3));

    // Apply the rotation
    group.current.setRotationFromAxisAngle(rotationAxis, angle);
    /////GPT//////////GPT//////////GPT//////////GPT//////////GPT/////
  }, [normalVec3]);

  return (
    <group ref={group} dispose={null}>
      <group name="Scene">
        <mesh
          name="Cube"
          //   castShadow
          //   receiveShadow
          geometry={nodes.Cube.geometry}
          //   material={nodes.Cube.material}
          morphTargetDictionary={nodes.Cube.morphTargetDictionary}
          morphTargetInfluences={nodes.Cube.morphTargetInfluences}
          //   position={[0, 0.88, 0]}
          //   scale={[0.091, 1, 0.091]}
        >
          <meshBasicMaterial morphTargets={true} color="green" />
        </mesh>
      </group>
    </group>
  );
}

useGLTF.preload("/models/cross.glb");
