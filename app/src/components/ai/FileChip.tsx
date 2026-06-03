import { FileCode } from 'lucide-react';
import type { FileRef } from './lib/filePath';

export interface OpenFileFn {
  (ref: FileRef): void;
}

/**
 * A clickable chip for a local file reference (e.g. `src/store/useStore.ts:42`).
 * Shows the basename + optional `:line` suffix; the full path is in the tooltip.
 * Clicking calls `onOpenFile`; when no handler is wired the chip is styled inert
 * but still serves as a visual signal that this token is a file path.
 */
export default function FileChip({
  refData,
  onOpenFile,
}: {
  refData: FileRef;
  onOpenFile?: OpenFileFn;
}) {
  const lineSuffix = refData.startLine
    ? `:${refData.startLine}${refData.endLine ? `-${refData.endLine}` : ''}`
    : '';
  const interactive = typeof onOpenFile === 'function';

  return (
    <button
      type="button"
      disabled={!interactive}
      onClick={interactive ? () => onOpenFile!(refData) : undefined}
      title={refData.path + lineSuffix}
      className={
        'ai-file-chip inline-flex max-w-full items-center gap-1 rounded border border-border bg-panel-2 px-1.5 py-px align-baseline font-mono text-[12px] leading-snug ' +
        (interactive
          ? 'cursor-pointer text-accent hover:border-accent/50 hover:bg-accent/10'
          : 'cursor-default text-fg-dim')
      }
    >
      <FileCode size={11} className="shrink-0 opacity-70" />
      <span className="truncate">
        {refData.basename}
        {lineSuffix && <span className="text-fg-faint">{lineSuffix}</span>}
      </span>
    </button>
  );
}
