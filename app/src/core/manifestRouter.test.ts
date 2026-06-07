import { describe, expect, it } from 'vitest';
import { EXEC, type IRGraph } from './ir';
import { scoreManifestNode, scoreManifestTask } from './manifestRouter';

describe('Manifest smart routing scorer', () => {
  it('routes short/simple tasks to the lightweight tier', () => {
    const decision = scoreManifestTask({
      nodeType: 'agent',
      prompt: '翻译这句话为英文。',
    });

    expect(decision.tier).toBe('simple');
    expect(decision.modelClass).toBe('haiku');
  });

  it('routes complex engineering tasks to the strong tier', () => {
    const decision = scoreManifestTask({
      nodeType: 'agent',
      prompt:
        '审查这个大型 TypeScript 重构，重点找并发 bug、数据一致性问题、安全风险和遗漏测试，并给出修复计划。',
    });

    expect(decision.tier).toMatch(/complex|reasoning/);
    expect(decision.modelClass).toBe('opus');
  });

  it('treats consensus nodes as high-complexity orchestration', () => {
    const graph: IRGraph = {
      version: 1,
      meta: { name: 'manifest scorer' },
      nodes: [
        { id: 'start', type: 'start', params: {} },
        {
          id: 'vote',
          type: 'consensus',
          label: '验收投票',
          params: {
            voters: [
              { prompt: '从正确性角度验证输出。' },
              { prompt: '从安全性角度验证输出。' },
              { prompt: '从可复现性角度验证输出。' },
            ],
            strategy: 'multi-lens',
          },
        },
        { id: 'end', type: 'end', params: {} },
      ],
      edges: [
        {
          id: 'e1',
          from: { node: 'start', port: 'exec_out' },
          to: { node: 'vote', port: 'exec_in' },
          kind: EXEC,
        },
        {
          id: 'e2',
          from: { node: 'vote', port: 'exec_out' },
          to: { node: 'end', port: 'exec_in' },
          kind: EXEC,
        },
      ],
    };

    const decision = scoreManifestNode(graph.nodes[1], graph);
    expect(decision.modelClass).toBe('opus');
    expect(decision.reasons).toContain('共识节点');
  });
});

