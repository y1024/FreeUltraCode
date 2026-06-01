/**
 * Fix i18n by processing locales in REVERSE order.
 * This way, insertions in later locales don't shift positions of earlier ones.
 */
const fs = require('fs');

let content = fs.readFileSync('src/lib/i18n.ts', 'utf8');

// Node type translations
const NODE_TYPE = {
  'zh-CN': [
    "    'nodeType.agent': '智能体',", "    'nodeType.parallel': '并行',",
    "    'nodeType.pipeline': '流水线',", "    'nodeType.consensus': '共识投票',",
    "    'nodeType.phase': '阶段',", "    'nodeType.branch': '分支',",
    "    'nodeType.loop': '循环',", "    'nodeType.workflow': '子工作流',",
    "    'nodeType.log': '日志',", "    'nodeType.variable': '变量',",
    "    'nodeType.codeblock': '代码块',", "    'nodeType.start': '开始',",
    "    'nodeType.end': '结束',",
  ],
  'en-US': [
    "    'nodeType.agent': 'Agent',", "    'nodeType.parallel': 'Parallel',",
    "    'nodeType.pipeline': 'Pipeline',", "    'nodeType.consensus': 'Consensus',",
    "    'nodeType.phase': 'Phase',", "    'nodeType.branch': 'Branch',",
    "    'nodeType.loop': 'Loop',", "    'nodeType.workflow': 'Sub-workflow',",
    "    'nodeType.log': 'Log',", "    'nodeType.variable': 'Variable',",
    "    'nodeType.codeblock': 'Code block',", "    'nodeType.start': 'Start',",
    "    'nodeType.end': 'End',",
  ],
  'es-ES': [
    "    'nodeType.agent': 'Agente',", "    'nodeType.parallel': 'Paralelo',",
    "    'nodeType.pipeline': 'Pipeline',", "    'nodeType.consensus': 'Consenso',",
    "    'nodeType.phase': 'Fase',", "    'nodeType.branch': 'Rama',",
    "    'nodeType.loop': 'Bucle',", "    'nodeType.workflow': 'Subflujo',",
    "    'nodeType.log': 'Registro',", "    'nodeType.variable': 'Variable',",
    "    'nodeType.codeblock': 'Bloque de código',", "    'nodeType.start': 'Inicio',",
    "    'nodeType.end': 'Fin',",
  ],
  'fr-FR': [
    "    'nodeType.agent': 'Agent',", "    'nodeType.parallel': 'Parallèle',",
    "    'nodeType.pipeline': 'Pipeline',", "    'nodeType.consensus': 'Consensus',",
    "    'nodeType.phase': 'Phase',", "    'nodeType.branch': 'Branche',",
    "    'nodeType.loop': 'Boucle',", "    'nodeType.workflow': 'Sous-flux',",
    "    'nodeType.log': 'Journal',", "    'nodeType.variable': 'Variable',",
    "    'nodeType.codeblock': 'Bloc de code',", "    'nodeType.start': 'Début',",
    "    'nodeType.end': 'Fin',",
  ],
  'ru-RU': [
    "    'nodeType.agent': 'Агент',", "    'nodeType.parallel': 'Параллельно',",
    "    'nodeType.pipeline': 'Конвейер',", "    'nodeType.consensus': 'Консенсус',",
    "    'nodeType.phase': 'Фаза',", "    'nodeType.branch': 'Ветвление',",
    "    'nodeType.loop': 'Цикл',", "    'nodeType.workflow': 'Подпроцесс',",
    "    'nodeType.log': 'Журнал',", "    'nodeType.variable': 'Переменная',",
    "    'nodeType.codeblock': 'Блок кода',", "    'nodeType.start': 'Начало',",
    "    'nodeType.end': 'Конец',",
  ],
  'ar-SA': [
    "    'nodeType.agent': 'وكيل',", "    'nodeType.parallel': 'متوازي',",
    "    'nodeType.pipeline': 'خط أنابيب',", "    'nodeType.consensus': 'إجماع',",
    "    'nodeType.phase': 'مرحلة',", "    'nodeType.branch': 'تفرع',",
    "    'nodeType.loop': 'حلقة',", "    'nodeType.workflow': 'سير عمل فرعي',",
    "    'nodeType.log': 'سجل',", "    'nodeType.variable': 'متغير',",
    "    'nodeType.codeblock': 'كتلة تعليمات برمجية',", "    'nodeType.start': 'بداية',",
    "    'nodeType.end': 'نهاية',",
  ],
  'hi-IN': [
    "    'nodeType.agent': 'एजेंट',", "    'nodeType.parallel': 'समानांतर',",
    "    'nodeType.pipeline': 'पाइपलाइन',", "    'nodeType.consensus': 'आम सहमति',",
    "    'nodeType.phase': 'चरण',", "    'nodeType.branch': 'शाखा',",
    "    'nodeType.loop': 'लूप',", "    'nodeType.workflow': 'उप-कार्यप्रवाह',",
    "    'nodeType.log': 'लॉग',", "    'nodeType.variable': 'चर',",
    "    'nodeType.codeblock': 'कोड ब्लॉक',", "    'nodeType.start': 'शुरू',",
    "    'nodeType.end': 'समाप्त',",
  ],
  'ja-JP': [
    "    'nodeType.agent': 'エージェント',", "    'nodeType.parallel': '並列',",
    "    'nodeType.pipeline': 'パイプライン',", "    'nodeType.consensus': '合意形成',",
    "    'nodeType.phase': 'フェーズ',", "    'nodeType.branch': '分岐',",
    "    'nodeType.loop': 'ループ',", "    'nodeType.workflow': 'サブワークフロー',",
    "    'nodeType.log': 'ログ',", "    'nodeType.variable': '変数',",
    "    'nodeType.codeblock': 'コードブロック',", "    'nodeType.start': '開始',",
    "    'nodeType.end': '終了',",
  ],
  'pt-BR': [
    "    'nodeType.agent': 'Agente',", "    'nodeType.parallel': 'Paralelo',",
    "    'nodeType.pipeline': 'Pipeline',", "    'nodeType.consensus': 'Consenso',",
    "    'nodeType.phase': 'Fase',", "    'nodeType.branch': 'Ramificação',",
    "    'nodeType.loop': 'Ciclo',", "    'nodeType.workflow': 'Subfluxo',",
    "    'nodeType.log': 'Registo',", "    'nodeType.variable': 'Variável',",
    "    'nodeType.codeblock': 'Bloco de código',", "    'nodeType.start': 'Início',",
    "    'nodeType.end': 'Fim',",
  ],
  'de-DE': [
    "    'nodeType.agent': 'Agent',", "    'nodeType.parallel': 'Parallel',",
    "    'nodeType.pipeline': 'Pipeline',", "    'nodeType.consensus': 'Konsens',",
    "    'nodeType.phase': 'Phase',", "    'nodeType.branch': 'Verzweigung',",
    "    'nodeType.loop': 'Schleife',", "    'nodeType.workflow': 'Unterworkflow',",
    "    'nodeType.log': 'Protokoll',", "    'nodeType.variable': 'Variable',",
    "    'nodeType.codeblock': 'Codeblock',", "    'nodeType.start': 'Start',",
    "    'nodeType.end': 'Ende',",
  ],
};

