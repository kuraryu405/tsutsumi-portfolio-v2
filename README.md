# tsutsumi-portfolio-v2

つつみんのポートフォリオサイトです。画面に表示する作品、コミュニティ、相互リンク、SNSは `src/data/portfolio.js` で管理します。

## 相互リンクを追加する

相互リンクは `src/data/portfolio.js` の `mutualLinks` に追加します。`id` は重複しない値にしてください。

### 特定のコミュニティに属する人

`orbit.type` を `affiliation` にして、`orbit.id` に `affiliations` 内のコミュニティIDを指定します。

```js
{
  id: "friend-id",
  orbit: { type: "affiliation", id: "geeken" },
  href: "https://example.com/",
  title: "Friend Name",
  relationship: "FRIEND / ENGINEER",
  image: "/images/friend-id.jpg",
  imageWidth: 1200,
  imageHeight: 630,
  imageWidths: [128, 256],
}
```

この設定では、指定したコミュニティ惑星の周囲を衛星として公転します。`orbit.id` は必ず `affiliations` に存在する `id` と一致させてください。

### どのコミュニティにも属さない人

`orbit.type` を `system` にします。

```js
{
  id: "independent-friend",
  orbit: { type: "system" },
  href: "https://example.com/",
  title: "Friend Name",
  relationship: "INDEPENDENT / FRIEND",
  image: "/images/independent-friend.jpg",
  imageWidth: 1200,
  imageHeight: 630,
  imageWidths: [128, 256],
}
```

この設定では、特定のコミュニティではなくCOMMUNITYフィールド全体の外周を公転します。

### 画像について

- 本人から提供された画像など、使用許可のある実在画像を使います。
- 元画像は `public/images/` に置きます。
- `imageWidth` と `imageHeight` には元画像の実寸を指定します。
- 軽量版を使う場合は、`public/images/optimized/` に `{ファイル名}-128.avif`、`-128.webp`、`-256.avif`、`-256.webp` を用意し、`imageWidths: [128, 256]` を指定します。

現在の `independent-demo` は所属なし衛星の見た目を確認するためのデモです。実際の相互リンクを追加するときに置き換えるか、不要なら項目ごと削除してください。デモだけが使う `external: false` と `ariaLabel` は通常の外部リンクでは不要です。
