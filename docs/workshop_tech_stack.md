# 技術スタック移行計画

## 現状の構成

- 単一JSXファイル（workshop-generator.jsx）にデータ+ロジック+UI全部入り
- Vercelにデプロイ済み: https://workshop-project-mocha.vercel.app/
- バイブコーディング（Claudeとの対話）で開発
- プログラミング経験は少ない開発者

---

## 移行の判断基準

### 現状のまま（単一JSX）で可能なこと
- カリキュラム自動生成（現在の機能）
- PDF出力（ブラウザ側で生成）
- LocalStorageによるカリキュラム保存
- URLパラメータによる共有リンク

### 現状では不可能・危険なこと（移行が必要）
- ユーザーアカウント・認証
- データベース（履歴保存、お気に入り）
- Claude API連携（単一JSXではAPIキーがブラウザに露出して危険）
- 複数ページ構成（進行モード、ライブラリ画面）→ 1ファイルが肥大化
- 効果測定アンケート
- テンプレート共有コミュニティ

### 移行タイミング
**Phase 1（PDF出力・保存・共有リンク）まではこのままでOK。Phase 2に入る前にNext.jsに移行する。**

---

## 移行先の技術スタック

```
Next.js (App Router)     ← フレームワーク
├── Vercel               ← ホスティング（今と同じ。そのまま使える）
├── Tailwind CSS         ← スタイリング
├── Supabase             ← 認証 + データベース + ストレージ
└── Claude API           ← サーバー側Route Handlersで安全に呼ぶ
```

### 選定理由

| 技術 | なぜこれか |
|------|-----------|
| Next.js (App Router) | Vercelが作ったフレームワーク。今のVercel環境でそのままデプロイできる。ページ分割・サーバー処理・API連携が自然にできる |
| Tailwind CSS | 現在のインラインスタイル(style={{...}})を整理できる。Claudeが最も正確にコード生成できるCSSフレームワーク。クラス名だけでデザインが完結する |
| Supabase | Firebase的なBaaS。認証・DB・ストレージが全部入り。無料枠で十分始められる。日本語ドキュメントも充実。PostgreSQLベースで将来の拡張性も高い |
| Claude API (server-side) | Next.jsのRoute Handlers経由で呼ぶことでAPIキーをサーバー側に隠せる。ブラウザには一切露出しない |

### バイブコーディングとの相性
Next.js + Tailwind CSS は、Claudeが最も正確にコード生成できる組み合わせ。「○○な画面を作って」と指示するだけで、ほぼ動くコードが出てくる。

---

## 移行手順（3ステップ）

### ステップ1: 土台を作り、今のコードをそのまま動かす

1. Next.jsプロジェクトを新規作成
2. Tailwind CSSを初期設定
3. 今の`workshop-generator.jsx`の中身をほぼそのまま`app/page.tsx`にコピー
4. インラインスタイルをTailwindクラスに段階的に置き換え
5. Vercelに接続してデプロイ確認

**この段階では見た目は何も変わらない。土台だけ変える。**

### ステップ2: ファイルを分割する

```
app/
├── page.tsx                  ← トップページ（ヒーロー + 入力フォーム）
├── result/page.tsx           ← 生成結果画面（タイムライン + 詳細）
├── library/page.tsx          ← エクササイズライブラリ（検索・フィルター）
├── presenter/page.tsx        ← 進行モード（タイマー付きプロンプター）
├── api/
│   └── generate/route.ts     ← カリキュラム生成API（将来Claude API連携）
├── components/
│   ├── Timeline.tsx          ← タイムライン表示コンポーネント
│   ├── ExerciseCard.tsx      ← エクササイズカード
│   ├── InputStepper.tsx      ← 入力フォーム（ステッパーUI）
│   └── PresenterView.tsx     ← 進行モード表示
├── data/
│   └── exercises.ts          ← エクササイズデータ（今JSXに直書きしているもの）
└── lib/
    └── curriculum.ts         ← カリキュラム生成ロジック
```

**分割ルール:**
- データ（exercises.ts）→ `data/` に分離
- ロジック（generateCurriculum関数）→ `lib/` に分離
- UI部品 → `components/` に分離
- 各ページ → `app/○○/page.tsx` に配置

### ステップ3: 機能を段階的に追加

| 順番 | 機能 | 使う技術 |
|------|------|----------|
| 1 | PDF出力 | html2canvas + jsPDF（ブラウザ側） |
| 2 | LocalStorage保存 | ブラウザ標準API |
| 3 | 共有リンク | URLパラメータ or 短縮URL |
| 4 | Supabase接続 | ユーザー認証 + カリキュラム保存DB |
| 5 | Claude API連携 | Route Handlers経由でサーバー側処理 |
| 6 | 進行モード | 専用ページ + タイマーロジック |

---

## Next.jsプロジェクト作成コマンド

```bash
npx create-next-app@latest workshop-app --typescript --tailwind --eslint --app --src-dir=false --import-alias="@/*"
```

このコマンドで以下が自動セットアップされる:
- TypeScript（型チェックでバグを防ぐ）
- Tailwind CSS（スタイリング）
- ESLint（コード品質チェック）
- App Router（最新のルーティング方式）

---

## Supabase導入手順（Phase 2で実施）

1. supabase.com でアカウント作成（GitHub連携で即時）
2. 新規プロジェクト作成
3. `npm install @supabase/supabase-js` でライブラリ追加
4. 環境変数にURLとキーを設定（.env.local）
5. 認証UI → Supabase Auth UI（ログイン画面を自動生成してくれる）

### データベーステーブル設計（想定）

```sql
-- ユーザーのカリキュラム保存
curricula:
  id, user_id, title, params(json), exercises(json), created_at

-- お気に入りエクササイズ
favorites:
  id, user_id, exercise_name, created_at

-- ワークショップ実施記録
sessions:
  id, user_id, curriculum_id, conducted_at, feedback(json)
```

---

## 移行時の注意点

### やること
- 現在のVercelプロジェクトをそのまま使う（新規リポジトリに接続し直すだけ）
- 移行中も旧バージョンは公開したまま維持
- Git管理を開始する（バージョン管理でいつでも戻せるようにする）

### やらないこと
- 一気に全機能を移行しない（まず動く状態を作ってから段階的に改善）
- TypeScriptの型定義を完璧にしようとしない（最初はanyでもOK、動くことが優先）
- テストを最初から書かない（まずは動くものを作ることに集中）

---

## ロードマップとの対応

| フェーズ | 技術スタック | やること |
|----------|-------------|---------|
| Phase 1（現状のまま） | 単一JSX + Vercel | PDF出力、LocalStorage保存、共有リンク |
| Phase 1.5（移行） | Next.js + Tailwind + Vercel | 土台移行、ファイル分割、デザイントークン統一 |
| Phase 2 | + Supabase | 認証、DB保存、進行モード、ライブラリ画面 |
| Phase 3 | + Claude API | AI最適化、自然言語カスタマイズ、効果測定 |

---

*作成日: 2026-03-28*
