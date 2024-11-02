import { useThree, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import Sphere from "./Sphere";

export default function Wrapper() {
  return (
    <>
      <OrbitControls />
      <Sphere />
    </>
  );
}
