import express from 'express';
import cors from 'cors';
import { OpenAI } from 'openai';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// ミドルウェア
app.use(cors());
app.use(express.json());

// 静的ファイルの配信
app.use(express.static(path.join(__dirname, 'public')));

// OpenAI クライアント
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// 施設データ
const venues = [
  {
    id: 1,
    name: '丸の内ビジネスセンター',
    area: '丸の内',
    capacity: [4, 6, 10, 20],
    price: 3000,
    amenities: ['WiFi', 'プロジェクター', 'ホワイトボード', 'コーヒー'],
    type: '貸し会議室',
    image: 'https://via.placeholder.com/300x200?text=Marunouchi+Center'
  },
  {
    id: 2,
    name: '渋谷コワーキングスペース',
    area: '渋谷',
    capacity: [2, 4, 8],
    price: 1500,
    amenities: ['WiFi', 'ドリンク無料', '打ち合わせスペース'],
    type: 'コワーキングスペース',
    image: 'https://via.placeholder.com/300x200?text=Shibuya+Coworking'
  },
  {
    id: 3,
    name: '品川プレミアムホール',
    area: '品川',
    capacity: [10, 20, 30, 50],
    price: 5000,
    amenities: ['WiFi', 'プロジェクター', '同時通訳', 'カテリング'],
    type: '貸し会議室',
    image: 'https://via.placeholder.com/300x200?text=Shinagawa+Hall'
  },
  {
    id: 4,
    name: '新宿フレックスオフィス',
    area: '新宿',
    capacity: [2, 4, 6, 12],
    price: 2000,
    amenities: ['WiFi', 'プリンター', '受付対応'],
    type: 'レンタルオフィス',
    image: 'https://via.placeholder.com/300x200?text=Shinjuku+Office'
  },
  {
    id: 5,
    name: '六本木エグゼクティブスペース',
    area: '六本木',
    capacity: [6, 10, 15],
    price: 4000,
    amenities: ['WiFi', 'プロジェクター', 'VIP対応', 'カフェ'],
    type: '貸し会議室',
    image: 'https://via.placeholder.com/300x200?text=Roppongi+Executive'
  },
  {
    id: 6,
    name: '池袋スマートオフィス',
    area: '池袋',
    capacity: [2, 4, 8],
    price: 1800,
    amenities: ['WiFi', 'ドリンク', 'フリーデスク'],
    type: 'コワーキングスペース',
    image: 'https://via.placeholder.com/300x200?text=Ikebukuro+Smart'
  }
];

// AI チャット用のシステムプロンプト
const systemPrompt = `あなたは会議室・コワーキングスペースの検索アシスタントです。
ユーザーの要望（人数、予算、場所、設備など）をヒアリングして、最適な施設をレコメンドしてください。

利用可能な施設情報：
${JSON.stringify(venues, null, 2)}

ユーザーの条件に基づいて、最適な施設を3〜5件レコメンドしてください。
レコメンドする際は、各施設の特徴と、ユーザーの条件との合致点を説明してください。

レコメンド結果は以下のJSON形式で返してください：
{
  "message": "レコメンドメッセージ",
  "recommendations": [
    {
      "id": 施設ID,
      "name": "施設名",
      "reason": "レコメンド理由"
    }
  ]
}`;

// チャットエンドポイント
app.post('/api/chat', async (req, res) => {
  try {
    const { message, conversationHistory } = req.body;

    // 会話履歴を構築
    const messages = [
      ...conversationHistory,
      { role: 'user', content: message }
    ];

    // OpenAI API を呼び出し
    const response = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages
      ],
      temperature: 0.7,
      max_tokens: 1000
    });

    const assistantMessage = response.choices[0].message.content;

    // JSON形式のレコメンド結果を抽出
    let parsedResponse = { message: assistantMessage, recommendations: [] };
    try {
      const jsonMatch = assistantMessage.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedResponse = JSON.parse(jsonMatch[0]);
      }
    } catch (e) {
      // JSON解析失敗時は、そのままメッセージを返す
      parsedResponse = { message: assistantMessage, recommendations: [] };
    }

    res.json({
      message: parsedResponse.message,
      recommendations: parsedResponse.recommendations || [],
      conversationHistory: [
        ...messages,
        { role: 'assistant', content: assistantMessage }
      ]
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'チャット処理中にエラーが発生しました' });
  }
});

// 施設詳細エンドポイント
app.get('/api/venues/:id', (req, res) => {
  const venue = venues.find(v => v.id === parseInt(req.params.id));
  if (venue) {
    res.json(venue);
  } else {
    res.status(404).json({ error: '施設が見つかりません' });
  }
});

// 全施設リストエンドポイント
app.get('/api/venues', (req, res) => {
  res.json(venues);
});

// ルートエンドポイント（SPA対応）
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 404 対応（SPA用）
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Vercel serverless function export
export default app;
