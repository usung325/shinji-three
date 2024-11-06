import "./App.css";
import { Canvas } from "@react-three/fiber";
import Wrapper from "./components/Wrapper";
import { EffectComposer, Bloom, SMAA } from "@react-three/postprocessing";

function App() {
  return (
    <>
      <Canvas camera={{ position: [-10, 20, 5] }}>
        <EffectComposer>
          <SMAA />
          <Bloom luminanceThreshold={1.0} />
        </EffectComposer>
        <Wrapper />
      </Canvas>
    </>
  );
}

export default App;
