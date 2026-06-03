import { afterEach, describe, expect, it, vi } from 'vitest';
import { defaultBlueprint, simpleBlueprint } from '@/core/defaultBlueprint';
import type { IRGraph } from '@/core/ir';

const gatewayMocks = vi.hoisted(() => ({
  completeGatewayText: vi.fn(),
  resolveDirectGatewayRoute: vi.fn(),
}));

vi.mock('@/lib/modelGateway/modelGateway', async () => {
  const actual = await vi.importActual<
    typeof import('@/lib/modelGateway/modelGateway')
  >('@/lib/modelGateway/modelGateway');
  return {
    ...actual,
    completeGatewayText: gatewayMocks.completeGatewayText,
    resolveDirectGatewayRoute: gatewayMocks.resolveDirectGatewayRoute,
  };
});

import { useStore } from './useStore';
import { isActiveAiEditingSession, isWorkflowReadOnly } from './useStore';
import { historyStore } from './history/store';

function cloneGraph(graph: IRGraph): IRGraph {
  return JSON.parse(JSON.stringify(graph)) as IRGraph;
}

function resetStore(workflow: IRGraph): void {
  window.localStorage.setItem('owf_research_angles_max', '1');
  window.localStorage.setItem('owf_nodegen_candidates_max', '1');
  useStore.setState({
    workflow: cloneGraph(workflow),
    selectedNodeId: null,
    mode: 'design',
    aiStreaming: false,
    aiEditingSessions: [],
    chattingSessions: [],
    dirty: false,
    currentFilePath: null,
    messages: [],
    composerDraft: '',
    composerDrafts: {},
    activeSessionId: null,
    activeWorkspaceId: null,
    historyReady: false,
    sessions: [],
    sessionTree: {},
    runState: {},
    runOutputs: {},
    lastRunFailedNodeId: null,
  });
}

function mockDirectRoute(): void {
  gatewayMocks.resolveDirectGatewayRoute.mockReturnValue({
    selection: { adapter: 'claude-code', modelClass: 'sonnet' },
    adapter: 'claude-code',
    apiKey: 'test-key',
    model: 'sonnet',
    transport: 'anthropic',
  });
}

async function waitFor(
  condition: () => boolean,
  description: string,
): Promise<void> {
  const deadline = Date.now() + 1000;
  while (!condition()) {
    if (Date.now() > deadline) {
      throw new Error(
        `Timed out waiting for ${description}\n` +
          `gatewayCalls=${gatewayMocks.completeGatewayText.mock.calls.length}\n` +
          `messages=${JSON.stringify(useStore.getState().messages, null, 2)}`,
      );
    }
    await new Promise((resolve) => setTimeout(resolve, 0));
  }
}

afterEach(() => {
  gatewayMocks.completeGatewayText.mockReset();
  gatewayMocks.resolveDirectGatewayRoute.mockReset();
  resetStore(defaultBlueprint('Current workflow'));
  window.localStorage.clear();
});

