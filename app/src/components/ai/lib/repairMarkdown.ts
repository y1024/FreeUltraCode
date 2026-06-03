/**
 * CONTRACT: repair(md) -> markdown with balanced code fences and inline ticks.
 *
 * AI output streams in token-by-token, so the last bubble is frequently
 * mid-token: an unclosed ``` fence or a dangling `inline` backtick. Feeding that
 * straight to react-markdown makes the whole subtree flip layout on every chunk
 * (a half-open fence swallows the rest of the document as code). We close the
 * dangling constructs on a *copy* of the text before parsing so the live bubble
 * renders stably; the real text in the store is never mutated.
 *
 * Pure + synchronous so it can run on every render of the streaming bubble.
 */

/** Balance an odd number of ``` fences and a trailing inline backtick. */
export function repairMarkdown(md: string): string {
  let out = md;

  // 1. Close a dangling triple-fence (``` count is odd).
  const fences = (out.match(/```/g) ?? []).length;
  if (fences % 2 === 1) {
    out += (out.endsWith('\n') ? '' : '\n') + '```';
  }

  // 2. Close a dangling single inline backtick. Strip complete fenced blocks
  // first (step 1 guarantees fences are now balanced) so their inner backticks
  // don't skew the inline count.
  const withoutFences = out.replace(/```[\s\S]*?```/g, '');
  const singles = (withoutFences.match(/`/g) ?? []).length;
  if (singles % 2 === 1) out += '`';

  return out;
}
