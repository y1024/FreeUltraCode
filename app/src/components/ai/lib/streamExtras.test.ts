import { describe, expect, it } from 'vitest';
import { scanFileRefs, hasFileRef } from './fileScan';
import { parseToolLine } from './toolLine';

describe('scanFileRefs', () => {
  it('returns the original string when no file ref present', () => {
    expect(scanFileRefs('just some prose here')).toEqual(['just some prose here']);
  });

  it('extracts a bare filename from prose', () => {
    const parts = scanFileRefs('改在 Sidebar.tsx 里。');
    expect(parts.some((p) => typeof p !== 'string')).toBe(true);
    const ref = parts.find((p) => typeof p !== 'string');
    expect(ref && typeof ref !== 'string' ? ref.basename : '').toBe('Sidebar.tsx');
  });

  it('peels trailing punctuation but keeps the path', () => {
    const parts = scanFileRefs('see app/src/store/useStore.ts.');
    const ref = parts.find((p) => typeof p !== 'string');
    expect(ref && typeof ref !== 'string' ? ref.path : '').toBe(
      'app/src/store/useStore.ts',
    );
    // The trailing period stays as text.
    expect(parts[parts.length - 1]).toBe('.');
  });

  it('keeps a :line suffix', () => {
    const parts = scanFileRefs('at useStore.ts:42 now');
    const ref = parts.find((p) => typeof p !== 'string');
    expect(ref && typeof ref !== 'string' ? ref.startLine : 0).toBe(42);
  });

  it('does not match version numbers or identifiers', () => {
    expect(hasFileRef('upgrade to 2.0 today')).toBe(false);
    expect(hasFileRef('call react.useState here')).toBe(false);
  });

  it('does not match a CJK clause containing a stray slash', () => {
    expect(hasFileRef('我会先定位左侧工具栏/导入按钮的实现和项目里的补充约定')).toBe(
      false,
    );
    expect(hasFileRef('已定位到左侧栏的主操作区')).toBe(false);
  });

  it('still finds an ASCII path embedded in a CJK sentence', () => {
    const parts = scanFileRefs('已定位到 app/src/panels/Sidebar.tsx 文件');
    const ref = parts.find((p) => typeof p !== 'string');
    expect(ref && typeof ref !== 'string' ? ref.basename : '').toBe('Sidebar.tsx');
  });

  it('reconstructs surrounding text losslessly', () => {
    const parts = scanFileRefs('a Sidebar.tsx b');
    const joined = parts
      .map((p) => (typeof p === 'string' ? p : p.basename))
      .join('');
    expect(joined).toBe('a Sidebar.tsx b');
  });
});

describe('parseToolLine', () => {
  it('parses an emoji claude tool line', () => {
    expect(parseToolLine('🔧 Bash: ls app/src')).toEqual({
      name: 'Bash',
      detail: 'ls app/src',
    });
  });

  it('parses an emoji codex item line', () => {
    expect(parseToolLine('🔧 command_execution: rg -n foo')).toEqual({
      name: 'command_execution',
      detail: 'rg -n foo',
    });
  });

  it('parses a bare known item line without emoji', () => {
    expect(parseToolLine('file_change: completed')).toEqual({
      name: 'file_change',
      detail: 'completed',
    });
  });

  it('handles a tool line with no detail', () => {
    expect(parseToolLine('🔧 Read')).toEqual({ name: 'Read', detail: '' });
  });

  it('rejects ordinary prose with a colon', () => {
    expect(parseToolLine('注意: 这是普通句子')).toBeNull();
    expect(parseToolLine('https://example.com')).toBeNull();
  });

  it('rejects an unknown bare name:detail', () => {
    expect(parseToolLine('foobar: something')).toBeNull();
  });
});
