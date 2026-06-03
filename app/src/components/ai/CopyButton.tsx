import { useCallback, useState } from 'react';
import { Check, Copy } from 'lucide-react';

/**
 * Copy-to-clipboard button used by code blocks (and reusable elsewhere). Swaps
 * to a check mark for ~1.4s after a successful copy. Guards against insecure
 * contexts where `navigator.clipboard` is unavailable (falls back silently).
 */
export default function CopyButton({
  value,
  className,
  title = '复制',
  label,
}: {
  value: string;
  className?: string;
  title?: string;
  /** Optional text shown next to the icon (e.g. "复制"). Icon-only when omitted. */
  label?: string;
}) {
  const [copied, setCopied] = useState(false);

  const onCopy = useCallback(async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(value);
      } else {
        const ta = document.createElement('textarea');
        ta.value = value;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        try {
          ta.select();
          document.execCommand('copy');
        } finally {
          if (ta.parentNode) ta.parentNode.removeChild(ta);
        }
      }
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1400);
    } catch {
      /* clipboard unavailable — ignore */
    }
  }, [value]);

  return (
    <button
      type="button"
      onClick={onCopy}
      title={copied ? '已复制' : title}
      aria-label={copied ? '已复制' : title}
      className={
        'inline-flex items-center gap-1 rounded text-fg-faint transition-colors hover:text-fg ' +
        (className ?? '')
      }
    >
      {copied ? (
        <Check size={13} className="text-accent-2" />
      ) : (
        <Copy size={13} />
      )}
      {label != null && (
        <span className="text-[11px]">{copied ? '已复制' : label}</span>
      )}
    </button>
  );
}
