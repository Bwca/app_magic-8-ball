import { Camera } from 'three';

export class OrbitControls {
    constructor(object: Camera, domElement?: HTMLElement);
    enablePan: boolean;
    enableDamping: boolean;
    minDistance: number;
    maxDistance: number;
    update(): boolean;
}
