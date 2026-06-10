import type {
  WorkspaceChangeFile,
  WorkspaceChanges,
  WorkspaceTreeEntry,
} from './tauri';

export type WorkspaceVcsTreeStatusKind =
  | 'added'
  | 'modified'
  | 'deleted'
  | 'renamed';

export interface WorkspaceVcsVirtualTreeEntry {
  name: string;
  relativePath: string;
  kind: WorkspaceTreeEntry['kind'];
  status: WorkspaceVcsTreeStatusKind;
}

export interface WorkspaceVcsTreeStatusIndex {
  files: Record<string, WorkspaceVcsTreeStatusKind>;
  directories: Record<string, WorkspaceVcsTreeStatusKind>;
  virtualEntriesByDirectory: Record<string, WorkspaceVcsVirtualTreeEntry[]>;
  fileCount: number;
  truncated: boolean;
  source?: string;
  generatedAtMs?: number;
  scanScope?: WorkspaceChanges['scanScope'];
}

const STATUS_PRIORITY: Record<WorkspaceVcsTreeStatusKind, number> = {
  deleted: 4,
  added: 3,
  renamed: 2,
  modified: 1,
};

export function normalizeWorkspaceVcsPath(path: string | null | undefined): string {
  const normalized = (path ?? '')
    .trim()
    .replace(/\\/g, '/')
    .replace(/^\/+|\/+$/g, '')
    .replace(/\/+/g, '/');
  return normalized.startsWith('./') ? normalized.slice(2) : normalized;
}

function parentDirectory(path: string): string {
  const slash = path.lastIndexOf('/');
  return slash <= 0 ? '' : path.slice(0, slash);
}

function pathSegments(path: string): string[] {
  return normalizeWorkspaceVcsPath(path)
    .split('/')
    .map((segment) => segment.trim())
    .filter(Boolean);
}

function mergeStatus(
  current: WorkspaceVcsTreeStatusKind | undefined,
  next: WorkspaceVcsTreeStatusKind,
): WorkspaceVcsTreeStatusKind {
  if (!current) return next;
  return STATUS_PRIORITY[next] > STATUS_PRIORITY[current] ? next : current;
}

function changeFileStatus(file: WorkspaceChangeFile): WorkspaceVcsTreeStatusKind | null {
  if (
    file.status === 'added' ||
    file.status === 'modified' ||
    file.status === 'deleted' ||
    file.status === 'renamed'
  ) {
    return file.status;
  }
  return null;
}

function addDirectoryStatuses(
  index: WorkspaceVcsTreeStatusIndex,
  path: string,
  status: WorkspaceVcsTreeStatusKind,
): void {
  let parent = parentDirectory(path);
  while (parent) {
    index.directories[parent] = mergeStatus(index.directories[parent], status);
    parent = parentDirectory(parent);
  }
}

function addFileStatus(
  index: WorkspaceVcsTreeStatusIndex,
  path: string,
  status: WorkspaceVcsTreeStatusKind,
): void {
  const normalized = normalizeWorkspaceVcsPath(path);
  if (!normalized) return;
  index.files[normalized] = mergeStatus(index.files[normalized], status);
  addDirectoryStatuses(index, normalized, status);
}

function addVirtualEntry(
  index: WorkspaceVcsTreeStatusIndex,
  parent: string,
  entry: WorkspaceVcsVirtualTreeEntry,
): void {
  const entries = index.virtualEntriesByDirectory[parent] ?? [];
  if (!entries.some((existing) => existing.relativePath === entry.relativePath)) {
    entries.push(entry);
    entries.sort((a, b) => {
      if (a.kind !== b.kind) return a.kind === 'directory' ? -1 : 1;
      return a.name.localeCompare(b.name);
    });
    index.virtualEntriesByDirectory[parent] = entries;
  }
}

function addVirtualDeletedPath(
  index: WorkspaceVcsTreeStatusIndex,
  path: string,
): void {
  const segments = pathSegments(path);
  if (segments.length === 0) return;

  for (let indexInPath = 0; indexInPath < segments.length; indexInPath += 1) {
    const relativePath = segments.slice(0, indexInPath + 1).join('/');
    const parent = segments.slice(0, indexInPath).join('/');
    const name = segments[indexInPath];
    addVirtualEntry(index, parent, {
      name,
      relativePath,
      kind: indexInPath === segments.length - 1 ? 'file' : 'directory',
      status: 'deleted',
    });
  }
}

export function buildWorkspaceVcsTreeStatus(
  snapshot: WorkspaceChanges | null | undefined,
): WorkspaceVcsTreeStatusIndex {
  const index: WorkspaceVcsTreeStatusIndex = {
    files: {},
    directories: {},
    virtualEntriesByDirectory: {},
    fileCount: snapshot?.files.length ?? 0,
    truncated: snapshot?.truncated === true,
    source: snapshot?.source,
    generatedAtMs: snapshot?.generatedAtMs,
    scanScope: snapshot?.scanScope,
  };

  if (!snapshot || snapshot.source === 'none') return index;

  for (const file of snapshot.files) {
    const status = changeFileStatus(file);
    if (!status) continue;
    const path = normalizeWorkspaceVcsPath(file.path);
    if (!path) continue;

    addFileStatus(index, path, status);
    if (status === 'deleted') {
      addVirtualDeletedPath(index, path);
    }

    if (status === 'renamed' && file.oldPath) {
      const oldPath = normalizeWorkspaceVcsPath(file.oldPath);
      addFileStatus(index, oldPath, 'deleted');
      addVirtualDeletedPath(index, oldPath);
    }
  }

  return index;
}

export function workspaceVcsStatusForEntry(
  entry: WorkspaceTreeEntry,
  index: WorkspaceVcsTreeStatusIndex,
): WorkspaceVcsTreeStatusKind | undefined {
  const key = normalizeWorkspaceVcsPath(entry.relativePath);
  return entry.kind === 'directory' ? index.directories[key] : index.files[key];
}

export function workspaceVcsStatusLabel(status: WorkspaceVcsTreeStatusKind): string {
  if (status === 'added') return '新增';
  if (status === 'deleted') return '删除';
  if (status === 'renamed') return '重命名';
  return '修改';
}

export function workspaceVcsStatusSymbol(status: WorkspaceVcsTreeStatusKind): string {
  if (status === 'added') return '+';
  if (status === 'deleted') return '-';
  if (status === 'renamed') return 'R';
  return 'M';
}
