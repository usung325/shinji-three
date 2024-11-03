import { useEffect } from "react";
import { useGLTF, useAnimations, Clone } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

export default function Cross({ normalVec3 = new THREE.Vector3(0, 0, 0) }) {
  const model = useGLTF("/models/promise.glb");
  const animations = useAnimations(model.animations, model.scene);
  const expand = animations.actions.Expand;
  const expandWing = animations.actions.ExpandWing;

  const ref = useRef(null);

  useEffect(() => {
    if (model.scene) {
      expand.play();
      expandWing.play();
      expand.repetitions = false;
      expandWing.repetitions = false;
      expandWing.clampWhenFinished = true;
      expand.clampWhenFinished = true; // this freezes on last frame

      // setTimeout(() => {
      //   expandWing.crossFadeFrom(expandWing, 0.1);
      // }, 10);

      // ref.current.rotation.setFromVector3(normalVec3);
      // ref.current.setRotationFromAxisAngle(normalVec3, 3.0);
      // const myMesh = ref.current.children[0];

      /////GPT//////////GPT//////////[IT KIND OF WORKS]/////////GPT//////////GPT/////
      // Convert normal to orientation vectors
      const up = new THREE.Vector3(0, 1, 0);

      // Calculate the rotation axis by crossing the up vector with the normal
      const rotationAxis = new THREE.Vector3().crossVectors(up, normalVec3);

      // Calculate the angle between the up vector and normal
      const angle = Math.acos(up.dot(normalVec3));

      // Apply the rotation
      ref.current.setRotationFromAxisAngle(rotationAxis, angle);
      /////GPT//////////GPT//////////GPT//////////GPT//////////GPT/////

      console.log("NOR: ", normalVec3);
      console.log("ROT: ", ref.current.rotation);
    }
  }, []);

  return (
    <>
      <primitive ref={ref} object={model.scene} scale={10} />
    </>
  );
}
