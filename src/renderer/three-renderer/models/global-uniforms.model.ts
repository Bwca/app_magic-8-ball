import { Texture } from 'three';

export interface GlobalUniforms {
    time: { value: number };
    textBackgroundVisibility: { value: number };
    textVisibility: { value: number };
    text: { value: Texture | null };
}
