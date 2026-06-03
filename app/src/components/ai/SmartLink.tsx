import type { ReactNode } from 'react';
import { ExternalLink } from 'lucide-react';
import { parseFileRef } from './lib/filePath';
import FileChip, { type OpenFileFn } from './FileChip';

/**
 * Anchor renderer for markdown links. External URLs (http/https/mailto) open in
 * a new tab with safe rel; anything that parses as a local file reference is
 * rendered as a clickable {@link FileChip} (a real <a target="_blank"> silently
 * fails for local paths inside a webview).
 */
export default function SmartLink({
  href,
  children,
  onOpenFile,
}: {
  href?: string;
  children?: ReactNode;
  onOpenFile?: OpenFileFn;
}) {
  const url = href ?? '';
  const isExternal = /^(https?:|mailto:)/i.test(url);

  if (isExternal) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-0.5 text-accent underline decoration-accent/40 underline-offset-2 hover:decoration-accent"
      >
        {children}
        <ExternalLink size={11} className="opacity-60" />
      </a>
    );
  }

  const ref = parseFileRef(url);
  if (ref) return <FileChip refData={ref} onOpenFile={onOpenFile} />;

  // Unknown scheme / relative anchor — render as plain styled text.
  return <span className="text-accent underline underline-offset-2">{children}</span>;
}
