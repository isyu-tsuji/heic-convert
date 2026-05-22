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
  title: 'HEIC JPG 変換',
  description:
    'iPhone写真がWindowsで開けないときに、HEIC/HEIFをJPG、PNG、WebPへ変換できます。画像をアップロードせずブラウザ内で処理します。',
  links: [
    { label: 'iPhone写真が開けない', path: '/guide/windows' },
    { label: 'JPG保存の設定', path: '/guide/iphone' },
    { label: 'HEICとは', path: '/about/heic' },
    { label: 'FAQ', path: '/faq' },
  ],
};

export const ARTICLE_PAGES: ArticlePage[] = [
  {
    path: '/guide/windows',
    title: 'iPhoneの写真がWindowsで開けないときの対処',
    description:
      'iPhoneの写真がWindowsやパソコンで開けないときの原因と、HEICをJPGに変換する方法をまとめます。',
    lead:
      'iPhoneから送った写真がWindowsで開けない場合、原因のひとつはHEIC形式です。まずは表示できない理由を切り分けて、必要ならJPGに変換します。',
    sections: [
      {
        heading: 'よくある状況',
        body: [
          'iPhoneの写真をWindowsパソコンに送ったら、画像ファイルなのに開けない。',
          'メール添付やUSBコピーでは見えるのに、写真アプリで表示できない。',
          '拡張子が.heicや.heifになっていて、普段のJPG写真と同じように扱えない。',
        ],
      },
      {
        heading: 'まず確認すること',
        body: [
          'ファイル名の最後が.heicまたは.heifになっているか確認する。',
          'Windows側にHEIF画像拡張機能が入っているかを見る。',
          '相手に提出・共有する写真なら、互換性の高いJPGに変換してから渡すほうが迷いにくい。',
        ],
      },
      {
        heading: 'このサイトの使いどころ',
        body: [
          'Windowsで開けないiPhone写真をブラウザにドラッグ&ドロップし、JPGでまとめて出力する。',
          '複数のHEIC写真を一括変換してZIP保存できるので、仕事や家族共有でも扱いやすい。',
          '画像はこの端末のブラウザ内で処理し、変換のためにサーバへアップロードしません。',
        ],
      },
    ],
    links: [
      { label: '変換ツールへ戻る', path: '/' },
      { label: 'JPG保存の設定', path: '/guide/iphone' },
      { label: 'HEICとは', path: '/about/heic' },
    ],
  },
  {
    path: '/guide/iphone',
    title: 'iPhoneの写真をJPGで保存・変換する方法',
    description:
      'iPhoneの写真をJPGで保存したいときの設定と、すでにあるHEIC写真をJPGへ変換する方法を整理します。',
    lead:
      'iPhone写真はHEICで保存されることがあります。Windowsや古いアプリで開けない場合は、今後の保存設定と、手元の写真をJPGに変換する方法を分けて考えます。',
    sections: [
      {
        heading: 'これから撮る写真をJPGにする',
        body: [
          'iPhoneのカメラ設定で互換性を優先すると、これから撮る写真をJPGにできます。',
          '家族や仕事でWindowsパソコンへ写真を渡すことが多いなら、最初からJPGで保存するほうが手間を減らせます。',
        ],
      },
      {
        heading: 'すでにあるHEIC写真を変換する',
        body: [
          '過去に撮った写真や、ほかの人から受け取ったHEIC写真は、設定を変えても自動ではJPGになりません。',
          'その場合はHEICファイルを追加して、JPG、PNG、WebPのどれかへ変換します。',
        ],
      },
      {
        heading: 'このサイトの使いどころ',
        body: [
          'Windowsで開けない写真や、提出先でHEICが使えない写真をJPGへ変換できます。',
          'Web掲載向けならWebP、印刷や共有ならJPG、透過が必要ならPNGが使いやすいです。',
          '複数のiPhone写真をまとめて変換し、ZIPで保存できます。',
        ],
      },
    ],
    links: [
      { label: '変換ツールへ戻る', path: '/' },
      { label: 'iPhone写真が開けない', path: '/guide/windows' },
      { label: 'HEICとは', path: '/about/heic' },
    ],
  },
  {
    path: '/about/heic',
    title: 'HEICとは？iPhone写真が開けない原因とJPGとの違い',
    description:
      'HEIC/HEIFとは何か、iPhone写真がWindowsで開けない理由、JPG/PNG/WebPとの違いを整理します。',
    lead:
      'HEICはiPhoneなどで使われる高効率な画像形式です。容量を抑えやすい一方で、Windowsや一部のサービスでは開けないことがあるため、共有時にはJPG変換が必要になる場合があります。',
    sections: [
      {
        heading: 'HEICとは何か',
        body: [
          'HEIC/HEIFは、写真を高画質のまま軽く保存しやすい画像形式です。',
          'iPhoneでは保存容量を抑える目的で使われることがあります。',
          'ただし、相手の端末やアプリが対応していないと、画像ファイルなのに開けない原因になります。',
        ],
      },
      {
        heading: 'JPGとの違い',
        body: [
          'JPGは対応しているアプリやWebサービスが多く、提出・共有で迷いにくい形式です。',
          'HEICは容量面で有利な場面がありますが、Windowsや業務システムではJPGを求められることがあります。',
        ],
      },
      {
        heading: '変換先の使い分け',
        body: [
          '配布・提出・メール添付ならJPG。',
          'Web掲載でサイズを抑えたいならWebP。',
          '透過が必要な画像ならPNG。',
        ],
      },
    ],
    links: [
      { label: '変換ツールへ戻る', path: '/' },
      { label: 'iPhone写真が開けない', path: '/guide/windows' },
      { label: 'FAQ', path: '/faq' },
    ],
  },
  {
    path: '/faq',
    title: 'iPhone写真・HEIC変換のよくある質問',
    description:
      'iPhone写真が開けないときのHEIC変換、対応形式、サーバ送信なしの方針を短くまとめます。',
    lead:
      'iPhone写真がWindowsで開けないときや、HEICをJPGに変換したいときに迷いやすい点をまとめます。',
    sections: [
      {
        heading: '画像はサーバへ送られますか',
        body: ['送られません。変換はこの端末のブラウザ内で行います。'],
      },
      {
        heading: '複数のiPhone写真をまとめて変換できますか',
        body: ['変換できます。複数選択またはドラッグ&ドロップで追加し、ZIPでまとめて保存できます。'],
      },
      {
        heading: '対応形式は何ですか',
        body: ['入力はHEIC/HEIF、出力はJPG、PNG、WebPです。'],
      },
      {
        heading: 'Windowsで写真が開けない場合はJPGにすればよいですか',
        body: ['提出・共有が目的ならJPGが扱いやすいです。Web掲載ならWebP、透過が必要ならPNGも選べます。'],
      },
      {
        heading: '変換できない場合はどうしますか',
        body: ['ファイル単位で失敗理由を表示します。形式やサイズの問題を確認してください。'],
      },
    ],
    links: [
      { label: '変換ツールへ戻る', path: '/' },
      { label: 'HEICとは', path: '/about/heic' },
      { label: 'iPhone写真が開けない', path: '/guide/windows' },
    ],
  },
];

export function getArticlePage(path: Exclude<SitePath, '/'>): ArticlePage | undefined {
  return ARTICLE_PAGES.find((page) => page.path === path);
}

export function isSitePath(pathname: string): pathname is SitePath {
  return pathname === '/' || ARTICLE_PAGES.some((page) => page.path === pathname);
}
