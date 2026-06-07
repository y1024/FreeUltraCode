import { DATA, type IRGraph, type IRNode, type NodeType } from './ir';

export type ManifestRoutingTier =
  | 'simple'
  | 'standard'
  | 'complex'
  | 'reasoning';

export type ManifestModelClass = 'haiku' | 'sonnet' | 'opus';

export interface ManifestRoutingDecision {
  tier: ManifestRoutingTier;
  modelClass: ManifestModelClass;
  score: number;
  confidence: number;
  reasons: string[];
}

export interface ManifestTaskInput {
  nodeType?: NodeType | 'spec';
  label?: string;
  prompt?: string;
  agentType?: string;
  schema?: string;
  fanOutCount?: number;
  stageCount?: number;
  dataInputCount?: number;
  upstreamChars?: number;
  isTerminal?: boolean;
}

export interface ManifestSpecLike {
  prompt: string;
  label?: string;
  agentType?: string;
  schema?: string;
}

const SIMPLE_TERMS = [
  '翻译',
  '改写',
  '润色',
  '格式',
  '摘要',
  '总结',
  '提取',
  '分类',
  '重命名',
  '命名',
  'translate',
  'rewrite',
  'polish',
  'format',
  'summarize',
  'summary',
  'extract',
  'classify',
  'rename',
] as const;

const COMPLEX_TERMS = [
  '实现',
  '开发',
  '代码',
  '审查',
  '调试',
  '修复',
  '重构',
  '迁移',
  '架构',
  '并发',
  '性能',
  '安全',
  '测试',
  '回归',
  '多步骤',
  '规划',
  '分析',
  '优化',
  '生成',
  '端到端',
  'production',
  'implement',
  'develop',
  'code',
  'review',
  'debug',
  'fix',
  'refactor',
  'migrate',
  'architecture',
  'concurrency',
  'performance',
  'security',
  'test',
  'analyze',
  'optimize',
  'typescript',
  'react',
  'rust',
  'tauri',
] as const;

const REASONING_TERMS = [
  '推理',
  '论证',
  '证明',
  '形式逻辑',
  '数学',
  '验证',
  '验收',
  '反驳',
  '证伪',
  '对抗',
  '共识',
  '投票',
  '根因',
  '风险',
  '威胁建模',
  '一致性',
  'reason',
  'reasoning',
  'prove',
  'proof',
  'logic',
  'verify',
  'validate',
  'adversarial',
  'consensus',
  'vote',
  'root cause',
  'race condition',
  'threat model',
] as const;

function compactText(parts: Array<string | undefined>): string {
  return parts
    .map((part) => part?.trim())
    .filter((part): part is string => !!part)
    .join('\n');
}

function countIncludes(text: string, terms: readonly string[]): number {
  const lower = text.toLowerCase();
  return terms.reduce((count, term) => {
    return lower.includes(term.toLowerCase()) ? count + 1 : count;
  }, 0);
}

function add(
  state: { score: number; reasons: string[] },
  amount: number,
  reason: string,
): void {
  state.score += amount;
  state.reasons.push(reason);
}

function modelClassForTier(tier: ManifestRoutingTier): ManifestModelClass {
  if (tier === 'simple') return 'haiku';
  if (tier === 'standard') return 'sonnet';
  return 'opus';
}

function confidenceFor(score: number, tier: ManifestRoutingTier): number {
  const center =
    tier === 'simple'
      ? -0.08
      : tier === 'standard'
        ? 0.16
        : tier === 'complex'
          ? 0.42
          : 0.68;
  const distance = Math.min(0.4, Math.abs(score - center));
  return Number((0.55 + distance).toFixed(2));
}

