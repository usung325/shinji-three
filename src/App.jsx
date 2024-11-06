import "./App.css";
import { Canvas } from "@react-three/fiber";
import Wrapper from "./components/Wrapper";
import { EffectComposer, Bloom } from "@react-three/postprocessing";

function App() {
  return (
    <>
      <Canvas
        flat
        gl={{ antialias: false }}
        camera={{ position: [-10, 20, 5] }}
      >
        {/* <EffectComposer disableNormalPass={true}>
          <Bloom luminanceThreshold={1.0} />
        </EffectComposer> */}
        <Wrapper />
      </Canvas>
    </>
  );
}

export default App;
