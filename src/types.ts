export interface ModelData {
  id: number;
  url: string;
}

export interface AnimationsState {
  [modelId: number]: string;
}
