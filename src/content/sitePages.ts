export type SitePath = '/' | '/guide/windows' | '/guide/iphone' | '/about/heic' | '/faq';

export interface SiteLink {
  label: string;
  path: SitePath;
}

export interface Section {
  heading: string;
  body: string[];
}

export interface ArticlePage {
  path: Exclude<SitePath, '/'>;
  title: string;
  description: string;
  lead: string;
  sections: Section[];
  links: SiteLink[];
}

export interface HomePageSummary {
  title: string;
  description: string;
  links: SiteLink[];
}

export const HOME_PAGE: HomePageSummary = {
  title: 'heic-flip',
  description: 'HEIC/HEIFをJPG、PNG、WebPへ変換する、画像をアップロードしないブラウザ完結の無料ツールです。',
  links: [
    { label: 'Windowsで開けない', path: '/guide/windows' },
    { label: 'iPhoneの設定', path: '/guide/iphone' },
    { label: 'HEICとは', path: '/about/heic' },
    { label: 'FAQ', path: '/faq' },
  ],
};

export const ARTICLE_PAGES: ArticlePage[] = [
  {
    path: '/guide/windows',
    title: 'WindowsでHEICが開けないときの対処',
    description: 'WindowsでHEICが開けないときの確認点と、変換サイトの使いどころをまとめます。',
    lead: 'Windows側の設定やアプリの相性でHEICが開けないことがあります。まずは開けない理由を切り分けて、必要ならJPGに変換します。',
    sections: [
      {
        heading: 'よくある状況',
        body: [
          'メール添付の写真を開いたら、拡張子はあるのに表示できない。',
          'エクスプローラーのサムネイルは見えるが、ダブルクリックすると失敗する。',
          '画像ビューアが古く、HEICコーデックを持っていない。',
        ],
      },
      {
        heading: 'まず確認すること',
        body: [
          'Microsoft Store の HEIF 画像拡張機能が入っているかを見る。',
          'iPhoneから来た写真がHEICのままかを確認する。',
          '業務で他人に渡すなら、最初からJPGにしておくほうが安全なことが多い。',
        ],
      },
      {
        heading: 'このサイトの使いどころ',
        body: [
          'Windowsで開けないファイルをブラウザにドラッグ&ドロップし、JPGでまとめて出力する。',
          '複数枚をZIPにしておけば、再配布や社内共有が楽になる。',
        ],
      },
    ],
    links: [
      { label: '変換ツールへ戻る', path: '/' },
      { label: 'iPhoneの設定', path: '/guide/iphone' },
      { label: 'HEICとは', path: '/about/heic' },
    ],
  },
  {
    path: '/guide/iphone',
    title: 'iPhoneでHEICを避けたいときの設定',
    description: 'iPhoneでHEICを避ける設定と、普段の運用で気をつける点を整理します。',
    lead: 'iPhoneは標準でHEIC保存が有効になっていることが多いです。今後の撮影をJPG寄りにしたいなら、設定を見直します。',
    sections: [
      {
        heading: '設定の考え方',
        body: [
          '撮るたびに変換するより、最初から互換性の高い形式で保存するほうが楽な場面があります。',
          'ただし容量や画質のバランスは状況で変わるので、すべてをJPGに固定すればよいとは限りません。',
        ],
      },
      {
        heading: '運用の目安',
        body: [
          '家族共有や社内共有が多いなら、後工程の手間を減らすことを優先する。',
          '画質を保ちつつ容量も抑えたいなら、必要なときだけHEICを変換する。',
        ],
      },
      {
        heading: 'このサイトの使いどころ',
        body: [
          '昔の写真や外部から受け取ったHEICは、まとめてJPGにすると扱いやすい。',
          'Web掲載向けならWebP、印刷や共有ならJPGが使いやすい。',
        ],
      },
    ],
    links: [
      { label: '変換ツールへ戻る', path: '/' },
      { label: 'Windowsで開けない', path: '/guide/windows' },
      { label: 'HEICとは', path: '/about/heic' },
    ],
  },
  {
    path: '/about/heic',
    title: 'HEICとは何か',
    description: 'HEIC/HEIFの基本と、JPG/PNG/WebPとの違いをざっくり整理します。',
    lead: 'HEICは高効率な画像形式です。容量を抑えやすい一方で、対応ソフトや端末の差が出やすいので、共有時には注意が要ります。',
    sections: [
      {
        heading: 'ざっくりした位置づけ',
        body: [
          'HEIC/HEIFは、写真を軽く持てるように作られた形式です。',
          'JPGは互換性が広く、PNGは透過に強く、WebPはWeb向けの扱いやすさがあります。',
        ],
      },
      {
        heading: '困りやすい点',
        body: [
          '古いPCや一部のWebサービスでは、HEICのままでは扱えません。',
          '相手側の環境が読めないときは、互換性の高い形式へ変換して渡すほうが安全です。',
        ],
      },
      {
        heading: '使い分け',
        body: [
          '配布・提出ならJPG。',
          '見た目の品質とサイズのバランスを取りたいならWebP。',
          '透過が必要ならPNG。',
        ],
      },
    ],
    links: [
      { label: '変換ツールへ戻る', path: '/' },
      { label: 'Windowsで開けない', path: '/guide/windows' },
      { label: 'FAQ', path: '/faq' },
    ],
  },
  {
    path: '/faq',
    title: 'よくある質問',
    description: 'heic-flipの使い方、対応形式、プライバシー面を短くまとめます。',
    lead: '迷いやすい点だけを先にまとめたFAQです。細かい仕様は変換画面と各ガイドからたどれます。',
    sections: [
      {
        heading: '画像はサーバへ送られますか',
        body: ['送られません。変換はブラウザ内のWASMで行います。'],
      },
      {
        heading: '複数ファイルは扱えますか',
        body: ['扱えます。複数選択またはドラッグ&ドロップで追加し、ZIPでまとめて保存できます。'],
      },
      {
        heading: '対応形式は何ですか',
        body: ['入力はHEIC/HEIF、出力はJPG、PNG、WebPです。'],
      },
      {
        heading: '変換できない場合はどうしますか',
        body: ['ファイル単位で失敗理由を表示します。形式やサイズの問題を確認してください。'],
      },
    ],
    links: [
      { label: '変換ツールへ戻る', path: '/' },
      { label: 'HEICとは', path: '/about/heic' },
      { label: 'Windowsで開けない', path: '/guide/windows' },
    ],
  },
];

export function getArticlePage(path: Exclude<SitePath, '/'>): ArticlePage | undefined {
  return ARTICLE_PAGES.find((page) => page.path === path);
}

export function isSitePath(pathname: string): pathname is SitePath {
  return pathname === '/' || ARTICLE_PAGES.some((page) => page.path === pathname);
}
