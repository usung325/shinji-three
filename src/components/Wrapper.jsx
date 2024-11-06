import { useThree, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import Sphere from "./Sphere";
import Cross from "./Cross";
import {
  Bloom,
  EffectComposer,
  HueSaturation,
} from "@react-three/postprocessing";

export default function Wrapper() {
  return (
    <>
      <ambientLight intensity={[2.5]} />
      <EffectComposer>
        <HueSaturation saturation={0.5} />
        <Bloom
          intensity={0.9} // The bloom intensity.
          luminanceThreshold={0.9} // luminance threshold. Raise this value to mask out darker elements in the scene.
          luminanceSmoothing={0.025} // smoothness of the luminance threshold. Range is [0, 1]
          mipmapBlur={false} // Enables or disables mipmap blur.
        />
      </EffectComposer>
      <OrbitControls />
      <Sphere />
      <Cross />
    </>
  );
}
