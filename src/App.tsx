import { Canvas } from "@react-three/fiber";
import { useState } from "react";
import SceneModel from "./components/SceneModel";
import Menu from "./components/Menu";
import { type ModelData, type AnimationsState } from "./types";
import * as THREE from "three";
import { OrbitControls } from "@react-three/drei";

export default function App() {
  const [models, setModels] = useState<ModelData[]>([
    { id: 1, url: "/models/test.glb" },
  ]);

  const [activeAnimations, setActiveAnimations] = useState<AnimationsState>({});
  const [camera, setCamera] = useState<THREE.Camera>();

  const addModel = (file: File) => {
    const url = URL.createObjectURL(file);
    setModels([{ id: models.length + 1, url }]);
  };

  const [speed, setSpeed] = useState<number>(1); // скорость анимации

  return (
    <div className="flex w-screen h-screen bg-[#1e1e1e] overflow-hidden">
      {/* Сцена */}
      <div className="flex-[0_0_80%] h-full">
        <Canvas>
          {camera && <primitive object={camera} />}
          <OrbitControls />
          {models.map((m, i) => (
            <SceneModel
              key={m.id}
              url={m.url}
              modelId={m.id}
              activeAnimations={activeAnimations}
              setCamera={setCamera}
              position={[i * 2, 0, 0]}
              speed={speed}
            />
          ))}
          <ambientLight intensity={0.8} />
          {/* Основной свет для создания формы и теней */}
          <directionalLight
            position={[5, 10, 5]}
            intensity={1}
            castShadow
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
          />
          <hemisphereLight groundColor={0x444444} intensity={0.6} />
        </Canvas>
      </div>

      {/* Меню */}
      <div className="flex-[0_0_20%] h-full bg-gray-800/60 backdrop-blur-md shadow-lg text-white p-4 overflow-y-auto">
        <Menu
          models={models}
          onAddModel={addModel}
          activeAnimations={activeAnimations}
          setActiveAnimations={setActiveAnimations}
          setSpeed={setSpeed}
        />
      </div>
    </div>
  );
}
