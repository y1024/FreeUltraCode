import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, describe, expect, it, vi } from 'vitest';
import WorkspaceSelect from '@/components/WorkspaceSelect';

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT =
  true;

async function renderWorkspaceSelect(props: {
  value: string;
  history: string[];
  onSelect?: (path: string) => void;
  onRemove?: (path: string) => void;
}): Promise<{ container: HTMLDivElement; cleanup: () => Promise<void> }> {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const root: Root = createRoot(container);

  const { onSelect, onRemove, ...rest } = props;
  await act(async () => {
    root.render(
      <WorkspaceSelect
        {...rest}
        onSelect={onSelect ?? vi.fn()}
        onRemove={onRemove}
      />,
    );
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

afterEach(() => {
  window.localStorage.clear();
  document.body.innerHTML = '';
});

describe('WorkspaceSelect', () => {
  it('renders normalized duplicate workspace history entries once', async () => {
    const view = await renderWorkspaceSelect({
      value: 'E:\\Game',
      history: [
        'E:\\Game',
        'e:/Game/',
        'E:\\FreeUltraCode',
        'E:\\Game\\',
      ],
    });

    try {
      const trigger = view.container.querySelector('button');
      expect(trigger).toBeInstanceOf(HTMLButtonElement);

      await act(async () => {
        trigger?.click();
      });

      const options = Array.from(
        view.container.querySelectorAll('[role="option"]'),
      );
      expect(options).toHaveLength(2);
      expect(options.map((item) => item.textContent?.trim())).toEqual([
        '●Game',
        '●FreeUltraCode',
      ]);
    } finally {
      await view.cleanup();
    }
  });

  it('removes a folder via its delete button without selecting it', async () => {
    const onSelect = vi.fn();
    const onRemove = vi.fn();
    const view = await renderWorkspaceSelect({
      value: 'E:\\Game',
      history: ['E:\\Game', 'E:\\FreeUltraCode'],
      onSelect,
      onRemove,
    });

    try {
      const trigger = view.container.querySelector('button');
      await act(async () => {
        trigger?.click();
      });

      const removeButtons = Array.from(
        view.container.querySelectorAll<HTMLButtonElement>(
          'li button:not([role="option"])',
        ),
      );
      expect(removeButtons).toHaveLength(2);

      await act(async () => {
        removeButtons[1]?.click();
      });

      expect(onRemove).toHaveBeenCalledWith('E:\\FreeUltraCode');
      expect(onSelect).not.toHaveBeenCalled();
    } finally {
      await view.cleanup();
    }
  });

  it('omits delete buttons when onRemove is not provided', async () => {
    const view = await renderWorkspaceSelect({
      value: '',
      history: ['E:\\Game'],
    });

    try {
      const trigger = view.container.querySelector('button');
      await act(async () => {
        trigger?.click();
      });

      const removeButtons = view.container.querySelectorAll(
        'li button:not([role="option"])',
      );
      expect(removeButtons).toHaveLength(0);
    } finally {
      await view.cleanup();
    }
  });
});
