# Novel Development Center

AIによる小説制作と、作品の公開・鑑賞・評価を一つにしたWebプラットフォーム。

## 今回追加したもの

- ログイン画面
- 新規会員登録画面
- Supabase Auth接続の土台
- マイページ
- 小説作成画面
- 公開/下書き設定
- 作品一覧
- 作品詳細ページ
- 作品評価UIの土台
- 作者表示・閲覧数・いいね数UI

## 重要

現在の作品一覧はデモデータです。実際のユーザー作品、本文、評価、コメントなどはSupabase Databaseへ接続する次の段階で実装します。

## Supabase

`.env.example` を `.env` にコピーし、SupabaseのProject URLとAnon Keyを設定してください。

```env
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

その後、

```bash
npm install
npm run dev
```

## 次の実装

1. Supabase Database
2. users/profiles
3. works
4. chapters
5. ratings
6. likes
7. comments
8. favorites
9. 公開/非公開
10. AI生成
11. AIによる作品設定・キャラクター・プロット・本文生成
12. 長編作品のコンテキスト管理
