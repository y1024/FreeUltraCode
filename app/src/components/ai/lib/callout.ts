/**
 * CONTRACT: GitHub-flavoured alert/callout detection helpers (pure, no JSX).
 *
 *   detectCallout(firstText)   -> CalloutKind | null
 *   stripCalloutMarker(text)   -> text with a leading `[!KIND]` removed
 *
 * Kept separate from the Callout component so the renderer file only exports a
 * component (react-refresh friendliness).
 */

export type CalloutKind = 'note' | 'tip' | 'important' | 'warning' | 'caution';

const KIND_RE = /^\s*\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*/i;

/** Detect a leading `[!KIND]` marker in a blockquote's first text. */
export function detectCallout(firstText: string): CalloutKind | null {
  const m = firstText.match(KIND_RE);
  return m ? (m[1].toLowerCase() as CalloutKind) : null;
}

/** Strip the `[!KIND]` marker from text (used to clean the first paragraph). */
export function stripCalloutMarker(text: string): string {
  return text.replace(KIND_RE, '');
}
