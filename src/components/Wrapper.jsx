import { useThree, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import Sphere from "./Sphere";
import Cross from "./Cross";

export default function Wrapper() {
  return (
    <>
      <ambientLight intensity={[2.5]} />
      <OrbitControls />
      <Sphere />
      <Cross />
    </>
  );
}
