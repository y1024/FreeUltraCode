import type { ReactNode } from 'react';
import {
  AlertTriangle,
  Info,
  Lightbulb,
  MessageSquareWarning,
  OctagonAlert,
} from 'lucide-react';
import type { CalloutKind } from './lib/callout';

const META: Record<
  CalloutKind,
  { label: string; icon: typeof Info; varName: string }
> = {
  note: { label: '注', icon: Info, varName: '--accent' },
  tip: { label: '提示', icon: Lightbulb, varName: '--accent-2' },
  important: { label: '要点', icon: MessageSquareWarning, varName: '--accent-4' },
  warning: { label: '警告', icon: AlertTriangle, varName: '--status-running' },
  caution: { label: '注意', icon: OctagonAlert, varName: '--status-error' },
};

/** A GitHub-style alert banner: colored left border + icon + label + body. */
export default function Callout({
  kind,
  children,
}: {
  kind: CalloutKind;
  children: ReactNode;
}) {
  const meta = META[kind];
  const Icon = meta.icon;
  const accent = `var(${meta.varName})`;
  return (
    <div
      className="ai-callout my-2 rounded-md border border-l-[3px] py-1.5 pl-3 pr-3 text-sm"
      style={{
        borderColor: 'var(--border)',
        borderLeftColor: accent,
        background: `color-mix(in oklab, ${accent} 7%, transparent)`,
      }}
    >
      <div
        className="mb-0.5 flex items-center gap-1.5 text-[12px] font-semibold"
        style={{ color: accent }}
      >
        <Icon size={13} />
        <span>{meta.label}</span>
      </div>
      <div className="ai-callout__body text-fg-dim">{children}</div>
    </div>
  );
}
