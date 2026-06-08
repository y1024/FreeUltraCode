import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, describe, expect, it, vi } from 'vitest';
import SettingsModal from './SettingsModal';
import { defaultBlueprint } from '@/core/defaultBlueprint';
import { DEFAULT_GAME_EXPERT_SETTINGS } from '@/lib/gameExperts';
import { defaultComposer } from '@/store/sampleSessions';
import { useStore } from '@/store/useStore';

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT =
  true;

async function renderSettingsModal(): Promise<{
  container: HTMLDivElement;
  cleanup: () => Promise<void>;
}> {
  useStore.setState({
    locale: 'zh-CN',
    workflow: defaultBlueprint('Current workflow'),
    composer: defaultComposer,
    gameExpertSettings: DEFAULT_GAME_EXPERT_SETTINGS,
  });

  const container = document.createElement('div');
  document.body.appendChild(container);
  const root: Root = createRoot(container);

  await act(async () => {
    root.render(<SettingsModal onClose={vi.fn()} />);
  });

  return {
    container,
    cleanup: async () => {
      await act(async () => {
        root.unmount();
      });
      container.remove();
    },
  };
}

function clickButtonByText(container: ParentNode, text: string): void {
  const button = Array.from(container.querySelectorAll('button')).find(
    (item) => item.textContent?.trim() === text,
  );
  expect(button).toBeInstanceOf(HTMLButtonElement);
  button?.click();
}

afterEach(() => {
  window.localStorage.clear();
  document.body.innerHTML = '';
  vi.restoreAllMocks();
});

describe('SettingsModal game expert settings', () => {
  it('opens a child dialog when editing an expert', async () => {
    const view = await renderSettingsModal();

    try {
      await act(async () => {
        clickButtonByText(view.container, '游戏专家');
      });

      const editButton = view.container.querySelector(
        'button[aria-label="修改专家"]',
      );
      expect(editButton).toBeInstanceOf(HTMLButtonElement);

      await act(async () => {
        editButton?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      });

      const editor = document.querySelector(
        '[data-settings-child-modal="true"][data-game-expert-editor="true"]',
      );
      expect(editor).toBeInstanceOf(HTMLElement);
      expect(editor?.textContent).toContain('编辑专家内容');
      expect(editor?.textContent).toContain('Technical Director');
      expect(
        (editor?.querySelector('textarea') as HTMLTextAreaElement | null)?.value,
      ).toContain(
        '把玩法目标拆成稳定架构',
      );
    } finally {
      await view.cleanup();
    }
  });

  it('opens a child confirmation dialog when deleting an expert', async () => {
    const view = await renderSettingsModal();

    try {
      await act(async () => {
        clickButtonByText(view.container, '游戏专家');
      });

      const deleteButton = view.container.querySelector(
        'button[aria-label="删除专家"]',
      );
      expect(deleteButton).toBeInstanceOf(HTMLButtonElement);

      await act(async () => {
        deleteButton?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      });

      const confirm = document.querySelector(
        '[data-settings-child-modal="true"][data-game-expert-delete="true"]',
      );
      expect(confirm).toBeInstanceOf(HTMLElement);
      expect(confirm?.textContent).toContain('删除专家');
      // The delete confirmation shows the locale-aware expert name (zh-CN here),
      // not the canonical English name stored in the catalog.
      expect(confirm?.textContent).toContain('技术总监');
    } finally {
      await view.cleanup();
    }
  });

  it('filters the expert pool by category tab', async () => {
    const view = await renderSettingsModal();

    try {
      await act(async () => {
        clickButtonByText(view.container, '游戏专家');
      });

      // The synthetic "全部" (All) tab is selected initially and shows the full
      // catalog, including a Leadership expert (技术总监) and an Audio expert.
      const allTab = Array.from(view.container.querySelectorAll('button')).find(
        (b) => b.getAttribute('role') === 'tab' && b.textContent?.includes('全部'),
      );
      expect(allTab).toBeInstanceOf(HTMLButtonElement);
      expect(allTab?.getAttribute('aria-selected')).toBe('true');

      const poolText = () =>
        view.container.querySelector('section')?.textContent ?? '';
      expect(poolText()).toContain('技术总监');

      // Switching to the 引擎 (Engine) category hides non-engine experts such as
      // the Leadership 技术总监 while keeping engine specialists like Unity 专家.
      const engineTab = Array.from(
        view.container.querySelectorAll('button'),
      ).find(
        (b) =>
          b.getAttribute('role') === 'tab' && b.textContent?.includes('引擎'),
      );
      expect(engineTab).toBeInstanceOf(HTMLButtonElement);

      await act(async () => {
        engineTab?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      });

      expect(engineTab?.getAttribute('aria-selected')).toBe('true');
      const grid = view.container.querySelector('.sm\\:grid-cols-2');
      const gridText = grid?.textContent ?? '';
      expect(gridText).toContain('Unity 专家');
      expect(gridText).not.toContain('技术总监');
    } finally {
      await view.cleanup();
    }
  });
});