// Value fixes per locale
const VALUE_FIXES = {
  'es-ES': { "settings.generalTitle": "Configuración general" },
  'fr-FR': {
    "inspector.branchesLabel": "Branches (branches parallèles)",
    "inspector.stagesLabel": "Étapes (pipeline)",
    "inspector.ifCondition": "Condition (si)",
    "inspector.whileCondition": "Condition (tant que)",
  },
  'de-DE': {
    "inspector.branchesLabel": "Zweige (parallele Zweige)",
    "inspector.addBranch": "+ Zweig",
    "inspector.stagesLabel": "Stufen (Pipeline)",
    "inspector.addStage": "+ Stufe",
    "inspector.addVoter": "+ Prüfer",
    "settings.aboutWebsite": "Webseite",
    "settings.aboutChangelog": "Änderungsprotokoll",
    "settings.appearancePresetMidnight": "Mitternacht",
    "settings.appearancePresetDaylight": "Tageslicht",
    "settings.appearancePresetEmber": "Glut",
  },
  'pt-BR': { "settings.cliAuto": "Automático" },
};

// Process locales in REVERSE order
const localeOrder = ['de-DE', 'pt-BR', 'ja-JP', 'hi-IN', 'ar-SA', 'ru-RU', 'fr-FR', 'es-ES', 'en-US', 'zh-CN'];
const uiFullIdx = content.indexOf('const UI_FULL = {');

let totalNodeFixes = 0;
let totalValueFixes = 0;

