# シンプルQRコードリーダー

[![PWA Compatible](https://img.shields.io/badge/PWA-compatible-brightgreen)](https://web.dev/progressive-web-apps/)
[![Built with Solid.js](https://img.shields.io/badge/Built%20with-Solid.js-blue)](https://www.solidjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.9%2B-blue)](https://www.typescriptlang.org/)

## 🌟 特徴

- **オフライン対応**: PWA技術により、インターネット接続がなくても完全に動作
- **複数の読み取り方法**: カメラからのリアルタイムスキャンとファイルアップロードに対応
- **スマートコンテンツ検出**: URL、メールアドレス、電話番号などを自動検出し適切なアクション提供
- **履歴機能**: スキャン結果を自動的に保存し、後で参照可能（最大1000件）
- **軽量設計**: 最小限のリソースで高速に動作
- **プライバシー重視**: すべての処理はブラウザ内で完結、データが外部に送信されることはありません

## 📱 使用方法

1. **カメラでスキャン**:
   - 「カメラで読み取る」タブを選択
   - 「スキャン開始」ボタンをクリック
   - QRコードにカメラを向ける
   - 結果が表示され、コンテンツに応じたアクションボタンが利用可能に

2. **ファイルからスキャン**:
   - 「ファイルをアップロード」タブを選択
   - 画像ファイルを選択
   - QRコードが検出され、結果が表示される

3. **履歴の参照**:
   - 「履歴」タブで過去のスキャン結果を確認
   - 不要な履歴は個別または一括で削除可能

## 🔧 技術スタック

- **フロントエンド**: [Solid.js](https://www.solidjs.com/) + [TypeScript](https://www.typescriptlang.org/)
- **QRコード処理**: [zxing-wasm](https://github.com/Sec-ant/zxing-wasm) - WebAssemblyによる高速なQRコード処理
- **ルーティング**: [@generouted/solid-router](https://github.com/oedotme/generouted) - ファイルベースのルーティング
- **データ保存**: [IndexedDB](https://developer.mozilla.org/docs/Web/API/IndexedDB_API) + [@idxdb/promised](https://github.com/dexie/Dexie.js) - ローカルデータベース
- **スタイリング**: [Matcha.css](https://matcha.mizu.sh/) - クラスレスCSS
- **オフライン対応**: [Vite-PWA](https://vite-pwa-org.netlify.app/) - サービスワーカーとPWA機能

## 🚀 インストール方法

### Webアプリとして

1. [アプリケーションURL]にアクセス
2. モバイルデバイスの場合は「ホーム画面に追加」
3. デスクトップの場合はブラウザの「インストール」ボタンをクリック

### 開発環境のセットアップ

```bash
# リポジトリをクローン
git clone https://github.com/yourusername/simple-qr-reader.git
cd simple-qr-reader

# 依存関係のインストール
npm install

# 開発サーバー起動
npm run dev

# 本番ビルド
npm run build
```

## 📱 PWA機能

このアプリケーションはPWA（Progressive Web App）として実装されており、以下の機能を提供します：

- **オフライン動作**: インターネット接続がなくても完全に機能
- **インストール可能**: ホーム画面やデスクトップに追加可能
- **高速ロード**: 必要なアセットをキャッシュし、高速に起動
- **自動更新**: 新バージョンがリリースされると自動的に更新

最初にアプリを読み込んだ後は、ネットワーク接続がなくても使用できるように必要なリソースがすべてキャッシュされます。

## 🔒 プライバシーとセキュリティ

- すべての処理はユーザーのデバイス上で行われ、データが外部サーバーに送信されることはありません
- カメラ画像やスキャン結果はローカルのIndexedDBにのみ保存されます
- [カメラへのアクセス許可が必要です]

## 🤝 貢献方法

1. このリポジトリをフォーク
2. 機能ブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add some amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成

## 📜 ライセンス

このプロジェクトはMITライセンスの下で公開されています。詳細は[LICENSE](LICENSE)ファイルを参照してください。

## 📞 サポート

質問や問題がある場合は、GitHubのIssueセクションに投稿してください。

---

**プライバシーを重視**したオープンソースプロジェクトです。使用データは常にあなたのデバイス内に保持され、外部に送信されることはありません。