describe('simple-workflow chat mode', () => {
  it('creates plain chat history entries with an untitled session placeholder', async () => {
    window.localStorage.clear();
    await historyStore.ready();
    const workspace = await historyStore.resolveWorkspaceByPath('');
    resetStore(defaultBlueprint('Current workflow'));
    useStore.setState({
      historyReady: true,
      activeWorkspaceId: workspace.id,
      workspaces: [workspace],
      sessions: [],
      sessionTree: { [workspace.id]: [] },
      locale: 'zh-CN',
    });

    useStore.getState().newSession();

    await waitFor(
      () => useStore.getState().sessions[0]?.title === '未命名会话',
      'plain chat session history title',
    );

    const session = useStore.getState().sessions[0];
    const record = await historyStore.getSession(workspace.id, session.id);

    expect(session.isWorkflow).toBe(false);
    expect(session.title).toBe('未命名会话');
    expect(record?.title).toBe('未命名会话');
    expect(record?.isWorkflow).toBe(false);
  });

  it('creates history entries with an untitled session placeholder', async () => {
    window.localStorage.clear();
    await historyStore.ready();
    const workspace = await historyStore.resolveWorkspaceByPath('');
    resetStore(defaultBlueprint('Current workflow'));
    useStore.setState({
      historyReady: true,
      activeWorkspaceId: workspace.id,
      workspaces: [workspace],
      sessions: [],
      sessionTree: { [workspace.id]: [] },
      locale: 'zh-CN',
    });

    useStore.getState().newSimpleWorkflow();

    await waitFor(
      () => useStore.getState().sessions[0]?.title === '未命名会话',
      'simple session history title',
    );

    const state = useStore.getState();
    const session = state.sessions[0];
    const record = await historyStore.getSession(workspace.id, session.id);

    expect(state.workflow.meta.simple).toBe(true);
    expect(state.workflow.meta.name).toBe('未命名会话');
    expect(session.title).toBe('未命名会话');
    expect(record?.title).toBe('未命名会话');
    expect(record?.workflow?.meta.name).toBe('未命名会话');
  });

  it('localizes the untitled session placeholder', () => {
    expect(simpleBlueprint(undefined, 'en-US').meta.name).toBe('Untitled Session');
    expect(simpleBlueprint(undefined, 'ja-JP').meta.name).toBe('無題のセッション');
    expect(simpleBlueprint(undefined, 'ko-KR').meta.name).toBe('제목 없는 세션');
  });

  it('answers directly without generating an IRGraph and keeps a single node', async () => {
    resetStore(simpleBlueprint('Simple chat'));
    mockDirectRoute();
    const requests: Array<{ system: string; userContent: string }> = [];
    gatewayMocks.completeGatewayText.mockImplementation(async (request) => {
      requests.push({
        system: String(request.system),
        userContent: String(request.userContent),
      });
      return '这是直接的回答。';
    });

    useStore.getState().sendPrompt('帮我算一下 2 加 2 等于几？');

    await waitFor(
      () =>
        !useStore.getState().aiStreaming &&
        useStore.getState().messages.some((m) => m.role === 'assistant'),
      'the assistant answer',
    );

    // Exactly one model call, no blueprint generation.
    expect(gatewayMocks.completeGatewayText).toHaveBeenCalledTimes(1);
    // Uses the plain-chat system prompt, NOT the blueprint editor prompt.
    expect(requests[0].system).toContain('简单 Workflow');
    expect(requests[0].system).not.toContain('IRGraph 结构');
    // The model was NOT asked to produce a graph and none was applied.
    expect(requests[0].userContent).not.toContain('IRGraph');
    const graph = useStore.getState().workflow;
    expect(graph.meta.simple).toBe(true);
    expect(graph.nodes).toHaveLength(1);
    expect(graph.nodes[0].type).toBe('start');
    expect(graph.edges).toHaveLength(0);
    // The user input is recorded on the lone node; the answer stays in messages.
    expect(graph.nodes[0].params.userInputs).toContain('帮我算一下 2 加 2 等于几？');
    const assistant = useStore
      .getState()
      .messages.find((m) => m.role === 'assistant');
    expect(assistant?.text).toContain('这是直接的回答。');
  });

  it('folds prior turns into the prompt for multi-turn context', async () => {
    resetStore(simpleBlueprint('Simple chat'));
    mockDirectRoute();
    const userContents: string[] = [];
    gatewayMocks.completeGatewayText.mockImplementation(async (request) => {
      userContents.push(String(request.userContent));
      return userContents.length === 1 ? '北京是中国的首都。' : '它大约有 2000 多万人口。';
    });

    useStore.getState().sendPrompt('中国的首都是哪里？');
    await waitFor(
      () => !useStore.getState().aiStreaming && userContents.length === 1,
      'the first answer',
    );

    useStore.getState().sendPrompt('那它有多少人口？');
    await waitFor(
      () => !useStore.getState().aiStreaming && userContents.length === 2,
      'the second answer',
    );

    // First turn: just the question, no transcript.
    expect(userContents[0]).toContain('中国的首都是哪里？');
    expect(userContents[0]).not.toContain('助手：');
    // Second turn: prior conversation is folded in as context.
    expect(userContents[1]).toContain('之前的对话');
    expect(userContents[1]).toContain('中国的首都是哪里？');
    expect(userContents[1]).toContain('北京是中国的首都。');
    expect(userContents[1]).toContain('那它有多少人口？');

    // Both inputs accumulate on the single node.
    const node = useStore.getState().workflow.nodes[0];
    expect(node.params.userInputs).toEqual([
      '中国的首都是哪里？',
      '那它有多少人口？',
    ]);
  });

  it('does NOT enter chat mode for a normal workflow (blueprint generation path)', async () => {
    resetStore(defaultBlueprint('Normal workflow'));
    mockDirectRoute();
    const requests: Array<{ system: string }> = [];
    gatewayMocks.completeGatewayText.mockImplementation(async (request) => {
      requests.push({ system: String(request.system) });
      // Return prose (no graph) so the turn finalizes quickly.
      return '这是一个说明。';
    });

    useStore.getState().sendPrompt('随便说点什么。');
    await waitFor(
      () => !useStore.getState().aiStreaming && requests.length >= 1,
      'the normal workflow call',
    );

    // Normal mode uses the blueprint editor system prompt, not the chat one.
    expect(requests[0].system).toContain('IRGraph 结构');
    expect(requests[0].system).not.toContain('简单 Workflow');
  });

  it('surfaces as chatting (not blueprint editing) and never locks the workflow read-only', async () => {
    resetStore(simpleBlueprint('Simple chat'));
    mockDirectRoute();
    let resolveReply!: (value: string) => void;
    gatewayMocks.completeGatewayText.mockImplementation(
      async () => new Promise<string>((resolve) => (resolveReply = resolve)),
    );

    useStore.getState().sendPrompt('第一个问题');
    await waitFor(() => useStore.getState().aiStreaming, 'chat to start');

    // In flight: a chat turn is busy but NOT a blueprint edit, and the workflow
    // is NOT read-only (so the user can keep chatting).
    const state = useStore.getState();
    expect(state.chattingSessions.length).toBe(1);
    expect(state.aiEditingSessions.length).toBe(0);
    expect(isWorkflowReadOnly(state)).toBe(false);
    expect(isActiveAiEditingSession(state)).toBe(false);

    resolveReply('回答一');
    await waitFor(
      () => !useStore.getState().aiStreaming,
      'chat to finish',
    );
    expect(useStore.getState().chattingSessions.length).toBe(0);
  });

  it('allows sending a second chat message while the first is still streaming', async () => {
    resetStore(simpleBlueprint('Simple chat'));
    mockDirectRoute();
    const resolvers: Array<(value: string) => void> = [];
    gatewayMocks.completeGatewayText.mockImplementation(
      async () => new Promise<string>((resolve) => resolvers.push(resolve)),
    );

    useStore.getState().sendPrompt('问题一');
    await waitFor(() => resolvers.length === 1, 'first chat call');

    // Second send must NOT be rejected by the read-only gate.
    useStore.getState().sendPrompt('问题二');
    await waitFor(() => resolvers.length === 2, 'second chat call (not blocked)');

    expect(gatewayMocks.completeGatewayText).toHaveBeenCalledTimes(2);
    for (const resolve of resolvers) resolve('答');
    await waitFor(
      () => !useStore.getState().aiStreaming,
      'all chat turns to finish',
    );
  });
});
