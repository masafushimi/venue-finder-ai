# Venue Finder AI - デプロイメントガイド

## プロジェクト概要
AI搭載の会議室・コワーキングスペース検索アプリケーションです。OpenAIのGPT-4o-miniを使用して、ユーザーの要望に基づいて最適な施設をレコメンドします。

## デプロイメント手順

### 1. Vercelへのデプロイ

#### 前提条件
- Vercelアカウント
- OpenAI API キー

#### 手順

1. **Vercel CLIのインストール**
   ```bash
   npm i -g vercel
   ```

2. **プロジェクトのデプロイ**
   ```bash
   vercel
   ```

3. **環境変数の設定**
   - Vercelダッシュボードでプロジェクトを開く
   - Settings > Environment Variables
   - `OPENAI_API_KEY` を追加（値は実際のAPIキー）

4. **再デプロイ**
   ```bash
   vercel --prod
   ```

### 2. 手動デプロイ（GitHub連携）

1. **GitHubリポジトリにプッシュ**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Vercelでプロジェクトをインポート**
   - Vercelダッシュボードで「New Project」
   - GitHubリポジトリを選択
   - 環境変数 `OPENAI_API_KEY` を設定
   - Deploy

## プロジェクト構造

```
venue-finder-ai/
├── api/
│   └── server.js          # メインサーバーファイル
├── public/
│   └── index.html         # フロントエンド
├── package.json           # 依存関係
├── vercel.json           # Vercel設定
└── README.md
```

## 機能

- **AI チャット**: OpenAI GPT-4o-miniを使用した自然言語での会話
- **施設レコメンド**: ユーザーの条件に基づいた最適な施設の提案
- **レスポンシブデザイン**: モバイル・デスクトップ対応
- **リアルタイム検索**: 会話形式での条件ヒアリング

## 利用可能な施設

- 丸の内ビジネスセンター（貸し会議室）
- 渋谷コワーキングスペース
- 品川プレミアムホール（貸し会議室）
- 新宿フレックスオフィス（レンタルオフィス）
- 六本木エグゼクティブスペース（貸し会議室）
- 池袋スマートオフィス（コワーキングスペース）

## トラブルシューティング

### よくある問題

1. **OpenAI API キーエラー**
   - 環境変数が正しく設定されているか確認
   - API キーが有効か確認

2. **デプロイエラー**
   - `vercel.json` の設定を確認
   - Node.js バージョンが18以上か確認

3. **CORS エラー**
   - フロントエンドとバックエンドのURLが一致しているか確認

## 開発環境での実行

```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev

# 本番サーバーの起動
npm start
```

## カスタマイズ

### 施設データの追加
`api/server.js` の `venues` 配列に新しい施設を追加できます。

### AI プロンプトの調整
`systemPrompt` 変数を編集して、AIの応答をカスタマイズできます。

### スタイルの変更
`public/index.html` のCSSセクションを編集してデザインを変更できます。