for (let idx = 0; idx < localeOrder.length; idx++) {
  const locale = localeOrder[idx];
  console.log(`\n--- ${locale} ---`);

  // Find locale marker in UI_FULL
  const localeMarker = `'${locale}': {`;
  const localeStart = content.indexOf(localeMarker, uiFullIdx);
  if (localeStart === -1) { console.log(`  Cannot find marker`); continue; }

  // Find the next marker to determine the section's end
  // For the last locale (de-DE in original order, but we process it first),
  // the next marker is } as const;
  const originalIdx = ['zh-CN', 'en-US', 'es-ES', 'fr-FR', 'ru-RU', 'ar-SA', 'hi-IN', 'ja-JP', 'pt-BR', 'de-DE'].indexOf(locale);
  let nextMarker;
  if (originalIdx < 9) {
    const nextLocale = ['zh-CN', 'en-US', 'es-ES', 'fr-FR', 'ru-RU', 'ar-SA', 'hi-IN', 'ja-JP', 'pt-BR', 'de-DE'][originalIdx + 1];
    nextMarker = `'${nextLocale}': {`;
  } else {
    nextMarker = '} as const;';
  }

  const nextIdx = content.indexOf(nextMarker, localeStart + localeMarker.length);
  if (nextIdx === -1) { console.log(`  Cannot find next marker '${nextMarker}'`); continue; }

  // Find the "  }," just before the next marker
  // Start searching from just before the next marker (not at it)
  let closeBrace = nextIdx - 1;
  while (closeBrace > localeStart && content[closeBrace] !== '}') {
    closeBrace--;
  }
  // closeBrace is at the } of "  },"
  // Find the newline before it (start of the "  }" line)
  let insertPos = closeBrace;
  while (insertPos > localeStart && content[insertPos - 1] !== '\n') {
    insertPos--;
  }

  // Build insertion text: value fixes + nodeType keys
  const parts = [];

  // Value fixes: we need to modify existing lines BEFORE the closing brace
  // Process them by replacing values in the section text
  const fixes = VALUE_FIXES[locale];
  if (fixes) {
    for (const [key, newValue] of Object.entries(fixes)) {
      const keyPat = `'${key}':`;
      // Find the key within the locale section
      let searchFrom = localeStart;
      let found = false;
      while (searchFrom < closeBrace) {
        const keyIdx = content.indexOf(keyPat, searchFrom);
        if (keyIdx === -1 || keyIdx >= closeBrace) break;

        // Extract current value
        const afterKey = content.slice(keyIdx + keyPat.length);
        const qMatch = afterKey.match(/^\s*('|")/);
        if (!qMatch) { searchFrom = keyIdx + keyPat.length; continue; }

        const q = qMatch[1];
        const valStart = keyIdx + keyPat.length + qMatch[0].length;
        let vi = valStart;
        while (vi < content.length) {
          if (content[vi] === '\\') { vi += 2; continue; }
          if (content[vi] === q) break;
          vi++;
        }
        const oldVal = content.slice(valStart, vi);

        if (oldVal === newValue) { searchFrom = vi + 1; continue; }

        let newQ = q;
        if (q === "'" && newValue.includes("'")) newQ = '"';
        else if (q === '"' && newValue.includes('"')) newQ = "'";

        content = content.slice(0, valStart) + newValue + content.slice(vi);
        console.log(`  FIXED ${key}: "${oldVal}" -> "${newValue}"`);
        totalValueFixes++;

        // Recalculate positions after modification
        // Since we process in reverse order and this is the current locale,
        // the nextMarker position might shift
        const newNextIdx = content.indexOf(nextMarker, localeStart + localeMarker.length);
        if (newNextIdx !== -1) {
          // Update closeBrace and insertPos
          let cb = newNextIdx - 1;
          while (cb > localeStart && content[cb] !== '}') cb--;
          closeBrace = cb;
          insertPos = closeBrace;
          while (insertPos > localeStart && content[insertPos - 1] !== '\n') insertPos--;
        }

        found = true;
        break;
      }
      if (!found) {
        console.log(`  [WARN] Key '${key}' not found in ${locale} section`);
      }
    }
  }

  // NodeType keys: insert before the closing brace line
  const nodeTypes = NODE_TYPE[locale];
  if (nodeTypes && nodeTypes.length > 0) {
    const insertText = nodeTypes.join('\n') + '\n';
    content = content.slice(0, insertPos) + insertText + content.slice(insertPos);
    console.log(`  Added ${nodeTypes.length} nodeType keys`);
    totalNodeFixes += nodeTypes.length;
  }
}

fs.writeFileSync('src/lib/i18n.ts', content, 'utf8');
console.log(`\n=== Done ===`);
console.log(`Value fixes: ${totalValueFixes}`);
console.log(`NodeType keys: ${totalNodeFixes}`);
