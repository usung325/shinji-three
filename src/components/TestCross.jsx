import React, { useRef, useEffect } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import * as THREE from "three";

export function Cross2({ normalVec3 }) {
  const group = useRef();
  const { nodes, materials, animations } = useGLTF("/models/promise.glb");
  const { actions } = useAnimations(animations, group);
  console.log(actions);

  const playActions = (expand, expandWing) => {
    expand.repetitions = false;
    expandWing.repetitions = false;
    expandWing.clampWhenFinished = true;
    expand.clampWhenFinished = true;
    expandWing.play();
    expand.fadeIn(0.1).play();
    setTimeout(() => {
      expandWing.fadeOut(0.1);
    }, 1000);
  };

  useEffect(() => {
    const expand = actions.Expand;
    const expandWing = actions.ExpandWing;
    if (actions) {
      playActions(expand, expandWing);
    }

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
  }, []);

  return (
    <group ref={group} dispose={null}>
      <group name="Scene">
        <mesh
          name="cross"
          castShadow
          receiveShadow
          geometry={nodes.cross.geometry}
          //   material={nodes.cross.material}
          morphTargetDictionary={nodes.cross.morphTargetDictionary}
          morphTargetInfluences={nodes.cross.morphTargetInfluences}
          // position={[0, 1.15, 0]}
          //   scale={[0.01, 0.01, 0.01]}
        >
          <meshBasicMaterial color="lightgreen" />
        </mesh>
      </group>
    </group>
  );
}

useGLTF.preload("/models/promise.glb");
