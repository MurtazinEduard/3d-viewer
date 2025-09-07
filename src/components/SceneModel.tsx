import { useEffect, useRef } from "react";
import {
  Group,
  AnimationMixer,
  AnimationAction,
  Camera,
  AnimationClip,
} from "three";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { type AnimationsState } from "../types";

interface SceneModelProps {
  url: string;
  modelId: number;
  activeAnimations: AnimationsState;
  position?: [number, number, number];
  setCamera?: (cam: Camera) => void;
  speed?: number;
}

export default function SceneModel({
  url,
  modelId,
  activeAnimations,
  position = [0, 0, 0],
  setCamera,
  speed,
}: SceneModelProps) {
  const group = useRef<Group>(null);
  const mixer = useRef<AnimationMixer>(null);
  const actions = useRef<Record<string, AnimationAction>>({});
  const glbCamera = useRef<Camera>(null);

  const { scene, cameras, animations } = useGLTF(url) as {
    scene: Group;
    cameras: Camera[];
    animations: AnimationClip[];
  };

  // Берём камеру из GLB
  useEffect(() => {
    if (cameras?.length) {
      glbCamera.current = cameras[0];
      if (setCamera) setCamera(glbCamera.current);
    }
  }, [cameras, setCamera]);

  // Создаём миксер для всей сцены
  useEffect(() => {
    if (!animations?.length) return;

    mixer.current = new AnimationMixer(scene);

    animations.forEach((clip) => {
      const action = mixer.current!.clipAction(clip);
      action.stop(); // по умолчанию не проигрываем
      actions.current[clip.name] = action;
    });

    return () => mixer.current?.stopAllAction();
  }, [animations, scene]);


  useEffect(() => {
    const active = activeAnimations[modelId];

    Object.values(actions.current).forEach((a) => a.stop());

    if (!active) return;

    if (active === "__ALL__") {
      // включаем все анимации
      Object.values(actions.current).forEach((a) => {
        a.reset().fadeIn(0.3);
        a.timeScale = speed || 1; // скорость анимации
        a.play();
      });
    } else if (actions.current[active]) {
      const action = actions.current[active];
      action.reset().fadeIn(0.3);

      // Увеличиваем скорость анимации
      action.timeScale = speed || 1;
      action.play();
    }
  }, [activeAnimations, modelId]);

  useFrame((_, delta) => {
    mixer.current?.update(delta);
  });

  return <primitive ref={group} object={scene} position={position} />;
}
