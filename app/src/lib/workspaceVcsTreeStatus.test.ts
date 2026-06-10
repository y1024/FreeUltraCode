import { describe, expect, it } from 'vitest';
import type { WorkspaceChanges } from './tauri';
import {
  buildWorkspaceVcsTreeStatus,
  normalizeWorkspaceVcsPath,
  workspaceVcsStatusForEntry,
} from './workspaceVcsTreeStatus';

function snapshot(files: WorkspaceChanges['files']): WorkspaceChanges {
  return {
    rootPath: 'E:\\Project',
    generatedAtMs: 1,
    source: 'git',
    files,
    truncated: false,
  };
}

describe('workspaceVcsTreeStatus', () => {
  it('normalizes platform paths', () => {
    expect(normalizeWorkspaceVcsPath(' .\\Source\\Client\\Main.cs ')).toBe(
      'Source/Client/Main.cs',
    );
    expect(normalizeWorkspaceVcsPath('/Source//Client/')).toBe('Source/Client');
  });

  it('indexes file and parent directory statuses', () => {
    const index = buildWorkspaceVcsTreeStatus(
      snapshot([
        {
          path: 'Source/Client/Main.cs',
          oldPath: null,
          status: 'modified',
          binary: false,
          truncated: true,
          lines: [],
        },
      ]),
    );

    expect(index.files['Source/Client/Main.cs']).toBe('modified');
    expect(index.directories.Source).toBe('modified');
    expect(index.directories['Source/Client']).toBe('modified');
  });

  it('preserves root scan scope for incremental tree rendering', () => {
    const rootSnapshot = {
      ...snapshot([]),
      scanScope: 'root',
    };

    expect(buildWorkspaceVcsTreeStatus(rootSnapshot).scanScope).toBe('root');
  });

  it('adds virtual deleted entries for missing files', () => {
    const index = buildWorkspaceVcsTreeStatus(
      snapshot([
        {
          path: 'Source/Gone/Old.cs',
          oldPath: null,
          status: 'deleted',
          binary: false,
          truncated: true,
          lines: [],
        },
      ]),
    );

    expect(index.virtualEntriesByDirectory['']).toEqual([
      {
        name: 'Source',
        relativePath: 'Source',
        kind: 'directory',
        status: 'deleted',
      },
    ]);
    expect(index.virtualEntriesByDirectory.Source[0]).toMatchObject({
      name: 'Gone',
      kind: 'directory',
    });
    expect(index.virtualEntriesByDirectory['Source/Gone'][0]).toMatchObject({
      name: 'Old.cs',
      kind: 'file',
    });
  });

  it('treats renamed old paths as deleted ghosts', () => {
    const index = buildWorkspaceVcsTreeStatus(
      snapshot([
        {
          path: 'Source/New.cs',
          oldPath: 'Source/Old.cs',
          status: 'renamed',
          binary: false,
          truncated: true,
          lines: [],
        },
      ]),
    );

    expect(index.files['Source/New.cs']).toBe('renamed');
    expect(index.files['Source/Old.cs']).toBe('deleted');
  });

  it('resolves entry status by relative path', () => {
    const index = buildWorkspaceVcsTreeStatus(
      snapshot([
        {
          path: 'Config/App.ini',
          oldPath: null,
          status: 'added',
          binary: false,
          truncated: true,
          lines: [],
        },
      ]),
    );

    expect(
      workspaceVcsStatusForEntry(
        {
          name: 'App.ini',
          path: 'E:\\Project\\Config\\App.ini',
          relativePath: 'Config/App.ini',
          kind: 'file',
          hidden: false,
        },
        index,
      ),
    ).toBe('added');
  });
});
