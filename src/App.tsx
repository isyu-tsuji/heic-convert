import {
  type ChangeEvent,
  type DragEvent,
  type MouseEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import './App.css';
import { HOME_PAGE, getArticlePage, isSitePath, type SitePath } from './content/sitePages';
import { buildOutputFileName } from './lib/fileName';
import { convertHeicArrayBuffer } from './lib/heicConverter';
import { OUTPUT_FORMAT_OPTIONS } from './lib/outputFormat';
import type { ConvertedImage, ConversionJob, OutputFormat } from './lib/types';
import { validateHeicFiles, type FileValidationError } from './lib/validation';
import { createConvertedImagesZip, ZIP_FILE_NAME } from './lib/zip';

const STATUS_LABELS: Record<ConversionJob['status'], string> = {
  pending: '待機中',
  converting: '変換中',
  done: '完了',
  failed: '失敗',
};

export default function App() {
  const [pathname, setPathname] = useState<SitePath>(() => resolvePath(window.location.pathname));

  useEffect(() => {
    const onPopState = () => setPathname(resolvePath(window.location.pathname));
    window.addEventListener('popstate', onPopState);

    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  useEffect(() => {
    updateMetadata(pathname);
  }, [pathname]);

  function navigate(path: SitePath) {
    if (path === pathname) {
      return;
    }

    window.history.pushState({}, '', path);
    setPathname(path);
  }

  if (pathname !== '/') {
    const article = getArticlePage(pathname);

    if (!article) {
      return <NotFoundPage onNavigate={navigate} />;
    }

    return <ArticlePageView articlePath={pathname} onNavigate={navigate} />;
  }

  return <HomePage onNavigate={navigate} />;
}

function HomePage({ onNavigate }: { onNavigate: (path: SitePath) => void }) {
  const [jobs, setJobs] = useState<ConversionJob[]>([]);
  const [outputFormat, setOutputFormat] = useState<OutputFormat>('jpg');
  const [validationErrors, setValidationErrors] = useState<FileValidationError[]>([]);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [zipUrl, setZipUrl] = useState<string | null>(null);
  const zipUrlRef = useRef<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const summary = useMemo(() => {
    const completed = jobs.filter((job) => job.status === 'done').length;
    const failed = jobs.filter((job) => job.status === 'failed').length;

    return { completed, failed, total: jobs.length };
  }, [jobs]);

  const canConvert = jobs.length > 0 && !isConverting;

  useEffect(() => {
    return () => {
      if (zipUrlRef.current) {
        URL.revokeObjectURL(zipUrlRef.current);
      }
    };
  }, []);

  function replaceZipUrl(nextUrl: string | null) {
    if (zipUrlRef.current) {
      URL.revokeObjectURL(zipUrlRef.current);
    }

    zipUrlRef.current = nextUrl;
    setZipUrl(nextUrl);
  }

  function addFiles(files: Iterable<File>) {
    const result = validateHeicFiles(files);
    const newJobs = result.validFiles.map<ConversionJob>((file) => ({
      id: createJobId(),
      file,
      status: 'pending',
    }));

    setValidationErrors(result.errors);
    setGlobalError(null);
    replaceZipUrl(null);

    if (newJobs.length > 0) {
      setJobs((currentJobs) => [...currentJobs, ...newJobs]);
    }
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    if (!event.target.files) {
      return;
    }

    addFiles(event.target.files);
    event.target.value = '';
  }

  function handleDragOver(event: DragEvent<HTMLElement>) {
    event.preventDefault();
    setIsDragging(true);
  }

  function handleDragLeave(event: DragEvent<HTMLElement>) {
    event.preventDefault();
    setIsDragging(false);
  }

  function handleDrop(event: DragEvent<HTMLElement>) {
    event.preventDefault();
    setIsDragging(false);

    if (event.dataTransfer.files.length > 0) {
      addFiles(event.dataTransfer.files);
    }
  }

  function updateJob(jobId: string, patch: Partial<ConversionJob>) {
    setJobs((currentJobs) =>
      currentJobs.map((job) => (job.id === jobId ? { ...job, ...patch } : job)),
    );
  }

  function resetResults(nextFormat?: OutputFormat) {
    if (nextFormat) {
      setOutputFormat(nextFormat);
    }

    setGlobalError(null);
    replaceZipUrl(null);
    setJobs((currentJobs) =>
      currentJobs.map((job) => ({
        ...job,
        status: 'pending',
        outputName: undefined,
        convertedBlob: undefined,
        error: undefined,
      })),
    );
  }

  function removeJob(jobId: string) {
    if (isConverting) {
      return;
    }

    replaceZipUrl(null);
    setJobs((currentJobs) => currentJobs.filter((job) => job.id !== jobId));
  }

  function clearJobs() {
    if (isConverting) {
      return;
    }

    setJobs([]);
    setValidationErrors([]);
    setGlobalError(null);
    replaceZipUrl(null);
  }

  async function convertFiles() {
    if (!canConvert) {
      return;
    }

    setIsConverting(true);
    setGlobalError(null);
    setValidationErrors([]);
    replaceZipUrl(null);

    const convertedImages: ConvertedImage[] = [];

    setJobs((currentJobs) =>
      currentJobs.map((job) => ({
        ...job,
        status: 'pending',
        outputName: undefined,
        convertedBlob: undefined,
        error: undefined,
      })),
    );

    for (const job of jobs) {
      updateJob(job.id, { status: 'converting' });

      try {
        const arrayBuffer = await job.file.arrayBuffer();
        const convertedBlob = await convertHeicArrayBuffer(arrayBuffer, outputFormat);
        const outputName = buildOutputFileName(job.file.name, outputFormat);

        convertedImages.push({
          sourceName: job.file.name,
          outputName,
          blob: convertedBlob,
        });

        updateJob(job.id, {
          status: 'done',
          outputName,
          convertedBlob,
          error: undefined,
        });
      } catch (error) {
        updateJob(job.id, {
          status: 'failed',
          error: getErrorMessage(error),
        });
      }
    }

    if (convertedImages.length > 0) {
      try {
        const zipBlob = await createConvertedImagesZip(convertedImages);
        replaceZipUrl(URL.createObjectURL(zipBlob));
      } catch (error) {
        setGlobalError(`ZIPを作成できませんでした。${getErrorMessage(error)}`);
      }
    }

    setIsConverting(false);
  }

  return (
    <main className="app-shell">
      <header className="app-header">
        <div className="brand-block">
          <p className="eyebrow">ブラウザで変換</p>
          <h1>heic-flip</h1>
        </div>
        <p className="app-tagline">HEIC/HEIF を JPG、PNG、WebP に変換します。画像はこの端末のブラウザ内だけで処理します。</p>
      </header>

      <section className="workspace" aria-busy={isConverting}>
        <div className="primary-panel">
          <label
            className={`drop-zone${isDragging ? ' is-dragging' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input
              ref={inputRef}
              className="file-input"
              type="file"
              accept=".heic,.heif,image/heic,image/heif"
              multiple
              onChange={handleFileChange}
            />
            <span className="drop-kicker">ここに追加</span>
            <span className="drop-title">HEIC / HEIF ファイルを置く</span>
            <span className="drop-subtitle">複数ファイル対応。変換後は ZIP でまとめて保存できます。</span>
          </label>

          {validationErrors.length > 0 && (
            <div className="message-list" role="alert">
              {validationErrors.map((error) => (
                <p key={`${error.fileName}-${error.reason}`}>
                  <strong>{error.fileName}</strong>: {error.reason}
                </p>
              ))}
            </div>
          )}

          <div className="file-panel">
            <div className="panel-heading">
              <div>
                <h2>ファイル一覧</h2>
                <p>{jobs.length} 件</p>
              </div>
              <button type="button" className="text-button" onClick={clearJobs} disabled={jobs.length === 0 || isConverting}>
                クリア
              </button>
            </div>

            {jobs.length === 0 ? (
              <p className="empty-state">ファイルはまだ追加されていません。</p>
            ) : (
              <ul className="file-list">
                {jobs.map((job) => (
                  <li className="file-row" key={job.id}>
                    <div className="file-main">
                      <span className="file-name">{job.file.name}</span>
                      <span className="file-meta">
                        {formatFileSize(job.file.size)}
                        {job.outputName ? ` / ${job.outputName}` : ''}
                      </span>
                      {job.error && <span className="file-error">{job.error}</span>}
                    </div>
                    <div className="file-actions">
                      <span className={`status-pill status-${job.status}`}>{STATUS_LABELS[job.status]}</span>
                      <button
                        type="button"
                        className="icon-button"
                        onClick={() => removeJob(job.id)}
                        disabled={isConverting}
                        aria-label={`${job.file.name}を削除`}
                        title="削除"
                      >
                        ×
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <aside className="side-panel">
          <section className="control-group">
            <h2>出力形式</h2>
            <div className="format-segment" role="group" aria-label="出力形式">
              {OUTPUT_FORMAT_OPTIONS.map((format) => (
                <button
                  key={format.format}
                  type="button"
                  className={format.format === outputFormat ? 'is-selected' : ''}
                  onClick={() => resetResults(format.format)}
                  disabled={isConverting}
                >
                  {format.label}
                </button>
              ))}
            </div>
          </section>

          <section className="control-group summary-group">
            <h2>変換状況</h2>
            <dl className="summary-grid">
              <div>
                <dt>対象</dt>
                <dd>{summary.total}</dd>
              </div>
              <div>
                <dt>完了</dt>
                <dd>{summary.completed}</dd>
              </div>
              <div>
                <dt>失敗</dt>
                <dd>{summary.failed}</dd>
              </div>
            </dl>
          </section>

          {globalError && (
            <p className="global-error" role="alert">
              {globalError}
            </p>
          )}

          <div className="command-stack">
            <button type="button" className="primary-button" onClick={convertFiles} disabled={!canConvert}>
              {isConverting ? '変換中' : '変換する'}
            </button>

            {zipUrl ? (
              <a className="download-button" href={zipUrl} download={ZIP_FILE_NAME}>
                ZIPをダウンロード
              </a>
            ) : (
              <button type="button" className="download-button" disabled>
                ZIPをダウンロード
              </button>
            )}
          </div>

          <section className="control-group guide-panel">
            <h2>ガイド</h2>
            <p className="guide-copy">使い方やHEICの基本を短くまとめています。</p>
            <div className="guide-links">
              {HOME_PAGE.links.map((link) => (
                <LinkButton key={link.path} label={link.label} path={link.path} onNavigate={onNavigate} />
              ))}
            </div>
          </section>
        </aside>
      </section>
    </main>
  );
}

function ArticlePageView({
  articlePath,
  onNavigate,
}: {
  articlePath: Exclude<SitePath, '/'>;
  onNavigate: (path: SitePath) => void;
}) {
  const article = getArticlePage(articlePath);

  if (!article) {
    return <NotFoundPage onNavigate={onNavigate} />;
  }

  return (
    <main className="app-shell article-shell">
      <header className="app-header article-header">
        <div className="brand-block">
          <p className="eyebrow">解説</p>
          <h1>{article.title}</h1>
        </div>
        <p className="app-tagline">{article.description}</p>
      </header>

      <section className="article-layout">
        <article className="article-card">
          <p className="article-lead">{article.lead}</p>

          {article.sections.map((section) => (
            <section className="article-section" key={section.heading}>
              <h2>{section.heading}</h2>
              {section.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </section>
          ))}
        </article>

        <aside className="side-panel article-side-panel">
          <section className="control-group">
            <h2>関連ページ</h2>
            <div className="guide-links">
              {article.links.map((link) => (
                <LinkButton key={link.path} label={link.label} path={link.path} onNavigate={onNavigate} />
              ))}
            </div>
          </section>

          <section className="control-group">
            <h2>元の画面</h2>
            <p className="guide-copy">変換ツールに戻って、実際にファイルを処理できます。</p>
            <LinkButton label="変換ツールへ戻る" path="/" onNavigate={onNavigate} />
          </section>
        </aside>
      </section>
    </main>
  );
}

function NotFoundPage({ onNavigate }: { onNavigate: (path: SitePath) => void }) {
  return (
    <main className="app-shell article-shell">
      <header className="app-header article-header">
        <div className="brand-block">
          <p className="eyebrow">404</p>
          <h1>ページが見つかりません</h1>
        </div>
        <p className="app-tagline">指定されたページはまだありません。変換ツールのトップに戻れます。</p>
      </header>

      <section className="article-layout">
        <article className="article-card">
          <p className="article-lead">このURLには対応するページがありません。</p>
        </article>

        <aside className="side-panel article-side-panel">
          <LinkButton label="変換ツールへ戻る" path="/" onNavigate={onNavigate} />
        </aside>
      </section>
    </main>
  );
}

function LinkButton({
  path,
  label,
  onNavigate,
}: {
  path: SitePath;
  label: string;
  onNavigate: (path: SitePath) => void;
}) {
  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
    onNavigate(path);
  }

  return (
    <a className="link-button" href={path} onClick={handleClick}>
      {label}
    </a>
  );
}

function resolvePath(pathname: string): SitePath {
  if (isSitePath(pathname)) {
    return pathname;
  }

  return '/';
}

function updateMetadata(pathname: SitePath) {
  const article = pathname === '/' ? undefined : getArticlePage(pathname);
  const title = article ? `${article.title} | heic-flip` : 'heic-flip | HEICをJPG・PNG・WebPへブラウザ内で変換';
  const description = article?.description ?? HOME_PAGE.description;
  const url = new URL(pathname, getSiteBaseUrl()).href;

  document.title = title;

  setMetaTag('name', 'description', description);
  setMetaTag('name', 'theme-color', '#fbfaf7');
  setMetaTag('property', 'og:title', title);
  setMetaTag('property', 'og:description', description);
  setMetaTag('property', 'og:url', url);
  setMetaTag('property', 'twitter:title', title);
  setMetaTag('property', 'twitter:description', description);
  setLinkHref('canonical', url);
}

function getSiteBaseUrl(): string {
  const configured = import.meta.env.VITE_SITE_URL;

  if (typeof configured === 'string' && configured.length > 0) {
    return configured;
  }

  if (typeof window !== 'undefined') {
    return window.location.origin;
  }

  return 'https://heicflip.example';
}

function setMetaTag(attrName: 'name' | 'property', key: string, value: string) {
  const selector = `meta[${attrName}="${key}"]`;
  let element = document.querySelector<HTMLMetaElement>(selector);

  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attrName, key);
    document.head.appendChild(element);
  }

  element.setAttribute('content', value);
}

function setLinkHref(rel: string, href: string) {
  let element = document.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);

  if (!element) {
    element = document.createElement('link');
    element.rel = rel;
    document.head.appendChild(element);
  }

  element.href = href;
}

function createJobId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function formatFileSize(size: number): string {
  if (size < 1024) {
    return `${size} B`;
  }

  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(1)} KB`;
  }

  return `${(size / 1024 / 1024).toFixed(1)} MB`;
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return '不明なエラーが発生しました。';
}
