# Auto Close Video Tab - 動画自動クローズ拡張機能

動画再生終了後に自動的にタブを閉じるChrome拡張機能です。連続で動画を視聴する際の手間を省きます。

## 機能

- **動画再生終了時の自動タブクローズ**
  - 動画の再生が終了すると、自動的にそのタブを閉じます
  - 動画を連続で見るときの手間を省きます

- **簡単な有効/無効切り替え**
  - ツールバーのアイコンをクリックするだけで機能のON/OFFを切り替えられます
  - 状態はブラウザを閉じても保持されます

- **URLごとの設定**
  - `default_sites.json`で設定された対象URLに対して機能を適用します
  - 特定のページでのみ機能を有効にすることができます（例: YouTube動画視聴ページのみ）

## インストール方法

1. リポジトリをクローン
```bash
git clone https://github.com/ilim0t/video-utils-chrome-extension.git
cd video-utils-chrome-extension
```

2. 依存関係のインストール
```bash
npm install
```

3. 拡張機能のビルド
```bash
npm run build
```

4. Chromeへの読み込み
- Chromeで `chrome://extensions/` を開く
- 右上の「デベロッパーモード」を有効にする
- 「パッケージ化されていない拡張機能を読み込む」をクリックし、`dist` ディレクトリを選択

## 開発

- `npm run build` - 拡張機能のビルド
- `npm run lint` - コードのリント
- `npm run format` - コードの整形

## ライセンス

MIT
