import "./App.css";
import { Canvas } from "@react-three/fiber";
import Wrapper from "./components/Wrapper";

function App() {
  return (
    <>
      <Canvas camera={{ position: [-10, 20, 5] }}>
        <Wrapper />
      </Canvas>
    </>
  );
}

export default App;
