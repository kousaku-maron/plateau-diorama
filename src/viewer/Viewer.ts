import {
  ACESFilmicToneMapping,
  AmbientLight,
  Box3,
  Color,
  DirectionalLight,
  GridHelper,
  Group,
  PerspectiveCamera,
  Scene,
  SRGBColorSpace,
  Vector3,
  WebGLRenderer,
} from 'three';
import { CameraController } from './CameraController';

export class Viewer {
  private readonly scene = new Scene();
  private readonly camera = new PerspectiveCamera(50, 1, 0.1, 50_000);
  private readonly renderer: WebGLRenderer;
  private readonly cameraController: CameraController;
  private readonly viewport: HTMLDivElement;
  private readonly status: HTMLSpanElement;
  private readonly contentRoot = new Group();
  private readonly resizeObserver: ResizeObserver;
  private currentContent: Group | null = null;
  private animationFrame = 0;

  constructor(private readonly root: HTMLElement) {
    root.innerHTML = this.template();

    const viewport = root.querySelector<HTMLDivElement>('[data-viewport]');
    const status = root.querySelector<HTMLSpanElement>('[data-status]');

    if (!viewport || !status) {
      throw new Error('Viewer elements were not found.');
    }

    this.viewport = viewport;
    this.status = status;
    this.renderer = new WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.outputColorSpace = SRGBColorSpace;
    this.renderer.toneMapping = ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;
    this.renderer.shadowMap.enabled = true;
    this.viewport.append(this.renderer.domElement);

    this.scene.background = new Color('#101418');
    this.scene.add(this.contentRoot);
    this.scene.add(new GridHelper(2000, 200, '#56616a', '#2c343a'));

    const ambientLight = new AmbientLight(0xffffff, 1.6);
    const sun = new DirectionalLight(0xffffff, 3.2);
    sun.position.set(160, 240, 120);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    this.scene.add(ambientLight, sun);

    this.camera.position.set(180, 140, 180);
    this.cameraController = new CameraController(this.camera, this.renderer.domElement);
    this.cameraController.controls.target.set(0, 12, 0);
    this.cameraController.controls.update();

    this.resizeObserver = new ResizeObserver(this.resize);
    this.resizeObserver.observe(this.viewport);
    this.animate();
  }

  setContent(content: Group): void {
    if (this.currentContent) {
      this.contentRoot.remove(this.currentContent);
    }

    this.currentContent = content;
    this.contentRoot.add(content);
    this.fitToContent();
  }

  setStatus(message: string): void {
    this.status.textContent = message;
  }

  private fitToContent(): void {
    if (!this.currentContent) return;

    const bounds = new Box3().setFromObject(this.currentContent);
    if (bounds.isEmpty()) return;

    const size = bounds.getSize(new Vector3());
    const center = bounds.getCenter(new Vector3());
    const radius = Math.max(size.x, size.y, size.z, 1);

    this.camera.position.copy(center).add(new Vector3(radius, radius * 0.8, radius));
    this.cameraController.controls.target.copy(center);
    this.cameraController.controls.update();
  }

  private readonly resize = (): void => {
    const width = this.viewport.clientWidth;
    const height = this.viewport.clientHeight;

    if (width === 0 || height === 0) return;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height, false);
  };

  private readonly animate = (): void => {
    this.animationFrame = requestAnimationFrame(this.animate);
    this.cameraController.update();
    this.renderer.render(this.scene, this.camera);
  };

  private template(): string {
    return `
      <main class="viewer-shell">
        <div class="viewer-header">
          <div>
            <strong>PLATEAU Diorama</strong>
            <span data-status>loading repository data...</span>
          </div>
          <div class="controls-help">
            <span>WASD move</span>
            <span>drag rotate</span>
            <span>wheel zoom</span>
          </div>
        </div>
        <div class="viewport" data-viewport></div>
      </main>
    `;
  }
}