export function scoreManifestTask(
  input: ManifestTaskInput,
): ManifestRoutingDecision {
  const text = compactText([input.label, input.agentType, input.prompt]);
  const state = { score: 0, reasons: [] as string[] };
  const length = text.length;

  if (length <= 80) add(state, -0.1, '短提示');
  else if (length > 1800) add(state, 0.22, '长提示');
  else if (length > 700) add(state, 0.14, '中长提示');
  else if (length > 260) add(state, 0.06, '提示较长');

  const simpleMatches = countIncludes(text, SIMPLE_TERMS);
  const complexMatches = countIncludes(text, COMPLEX_TERMS);
  const reasoningMatches = countIncludes(text, REASONING_TERMS);
  if (simpleMatches > 0) {
    add(state, -Math.min(0.2, simpleMatches * 0.05), '简单任务关键词');
  }
  if (complexMatches > 0) {
    add(state, Math.min(0.32, complexMatches * 0.06), '复杂任务关键词');
  }
  if (reasoningMatches > 0) {
    add(state, Math.min(0.42, reasoningMatches * 0.1), '推理/验证关键词');
  }

  if (input.schema) add(state, 0.12, '结构化输出约束');

  const fanOut = Math.max(0, input.fanOutCount ?? 0);
  if (fanOut >= 8) add(state, 0.24, '大规模扇出');
  else if (fanOut >= 4) add(state, 0.16, '多分支扇出');
  else if (fanOut >= 2) add(state, 0.08, '并行分支');

  const stages = Math.max(0, input.stageCount ?? 0);
  if (stages >= 4) add(state, 0.16, '多阶段流水线');
  else if (stages >= 2) add(state, 0.08, '流水线阶段');

  const dataInputs = Math.max(0, input.dataInputCount ?? 0);
  if (dataInputs >= 3) add(state, 0.1, '多路上游数据');
  else if (dataInputs >= 1) add(state, 0.04, '依赖上游数据');

  const upstream = Math.max(0, input.upstreamChars ?? 0);
  if (upstream > 12000) add(state, 0.18, '大量上游上下文');
  else if (upstream > 4000) add(state, 0.1, '较多上游上下文');

  if (input.isTerminal && reasoningMatches > 0) {
    add(state, 0.08, '末端验证/汇总');
  }

  switch (input.nodeType) {
    case 'consensus':
      add(state, 0.38, '共识节点');
      break;
    case 'workflow':
      add(state, 0.2, '子工作流节点');
      break;
    case 'composite':
      add(state, 0.18, '复合节点');
      break;
    case 'parallel':
    case 'pipeline':
      add(state, 0.08, '编排容器');
      break;
    default:
      break;
  }

  const score = Number(state.score.toFixed(3));
  const tier: ManifestRoutingTier =
    reasoningMatches >= 2 || score >= 0.62
      ? 'reasoning'
      : score >= 0.3
        ? 'complex'
        : score >= 0.04
          ? 'standard'
          : 'simple';

  return {
    tier,
    modelClass: modelClassForTier(tier),
    score,
    confidence: confidenceFor(score, tier),
    reasons: state.reasons.length ? state.reasons : ['默认标准任务'],
  };
}

function dataInputCount(node: IRNode, workflow: IRGraph): number {
  return workflow.edges.filter(
    (edge) => edge.kind === DATA && edge.to.node === node.id,
  ).length;
}

function arrayParamLength(value: unknown): number {
  return Array.isArray(value) ? value.length : 0;
}

function specTexts(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.map((item) => {
    if (typeof item === 'string') return item;
    if (item && typeof item === 'object') {
      const record = item as Record<string, unknown>;
      return compactText([
        typeof record.label === 'string' ? record.label : undefined,
        typeof record.agentType === 'string' ? record.agentType : undefined,
        typeof record.prompt === 'string' ? record.prompt : undefined,
      ]);
    }
    return '';
  });
}

function nodePrompt(node: IRNode): string {
  if (typeof node.params.prompt === 'string') return node.params.prompt;
  if (node.type === 'workflow') {
    return compactText([
      node.label,
      typeof node.params.name === 'string' ? node.params.name : undefined,
    ]);
  }
  if (node.type === 'parallel') {
    return specTexts(node.params.branches).join('\n');
  }
  if (node.type === 'pipeline') {
    return specTexts(node.params.stages).join('\n');
  }
  if (node.type === 'consensus') {
    return specTexts(node.params.voters).join('\n');
  }
  return node.label ?? '';
}

export function scoreManifestNode(
  node: IRNode,
  workflow: IRGraph,
  opts: {
    upstreamChars?: number;
    isTerminal?: boolean;
  } = {},
): ManifestRoutingDecision {
  const fanOut =
    node.type === 'parallel'
      ? arrayParamLength(node.params.branches)
      : node.type === 'consensus'
        ? arrayParamLength(node.params.voters)
        : 0;
  const stageCount =
    node.type === 'pipeline' ? arrayParamLength(node.params.stages) : 0;
  const schema =
    typeof node.params.schema === 'string' ? node.params.schema : undefined;
  return scoreManifestTask({
    nodeType: node.type,
    label: node.label,
    prompt: nodePrompt(node),
    agentType:
      typeof node.params.agentType === 'string'
        ? node.params.agentType
        : undefined,
    schema,
    fanOutCount: fanOut,
    stageCount,
    dataInputCount: dataInputCount(node, workflow),
    upstreamChars: opts.upstreamChars,
    isTerminal: opts.isTerminal,
  });
}

export function scoreManifestSpec(
  spec: ManifestSpecLike,
  opts: {
    parentType?: NodeType;
    upstreamChars?: number;
  } = {},
): ManifestRoutingDecision {
  return scoreManifestTask({
    nodeType: 'spec',
    label: spec.label,
    prompt: spec.prompt,
    agentType: spec.agentType,
    schema: spec.schema,
    upstreamChars: opts.upstreamChars,
    fanOutCount: opts.parentType === 'parallel' ? 2 : 0,
  });
}

