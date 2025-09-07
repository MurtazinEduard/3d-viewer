import { useEffect, useState } from "react";
import { type ModelData, type AnimationsState } from "../types";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

interface MenuProps {
  models: ModelData[];
  onAddModel: (file: File) => void;
  activeAnimations: AnimationsState;
  setActiveAnimations: React.Dispatch<React.SetStateAction<AnimationsState>>;
  setSpeed: (value: number) => void; // функция для передачи скорости в SceneModel
}


export default function Menu({
  models,
  onAddModel,
  activeAnimations,
  setActiveAnimations,
  setSpeed,
}: MenuProps) {
  const [animationsMap, setAnimationsMap] = useState<Record<number, string[]>>({});
  const [speed, setLocalSpeed] = useState<number>(1);

  useEffect(() => {
    const loader = new GLTFLoader();

    models.forEach((m) => {
      loader.load(
        m.url,
        (gltf) => {
          if (gltf.animations?.length) {
            setAnimationsMap((prev) => ({
              ...prev,
              [m.id]: gltf.animations.map((a) => a.name),
            }));
          }
        },
        undefined,
        (err) => console.error(err)
      );
    });
  }, [models]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onAddModel(file);
  };

  const playAllAnimations = () => {
    const newState: AnimationsState = {};
    models.forEach((m) => {
      if (animationsMap[m.id]?.length) {
        newState[m.id] = "__ALL__";
      }
    });
    setActiveAnimations(newState);
  };

  // Обработчик ползунка скорости
  const handleSpeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setLocalSpeed(val);
    setSpeed(val); // передаем в SceneModel
  };

  return (
    <div className="p-4 rounded-2xl bg-gray-800/60 backdrop-blur-md shadow-lg text-white w-60">
      <h2 className="text-lg font-bold mb-2">Модели</h2>

      {models.map((m) => (
        <div key={m.id} className="mb-4">
          <h3 className="font-semibold text-sm">Model {m.id}</h3>
          {animationsMap[m.id]?.length ? (
            <select
              className="w-full mt-1 p-1 rounded bg-gray-700"
              value={activeAnimations[m.id] || ""}
              onChange={(e) =>
                setActiveAnimations({
                  ...activeAnimations,
                  [m.id]: e.target.value,
                })
              }
            >
              <option value="">Без анимации</option>
              {animationsMap[m.id].map((anim) => (
                <option key={anim} value={anim}>
                  {anim}
                </option>
              ))}
            </select>
          ) : (
            <p className="text-xs text-gray-400">Нет анимаций</p>
          )}
        </div>
      ))}

      <button
        className="mt-2 w-full p-2 rounded bg-green-600 hover:bg-green-500"
        onClick={playAllAnimations}
      >
        Воспроизвести все анимации
      </button>

      <div className="mt-4">
        <label className="text-sm">Скорость анимации: {speed}x</label>
        <input
          type="range"
          min="0.1"
          max="10"
          step="0.1"
          value={speed}
          onChange={handleSpeedChange}
          className="w-full"
        />
      </div>

      <label className="block mt-4 text-sm cursor-pointer">
        Добавить модель
        <input type="file" accept=".glb" className="hidden" onChange={handleFileUpload} />
      </label>
    </div>
  );
}