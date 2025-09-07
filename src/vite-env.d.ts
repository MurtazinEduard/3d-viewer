/// <reference types="vite/client" />
declare module "three/examples/jsm/loaders/GLTFLoader" {
  import { Loader, LoadingManager, Group, AnimationClip } from "three";

  export class GLTF {
    scene: Group;
    scenes: Group[];
    animations: AnimationClip[];
    asset: any;
    parser: any;
    userData: any;
  }

  export class GLTFLoader extends Loader {
    constructor(manager?: LoadingManager);
    load(
      url: string,
      onLoad: (gltf: GLTF) => void,
      onProgress?: (event: ProgressEvent) => void,
      onError?: (event: ErrorEvent) => void
    ): void;
    parse(
      data: ArrayBuffer | string,
      path: string,
      onLoad: (gltf: GLTF) => void,
      onError?: (event: ErrorEvent) => void
    ): void;
  }
}