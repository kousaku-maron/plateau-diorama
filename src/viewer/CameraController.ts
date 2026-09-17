import { Clock, PerspectiveCamera, Vector3 } from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const UP = new Vector3(0, 1, 0);

export class CameraController {
  readonly controls: OrbitControls;

  private readonly pressedKeys = new Set<string>();
  private readonly clock = new Clock();
  private readonly forward = new Vector3();
  private readonly right = new Vector3();
  private readonly movement = new Vector3();

  constructor(
    private readonly camera: PerspectiveCamera,
    element: HTMLElement,
  ) {
    this.controls = new OrbitControls(camera, element);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.08;
    this.controls.screenSpacePanning = true;
    this.controls.zoomToCursor = true;
    this.controls.minDistance = 2;
    this.controls.maxDistance = 20_000;

    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);
    window.addEventListener('blur', this.handleBlur);
  }

  update(): void {
    const deltaSeconds = Math.min(this.clock.getDelta(), 0.05);
    this.updateKeyboardMovement(deltaSeconds);
    this.controls.update();
  }

  dispose(): void {
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keyup', this.handleKeyUp);
    window.removeEventListener('blur', this.handleBlur);
    this.controls.dispose();
  }

  private updateKeyboardMovement(deltaSeconds: number): void {
    const horizontal = Number(this.pressedKeys.has('KeyD')) - Number(this.pressedKeys.has('KeyA'));
    const vertical = Number(this.pressedKeys.has('KeyW')) - Number(this.pressedKeys.has('KeyS'));

    if (horizontal === 0 && vertical === 0) return;

    this.camera.getWorldDirection(this.forward);
    this.forward.y = 0;

    if (this.forward.lengthSq() < 0.0001) {
      this.forward.set(0, 0, -1);
    } else {
      this.forward.normalize();
    }

    this.right.crossVectors(this.forward, UP).normalize();
    this.movement
      .set(0, 0, 0)
      .addScaledVector(this.forward, vertical)
      .addScaledVector(this.right, horizontal)
      .normalize();

    const distance = this.camera.position.distanceTo(this.controls.target);
    const speed = Math.max(8, distance * 0.75);
    const step = speed * deltaSeconds;

    this.camera.position.addScaledVector(this.movement, step);
    this.controls.target.addScaledVector(this.movement, step);
  }

  private readonly handleKeyDown = (event: KeyboardEvent): void => {
    if (event.code === 'KeyW' || event.code === 'KeyA' || event.code === 'KeyS' || event.code === 'KeyD') {
      this.pressedKeys.add(event.code);
    }
  };

  private readonly handleKeyUp = (event: KeyboardEvent): void => {
    this.pressedKeys.delete(event.code);
  };

  private readonly handleBlur = (): void => {
    this.pressedKeys.clear();
  };
}
