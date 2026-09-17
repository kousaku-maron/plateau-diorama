import './styles.css';
import { loadRepositoryScene } from './data/loadRepositoryScene';
import { Viewer } from './viewer/Viewer';

const root = document.querySelector<HTMLDivElement>('#app');

if (!root) {
  throw new Error('App root element was not found.');
}

const viewer = new Viewer(root);

try {
  const scene = await loadRepositoryScene();
  viewer.setContent(scene);
  viewer.setStatus('repository data loaded');
} catch (error) {
  console.error(error);
  viewer.setStatus('failed to load repository data');
}
