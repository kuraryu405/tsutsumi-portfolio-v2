export const works = [
  {
    slug: "portfolio",
    href: "https://kuraryu.jp",
    title: "Portfolio",
    image: "/images/portfolio.png",
    imageWidth: 1696,
    imageHeight: 1230,
    imageWidths: [480, 960, 1600],
    description: "自己紹介のために作ったポートフォリオ。",
    detailCopy: "今の自分を、次の自分へ渡す。",
    type: "Web design / Development",
    year: "2024",
    position: ["29%", "22%"],
    focus: "50% 44%",
  },
  {
    slug: "happa",
    href: "https://kuraryu.jp/Happa",
    title: "Happa",
    image: "/images/Happalogo.png",
    imageWidth: 2816,
    imageHeight: 1536,
    imageWidths: [480, 960, 1600, 2048],
    description:
      "友達との飲み会や合宿で、聞けなかったことを匿名で聞ける質問Webゲーム。",
    detailCopy: "聞けなかったこと、化けて聞こう。",
    type: "Web game / Full stack",
    year: "2024",
    position: ["72%", "14%"],
    focus: "50% 50%",
  },
  {
    slug: "long-long-url",
    href: "https://kuraryu.jp/long-long-url",
    title: "long-long-url",
    image: "/images/longurl.png",
    imageWidth: 1731,
    imageHeight: 909,
    imageWidths: [480, 960, 1600],
    description:
      "URLを意味もなく長くする、日常を少しだけ不便にするためのWeb実験。",
    detailCopy: "便利すぎる日常に、ひとつ無駄を。",
    type: "Web experiment",
    year: "2024",
    position: ["80%", "66%"],
    focus: "50% 50%",
  },
  {
    slug: "iniad-quest",
    href: "https://kuraryu.jp/iniad-quest/",
    title: "INIAD Quest",
    image: "/images/INIAD-Quest.jpg",
    imageWidth: 1731,
    imageHeight: 909,
    imageWidths: [480, 960, 1600],
    description:
      "INIAD生の学習支援として試験の模擬問題など学内からアクセスできる情報をもとオリジナル問題作成したサイトです。",
    detailCopy: "解くほど、次に進みたくなる学習を。",
    type: "Learning support",
    year: "2025",
    position: ["34%", "70%"],
    focus: "50% 48%",
  },
];

export const hobbies = [
  {
    image: "/images/ueda.webp",
    imageWidth: 2048,
    imageHeight: 1536,
    imageWidths: [480, 960, 1600],
    title: "Photography",
    label: "PHOTOGRAPHY",
    text: "光と空気ごと残せる写真が好き。次に狙っているのは1DX。",
  },
  {
    image: "/images/pc.webp",
    imageWidth: 4096,
    imageHeight: 3072,
    imageWidths: [480, 960, 1600, 2048],
    title: "Computers",
    label: "PC",
    text: "自作PCはArch Linux。MacBookとVivoBookも、用途ごとに使い分ける。",
  },
  {
    image: "/images/euphonium.webp",
    imageWidth: 1532,
    imageHeight: 1008,
    imageWidths: [480, 960],
    title: "Euphonium",
    label: "EUPHONIUM",
    text: "大学の吹奏楽サークルで、低くて温かい音を鳴らしています。",
  },
  {
    image: "/images/karaoke.webp",
    imageWidth: 2048,
    imageHeight: 1536,
    imageWidths: [480, 960, 1600, 2048],
    title: "Music",
    label: "KARAOKE",
    text: "歌うことも、オルタナティブを聴くことも。時速36kmが好き。",
  },
];

export const affiliations = [
  {
    id: "tekunotes",
    href: "https://tekunotes.com",
    title: "TEKUNOTES",
    image: "/images/tekunotes.webp",
    imageWidth: 5000,
    imageHeight: 2831,
    imageWidths: [128, 256, 480],
    description: "ガジェットを、使った言葉で伝える。",
  },
  {
    id: "tgr",
    href: "https://tgrgroup.jp",
    title: "TGR",
    image: "/images/tgr-color.min.svg",
    imageWidth: 1024,
    imageHeight: 1024,
    imageWidths: [],
    description: "学生同士で、つくる熱をつなぐ。",
  },
  {
    id: "geeken",
    href: "https://geeken-iniad.org/",
    title: "GeeKen",
    image: "/images/geeken.png",
    imageWidth: 200,
    imageHeight: 200,
    imageWidths: [128, 200],
    description: "大学の技術系サークルで動く。",
  },
];

/**
 * 相互リンクの追加先。
 *
 * - 特定コミュニティの衛星:
 *   orbit: { type: "affiliation", id: "<affiliations内のid>" }
 * - どこにも属さず、コミュニティ全体の外周を回る衛星:
 *   orbit: { type: "system" }
 *
 * 本番の相互リンクでは実在するURLと本人の画像を使い、`external` は省略する。
 * `independent-demo` は所属なし表示を確認するためのデモなので、本番データ追加時に
 * 置き換えるか、不要なら項目ごと削除する。詳しくは README.md を参照。
 */
export const mutualLinks = [
  {
    id: "yuki-matsuda",
    orbit: { type: "affiliation", id: "geeken" },
    href: "https://me.tenelol.dev/",
    title: "Yuki Matsuda",
    relationship: "FRIEND / ENGINEER",
    image: "/images/yukimatsuda.jpg",
    imageWidth: 1200,
    imageHeight: 630,
    imageWidths: [128, 256],
  },
  {
    id: "independent-demo",
    orbit: { type: "system" },
    href: "#links",
    external: false,
    title: "Demo Friend",
    relationship: "INDEPENDENT / DEMO",
    image: "/images/gf.webp",
    imageWidth: 1366,
    imageHeight: 2048,
    imageWidths: [128, 256],
    ariaLabel: "所属なし相互リンクの表示デモ",
  },
];

export const socialLinks = [
  {
    href: "https://x.com/tsutsumin_dev",
    title: "X",
    handle: "@tsutsumin_dev",
    image: "/images/x.svg",
    imageWidth: 24,
    imageHeight: 24,
    imageWidths: [],
  },
  {
    href: "https://github.com/kuraryu405",
    title: "GitHub",
    handle: "kuraryu405",
    image: "/images/github.svg",
    imageWidth: 24,
    imageHeight: 24,
    imageWidths: [],
  },
  {
    href: "https://qiita.com/kuraryu405",
    title: "Qiita",
    handle: "kuraryu405",
    image: "/images/qiita-icon.png",
    imageWidth: 300,
    imageHeight: 300,
    imageWidths: [48, 96, 192],
  },
];

export const sections = [
  ["intro", "INTRO"],
  ["profile", "PROFILE"],
  ["works", "WORKS"],
  ["project", "PROJECT"],
  ["about", "ABOUT"],
  ["affiliations", "COMMUNITY"],
  ["links", "LINKS"],
];
