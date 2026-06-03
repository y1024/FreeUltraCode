import { useMemo, useState, type ReactNode } from 'react';
import { ChevronsDownUp, ChevronsUpDown, WrapText } from 'lucide-react';
import CopyButton from './CopyButton';

/**
 * Recursively collect the plain text of a hast node (rehype-highlight wraps the
 * source in nested <span> elements, so the original code lives in leaf text
 * nodes). Used to recover the raw code for the copy button.
 */
interface HastNode {
  type?: string;
  value?: string;
  tagName?: string;
  properties?: { className?: unknown };
  children?: HastNode[];
}

function nodeText(node: HastNode | undefined): string {
  if (!node) return '';
  if (node.type === 'text') return node.value ?? '';
  return (node.children ?? []).map(nodeText).join('');
}

function languageOf(preNode: HastNode | undefined): string | null {
  const code = preNode?.children?.find((c) => c.tagName === 'code');
  const cls = code?.properties?.className;
  const classes = Array.isArray(cls) ? cls : typeof cls === 'string' ? cls.split(' ') : [];
  for (const c of classes) {
    if (typeof c === 'string' && c.startsWith('language-')) {
      return c.slice('language-'.length);
    }
  }
  return null;
}

/** Collapse tall code blocks past this many lines behind an expand toggle. */
const MAX_LINES = 22;

/**
 * Fenced code block chrome: a header bar with the language label, word-wrap and
 * (for tall blocks) expand toggles, plus a copy button, wrapping the
 * rehype-highlighted <pre><code>. Rendered as the `pre` override in
 * {@link Markdown}; the highlighted children pass straight through.
 *
 * A ` ```diff ` fence gets per-line +/- tinting via the `.ai-code--diff` class
 * (highlight.js marks added/removed lines with `.hljs-addition`/`.hljs-deletion`).
 */
export default function CodeBlock({
  children,
  node,
}: {
  children?: ReactNode;
  node?: HastNode;
}) {
  const [wrap, setWrap] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const raw = useMemo(() => nodeText(node).replace(/\n$/, ''), [node]);
  const lang = languageOf(node);
  const lineCount = useMemo(() => raw.split('\n').length, [raw]);
  const tall = lineCount > MAX_LINES;
  const isDiff = lang === 'diff';

  // Defensive: react-markdown normally supplies `node`, but if a future plugin
  // strips it we still render the (highlighted) children without chrome.
  if (!node) return <pre className="ai-code__scroll">{children}</pre>;

  return (
    <div className="ai-code group/code my-2 overflow-hidden rounded-lg border border-[var(--code-border)]">
      <div className="flex items-center justify-between border-b border-[var(--code-border)] bg-[var(--code-header-bg)] px-3 py-1.5">
        <span className="font-mono text-[10px] uppercase tracking-wider text-fg-faint">
          {lang ?? 'text'}
          {tall && (
            <span className="ml-2 text-fg-faint/70">{lineCount} 行</span>
          )}
        </span>
        <div className="flex items-center gap-2">
          {tall && (
            <button
              type="button"
              onClick={() => setExpanded((e) => !e)}
              title={expanded ? '收起' : '展开全部'}
              aria-label={expanded ? '收起代码' : '展开代码'}
              className="inline-flex items-center rounded p-0.5 text-fg-faint transition-colors hover:text-fg"
            >
              {expanded ? <ChevronsDownUp size={13} /> : <ChevronsUpDown size={13} />}
            </button>
          )}
          <button
            type="button"
            onClick={() => setWrap((w) => !w)}
            title={wrap ? '取消自动换行' : '自动换行'}
            aria-label="切换自动换行"
            className={
              'inline-flex items-center rounded p-0.5 transition-colors ' +
              (wrap ? 'text-accent' : 'text-fg-faint hover:text-fg')
            }
          >
            <WrapText size={13} />
          </button>
          <CopyButton value={raw} label="复制" className="px-1 py-0.5" />
        </div>
      </div>
      <div
        className={
          'ai-code__scroll overflow-auto bg-[var(--code-bg)] text-[12.5px] leading-relaxed ' +
          (wrap ? 'ai-code--wrap ' : '') +
          (isDiff ? 'ai-code--diff ' : '')
        }
        style={tall && !expanded ? { maxHeight: '24rem' } : undefined}
      >
        {children}
      </div>
    </div>
  );
}
