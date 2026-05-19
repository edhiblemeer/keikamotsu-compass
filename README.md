# 軽貨物コンパス (keikamotsu-compass)

軽貨物業者比較ランキングメディア。 千葉船橋エリアを中心に、公開情報15項目で機械的に採点した業者ランキングを提供。

## 運営

株式会社EST FORT (https://boost-sys.vercel.app/disclosure/related-entities)

## 技術スタック

- Next.js 16 (App Router) + React 19
- Tailwind CSS 4
- gray-matter + remark + remark-gfm + remark-html (Markdown レンダリング)
- Vercel ホスティング

## 記事

`articles/*.md` に Markdown + YAML front-matter で記述。
ファイル名 = 記事の slug (URL の `/articles/[slug]` に対応)。

## ローカル開発

```bash
npm install
npm run dev
```

http://localhost:3000

## ビルド

```bash
npm run build
npm start
```

## 関連法人開示 (景表法・ステマ規制対応)

掲載業者の一社「株式会社ブースト」は当メディア運営会社と代表取締役を同じくする関連法人です (資本関係なし)。 詳細: https://boost-sys.vercel.app/disclosure/related-entities
