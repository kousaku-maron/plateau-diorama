import {
  BoxGeometry,
  Group,
  Mesh,
  MeshStandardMaterial,
  PlaneGeometry,
} from 'three';
import type { SceneData } from './sceneTypes';

export async function loadRepositoryScene(): Promise<Group> {
  const response = await fetch(`${import.meta.env.BASE_URL}data/scene.json`);

  if (!response.ok) {
    throw new Error(`Failed to load scene data: ${response.status}`);
  }

  const data = (await response.json()) as SceneData;
  return createScene(data);
}

function createScene(data: SceneData): Group {
  const root = new Group();
  root.name = 'Repository Scene';

  const ground = new Mesh(
    new PlaneGeometry(data.ground.width, data.ground.depth),
    new MeshStandardMaterial({ color: data.ground.color, roughness: 1 }),
  );
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  root.add(ground);

  for (const building of data.buildings) {
    const [width, depth, height] = building.size;
    const [x, z] = building.position;
    const mesh = new Mesh(
      new BoxGeometry(width, height, depth),
      new MeshStandardMaterial({
        color: building.color ?? '#cbd2d8',
        roughness: 0.82,
      }),
    );

    mesh.position.set(x, height / 2, z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    root.add(mesh);
  }

  return root;
}
