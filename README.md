# plateau-diorama

PLATEAU をベースにした Web ジオラマビューアです。

## Stack

- TypeScript
- Three.js
- Vite
- GitHub Pages

## Development

```bash
npm install
npm run dev
```

## Controls

- `W / A / S / D`: 地面方向にカメラ移動
- 左ドラッグ: カメラ回転
- 右ドラッグ: パン
- マウスホイール: ズームイン / ズームアウト

## Repository data

現時点では `public/data/scene.json` を起動時に自動ロードして表示します。
PLATEAU / CityGML の読み込み処理は `src/data` 配下に追加し、Viewer / Camera の実装とは分離する想定です。

## GitHub Pages

`.github/workflows/pages.yml` を含めています。GitHub の **Settings > Pages > Build and deployment > Source** を **GitHub Actions** にすると、`main` への push でデプロイされます。
