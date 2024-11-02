import "./App.css";
import { Canvas } from "@react-three/fiber";
import Wrapper from "./components/Wrapper";

function App() {
  return (
    <>
      <Canvas>
        <Wrapper />
      </Canvas>
    </>
  );
}

export default App;
