/* import { useEffect, useRef } from "react";
import { Group, AnimationMixer, AnimationAction, AnimationClip } from "three";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { type AnimationsState } from "../App";

interface ModelProps {
  url: string;
  modelId: number;
  activeAnimations: AnimationsState;
  position?: [number, number, number];
}

export default function Model({
  url,
  modelId,
  activeAnimations,
  position = [0, 0, 0],
}: ModelProps) {
  const group = useRef<Group>(null);
  const mixer = useRef<AnimationMixer>(null);
  const actions = useRef<Record<string, AnimationAction>>({});

  const { scene, animations } = useGLTF(url) as {
    scene: Group;
    animations: AnimationClip[];
  };

  // Инициализация анимаций
  useEffect(() => {
    if (!animations?.length) return;

    mixer.current = new AnimationMixer(scene);

    // создаём все actions и сразу останавливаем
    animations.forEach((clip) => {
      const action = mixer.current!.clipAction(clip);
      action.stop();
      actions.current[clip.name] = action;
    });

    return () => {
      mixer.current?.stopAllAction();
    };
  }, [animations, scene]);

  // Воспроизведение выбранной анимации
  useEffect(() => {
    const active = activeAnimations[modelId];

    // останавливаем все
    Object.values(actions.current).forEach((a) => a.stop());

    if (active && actions.current[active]) {
      actions.current[active].reset().fadeIn(0.5).play();
    }
  }, [activeAnimations, modelId]);

  useFrame((_, delta) => {
    mixer.current?.update(delta);
  });

  return <primitive ref={group} object={scene} position={position} />;
}
 */



/* interface ModelProps {
  url: string;
  modelId: number;
  activeAnimations: AnimationsState;
  position?: [number, number, number];
  setCamera?: (cam: Camera) => void; // передаём наружу камеру из GLB
}

export default function Model({
  url,
  modelId,
  activeAnimations,
  position = [0, 0, 0],
  setCamera,
}: ModelProps) {
  const group = useRef<Group>(null);
  const mixer = useRef<AnimationMixer>(null);
  const actions = useRef<Record<string, AnimationAction>>({});
  const glbCamera = useRef<Camera>(null);

  const { scene, cameras, animations } = useGLTF(url) as {
    scene: Group;
    cameras: Camera[];
    animations: AnimationClip[];
  };

  // Берём первую камеру из GLB
  useEffect(() => {
    console.log('cameras', cameras)
    if (cameras?.length) {
      glbCamera.current = cameras[0];
      if (setCamera) setCamera(glbCamera.current); // передаём наружу для Canvas
    }
  }, [cameras, setCamera]);

  // Инициализация анимаций
  useEffect(() => {
    console.log('animations', animations)
    if (!animations?.length) return;

    mixer.current = new AnimationMixer(scene);

    animations.forEach((clip) => {
      const action = mixer.current!.clipAction(clip);
      action.stop();
      actions.current[clip.name] = action;
    });

    return () => {
      mixer.current?.stopAllAction();
    };
  }, [animations, scene]);

  // Воспроизведение выбранной анимации
  useEffect(() => {
    const active = activeAnimations[modelId];

    Object.values(actions.current).forEach((a) => a.stop());

    if (active && actions.current[active]) {
      actions.current[active].reset().fadeIn(0.5).play();
    }
  }, [activeAnimations, modelId]);

  useFrame((_, delta) => {
    mixer.current?.update(delta);

    // если есть камера из GLB, синхронизируем с основной камерой
    if (glbCamera.current && setCamera) {
      const mainCam = glbCamera.current;
      // mainCam уже передан наружу через setCamera, Canvas будет использовать её
      // тут можно дополнительно интерполировать для плавности
    }
  });

  return <primitive ref={group} object={scene} position={position} />;
} */

import { useEffect, useRef } from "react";
import { Group, AnimationMixer, AnimationAction, Camera, AnimationClip } from "three";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { type AnimationsState } from "../App";

interface ModelProps {
  url: string;
  modelId: number;
  activeAnimations: AnimationsState;
  position?: [number, number, number];
  setCamera?: (cam: Camera) => void;
}

export default function Model({
  url,
  modelId,
  activeAnimations,
  position = [0, 0, 0],
  setCamera,
}: ModelProps) {
  const group = useRef<Group>(null);
  const mixer = useRef<AnimationMixer>(null);
  const actions = useRef<Record<string, AnimationAction>>({});
  const glbCamera = useRef<Camera>(null);

  const { scene, cameras, animations } = useGLTF(url) as {
    scene: Group;
    cameras: Camera[];
    animations: AnimationClip[];
  };

  // Берем камеру из GLB
  useEffect(() => {
    if (cameras?.length) {
      glbCamera.current = cameras[0];
      if (setCamera) setCamera(glbCamera.current);
    }
  }, [cameras, setCamera]);

  // Инициализация миксера
  useEffect(() => {
  if (!animations?.length || !glbCamera.current) return;

  mixer.current = new AnimationMixer(glbCamera.current);

  animations.forEach((clip) => {
    const action = mixer.current!.clipAction(clip);
    action.stop();
    actions.current[clip.name] = action;
  });

  // Функция очистки
  return () => {
    mixer.current?.stopAllAction();
    mixer.current = null;
  };
}, [animations]);

  // Воспроизведение выбранной анимации
  useEffect(() => {
    const active = activeAnimations[modelId];

    Object.values(actions.current).forEach((a) => a.stop());

    if (active && actions.current[active]) {
      actions.current[active].reset().fadeIn(0.5).play();
    }
  }, [activeAnimations, modelId]);

  // Обновляем миксер каждый кадр
  useFrame((_, delta) => {
    mixer.current?.update(delta);
  });

  return <primitive ref={group} object={scene} position={position} />;
}

