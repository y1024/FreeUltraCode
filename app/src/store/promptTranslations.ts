/**
 * Multi-language default translations for the prompt library.
 *
 * One record per locale (excluding zh-CN which is the DEFAULT_LOCALE and
 * en-US which already lives in `englishPromptTranslations` in sampleSessions.ts).
 *
 * Each record mirrors the structure of `englishPromptTranslations` — a map from
 * group id to { label, items: { itemId: { label, text } } }. The
 * `withDefaultTranslations()` function merges every locale into each group/item
 * `translations` field.
 *
 * Bump PROMPT_DEFAULTS_VERSION in sampleSessions.ts whenever entries are added or
 * changed so existing persisted libraries pick up the new translations.
 */

type TranslationGroup = {
  label: string;
  items: Record<string, { label: string; text: string }>;
};

type TranslationMap = Record<string, TranslationGroup>;

// ── Arabic (ar-SA) ──────────────────────────────────────────────────────────

const ar: TranslationMap = {
  interactive: {
    label: 'توضيح تفاعلي',
    items: {
      'interactive-grill': { label: 'استجواب (grill-me)', text: 'grill-me' },
      'interactive-clarify': {
        label: 'توضيح المتطلبات',
        text: 'قبل تعديل المخطط، استخدم تفاعلاً (select / input) لتأكيد القرار الأكثر غموضاً أو نقصاً. بعد إجابتي، قم فوراً بدمج الإجابة في مخطط سير العمل وأخرج IRGraph المحدّث.',
      },
    },
  },
  clarity: {
    label: 'وضوح',
    items: {
      'clarity-goal': {
        label: 'تحديد الهدف',
        text: 'وضّح الهدف النهائي ومعايير النجاح لسير العمل هذا، ولخّص مسؤولية كل عقدة في جملة واحدة.',
      },
      'clarity-naming': {
        label: 'توحيد التسمية',
        text: 'تحقق من أن تسميات العقد وأسماء المعاملات واضحة ومتسقة، وأعد تسمية العقد الغامضة.',
      },
      'clarity-simplify': {
        label: 'تبسيط الهيكل',
        text: 'حدد الخطوات المتكررة التي يمكن دمجها أو حذفها لجعل سلسلة التنفيذ الرئيسية أكثر وضوحاً.',
      },
    },
  },
  completeness: {
    label: 'اكتمال',
    items: {
      'completeness-edges': {
        label: 'تغطية الحالات الطرفية',
        text: 'اسرد الحالات الطرفية غير المعالجة وأضف عقد branch للمسارات المفقودة.',
      },
      'completeness-errors': {
        label: 'معالجة الأخطاء',
        text: 'أضف مسارات معالجة الفشل لكل عقدة agent حتى لا تؤدي الاستثناءات إلى مقاطعة سير العمل بالكامل.',
      },
      'completeness-data': {
        label: 'توصيل البيانات',
        text: 'تحقق من أن نتائج المراجعات المتوازية الثلاث كلها موصولة إلى خطوة verify، وأكمل أي data edges ناقصة.',
      },
    },
  },
  cost: {
    label: 'تكلفة',
    items: {
      'cost-model': {
        label: 'تخفيض النموذج',
        text: 'انقل العقد منخفضة التعقيد إلى نماذج أرخص مثل haiku، وقدّر التوفير في التكلفة.',
      },
      'cost-parallel': {
        label: 'تحسين التوازي',
        text: 'حدد الخطوات التي يمكن تنفيذها بالتوازي وأعد تنظيمها في عقدة parallel لتقليل المدة الإجمالية.',
      },
      'cost-cache': {
        label: 'إعادة الاستخدام والتخزين المؤقت',
        text: 'ابحث عن المخرجات الوسيطة التي يمكن تخزينها مؤقتاً أو إعادة استخدامها لتجنب استدعاءات agent المتكررة.',
      },
    },
  },
  structure: {
    label: 'هيكل',
    items: {
      'structure-split': {
        label: 'تقسيم المسؤوليات',
        text: 'راجع مسؤولية كل عقدة agent. قسّم agent المتضخمة إلى عقد agent ذات مسؤولية واحدة وأعد توصيلها بـ exec edges حسب ترتيب التبعية لتقليل نقاط الفشل المنفردة.',
      },
      'structure-parallelize': {
        label: 'إعادة التنظيم المتوازي',
        text: 'ابحث عن عقد agent المتسلسلة على المحور التنفيذي التي ليس بينها تبعية بيانات. انقلها إلى كتلة parallel، مع إبقاء العقد المترابطة في pipeline لتقصير المسار الحرج.',
      },
      'structure-phase': {
        label: 'تجميع المراحل',
        text: 'استخدم عقد phase لتقسيم سير العمل إلى مراحل منطقية مثل جمع ← تحليل ← تنفيذ ← تلخيص. ضع agents ذات الصلة في phase المناسب.',
      },
      'structure-converge': {
        label: 'تجميع النتائج',
        text: 'أضف عقدة agent تجميعية بعد كل كتلة parallel. وصّل مخرجات كل فرع متوازي إليها بـ data edges ليحصل downstream على نقطة تقارب واحدة.',
      },
      'structure-explicit-data': {
        label: 'حواف بيانات صريحة',
        text: 'راجع التمرير الضمني للسياق بين العقد. أضف data edges صريحة للتبعيات الحقيقية واحذف التوصيلات الزائدة أو المكررة.',
      },
    },
  },
  reliability: {
    label: 'موثوقية',
    items: {
      'reliability-retry': {
        label: 'إعادة المحاولة مع تراجع',
        text: 'أضف إعدادات إعادة المحاولة لعقد agent التي تستدعي أدوات خارجية أو قد تفشل عابراً — حوالي 3 محاولات مع تراجع أسي وتشتيت. لاحظ أن إعادة المحاولة يجب أن تكون متكافئة.',
      },
      'reliability-fallback': {
        label: 'مسار التراجع',
        text: 'أضف مستويات تراجع قائمة على branch للعقد الحرجة: عند الفشل، تراجع إلى عقدة قواعد أبسط، ثم نموذج أرخص، ثم قائمة انتظار بشرية.',
      },
      'reliability-boundary': {
        label: 'حدود الخطأ',
        text: 'استخدم عقد branch لإنشاء حدود خطأ للعقد عالية المخاطر. وجّه مسارات الفشل إلى فروع معالجة أو تنبيه.',
      },
      'reliability-idempotent': {
        label: 'التكافؤ والمهلة',
        text: 'راجع agents ذات التأثيرات الجانبية. أضف مفاتيح تكافؤ لتجنب الإجراءات المكررة أثناء إعادة المحاولة، وحدد مهلات لاستدعاءات LLM.',
      },
      'reliability-loop-fuse': {
        label: 'صمام الحلقة',
        text: 'تحقق من أن عقد loop لديها عدد تكرار أقصى واضح وشرط خروج. أضف منطق قطع الدائرة لمنع الحلقات اللانهائية.',
      },
      'reliability-production-grade': {
        label: 'موثوقية إنتاجية',
        text: 'هذا الكود للإنتاج. يجب أن يتمتع بموثوقية على مستوى المؤسسات؛ لا تستخدم نهج MVP (الحد الأدنى من المنتج القابل للتطبيق).',
      },
    },
  },
  performance: {
    label: 'أداء وتوازي',
    items: {
      'performance-critical-path': {
        label: 'المسار الحرج',
        text: 'حلل أطول سلسلة تبعية على المحور التنفيذي. حدد عقد agent التي يمكن تقديمها أو موازنتها لضغط زمن الاستجابة الكلي.',
      },
      'performance-model-tier': {
        label: 'تصنيف النماذج',
        text: 'راجع إعدادات النموذج لكل عقدة. استخدم نماذج أخف مثل haiku للتصنيف البسيط أو الاستخراج، واحتفظ بالنماذج القوية للاستدلال المعقد.',
      },
      'performance-dedupe': {
        label: 'إزالة التكرار',
        text: 'ابحث عن agents تكرر عملاً متماثلاً. ادمجها في عقدة واحدة قابلة لإعادة الاستخدام ووزّع مخرجاتها بـ data edges.',
      },
      'performance-fanout': {
        label: 'التحكم في الانتشار',
        text: 'تحقق من عرض انتشار كتل parallel. أضف حدود تزامن معقولة أو تجميع على دفعات.',
      },
    },
  },
  verification: {
    label: 'تحقق واختبار',
    items: {
      'verification-verifier': {
        label: 'عقدة التحقق',
        text: 'أدخل عقدة verifier agent بعد agents المخرجات الحرجة. غذِّ المخرجات القادمة عبر data edges وتحقق منها مقابل معايير نجاح واضحة وسلم تقدير.',
      },
      'verification-adversarial': {
        label: 'فحص عدائي',
        text: 'أضف عقدة agent عدائية أو فريق أحمر لخطوات إدخال المستخدم أو القرارات عالية المخاطر. حاكِ سيناريوهات تجاوز الامتيازات والحقن.',
      },
      'verification-selfcheck': {
        label: 'حلقة الفحص الذاتي',
        text: 'أضف حلقة فحص ذاتي لعقد agent المنتجة للمخرجات. استخدم loop أو branch لتتحقق من التنسيق والقيود، وتصحح مرة واحدة، ثم تطلق النتيجة.',
      },
      'verification-criteria': {
        label: 'معايير النجاح',
        text: 'أضف معايير نجاح قابلة للاختبار وعقود مخرجات لكل عقدة agent، تشمل التنسيق والطول والحقول المطلوبة.',
      },
    },
  },
  observability: {
    label: 'قابلية الملاحظة',
    items: {
      'observability-logs': {
        label: 'سجلات رئيسية',
        text: 'أدخل عقد log عند كل حدود phase وعند مخرجات agent الحرجة. سجّل معرف الخطوة وملخص الإدخال وحالة النتيجة.',
      },
      'observability-branch': {
        label: 'رؤية الفروع',
        text: 'أضف عقد log لمسارات الفشل في كل فرع تراجع أو خطأ. التقط سياق الفشل (الإدخال، الخطوة، الحالة).',
      },
      'observability-parallel': {
        label: 'تتبع متوازي',
        text: 'أضف عقد log بمعرف ارتباط موحد داخل كل فرع parallel. سجّل مدة كل agent ومخرجاته.',
      },
      'observability-audit': {
        label: 'أثر التدقيق',
        text: 'أضف عقد log حول agents ذات الصلاحيات العالية أو التأثيرات الجانبية الخارجية. سجّل أدلة القرار والبيانات الوصفية الرئيسية.',
      },
    },
  },
  security: {
    label: 'أمان وصلاحيات',
    items: {
      'security-approval': {
        label: 'موافقة بشرية',
        text: 'أدخل عقدة branch للموافقة البشرية قبل إجراءات agent عالية التأثير أو غير قابلة للعكس مثل الحذف أو الدفع أو الإرسال الخارجي.',
      },
      'security-scope': {
        label: 'حدود الصلاحية',
        text: 'راجع agents التي تصل إلى أنظمة خارجية أو بيانات حساسة. استخدم عقد branch أو log قبلها وبعدها لتضييق نطاق الصلاحية.',
      },
      'security-redact': {
        label: 'حجب البيانات الحساسة',
        text: 'أضف عقد حجب أو تقليل بيانات حيث تمر الحقول الحساسة عبر السجلات أو بين agents. مرر فقط السياق الضروري.',
      },
      'security-escalate': {
        label: 'تصعيد الاستثناءات',
        text: 'أضف فرع تراجع بشري في نهاية سلسلة تراجع الموثوقية. عندما تفشل إعادة المحاولة والتخفيض، وجّه المهمة إلى قائمة انتظار بشرية.',
      },
    },
  },
  'ui-ux': {
    label: 'واجهة وتجربة',
    items: {
      'ui-visual-review': {
        label: 'مراجعة بصرية',
        text: 'أدخل عقدة agent لمراجعة تصميم واجهة المستخدم بعد agents التي تولد مخرجات واجهة أو أمامية. تحقق من المحاذاة والتباعد والتباين والتسلسل الهرمي الطباعي والاتساق البصري.',
      },
      'ui-theme-switch': {
        label: 'تبديل الأنماط',
        text: 'أضف دعمًا لسمات/أنماط متعددة. استخرج ألوان التصميم وأحجام الخطوط وقيم الانحناء إلى عقد variable، وأضف agent لتوليد نماذج فاتحة/داكنة وعلامات تجارية متنوعة.',
      },
      'ui-responsive': {
        label: 'تكيف متجاوب',
        text: 'أضف كتلة parallel تفحص تخطيطات الحاسب واللوحي والجوال بالتوازي. حدد مشاكل المحاذاة والفيضان والازدحام.',
      },
      'ui-accessibility': {
        label: 'إمكانية الوصول',
        text: 'أضف عقدة agent لمراجعة إمكانية الوصول. تحقق من تباين الألوان WCAG والوصول بلوحة المفاتيح وترتيب التركيز وعلامات ARIA وتوافق قارئ الشاشة.',
      },
      'ui-states': {
        label: 'حالات التفاعل',
        text: 'أضف عقدًا لتغطية حالات التحميل والفراغ والخطأ والنجاح لتدفقات الواجهة. تأكد من وجود تغذية راجعة واضحة لكل تفاعل رئيسي.',
      },
      'ui-design-system': {
        label: 'نظام التصميم',
        text: 'أضف agent لمحاذاة نظام التصميم لتوحيد أنماط المكونات والتباعد والانحناء والظلال ورموز الألوان.',
      },
      'ui-motion': {
        label: 'حركة وانتقالات',
        text: 'أضف خطوة تصميم للتفاعلات الدقيقة والانتقالات. أضف حركة مناسبة لتغييرات الحالة والتحميل والتغذية الراجعة.',
      },
      'ui-usability': {
        label: 'تدقيق قابلية الاستخدام',
        text: 'أضف عقدة agent لتدقيق قابلية الاستخدام تحاكي مستخدمًا حقيقيًا على المسارات الرئيسية. ابحث عن العوائق (خطوات كثيرة، تلميحات مفقودة، إجراءات محفوفة بالمخاطر).',
      },
    },
  },
  'version-control': {
    label: 'سلامة VCS',
    items: {
      'vcs-isolated-workspace': {
        label: 'مساحة عمل معزولة',
        text: 'قبل الخطوات التي تعدل الملفات أو حالة VCS، اشترط استخدام مساحة عمل معزولة مثل Git worktree أو P4 workspace-client أو SVN checkout.',
      },
      'vcs-status-check': {
        label: 'فحص الحالة',
        text: 'حدد أولاً نظام التحكم بالإصدارات المستخدم (Git أو Perforce/P4 أو SVN أو غيره). نفذ فقط فحوصات للقراءة فقط للتغييرات غير المودعة والتعارضات والعناصر غير المتعقبة.',
      },
      'vcs-protect-changes': {
        label: 'حماية التغييرات',
        text: 'احمِ التغييرات غير المودعة الموجودة للمستخدم. لا تقم تلقائيًا بالكتابة فوقها أو التراجع عنها أو إعادة تعيينها أو حذفها.',
      },
      'vcs-no-auto-submit': {
        label: 'منع الإرسال التلقائي',
        text: 'لا تقم تلقائيًا بـ commit أو check in أو submit أو push، ولا تكتب تلقائيًا إلى مستودع بعيد أو مشترك.',
      },
      'vcs-pre-submit-confirm': {
        label: 'تأكيد قبل الإرسال',
        text: 'قبل أي commit أو check in أو submit، لخّص التغييرات والملفات المتأثرة والتحقق المنفذ والمخاطر المحتملة وطريقة التراجع.',
      },
      'vcs-high-risk-confirm': {
        label: 'تأكيد عالي المخاطر',
        text: 'قبل عمليات الحذف أو الكتابة الفوقية أو التراجع أو إعادة التعيين أو المزامنة أو التحديث أو تبديل الفروع أو إعادة التسمية الجماعية، اشرح نطاق التأثير وانتظر التأكيد.',
      },
      'vcs-unknown-conservative': {
        label: 'معالجة VCS غير المعروف',
        text: 'إذا تعذر تأكيد نظام التحكم بالإصدارات أو حالة مساحة العمل، نفذ فقط التحليل والتوصيات للقراءة فقط. لا تنفذ إجراءات تعدل الملفات.',
      },
    },
  },
};

// ── German (de-DE) ──────────────────────────────────────────────────────────

const de: TranslationMap = {
  interactive: {
    label: 'Interaktive Klärung',
    items: {
      'interactive-grill': { label: 'Ausfragen (grill-me)', text: 'grill-me' },
      'interactive-clarify': {
        label: 'Anforderungen klären',
        text: 'Bevor du den Blueprint bearbeitest, nutze eine Interaktion (select / input), um die wichtigste unklare oder fehlende Entscheidung zu bestätigen. Nach meiner Antwort musst du sie sofort in den Workflow-Blueprint einarbeiten und den aktualisierten IRGraph ausgeben.',
      },
    },
  },
  clarity: {
    label: 'Klarheit',
    items: {
      'clarity-goal': {
        label: 'Ziel klären',
        text: 'Klär das Endziel und die Erfolgskriterien dieses Workflows und fasse die Verantwortung jedes Knotens in einem Satz zusammen.',
      },
      'clarity-naming': {
        label: 'Namen vereinheitlichen',
        text: 'Prüfe, ob Knotenbeschriftungen und Parameternamen konsistent und klar sind. Benenne vage Knoten um.',
      },
      'clarity-simplify': {
        label: 'Struktur vereinfachen',
        text: 'Identifiziere redundante Schritte, die zusammengeführt oder entfernt werden können, um die Hauptausführungskette übersichtlicher zu machen.',
      },
    },
  },
  completeness: {
    label: 'Vollständigkeit',
    items: {
      'completeness-edges': {
        label: 'Randfälle abdecken',
        text: 'Liste unbehandelte Randfälle auf und füge branch-Knoten für fehlende Pfade hinzu.',
      },
      'completeness-errors': {
        label: 'Fehlerbehandlung',
        text: 'Füge Fehlerbehandlungspfade für jeden agent-Knoten hinzu, damit Ausnahmen nicht den gesamten Workflow unterbrechen.',
      },
      'completeness-data': {
        label: 'Datenverdrahtung',
        text: 'Prüfe, ob alle drei parallelen Prüfergebnisse in den verify-Schritt fließen, und ergänze fehlende data-Kanten.',
      },
    },
  },
  cost: {
    label: 'Kosten',
    items: {
      'cost-model': {
        label: 'Modell herabstufen',
        text: 'Verschiebe Knoten mit geringer Komplexität auf günstigere Modelle wie haiku und schätze die Kosteneinsparungen.',
      },
      'cost-parallel': {
        label: 'Parallelisierung',
        text: 'Identifiziere parallelisierbare Schritte und strukturiere sie in einen parallel-Knoten um, um die Gesamtdauer zu verkürzen.',
      },
      'cost-cache': {
        label: 'Wiederverwendung & Cache',
        text: 'Finde Zwischenergebnisse, die zwischengespeichert oder wiederverwendet werden können, um wiederholte agent-Aufrufe zu vermeiden.',
      },
    },
  },
  structure: {
    label: 'Struktur',
    items: {
      'structure-split': {
        label: 'Aufgaben trennen',
        text: 'Überprüfe die Verantwortung jedes agent-Knotens. Teile überladene agents in Einzweck-agent-Knoten auf und verbinde sie mit exec-Kanten in Abhängigkeitsreihenfolge.',
      },
      'structure-parallelize': {
        label: 'Parallel umbauen',
        text: 'Finde serielle agent-Knoten auf der exec-Hauptachse ohne Datenabhängigkeit. Verschiebe sie in einen parallel-Block, während abhängige Knoten in einer pipeline bleiben.',
      },
      'structure-phase': {
        label: 'Phasengruppierung',
        text: 'Nutze phase-Knoten, um den Workflow in logische Phasen zu gliedern (z. B. Sammeln → Analysieren → Ausführen → Zusammenfassen).',
      },
      'structure-converge': {
        label: 'Ergebnisse bündeln',
        text: 'Füge einen Aggregations-agent nach jedem parallel-Block hinzu. Verbinde jeden parallelen Zweigausgang über data-Kanten dorthin.',
      },
      'structure-explicit-data': {
        label: 'Explizite Datenkanten',
        text: 'Überprüfe implizite Kontextweitergabe zwischen Knoten. Füge explizite data-Kanten für echte Abhängigkeiten hinzu und entferne überflüssige.',
      },
    },
  },
  reliability: {
    label: 'Zuverlässigkeit',
    items: {
      'reliability-retry': {
        label: 'Wiederholung mit Backoff',
        text: 'Füge Wiederholungseinstellungen für agent-Knoten hinzu, die externe Tools aufrufen — ca. 3 Versuche mit exponentiellem Backoff und Jitter. Wiederholungen müssen idempotent sein.',
      },
      'reliability-fallback': {
        label: 'Fallback-Pfad',
        text: 'Füge branch-basierte Fallback-Ebenen für kritische agents hinzu: bei Fehler zurück auf einen Regelknoten, dann günstigeres Modell, dann menschliche Warteschlange.',
      },
      'reliability-boundary': {
        label: 'Fehlergrenze',
        text: 'Nutze branch-Knoten, um Fehlergrenzen für Hochrisiko-agents zu schaffen. Leite Fehlerpfade in Behandlungs- oder Alarmzweige.',
      },
      'reliability-idempotent': {
        label: 'Idempotenz & Timeout',
        text: 'Überprüfe agents mit Seiteneffekten. Füge Idempotenzschlüssel hinzu und setze Timeouts für LLM-Aufrufe.',
      },
      'reliability-loop-fuse': {
        label: 'Schleifensicherung',
        text: 'Stelle sicher, dass loop-Knoten eine klare maximale Iterationszahl und Abbruchbedingung haben. Füge Circuit-Breaker-Logik hinzu.',
      },
      'reliability-production-grade': {
        label: 'Produktionszuverlässigkeit',
        text: 'Dieser Code ist für die Produktion. Er muss unternehmenstaugliche Zuverlässigkeit aufweisen; verwende keinen MVP-Ansatz.',
      },
    },
  },
  performance: {
    label: 'Performance & Parallelität',
    items: {
      'performance-critical-path': {
        label: 'Kritischer Pfad',
        text: 'Analysiere die längste Abhängigkeitskette auf der exec-Achse. Identifiziere agent-Knoten, die vorgezogen oder parallelisiert werden können.',
      },
      'performance-model-tier': {
        label: 'Modellstufen',
        text: 'Überprüfe die Modelleinstellungen. Nutze leichtere Modelle wie haiku für einfache Klassifikation/Extraktion, starke Modelle für komplexes Reasoning.',
      },
      'performance-dedupe': {
        label: 'Deduplizierung',
        text: 'Finde agents, die ähnliche Arbeit wiederholen. Führe sie zu einem wiederverwendbaren Knoten zusammen und verteile seine Ausgabe über data-Kanten.',
      },
      'performance-fanout': {
        label: 'Fächerkontrolle',
        text: 'Prüfe die Fächerbreite von parallel-Blöcken. Füge sinnvolle Parallelitätsgrenzen oder Stapelverarbeitung hinzu.',
      },
    },
  },
  verification: {
    label: 'Verifikation & Test',
    items: {
      'verification-verifier': {
        label: 'Verifizierer-Knoten',
        text: 'Füge einen verifier-agent nach kritischen Ausgabe-agents ein. Leite die Ausgabe über data-Kanten und validiere gegen explizite Erfolgskriterien.',
      },
      'verification-adversarial': {
        label: 'Adversarielle Prüfung',
        text: 'Füge einen adversarial/Red-Team-agent für Benutzereingaben oder risikoreiche Entscheidungen hinzu. Simuliere Privilege-Escalation und Injection.',
      },
      'verification-selfcheck': {
        label: 'Selbstprüfschleife',
        text: 'Füge eine Selbstprüfschleife für ausgabeproduzierende agents hinzu. Nutze loop oder branch, um Format und Bedingungen zu prüfen.',
      },
      'verification-criteria': {
        label: 'Erfolgskriterien',
        text: 'Ergänze jeden agent-Knoten um testbare Erfolgskriterien und Ausgabeverträge (Format, Länge, Pflichtfelder).',
      },
    },
  },
  observability: {
    label: 'Beobachtbarkeit',
    items: {
      'observability-logs': {
        label: 'Schlüssel-Logs',
        text: 'Füge log-Knoten an jeder Phasengrenze und bei kritischen agent-Ausgaben ein. Erfasse Schritt-ID, Eingabezusammenfassung und Ergebnisstatus.',
      },
      'observability-branch': {
        label: 'Zweigsichtbarkeit',
        text: 'Füge log-Knoten in Fehlerpfade jedes Fallback-/Fehlerzweigs ein. Erfasse den Fehlerkontext (Eingabe, Schritt, Status).',
      },
      'observability-parallel': {
        label: 'Paralleles Tracing',
        text: 'Füge log-Knoten mit gemeinsamer Korrelations-ID in jeden parallelen Zweig ein. Erfasse Dauer und Ausgabe jedes agent.',
      },
      'observability-audit': {
        label: 'Audit-Trail',
        text: 'Füge log-Knoten um agents mit hohen Berechtigungen oder externen Seiteneffekten ein. Erfasse Entscheidungsbelege und Metadaten.',
      },
    },
  },
  security: {
    label: 'Sicherheit & Berechtigungen',
    items: {
      'security-approval': {
        label: 'Menschliche Freigabe',
        text: 'Füge einen branch-Knoten für menschliche Freigabe vor irreversiblen wirkungsvollen agent-Aktionen ein (Löschen, Zahlung, externes Senden).',
      },
      'security-scope': {
        label: 'Berechtigungsgrenze',
        text: 'Überprüfe agents mit Zugriff auf externe Systeme oder sensible Daten. Nutze branch/log davor und danach zur Eingrenzung.',
      },
      'security-redact': {
        label: 'Schwärzung sensibler Daten',
        text: 'Füge Schwärzungs- oder Datenminimierungsknoten ein, wo sensible Felder durch Logs oder zwischen agents fließen.',
      },
      'security-escalate': {
        label: 'Ausnahme-Eskalation',
        text: 'Füge einen menschlichen Fallback-Zweig am Ende der Zuverlässigkeits-Fallback-Kette ein. Leite Aufgaben bei Fehlschlag in eine menschliche Warteschlange.',
      },
    },
  },
  'ui-ux': {
    label: 'UI & UX',
    items: {
      'ui-visual-review': {
        label: 'Visuelles Review',
        text: 'Füge einen UI-Design-Review-agent nach Interface-/Frontend-generierenden agents ein. Prüfe Layout, Abstände, Kontrast, Typografie-Hierarchie und visuelle Konsistenz.',
      },
      'ui-theme-switch': {
        label: 'Stilvarianten',
        text: 'Füge Unterstützung für mehrere Themes hinzu. Extrahiere Farben, Schriftgrößen, Radius-Werte als variable-Knoten und generiere helle/dunkle/Markenvarianten.',
      },
      'ui-responsive': {
        label: 'Responsive Prüfung',
        text: 'Füge einen parallel-Block zur parallelen Prüfung von Desktop-, Tablet- und Mobil-Layouts hinzu. Identifiziere Layoutfehler und Überlauf.',
      },
      'ui-accessibility': {
        label: 'Barrierefreiheit',
        text: 'Füge einen Accessibility-Review-agent hinzu. Prüfe WCAG-Farbkontrast, Tastaturzugang, Fokusreihenfolge, ARIA-Labels und Screenreader-Kompatibilität.',
      },
      'ui-states': {
        label: 'Interaktionszustände',
        text: 'Füge Knoten für Loading-, Empty-, Error- und Success-Zustände hinzu. Stelle klares Feedback für jede Interaktion sicher.',
      },
      'ui-design-system': {
        label: 'Designsystem',
        text: 'Füge einen Designsystem-Abgleich-agent hinzu, um Komponentenstile, Abstände, Radius, Schatten und Farb-Tokens zu vereinheitlichen.',
      },
      'ui-motion': {
        label: 'Animation & Übergänge',
        text: 'Füge einen Microinteraction- und Übergangs-Designschritt hinzu. Füge passende Animation für Zustandswechsel, Laden und Feedback ein.',
      },
      'ui-usability': {
        label: 'Usability-Walkthrough',
        text: 'Füge einen Usability-Walkthrough-agent hinzu, der echte Nutzer auf Schlüsselpfaden simuliert. Finde Blocker (zu viele Schritte, fehlende Hinweise, riskante Aktionen).',
      },
    },
  },
  'version-control': {
    label: 'VCS-Sicherheit',
    items: {
      'vcs-isolated-workspace': {
        label: 'Isolierter Workspace',
        text: 'Verlange vor datei-/VCS-ändernden Schritten einen isolierten Workspace wie Git worktree, P4 workspace-client oder SVN checkout.',
      },
      'vcs-status-check': {
        label: 'Statusprüfung',
        text: 'Identifiziere zuerst das verwendete VCS (Git, Perforce/P4, SVN oder anderes). Führe nur lesende Prüfungen auf nicht eingecheckte Änderungen, Konflikte und ungetrackte Elemente durch.',
      },
      'vcs-protect-changes': {
        label: 'Änderungen schützen',
        text: 'Schütze bestehende nicht eingecheckte Änderungen des Nutzers. Überschreibe, setze zurück oder lösche sie nicht automatisch.',
      },
      'vcs-no-auto-submit': {
        label: 'Kein automatisches Submit',
        text: 'Führe kein automatisches commit, check-in, submit oder push durch und schreibe nicht automatisch in ein entferntes Repository.',
      },
      'vcs-pre-submit-confirm': {
        label: 'Bestätigung vor Submit',
        text: 'Fasse vor jedem commit, check-in oder submit die Änderungen, betroffenen Dateien, durchgeführte Prüfungen, Risiken und Rollback-Methode zusammen.',
      },
      'vcs-high-risk-confirm': {
        label: 'Hochrisiko-Bestätigung',
        text: 'Erkläre vor Löschen, Überschreiben, Zurücksetzen, Synchronisieren, Aktualisieren, Branch-Wechsel oder Massenumbenennungen die Auswirkungen und warte auf Bestätigung.',
      },
      'vcs-unknown-conservative': {
        label: 'Unbekanntes VCS — konservativ',
        text: 'Wenn das VCS oder der Workspace-Status nicht bestätigt werden kann, führe nur lesende Analyse und Empfehlungen durch. Keine dateiändernden Aktionen.',
      },
    },
  },
};

// ── Spanish (es-ES) ─────────────────────────────────────────────────────────

const es: TranslationMap = {
  interactive: {
    label: 'Clarificación interactiva',
    items: {
      'interactive-grill': { label: 'Interrogarme (grill-me)', text: 'grill-me' },
      'interactive-clarify': {
        label: 'Clarificar necesidades',
        text: 'Antes de editar el blueprint, usa una interacción (select / input) para confirmar la decisión más ambigua o faltante. Después de que responda, incorpora inmediatamente la respuesta al workflow y muestra el IRGraph actualizado.',
      },
    },
  },
  clarity: {
    label: 'Claridad',
    items: {
      'clarity-goal': {
        label: 'Definir objetivo',
        text: 'Aclara el objetivo final y los criterios de éxito de este workflow, y resume la responsabilidad de cada nodo en una frase.',
      },
      'clarity-naming': {
        label: 'Unificar nombres',
        text: 'Revisa que las etiquetas de los nodos y los nombres de los parámetros sean consistentes y claros. Renombra los nodos ambiguos.',
      },
      'clarity-simplify': {
        label: 'Simplificar estructura',
        text: 'Identifica pasos redundantes que puedan fusionarse o eliminarse para que la cadena de ejecución principal sea más legible.',
      },
    },
  },
  completeness: {
    label: 'Completitud',
    items: {
      'completeness-edges': {
        label: 'Cubrir casos extremos',
        text: 'Enumera los casos extremos no gestionados y añade nodos branch para las rutas faltantes.',
      },
      'completeness-errors': {
        label: 'Manejo de errores',
        text: 'Añade rutas de manejo de fallos para cada nodo agent, de modo que las excepciones no interrumpan todo el workflow.',
      },
      'completeness-data': {
        label: 'Cableado de datos',
        text: 'Comprueba que los tres resultados de revisión paralela fluyan hacia verify y añade los data edges que falten.',
      },
    },
  },
  cost: {
    label: 'Coste',
    items: {
      'cost-model': {
        label: 'Degradar modelo',
        text: 'Mueve los nodos de baja complejidad a modelos más baratos como haiku y estima el ahorro de costes.',
      },
      'cost-parallel': {
        label: 'Paralelizar',
        text: 'Identifica pasos que puedan ejecutarse en paralelo y reestructúralos en un nodo parallel para reducir la duración total.',
      },
      'cost-cache': {
        label: 'Reutilizar y cachear',
        text: 'Busca resultados intermedios que puedan cachearse o reutilizarse para evitar llamadas repetidas a agent.',
      },
    },
  },
  structure: {
    label: 'Estructura',
    items: {
      'structure-split': {
        label: 'Dividir responsabilidades',
        text: 'Revisa la responsabilidad de cada nodo agent. Divide los agents sobrecargados en nodos de propósito único y reconéctalos con exec edges en orden de dependencia.',
      },
      'structure-parallelize': {
        label: 'Reorganizar en paralelo',
        text: 'Encuentra nodos agent seriales en la espina exec sin dependencia de datos entre sí. Muévelos a un bloque parallel, manteniendo los dependientes en un pipeline.',
      },
      'structure-phase': {
        label: 'Agrupar por fases',
        text: 'Usa nodos phase para dividir el workflow en etapas lógicas (recolectar → analizar → ejecutar → resumir). Asigna los agents a la phase adecuada.',
      },
      'structure-converge': {
        label: 'Converger resultados',
        text: 'Añade un agent de agregación tras cada bloque parallel. Conecta cada salida de rama paralela mediante data edges.',
      },
      'structure-explicit-data': {
        label: 'Data edges explícitos',
        text: 'Revisa el paso implícito de contexto entre nodos. Añade data edges explícitos para dependencias reales y elimina los redundantes.',
      },
    },
  },
  reliability: {
    label: 'Fiabilidad',
    items: {
      'reliability-retry': {
        label: 'Reintento con backoff',
        text: 'Añade configuración de reintentos a los nodos agent que llamen a herramientas externas — unos 3 intentos con backoff exponencial y jitter. Los reintentos deben ser idempotentes.',
      },
      'reliability-fallback': {
        label: 'Ruta de degradación',
        text: 'Añade capas de fallback mediante branch para agents críticos: al fallar, degrada a un nodo de reglas más simple, luego un modelo más barato, luego una cola humana.',
      },
      'reliability-boundary': {
        label: 'Límite de error',
        text: 'Usa nodos branch para crear límites de error en agents de alto riesgo. Dirige las rutas de fallo a ramas de manejo o alerta.',
      },
      'reliability-idempotent': {
        label: 'Idempotencia y timeout',
        text: 'Revisa los agents con efectos secundarios. Añade claves de idempotencia y establece timeouts para las llamadas LLM.',
      },
      'reliability-loop-fuse': {
        label: 'Fusible de bucle',
        text: 'Comprueba que los nodos loop tengan un número máximo de iteraciones claro y una condición de salida. Añade lógica de circuit-breaker.',
      },
      'reliability-production-grade': {
        label: 'Fiabilidad de producción',
        text: 'Este código es para producción. Debe tener fiabilidad de nivel empresarial; no uses un enfoque MVP (producto mínimo viable).',
      },
    },
  },
  performance: {
    label: 'Rendimiento y paralelismo',
    items: {
      'performance-critical-path': {
        label: 'Ruta crítica',
        text: 'Analiza la cadena de dependencia más larga en la espina exec. Identifica nodos agent que puedan adelantarse o paralelizarse.',
      },
      'performance-model-tier': {
        label: 'Niveles de modelo',
        text: 'Revisa la configuración de modelo de cada nodo. Usa modelos más ligeros como haiku para tareas simples y reserva los fuertes para razonamiento complejo.',
      },
      'performance-dedupe': {
        label: 'Deduplicar',
        text: 'Encuentra agents que repitan trabajo similar. Fusiónalos en un nodo reutilizable y distribuye su salida con data edges.',
      },
      'performance-fanout': {
        label: 'Control de abanico',
        text: 'Comprueba el ancho de abanico de los bloques parallel. Añade límites de concurrencia razonables o procesamiento por lotes.',
      },
    },
  },
  verification: {
    label: 'Verificación y pruebas',
    items: {
      'verification-verifier': {
        label: 'Nodo verificador',
        text: 'Inserta un agente verificador tras los agents de salida críticos. Alimenta la salida mediante data edges y valida contra criterios de éxito explícitos.',
      },
      'verification-adversarial': {
        label: 'Comprobación adversaria',
        text: 'Añade un agente adversario/red-team para entradas de usuario o decisiones de alto riesgo. Simula escenarios de escalada de privilegios e inyección.',
      },
      'verification-selfcheck': {
        label: 'Bucle de autocomprobación',
        text: 'Añade un bucle de autocomprobación a los agents de salida. Usa loop o branch para verificar formato y restricciones, corregir una vez y liberar.',
      },
      'verification-criteria': {
        label: 'Criterios de éxito',
        text: 'Añade criterios de éxito comprobables y contratos de salida a cada nodo agent (formato, longitud, campos obligatorios).',
      },
    },
  },
  observability: {
    label: 'Observabilidad',
    items: {
      'observability-logs': {
        label: 'Logs clave',
        text: 'Inserta nodos log en cada límite de phase y en las salidas de agent críticas. Registra el id del paso, resumen de entrada y estado del resultado.',
      },
      'observability-branch': {
        label: 'Visibilidad de ramas',
        text: 'Añade nodos log en las rutas de fallo de cada rama de fallback o error. Captura el contexto del fallo.',
      },
      'observability-parallel': {
        label: 'Trazado paralelo',
        text: 'Añade nodos log con un id de correlación compartido dentro de cada rama parallel. Registra duración y salida de cada agent.',
      },
      'observability-audit': {
        label: 'Traza de auditoría',
        text: 'Añade nodos log alrededor de agents con altos permisos o efectos secundarios externos. Registra evidencias de decisión y metadatos clave.',
      },
    },
  },
  security: {
    label: 'Seguridad y permisos',
    items: {
      'security-approval': {
        label: 'Aprobación humana',
        text: 'Inserta un nodo branch de aprobación humana antes de acciones irreversibles o de alto impacto (eliminación, pago, envío externo).',
      },
      'security-scope': {
        label: 'Límite de permisos',
        text: 'Revisa los agents que acceden a sistemas externos o datos sensibles. Usa nodos branch/log antes y después para acotar el alcance.',
      },
      'security-redact': {
        label: 'Ofuscación de datos sensibles',
        text: 'Añade nodos de ofuscación o minimización donde campos sensibles circulen por logs o entre agents.',
      },
      'security-escalate': {
        label: 'Escalar excepciones',
        text: 'Añade una rama de fallback humano al final de la cadena de fallback de fiabilidad. Cuando todo falle, encamina la tarea a una cola humana.',
      },
    },
  },
  'ui-ux': {
    label: 'UI y UX',
    items: {
      'ui-visual-review': {
        label: 'Revisión visual',
        text: 'Inserta un agente de revisión de diseño UI tras los agents que generen interfaces. Comprueba alineación, espaciado, contraste, jerarquía tipográfica y consistencia visual.',
      },
      'ui-theme-switch': {
        label: 'Variantes de estilo',
        text: 'Añade soporte para múltiples temas. Extrae colores, tamaños de fuente y radios como nodos variable, y genera variantes claras/oscuras/de marca.',
      },
      'ui-responsive': {
        label: 'Comprobación responsive',
        text: 'Añade un bloque parallel que compruebe layouts de escritorio, tableta y móvil en paralelo. Identifica desplazamientos, desbordamientos y zonas apretadas.',
      },
      'ui-accessibility': {
        label: 'Accesibilidad',
        text: 'Añade un agente de revisión de accesibilidad. Comprueba contraste WCAG, acceso por teclado, orden de foco, etiquetas ARIA y compatibilidad con lectores de pantalla.',
      },
      'ui-states': {
        label: 'Estados de interacción',
        text: 'Añade nodos para cubrir los estados de carga, vacío, error y éxito. Asegura que cada interacción clave tenga retroalimentación clara.',
      },
      'ui-design-system': {
        label: 'Sistema de diseño',
        text: 'Añade un agente de alineación con el sistema de diseño para unificar estilos de componentes, espaciado, radios, sombras y tokens de color.',
      },
      'ui-motion': {
        label: 'Animaciones y transiciones',
        text: 'Añade un paso de diseño de microinteracciones y transiciones. Incorpora animaciones adecuadas para cambios de estado, carga y retroalimentación.',
      },
      'ui-usability': {
        label: 'Análisis de usabilidad',
        text: 'Añade un agente de análisis de usabilidad que simule un usuario real en las rutas clave. Encuentra bloqueos (demasiados pasos, falta de pistas, acciones arriesgadas).',
      },
    },
  },
  'version-control': {
    label: 'Seguridad VCS',
    items: {
      'vcs-isolated-workspace': {
        label: 'Espacio de trabajo aislado',
        text: 'Antes de pasos que modifiquen archivos o el estado VCS, exige un espacio de trabajo aislado como Git worktree, P4 workspace-client o SVN checkout.',
      },
      'vcs-status-check': {
        label: 'Comprobación de estado',
        text: 'Identifica primero el sistema de control de versiones (Git, Perforce/P4, SVN u otro). Realiza solo comprobaciones de solo lectura.',
      },
      'vcs-protect-changes': {
        label: 'Proteger cambios',
        text: 'Protege los cambios no confirmados existentes del usuario. No los sobrescribas, reviertas, restablezcas ni elimines automáticamente.',
      },
      'vcs-no-auto-submit': {
        label: 'No auto-submit',
        text: 'No hagas commit, check-in, submit ni push automáticos, ni escribas automáticamente en un repositorio remoto o compartido.',
      },
      'vcs-pre-submit-confirm': {
        label: 'Confirmar antes de submit',
        text: 'Antes de cualquier commit, check-in o submit, resume los cambios, archivos afectados, verificación realizada, riesgos y método de reversión.',
      },
      'vcs-high-risk-confirm': {
        label: 'Confirmación de alto riesgo',
        text: 'Antes de eliminar, sobrescribir, revertir, sincronizar, actualizar, cambiar de rama o renombrar en lote, explica el alcance y espera confirmación.',
      },
      'vcs-unknown-conservative': {
        label: 'VCS desconocido — conservador',
        text: 'Si no se puede confirmar el VCS o el estado del espacio de trabajo, realiza solo análisis y recomendaciones de solo lectura. No modifiques archivos.',
      },
    },
  },
};

// ── French (fr-FR) ──────────────────────────────────────────────────────────

const fr: TranslationMap = {
  interactive: {
    label: 'Clarification interactive',
    items: {
      'interactive-grill': { label: 'Interroge-moi (grill-me)', text: 'grill-me' },
      'interactive-clarify': {
        label: 'Clarifier les besoins',
        text: 'Avant de modifier le blueprint, utilise une interaction (select / input) pour confirmer la décision la plus ambiguë ou manquante. Après ma réponse, intègre-la immédiatement dans le blueprint et produis l\'IRGraph mis à jour.',
      },
    },
  },
  clarity: {
    label: 'Clarté',
    items: {
      'clarity-goal': {
        label: 'Définir l\'objectif',
        text: 'Clarifie l\'objectif final et les critères de succès de ce workflow, puis résume la responsabilité de chaque nœud en une phrase.',
      },
      'clarity-naming': {
        label: 'Uniformiser les noms',
        text: 'Vérifie que les étiquettes de nœuds et les noms de paramètres sont cohérents et clairs. Renomme les nœuds ambigus.',
      },
      'clarity-simplify': {
        label: 'Simplifier la structure',
        text: 'Identifie les étapes redondantes qui peuvent être fusionnées ou supprimées pour rendre la chaîne d\'exécution principale plus lisible.',
      },
    },
  },
  completeness: {
    label: 'Complétude',
    items: {
      'completeness-edges': {
        label: 'Couvrir les cas limites',
        text: 'Liste les cas limites non traités et ajoute des nœuds branch pour les chemins manquants.',
      },
      'completeness-errors': {
        label: 'Gestion des erreurs',
        text: 'Ajoute des chemins de gestion d\'échec pour chaque nœud agent afin que les exceptions n\'interrompent pas tout le workflow.',
      },
      'completeness-data': {
        label: 'Câblage des données',
        text: 'Vérifie que les trois résultats de revue parallèle alimentent bien l\'étape verify et complète les data edges manquantes.',
      },
    },
  },
  cost: {
    label: 'Coût',
    items: {
      'cost-model': {
        label: 'Rétrograder le modèle',
        text: 'Déplace les nœuds de faible complexité vers des modèles moins chers comme haiku et estime les économies réalisées.',
      },
      'cost-parallel': {
        label: 'Paralléliser',
        text: 'Identifie les étapes parallélisables et restructure-les en un nœud parallel pour réduire la durée totale.',
      },
      'cost-cache': {
        label: 'Réutiliser et mettre en cache',
        text: 'Trouve les sorties intermédiaires qui peuvent être mises en cache ou réutilisées pour éviter les appels agent répétés.',
      },
    },
  },
  structure: {
    label: 'Structure',
    items: {
      'structure-split': {
        label: 'Diviser les responsabilités',
        text: 'Examine la responsabilité de chaque nœud agent. Divise les agents surchargés en nœuds à responsabilité unique et reconnecte-les avec des exec edges par ordre de dépendance.',
      },
      'structure-parallelize': {
        label: 'Réorganiser en parallèle',
        text: 'Trouve les nœuds agent séquentiels sans dépendance de données sur l\'axe exec. Déplace-les dans un bloc parallel, en gardant les nœuds dépendants dans un pipeline.',
      },
      'structure-phase': {
        label: 'Grouper par phase',
        text: 'Utilise des nœuds phase pour diviser le workflow en étapes logiques (collecter → analyser → exécuter → résumer). Place les agents dans la phase appropriée.',
      },
      'structure-converge': {
        label: 'Converger les résultats',
        text: 'Ajoute un agent d\'agrégation après chaque bloc parallel. Connecte chaque sortie de branche parallèle avec des data edges.',
      },
      'structure-explicit-data': {
        label: 'Data edges explicites',
        text: 'Examine le passage implicite de contexte entre nœuds. Ajoute des data edges explicites pour les vraies dépendances et supprime les connexions redondantes.',
      },
    },
  },
  reliability: {
    label: 'Fiabilité',
    items: {
      'reliability-retry': {
        label: 'Nouvelles tentatives avec backoff',
        text: 'Ajoute des paramètres de nouvelle tentative aux nœuds agent qui appellent des outils externes — environ 3 tentatives avec backoff exponentiel et gigue. Les tentatives doivent être idempotentes.',
      },
      'reliability-fallback': {
        label: 'Chemin de repli',
        text: 'Ajoute des couches de repli basées sur branch pour les agents critiques : en cas d\'échec, repli vers un nœud de règles plus simple, puis un modèle moins cher, puis une file d\'attente humaine.',
      },
      'reliability-boundary': {
        label: 'Limite d\'erreur',
        text: 'Utilise des nœuds branch pour créer des limites d\'erreur autour des agents à haut risque. Dirige les chemins d\'échec vers des branches de traitement ou d\'alerte.',
      },
      'reliability-idempotent': {
        label: 'Idempotence et timeout',
        text: 'Examine les agents avec effets de bord. Ajoute des clés d\'idempotence et définis des timeouts pour les appels LLM.',
      },
      'reliability-loop-fuse': {
        label: 'Fusible de boucle',
        text: 'Vérifie que les nœuds loop ont un nombre maximal d\'itérations clair et une condition de sortie. Ajoute une logique de coupe-circuit.',
      },
      'reliability-production-grade': {
        label: 'Fiabilité de production',
        text: 'Ce code est destiné à la production. Il doit avoir une fiabilité de niveau entreprise ; n\'utilise pas une approche MVP (produit minimum viable).',
      },
    },
  },
  performance: {
    label: 'Performance et parallélisme',
    items: {
      'performance-critical-path': {
        label: 'Chemin critique',
        text: 'Analyse la plus longue chaîne de dépendance sur l\'axe exec. Identifie les nœuds agent qui peuvent être avancés ou parallélisés.',
      },
      'performance-model-tier': {
        label: 'Niveaux de modèle',
        text: 'Examine les paramètres de modèle de chaque nœud. Utilise des modèles plus légers comme haiku pour les tâches simples et réserve les modèles forts au raisonnement complexe.',
      },
      'performance-dedupe': {
        label: 'Dédupliquer',
        text: 'Trouve les agents qui répètent un travail similaire. Fusionne-les en un nœud réutilisable et distribue sa sortie avec des data edges.',
      },
      'performance-fanout': {
        label: 'Contrôle de l\'éventail',
        text: 'Vérifie la largeur d\'éventail des blocs parallel. Ajoute des limites de concurrence raisonnables ou un traitement par lots.',
      },
    },
  },
  verification: {
    label: 'Vérification et tests',
    items: {
      'verification-verifier': {
        label: 'Nœud vérificateur',
        text: 'Insère un agent vérificateur après les agents de sortie critiques. Achemine la sortie via des data edges et valide-la par rapport à des critères de succès explicites.',
      },
      'verification-adversarial': {
        label: 'Contrôle adversarial',
        text: 'Ajoute un agent adversarial/red-team pour les entrées utilisateur ou les décisions à haut risque. Simule des scénarios d\'escalade de privilèges et d\'injection.',
      },
      'verification-selfcheck': {
        label: 'Boucle d\'auto-vérification',
        text: 'Ajoute une boucle d\'auto-vérification aux agents producteurs de sortie. Utilise loop ou branch pour vérifier le format et les contraintes.',
      },
      'verification-criteria': {
        label: 'Critères de succès',
        text: 'Ajoute des critères de succès testables et des contrats de sortie à chaque nœud agent (format, longueur, champs obligatoires).',
      },
    },
  },
  observability: {
    label: 'Observabilité',
    items: {
      'observability-logs': {
        label: 'Logs clés',
        text: 'Insère des nœuds log à chaque frontière de phase et aux sorties d\'agent critiques. Enregistre l\'identifiant de l\'étape, le résumé d\'entrée et l\'état du résultat.',
      },
      'observability-branch': {
        label: 'Visibilité des branches',
        text: 'Ajoute des nœuds log dans les chemins d\'échec de chaque branche de repli ou d\'erreur. Capture le contexte de l\'échec.',
      },
      'observability-parallel': {
        label: 'Traçage parallèle',
        text: 'Ajoute des nœuds log avec un identifiant de corrélation partagé dans chaque branche parallel. Enregistre la durée et la sortie de chaque agent.',
      },
      'observability-audit': {
        label: 'Piste d\'audit',
        text: 'Ajoute des nœuds log autour des agents à hauts privilèges ou à effets de bord externes. Enregistre les preuves de décision et les métadonnées clés.',
      },
    },
  },
  security: {
    label: 'Sécurité et permissions',
    items: {
      'security-approval': {
        label: 'Approbation humaine',
        text: 'Insère un nœud branch d\'approbation humaine avant les actions agent irréversibles ou à fort impact (suppression, paiement, envoi externe).',
      },
      'security-scope': {
        label: 'Périmètre de permission',
        text: 'Examine les agents qui accèdent à des systèmes externes ou à des données sensibles. Utilise des nœuds branch/log avant et après pour restreindre le périmètre.',
      },
      'security-redact': {
        label: 'Anonymisation des données sensibles',
        text: 'Ajoute des nœuds d\'anonymisation ou de minimisation là où des champs sensibles transitent par les logs ou entre agents.',
      },
      'security-escalate': {
        label: 'Escalader les exceptions',
        text: 'Ajoute une branche de repli humain à la fin de la chaîne de repli de fiabilité. Lorsque tout échoue, aiguille la tâche vers une file d\'attente humaine.',
      },
    },
  },
  'ui-ux': {
    label: 'UI et UX',
    items: {
      'ui-visual-review': {
        label: 'Revue visuelle',
        text: 'Insère un agent de revue de design UI après les agents générant des interfaces. Vérifie l\'alignement, l\'espacement, le contraste, la hiérarchie typographique et la cohérence visuelle.',
      },
      'ui-theme-switch': {
        label: 'Variantes de style',
        text: 'Ajoute la prise en charge de plusieurs thèmes. Extrais les couleurs, tailles de police et rayons comme nœuds variable, et génère des variantes claires/sombres/de marque.',
      },
      'ui-responsive': {
        label: 'Vérification responsive',
        text: 'Ajoute un bloc parallel qui vérifie les mises en page desktop, tablette et mobile en parallèle. Identifie les décalages, débordements et zones encombrées.',
      },
      'ui-accessibility': {
        label: 'Accessibilité',
        text: 'Ajoute un agent de revue d\'accessibilité. Vérifie le contraste WCAG, l\'accès au clavier, l\'ordre de focus, les labels ARIA et la compatibilité avec les lecteurs d\'écran.',
      },
      'ui-states': {
        label: 'États d\'interaction',
        text: 'Ajoute des nœuds pour couvrir les états de chargement, vide, erreur et succès. Assure un feedback clair pour chaque interaction clé.',
      },
      'ui-design-system': {
        label: 'Système de design',
        text: 'Ajoute un agent d\'alignement sur le système de design pour unifier les styles de composants, l\'espacement, les rayons, les ombres et les tokens de couleur.',
      },
      'ui-motion': {
        label: 'Animations et transitions',
        text: 'Ajoute une étape de conception de micro-interactions et de transitions. Intègre des animations appropriées pour les changements d\'état, le chargement et le feedback.',
      },
      'ui-usability': {
        label: 'Audit d\'utilisabilité',
        text: 'Ajoute un agent d\'audit d\'utilisabilité qui simule un utilisateur réel sur les parcours clés. Trouve les blocages (trop d\'étapes, indications manquantes, actions risquées).',
      },
    },
  },
  'version-control': {
    label: 'Sécurité VCS',
    items: {
      'vcs-isolated-workspace': {
        label: 'Espace de travail isolé',
        text: 'Avant les étapes modifiant des fichiers ou l\'état VCS, exige un espace de travail isolé comme Git worktree, P4 workspace-client ou SVN checkout.',
      },
      'vcs-status-check': {
        label: 'Vérification d\'état',
        text: 'Identifie d\'abord le système de contrôle de version utilisé (Git, Perforce/P4, SVN ou autre). Effectue uniquement des vérifications en lecture seule.',
      },
      'vcs-protect-changes': {
        label: 'Protéger les modifications',
        text: 'Protège les modifications non validées existantes de l\'utilisateur. Ne les écrase pas, ne les annule pas et ne les supprime pas automatiquement.',
      },
      'vcs-no-auto-submit': {
        label: 'Pas de soumission automatique',
        text: 'Ne fais pas de commit, check-in, submit ou push automatique, et n\'écris pas automatiquement dans un dépôt distant ou partagé.',
      },
      'vcs-pre-submit-confirm': {
        label: 'Confirmer avant soumission',
        text: 'Avant tout commit, check-in ou submit, résume les modifications, les fichiers affectés, la vérification effectuée, les risques et la méthode de rollback.',
      },
      'vcs-high-risk-confirm': {
        label: 'Confirmation haut risque',
        text: 'Avant de supprimer, écraser, annuler, synchroniser, mettre à jour, changer de branche ou renommer en masse, explique la portée et attends la confirmation.',
      },
      'vcs-unknown-conservative': {
        label: 'VCS inconnu — conservateur',
        text: 'Si le VCS ou l\'état de l\'espace de travail ne peut être confirmé, effectue uniquement des analyses et recommandations en lecture seule. Ne modifie pas de fichiers.',
      },
    },
  },
};

// ── Hindi (hi-IN) ───────────────────────────────────────────────────────────

const hi: TranslationMap = {
  interactive: {
    label: 'इंटरैक्टिव स्पष्टीकरण',
    items: {
      'interactive-grill': { label: 'मुझसे पूछो (grill-me)', text: 'grill-me' },
      'interactive-clarify': {
        label: 'ज़रूरतें स्पष्ट करें',
        text: 'ब्लूप्रिंट संपादित करने से पहले, एक इंटरैक्शन (select / input) का उपयोग करके सबसे अस्पष्ट या अनुपलब्ध निर्णय की पुष्टि करें। मेरे उत्तर के बाद, तुरंत उसे वर्कफ़्लो ब्लूप्रिंट में शामिल करें और अद्यतन IRGraph आउटपुट करें।',
      },
    },
  },
  clarity: {
    label: 'स्पष्टता',
    items: {
      'clarity-goal': {
        label: 'लक्ष्य स्पष्ट करें',
        text: 'इस वर्कफ़्लो के अंतिम लक्ष्य और सफलता मानदंड को स्पष्ट करें और प्रत्येक नोड की ज़िम्मेदारी को एक वाक्य में संक्षेपित करें।',
      },
      'clarity-naming': {
        label: 'नामकरण एकरूप करें',
        text: 'जाँचें कि नोड लेबल और पैरामीटर नाम स्पष्ट और एकरूप हैं। अस्पष्ट नोड का नाम बदलें।',
      },
      'clarity-simplify': {
        label: 'संरचना सरल करें',
        text: 'दोहराए जाने वाले चरणों को पहचानें जिन्हें मिलाया या हटाया जा सकता है ताकि मुख्य निष्पादन श्रृंखला अधिक स्पष्ट हो।',
      },
    },
  },
  completeness: {
    label: 'पूर्णता',
    items: {
      'completeness-edges': {
        label: 'किनारे के मामले कवर करें',
        text: 'अनुपचारित किनारे के मामलों की सूची बनाएं और अनुपलब्ध पथों के लिए branch नोड जोड़ें।',
      },
      'completeness-errors': {
        label: 'त्रुटि प्रबंधन',
        text: 'प्रत्येक agent नोड के लिए विफलता-प्रबंधन पथ जोड़ें ताकि अपवाद पूरे वर्कफ़्लो को बाधित न करें।',
      },
      'completeness-data': {
        label: 'डेटा वायरिंग',
        text: 'जाँचें कि तीनों समानांतर समीक्षा परिणाम verify चरण में प्रवाहित होते हैं और अनुपलब्ध data edges जोड़ें।',
      },
    },
  },
  cost: {
    label: 'लागत',
    items: {
      'cost-model': {
        label: 'मॉडल डाउनग्रेड करें',
        text: 'कम जटिलता वाले नोड को haiku जैसे सस्ते मॉडल पर ले जाएं और लागत बचत का अनुमान लगाएं।',
      },
      'cost-parallel': {
        label: 'समानांतर अनुकूलन',
        text: 'समानांतर रूप से चलने योग्य चरणों की पहचान करें और उन्हें parallel नोड में पुनर्गठित करें ताकि कुल अवधि कम हो।',
      },
      'cost-cache': {
        label: 'पुन: उपयोग और कैश',
        text: 'मध्यवर्ती आउटपुट खोजें जिन्हें कैश या पुन: उपयोग किया जा सकता है ताकि बार-बार agent कॉल से बचा जा सके।',
      },
    },
  },
  structure: {
    label: 'संरचना',
    items: {
      'structure-split': {
        label: 'ज़िम्मेदारियाँ विभाजित करें',
        text: 'प्रत्येक agent नोड की ज़िम्मेदारी की समीक्षा करें। अतिभारित agents को एकल-उद्देश्य नोड में विभाजित करें और निर्भरता क्रम में exec edges से पुनः जोड़ें।',
      },
      'structure-parallelize': {
        label: 'समानांतर पुनर्गठन',
        text: 'exec स्पाइन पर ऐसे अनुक्रमिक agent नोड खोजें जिनके बीच डेटा निर्भरता नहीं है। उन्हें parallel ब्लॉक में ले जाएं, निर्भर नोड को pipeline में रखें।',
      },
      'structure-phase': {
        label: 'चरण समूहन',
        text: 'वर्कफ़्लो को तार्किक चरणों में विभाजित करने के लिए phase नोड का उपयोग करें जैसे एकत्र करें → विश्लेषण करें → निष्पादित करें → सारांशित करें।',
      },
      'structure-converge': {
        label: 'परिणाम अभिसरण',
        text: 'प्रत्येक parallel ब्लॉक के बाद एक एग्रीगेशन agent जोड़ें। प्रत्येक समानांतर शाखा आउटपुट को data edges से कनेक्ट करें।',
      },
      'structure-explicit-data': {
        label: 'स्पष्ट डेटा किनारे',
        text: 'नोड के बीच अंतर्निहित संदर्भ पासिंग की समीक्षा करें। वास्तविक निर्भरताओं के लिए स्पष्ट data edges जोड़ें और अनावश्यक वायरिंग हटाएं।',
      },
    },
  },
  reliability: {
    label: 'विश्वसनीयता',
    items: {
      'reliability-retry': {
        label: 'पुनर्प्रयास बैकऑफ',
        text: 'बाहरी उपकरणों को कॉल करने वाले या क्षणिक विफलता वाले agent नोड के लिए पुनर्प्रयास सेटिंग जोड़ें — लगभग 3 प्रयास, घातीय बैकऑफ और जिटर के साथ।',
      },
      'reliability-fallback': {
        label: 'फ़ॉलबैक पथ',
        text: 'महत्वपूर्ण agents के लिए branch-आधारित फ़ॉलबैक परतें जोड़ें: विफलता पर सरल नियम नोड, फिर सस्ता मॉडल, फिर मानव कतार में जाएं।',
      },
      'reliability-boundary': {
        label: 'त्रुटि सीमा',
        text: 'उच्च-जोखिम वाले agents के लिए त्रुटि सीमा बनाने हेतु branch नोड का उपयोग करें। विफलता पथ को हैंडलिंग या अलर्ट शाखाओं में रूट करें।',
      },
      'reliability-idempotent': {
        label: 'इडेम्पोटेंसी और टाइमआउट',
        text: 'साइड इफ़ेक्ट वाले agents की समीक्षा करें। दोहराव से बचने के लिए इडेम्पोटेंसी कुंजी जोड़ें और LLM कॉल के लिए टाइमआउट सेट करें।',
      },
      'reliability-loop-fuse': {
        label: 'लूप फ़्यूज़',
        text: 'जाँचें कि loop नोड में स्पष्ट अधिकतम पुनरावृत्ति गणना और निकास शर्त है। सर्किट-ब्रेकर लॉजिक जोड़ें।',
      },
      'reliability-production-grade': {
        label: 'उत्पादन विश्वसनीयता',
        text: 'यह कोड उत्पादन के लिए है। इसमें एंटरप्राइज़-ग्रेड विश्वसनीयता होनी चाहिए; MVP (न्यूनतम व्यवहार्य उत्पाद) दृष्टिकोण का उपयोग न करें।',
      },
    },
  },
  performance: {
    label: 'प्रदर्शन और समानांतरता',
    items: {
      'performance-critical-path': {
        label: 'महत्वपूर्ण पथ',
        text: 'exec स्पाइन पर सबसे लंबी निर्भरता श्रृंखला का विश्लेषण करें। ऐसे agent नोड की पहचान करें जिन्हें आगे लाया या समानांतर किया जा सकता है।',
      },
      'performance-model-tier': {
        label: 'मॉडल स्तर',
        text: 'प्रत्येक नोड की मॉडल सेटिंग की समीक्षा करें। सरल वर्गीकरण/निष्कर्षण के लिए haiku जैसे हल्के मॉडल का उपयोग करें।',
      },
      'performance-dedupe': {
        label: 'दोहराव हटाएं',
        text: 'समान कार्य दोहराने वाले agents खोजें। उन्हें एक पुन: प्रयोज्य नोड में मिलाएं और data edges से आउटपुट वितरित करें।',
      },
      'performance-fanout': {
        label: 'फैन-आउट नियंत्रण',
        text: 'parallel ब्लॉक की फैन-आउट चौड़ाई जाँचें। उचित समवर्ती सीमाएं या बैचिंग जोड़ें।',
      },
    },
  },
  verification: {
    label: 'सत्यापन और परीक्षण',
    items: {
      'verification-verifier': {
        label: 'सत्यापन नोड',
        text: 'महत्वपूर्ण आउटपुट agents के बाद एक verifier agent डालें। data edges के माध्यम से आउटपुट भेजें और स्पष्ट सफलता मानदंड के विरुद्ध मान्य करें।',
      },
      'verification-adversarial': {
        label: 'विरोधी जाँच',
        text: 'उपयोगकर्ता इनपुट या उच्च-जोखिम निर्णयों के लिए एक विरोधी/रेड-टीम agent जोड़ें। विशेषाधिकार वृद्धि और इंजेक्शन परिदृश्यों का अनुकरण करें।',
      },
      'verification-selfcheck': {
        label: 'स्व-जाँच लूप',
        text: 'आउटपुट-उत्पादक agents के लिए स्व-जाँच लूप जोड़ें। प्रारूप और बाधाओं को सत्यापित करने के लिए loop या branch का उपयोग करें।',
      },
      'verification-criteria': {
        label: 'सफलता मानदंड',
        text: 'प्रत्येक agent नोड में परीक्षण योग्य सफलता मानदंड और आउटपुट अनुबंध जोड़ें (प्रारूप, लंबाई, आवश्यक फ़ील्ड)।',
      },
    },
  },
  observability: {
    label: 'अवलोकन क्षमता',
    items: {
      'observability-logs': {
        label: 'मुख्य लॉग',
        text: 'प्रत्येक phase सीमा और महत्वपूर्ण agent आउटपुट पर log नोड डालें। चरण आईडी, इनपुट सारांश और परिणाम स्थिति रिकॉर्ड करें।',
      },
      'observability-branch': {
        label: 'शाखा दृश्यता',
        text: 'प्रत्येक फ़ॉलबैक या त्रुटि शाखा के विफलता पथ में log नोड जोड़ें। विफलता संदर्भ कैप्चर करें।',
      },
      'observability-parallel': {
        label: 'समानांतर ट्रेसिंग',
        text: 'प्रत्येक parallel शाखा के अंदर साझा सहसंबंध आईडी के साथ log नोड जोड़ें। प्रत्येक agent की अवधि और आउटपुट रिकॉर्ड करें।',
      },
      'observability-audit': {
        label: 'ऑडिट ट्रेल',
        text: 'उच्च-अनुमति या बाहरी साइड इफ़ेक्ट वाले agents के आसपास log नोड जोड़ें। निर्णय साक्ष्य और मुख्य मेटाडेटा रिकॉर्ड करें।',
      },
    },
  },
  security: {
    label: 'सुरक्षा और अनुमतियाँ',
    items: {
      'security-approval': {
        label: 'मानव अनुमोदन',
        text: 'अपरिवर्तनीय या उच्च-प्रभाव वाली agent कार्रवाइयों (हटाना, भुगतान, बाहरी भेजना) से पहले मानव-अनुमोदन branch डालें।',
      },
      'security-scope': {
        label: 'अनुमति सीमा',
        text: 'बाहरी सिस्टम या संवेदनशील डेटा तक पहुँचने वाले agents की समीक्षा करें। दायरे को सीमित करने के लिए पहले और बाद में branch/log नोड का उपयोग करें।',
      },
      'security-redact': {
        label: 'संवेदनशील डेटा रिडक्शन',
        text: 'जहाँ संवेदनशील फ़ील्ड लॉग या agents के बीच से गुज़रते हैं, वहाँ रिडक्शन या डेटा न्यूनीकरण नोड जोड़ें।',
      },
      'security-escalate': {
        label: 'अपवाद वृद्धि',
        text: 'विश्वसनीयता फ़ॉलबैक श्रृंखला के अंत में एक मानव फ़ॉलबैक शाखा जोड़ें। जब सब विफल हो जाए, कार्य को मानव कतार में भेजें।',
      },
    },
  },
  'ui-ux': {
    label: 'UI और UX',
    items: {
      'ui-visual-review': {
        label: 'दृश्य समीक्षा',
        text: 'इंटरफ़ेस/फ़्रंटएंड आउटपुट उत्पन्न करने वाले agents के बाद UI डिज़ाइन समीक्षा agent डालें। संरेखण, रिक्ति, कंट्रास्ट, टाइपोग्राफ़ी पदानुक्रम और दृश्य स्थिरता की जाँच करें।',
      },
      'ui-theme-switch': {
        label: 'शैली वेरिएंट',
        text: 'कई थीम के लिए समर्थन जोड़ें। रंग, फ़ॉन्ट आकार और त्रिज्या को variable नोड के रूप में निकालें और हल्के/गहरे/ब्रांड वेरिएंट उत्पन्न करें।',
      },
      'ui-responsive': {
        label: 'रिस्पॉन्सिव जाँच',
        text: 'एक parallel ब्लॉक जोड़ें जो डेस्कटॉप, टैबलेट और मोबाइल लेआउट की समानांतर जाँच करे। लेआउट शिफ्ट, ओवरफ़्लो और तंग क्षेत्रों की पहचान करें।',
      },
      'ui-accessibility': {
        label: 'सुलभता',
        text: 'एक सुलभता समीक्षा agent जोड़ें। WCAG रंग कंट्रास्ट, कीबोर्ड पहुँच, फ़ोकस क्रम, ARIA लेबल और स्क्रीन रीडर संगतता की जाँच करें।',
      },
      'ui-states': {
        label: 'इंटरैक्शन स्थितियाँ',
        text: 'लोडिंग, खाली, त्रुटि और सफलता स्थितियों को कवर करने के लिए नोड जोड़ें। सुनिश्चित करें कि हर महत्वपूर्ण इंटरैक्शन में स्पष्ट प्रतिक्रिया हो।',
      },
      'ui-design-system': {
        label: 'डिज़ाइन सिस्टम',
        text: 'घटक शैलियों, रिक्ति, त्रिज्या, छाया और रंग टोकन को एकरूप करने के लिए डिज़ाइन सिस्टम संरेखण agent जोड़ें।',
      },
      'ui-motion': {
        label: 'गति और संक्रमण',
        text: 'माइक्रोइंटरैक्शन और संक्रमण डिज़ाइन चरण जोड़ें। स्थिति परिवर्तन, लोडिंग और प्रतिक्रिया के लिए उपयुक्त एनिमेशन जोड़ें।',
      },
      'ui-usability': {
        label: 'उपयोगिता वॉकथ्रू',
        text: 'एक उपयोगिता वॉकथ्रू agent जोड़ें जो मुख्य पथों पर वास्तविक उपयोगकर्ता का अनुकरण करे। अवरोधक खोजें (बहुत सारे चरण, अनुपलब्ध संकेत, जोखिम भरी क्रियाएं)।',
      },
    },
  },
  'version-control': {
    label: 'VCS सुरक्षा',
    items: {
      'vcs-isolated-workspace': {
        label: 'पृथक कार्यक्षेत्र',
        text: 'फ़ाइलों या VCS स्थिति को संशोधित करने वाले चरणों से पहले, Git worktree, P4 workspace-client या SVN checkout जैसे पृथक कार्यक्षेत्र की आवश्यकता रखें।',
      },
      'vcs-status-check': {
        label: 'स्थिति जाँच',
        text: 'पहले उपयोग में आ रहे संस्करण नियंत्रण प्रणाली (Git, Perforce/P4, SVN या अन्य) की पहचान करें। केवल रीड-ओनली जाँच करें।',
      },
      'vcs-protect-changes': {
        label: 'परिवर्तन सुरक्षित रखें',
        text: 'उपयोगकर्ता के मौजूदा अनकमिटेड परिवर्तनों की रक्षा करें। उन्हें स्वचालित रूप से अधिलेखित, वापस, रीसेट या हटाएं नहीं।',
      },
      'vcs-no-auto-submit': {
        label: 'स्वतः सबमिट न करें',
        text: 'स्वचालित रूप से commit, check in, submit या push न करें, और दूरस्थ या साझा रिपॉज़िटरी में स्वचालित रूप से न लिखें।',
      },
      'vcs-pre-submit-confirm': {
        label: 'सबमिट से पहले पुष्टि',
        text: 'किसी भी commit, check in या submit से पहले, परिवर्तनों, प्रभावित फ़ाइलों, किए गए सत्यापन, संभावित जोखिमों और रोलबैक विधि का सारांश दें।',
      },
      'vcs-high-risk-confirm': {
        label: 'उच्च-जोखिम पुष्टि',
        text: 'हटाने, अधिलेखित करने, वापस लाने, सिंक करने, अपडेट करने, शाखा बदलने या सामूहिक नाम बदलने से पहले, प्रभाव का दायरा समझाएं और पुष्टि की प्रतीक्षा करें।',
      },
      'vcs-unknown-conservative': {
        label: 'अज्ञात VCS — रूढ़िवादी',
        text: 'यदि VCS या कार्यक्षेत्र स्थिति की पुष्टि नहीं की जा सकती, तो केवल रीड-ओनली विश्लेषण और अनुशंसाएं करें। फ़ाइलों को संशोधित करने वाली कार्रवाइयां न करें।',
      },
    },
  },
};

// ── Japanese (ja-JP) ────────────────────────────────────────────────────────

const ja: TranslationMap = {
  interactive: {
    label: 'インタラクティブ明確化',
    items: {
      'interactive-grill': { label: '問い詰める (grill-me)', text: 'grill-me' },
      'interactive-clarify': {
        label: '要件の明確化',
        text: 'ブループリントを編集する前に、インタラクション（select / input）を使用して最も曖昧または欠落している決定事項を確認してください。私が回答したら、すぐにその回答をワークフローブループリントに反映し、更新されたIRGraphを出力してください。',
      },
    },
  },
  clarity: {
    label: '明確さ',
    items: {
      'clarity-goal': {
        label: '目標の明確化',
        text: 'このワークフローの最終目標と成功基準を明確にし、各ノードの責務を一文で要約してください。',
      },
      'clarity-naming': {
        label: '命名の統一',
        text: 'ノードラベルとパラメータ名が一貫して明確であることを確認し、曖昧なノードの名前を変更してください。',
      },
      'clarity-simplify': {
        label: '構造の簡素化',
        text: '統合または削除できる冗長なステップを特定し、主要な実行チェーンを見やすくしてください。',
      },
    },
  },
  completeness: {
    label: '完全性',
    items: {
      'completeness-edges': {
        label: 'エッジケースの網羅',
        text: '未処理のエッジケースを列挙し、欠落しているパスにbranchノードを追加してください。',
      },
      'completeness-errors': {
        label: 'エラーハンドリング',
        text: '各agentノードに失敗処理パスを追加し、例外がワークフロー全体を中断しないようにしてください。',
      },
      'completeness-data': {
        label: 'データ配線',
        text: '3つの並列レビュー結果がすべてverifyステップに流れていることを確認し、欠落しているdataエッジを補完してください。',
      },
    },
  },
  cost: {
    label: 'コスト',
    items: {
      'cost-model': {
        label: 'モデルのダウングレード',
        text: '複雑性の低いノードをhaikuなどの安価なモデルに移動し、コスト削減額を見積もってください。',
      },
      'cost-parallel': {
        label: '並列最適化',
        text: '並列実行可能なステップを特定し、parallelノードに再編成して総所要時間を短縮してください。',
      },
      'cost-cache': {
        label: '再利用とキャッシュ',
        text: 'キャッシュまたは再利用可能な中間成果物を見つけ、agentの重複呼び出しを避けてください。',
      },
    },
  },
  structure: {
    label: '構造',
    items: {
      'structure-split': {
        label: '責務の分割',
        text: '各agentノードの責務を確認し、肥大化したagentを単一責務のagentノードに分割し、依存順にexecエッジで再接続して単一障害点を減らしてください。',
      },
      'structure-parallelize': {
        label: '並列再編成',
        text: 'execスパイン上のデータ依存関係のない直列agentノードを見つけ、parallelブロックに移動してください。依存関係のあるノードはpipelineに残します。',
      },
      'structure-phase': {
        label: 'フェーズグルーピング',
        text: 'phaseノードを使用して、収集→分析→実行→集約のような論理段階にワークフローを分割し、関連するagentを適切なphaseに配置してください。',
      },
      'structure-converge': {
        label: '結果の集約',
        text: '各parallelブロックの後ろに集約agentノードを追加し、各並列分岐の出力をdataエッジで接続してください。',
      },
      'structure-explicit-data': {
        label: '明示的データエッジ',
        text: 'ノード間の暗黙的なコンテキスト受け渡しを見直し、真の依存関係には明示的なdataエッジを追加し、冗長な配線を削除してください。',
      },
    },
  },
  reliability: {
    label: '信頼性',
    items: {
      'reliability-retry': {
        label: 'リトライとバックオフ',
        text: '外部ツールを呼び出すagentノードや一時的な失敗が発生するノードにリトライ設定を追加してください（約3回、指数バックオフとジッター付き）。リトライは冪等である必要があります。',
      },
      'reliability-fallback': {
        label: 'フォールバックパス',
        text: '重要なagentにbranchベースのフォールバック階層を追加してください。失敗時はよりシンプルなルールノード、さらに安価なモデル、最後に人間のキューへと段階的にフォールバックします。',
      },
      'reliability-boundary': {
        label: 'エラーバウンダリ',
        text: 'branchノードを使用して高リスクagentのエラーバウンダリを作成し、失敗パスを処理/アラート分岐に振り分けてください。',
      },
      'reliability-idempotent': {
        label: '冪等性とタイムアウト',
        text: '副作用のあるagentを確認し、リトライ時の重複操作を防ぐために冪等キーを追加し、LLM呼び出しにタイムアウトを設定してください。',
      },
      'reliability-loop-fuse': {
        label: 'ループヒューズ',
        text: 'loopノードに明確な最大反復回数と終了条件があることを確認し、無限ループを防ぐサーキットブレーカーロジックを追加してください。',
      },
      'reliability-production-grade': {
        label: '本番信頼性',
        text: 'このコードは本番用です。エンタープライズグレードの信頼性が必要です。MVP（最小限の実用製品）アプローチは使用しないでください。',
      },
    },
  },
  performance: {
    label: 'パフォーマンスと並列性',
    items: {
      'performance-critical-path': {
        label: 'クリティカルパス',
        text: 'execスパイン上の最長依存チェーンを分析し、前方移動または並列化できるagentノードを特定して全体のレイテンシを短縮してください。',
      },
      'performance-model-tier': {
        label: 'モデル階層',
        text: '各ノードのモデル設定を見直し、単純な分類・抽出タスクにはhaikuなどの軽量モデルを使用し、複雑な推論には強力なモデルを温存してください。',
      },
      'performance-dedupe': {
        label: '重複排除',
        text: '類似の作業を繰り返すagentを見つけ、再利用可能な単一ノードに統合し、その出力をdataエッジで分配してください。',
      },
      'performance-fanout': {
        label: 'ファンアウト制御',
        text: 'parallelブロックのファンアウト幅を確認し、適切な同時実行制限またはバッチ処理を追加してください。',
      },
    },
  },
  verification: {
    label: '検証とテスト',
    items: {
      'verification-verifier': {
        label: '検証ノード',
        text: '重要な出力agentの後ろにverifier agentノードを挿入し、dataエッジで上流の出力を受け取り、明示的な成功基準とスコアリング表で検証してください。',
      },
      'verification-adversarial': {
        label: '敵対的チェック',
        text: 'ユーザー入力や高リスク判断のステップに敵対的/レッドチームagentノードを追加し、権限昇格やインジェクションのシナリオをシミュレートしてください。',
      },
      'verification-selfcheck': {
        label: '自己チェックループ',
        text: '出力生成agentに自己チェックループを追加し、loopまたはbranchを使用して形式と制約を検証し、1回修正してから結果をリリースしてください。',
      },
      'verification-criteria': {
        label: '成功基準',
        text: '各agentノードにテスト可能な成功基準と出力契約（形式、長さ、必須フィールド）を追加してください。',
      },
    },
  },
  observability: {
    label: '可観測性',
    items: {
      'observability-logs': {
        label: 'キーログ',
        text: '各phase境界と重要なagent出力にlogノードを挿入し、ステップID、入力サマリ、結果ステータスを記録してください。',
      },
      'observability-branch': {
        label: '分岐の可視化',
        text: '各フォールバック/エラー分岐の失敗パスにlogノードを追加し、失敗コンテキスト（入力、ステップ、ステータス）をキャプチャしてください。',
      },
      'observability-parallel': {
        label: '並列トレーシング',
        text: '各parallel分岐内に共通の相関IDを持つlogノードを追加し、各agentの所要時間と出力を記録してください。',
      },
      'observability-audit': {
        label: '監査証跡',
        text: '高権限操作や外部副作用を持つagentの周辺にlogノードを追加し、判断根拠とキーメタデータを記録してください。',
      },
    },
  },
  security: {
    label: 'セキュリティと権限',
    items: {
      'security-approval': {
        label: '人間の承認',
        text: '不可逆的または高影響のagent操作（削除、支払い、外部送信）の前に、人間承認用のbranchノードを挿入してください。',
      },
      'security-scope': {
        label: '権限境界',
        text: '外部システムや機密データにアクセスするagentを確認し、その前後にbranch/logノードを使用して権限範囲を最小化してください。',
      },
      'security-redact': {
        label: '機密データのマスキング',
        text: '機密フィールドがログやagent間を通過する箇所に、マスキングまたはデータ最小化ノードを追加してください。',
      },
      'security-escalate': {
        label: '例外エスカレーション',
        text: '信頼性フォールバックチェーンの末端に人間向けフォールバック分岐を追加し、自動リトライとデグレードがすべて失敗した場合にタスクを人間のキューにエスカレーションしてください。',
      },
    },
  },
  'ui-ux': {
    label: 'UIとUX',
    items: {
      'ui-visual-review': {
        label: 'ビジュアルレビュー',
        text: 'インターフェース/フロントエンド出力を生成するagentの後ろにUIデザインレビューagentノードを挿入し、レイアウトの整列、余白、コントラスト、タイポグラフィ階層、視覚的一貫性をチェックしてください。',
      },
      'ui-theme-switch': {
        label: 'スタイルバリエーション',
        text: '複数テーマ/スタイルの切り替えをサポートし、配色、フォントサイズ、角丸などのデザイントークンをvariableノードとして抽出し、ライト/ダーク/ブランドバリエーションを生成するagentを追加してください。',
      },
      'ui-responsive': {
        label: 'レスポンシブチェック',
        text: 'デスクトップ/タブレット/モバイルの各ブレークポイントを並列チェックするparallelブロックを追加し、レイアウトのずれ、オーバーフロー、詰まりを特定してください。',
      },
      'ui-accessibility': {
        label: 'アクセシビリティ',
        text: 'アクセシビリティレビューagentノードを追加し、WCAGカラーコントラスト、キーボード操作性、フォーカス順序、ARIAラベル、スクリーンリーダー互換性をチェックしてください。',
      },
      'ui-states': {
        label: 'インタラクション状態',
        text: 'ローディング中/空データ/エラー/成功の各状態を処理するノードを追加し、すべての重要なインタラクションに明確なフィードバックを確保してください。',
      },
      'ui-design-system': {
        label: 'デザインシステム',
        text: 'コンポーネントスタイル、余白、角丸、シャドウ、カラートークンを統一するデザインシステム整列agentを追加し、使い捨てのインラインスタイルを排除してください。',
      },
      'ui-motion': {
        label: 'モーションとトランジション',
        text: 'マイクロインタラクションとトランジションのデザインステップを追加し、状態切り替え、ローディング、フィードバックに適切なアニメーションを付与してください。',
      },
      'ui-usability': {
        label: 'ユーザビリティウォークスルー',
        text: '主要操作パスで実ユーザーをシミュレートするユーザビリティウォークスルーagentノードを追加し、手順の多さ、ヒント不足、誤操作しやすさなどの体験上のブロッカーを発見してください。',
      },
    },
  },
  'version-control': {
    label: 'VCS安全性',
    items: {
      'vcs-isolated-workspace': {
        label: '隔離ワークスペース',
        text: 'ファイルやVCS状態を変更するステップの前に、Git worktree、P4 workspace-client、SVN checkoutなどの隔離ワークスペースの使用を要求してください。',
      },
      'vcs-status-check': {
        label: '状態チェック',
        text: 'まず使用中のバージョン管理システム（Git、Perforce/P4、SVN、その他）を特定し、読み取り専用で未コミット変更、競合、未追跡項目をチェックしてください。',
      },
      'vcs-protect-changes': {
        label: '変更の保護',
        text: 'ユーザーの既存の未コミット変更を保護し、自動的に上書き、巻き戻し、リセット、削除しないでください。',
      },
      'vcs-no-auto-submit': {
        label: '自動サブミット禁止',
        text: '自動的にcommit、check in、submit、pushを行わず、リモートや共有リポジトリに自動書き込みしないでください。',
      },
      'vcs-pre-submit-confirm': {
        label: 'サブミット前確認',
        text: 'commit、check in、submitの前に、変更内容、影響ファイル、実施済み検証、潜在的リスク、ロールバック方法を要約してください。',
      },
      'vcs-high-risk-confirm': {
        label: '高リスク確認',
        text: '削除、上書き、巻き戻し、同期、更新、ブランチ切り替え、一括リネームの前に、影響範囲を説明し確認を待ってください。',
      },
      'vcs-unknown-conservative': {
        label: '不明VCS — 保守的対応',
        text: 'VCSやワークスペース状態が確認できない場合は、読み取り専用の分析と推奨にとどめ、ファイルを変更する操作は実行しないでください。',
      },
    },
  },
};

// ── Portuguese (pt-BR) ──────────────────────────────────────────────────────

const pt: TranslationMap = {
  interactive: {
    label: 'Esclarecimento interativo',
    items: {
      'interactive-grill': { label: 'Interrogar-me (grill-me)', text: 'grill-me' },
      'interactive-clarify': {
        label: 'Esclarecer requisitos',
        text: 'Antes de editar o blueprint, utiliza uma interação (select / input) para confirmar a decisão mais ambígua ou em falta. Após a minha resposta, incorpora-a imediatamente no blueprint e produz o IRGraph atualizado.',
      },
    },
  },
  clarity: {
    label: 'Clareza',
    items: {
      'clarity-goal': {
        label: 'Definir objetivo',
        text: 'Esclarece o objetivo final e os critérios de sucesso deste workflow e resume a responsabilidade de cada nó numa frase.',
      },
      'clarity-naming': {
        label: 'Uniformizar nomes',
        text: 'Verifica se os rótulos dos nós e os nomes dos parâmetros são consistentes e claros. Renomeia nós ambíguos.',
      },
      'clarity-simplify': {
        label: 'Simplificar estrutura',
        text: 'Identifica passos redundantes que podem ser fundidos ou removidos para tornar a cadeia de execução principal mais legível.',
      },
    },
  },
  completeness: {
    label: 'Completude',
    items: {
      'completeness-edges': {
        label: 'Cobrir casos extremos',
        text: 'Enumera os casos extremos não tratados e adiciona nós branch para os caminhos em falta.',
      },
      'completeness-errors': {
        label: 'Tratamento de erros',
        text: 'Adiciona caminhos de tratamento de falhas para cada nó agent, para que exceções não interrompam todo o workflow.',
      },
      'completeness-data': {
        label: 'Ligação de dados',
        text: 'Verifica se os três resultados de revisão paralela fluem para o passo verify e completa as data edges em falta.',
      },
    },
  },
  cost: {
    label: 'Custo',
    items: {
      'cost-model': {
        label: 'Descer de modelo',
        text: 'Move nós de baixa complexidade para modelos mais baratos como haiku e estima a poupança de custos.',
      },
      'cost-parallel': {
        label: 'Paralelizar',
        text: 'Identifica passos que podem ser executados em paralelo e reestrutura-os num nó parallel para reduzir a duração total.',
      },
      'cost-cache': {
        label: 'Reutilizar e cache',
        text: 'Encontra resultados intermédios que podem ser colocados em cache ou reutilizados para evitar chamadas repetidas a agent.',
      },
    },
  },
  structure: {
    label: 'Estrutura',
    items: {
      'structure-split': {
        label: 'Dividir responsabilidades',
        text: 'Revê a responsabilidade de cada nó agent. Divide agentes sobrecarregados em nós de finalidade única e reconecta-os com exec edges por ordem de dependência.',
      },
      'structure-parallelize': {
        label: 'Reorganizar em paralelo',
        text: 'Encontra nós agent em série no eixo exec sem dependência de dados entre si. Move-os para um bloco parallel, mantendo os nós dependentes num pipeline.',
      },
      'structure-phase': {
        label: 'Agrupar por fase',
        text: 'Usa nós phase para dividir o workflow em fases lógicas (recolher → analisar → executar → resumir). Coloca os agents na fase adequada.',
      },
      'structure-converge': {
        label: 'Convergir resultados',
        text: 'Adiciona um agent de agregação após cada bloco parallel. Conecta cada saída de ramo paralelo através de data edges.',
      },
      'structure-explicit-data': {
        label: 'Data edges explícitas',
        text: 'Revê a passagem implícita de contexto entre nós. Adiciona data edges explícitas para dependências reais e remove as redundantes.',
      },
    },
  },
  reliability: {
    label: 'Fiabilidade',
    items: {
      'reliability-retry': {
        label: 'Repetição com backoff',
        text: 'Adiciona configurações de repetição aos nós agent que chamam ferramentas externas — cerca de 3 tentativas com backoff exponencial e jitter. As repetições devem ser idempotentes.',
      },
      'reliability-fallback': {
        label: 'Caminho de fallback',
        text: 'Adiciona camadas de fallback baseadas em branch para agentes críticos: em falha, recua para um nó de regras mais simples, depois um modelo mais barato, depois uma fila humana.',
      },
      'reliability-boundary': {
        label: 'Limite de erro',
        text: 'Usa nós branch para criar limites de erro em agentes de alto risco. Encaminha caminhos de falha para ramos de tratamento ou alerta.',
      },
      'reliability-idempotent': {
        label: 'Idempotência e timeout',
        text: 'Revê agentes com efeitos colaterais. Adiciona chaves de idempotência e define timeouts para chamadas LLM.',
      },
      'reliability-loop-fuse': {
        label: 'Fusível de ciclo',
        text: 'Verifica se os nós loop têm um número máximo de iterações claro e uma condição de saída. Adiciona lógica de circuit-breaker.',
      },
      'reliability-production-grade': {
        label: 'Fiabilidade de produção',
        text: 'Este código é para produção. Deve ter fiabilidade de nível empresarial; não uses uma abordagem MVP (produto mínimo viável).',
      },
    },
  },
  performance: {
    label: 'Desempenho e paralelismo',
    items: {
      'performance-critical-path': {
        label: 'Caminho crítico',
        text: 'Analisa a cadeia de dependência mais longa no eixo exec. Identifica nós agent que podem ser antecipados ou paralelizados.',
      },
      'performance-model-tier': {
        label: 'Níveis de modelo',
        text: 'Revê as configurações de modelo de cada nó. Usa modelos mais leves como haiku para tarefas simples e reserva os fortes para raciocínio complexo.',
      },
      'performance-dedupe': {
        label: 'Desduplicar',
        text: 'Encontra agentes que repetem trabalho semelhante. Funde-os num nó reutilizável e distribui o seu resultado com data edges.',
      },
      'performance-fanout': {
        label: 'Controlo de fan-out',
        text: 'Verifica a largura de fan-out dos blocos parallel. Adiciona limites de concorrência razoáveis ou processamento em lote.',
      },
    },
  },
  verification: {
    label: 'Verificação e testes',
    items: {
      'verification-verifier': {
        label: 'Nó verificador',
        text: 'Insere um agente verificador após agentes de saída críticos. Alimenta a saída através de data edges e valida contra critérios de sucesso explícitos.',
      },
      'verification-adversarial': {
        label: 'Verificação adversarial',
        text: 'Adiciona um agente adversarial/red-team para entradas de utilizador ou decisões de alto risco. Simula cenários de escalada de privilégios e injeção.',
      },
      'verification-selfcheck': {
        label: 'Ciclo de autoverificação',
        text: 'Adiciona um ciclo de autoverificação aos agentes de saída. Usa loop ou branch para verificar formato e restrições, corrigir uma vez e libertar.',
      },
      'verification-criteria': {
        label: 'Critérios de sucesso',
        text: 'Adiciona critérios de sucesso testáveis e contratos de saída a cada nó agent (formato, comprimento, campos obrigatórios).',
      },
    },
  },
  observability: {
    label: 'Observabilidade',
    items: {
      'observability-logs': {
        label: 'Logs chave',
        text: 'Insere nós log em cada fronteira de phase e nas saídas de agent críticas. Regista o ID do passo, resumo da entrada e estado do resultado.',
      },
      'observability-branch': {
        label: 'Visibilidade de ramos',
        text: 'Adiciona nós log nos caminhos de falha de cada ramo de fallback ou erro. Captura o contexto da falha.',
      },
      'observability-parallel': {
        label: 'Rastreamento paralelo',
        text: 'Adiciona nós log com um ID de correlação partilhado dentro de cada ramo parallel. Regista a duração e saída de cada agent.',
      },
      'observability-audit': {
        label: 'Trilho de auditoria',
        text: 'Adiciona nós log em torno de agentes com permissões elevadas ou efeitos colaterais externos. Regista evidências de decisão e metadados chave.',
      },
    },
  },
  security: {
    label: 'Segurança e permissões',
    items: {
      'security-approval': {
        label: 'Aprovação humana',
        text: 'Insere um nó branch de aprovação humana antes de ações agent irreversíveis ou de alto impacto (eliminação, pagamento, envio externo).',
      },
      'security-scope': {
        label: 'Limite de permissão',
        text: 'Revê agentes que acedem a sistemas externos ou dados sensíveis. Usa nós branch/log antes e depois para restringir o âmbito.',
      },
      'security-redact': {
        label: 'Ocultação de dados sensíveis',
        text: 'Adiciona nós de ocultação ou minimização onde campos sensíveis passam por logs ou entre agentes.',
      },
      'security-escalate': {
        label: 'Escalar exceções',
        text: 'Adiciona um ramo de fallback humano no final da cadeia de fallback de fiabilidade. Quando tudo falhar, encaminha a tarefa para uma fila humana.',
      },
    },
  },
  'ui-ux': {
    label: 'UI e UX',
    items: {
      'ui-visual-review': {
        label: 'Revisão visual',
        text: 'Insere um agente de revisão de design UI após agentes que geram interfaces. Verifica alinhamento, espaçamento, contraste, hierarquia tipográfica e consistência visual.',
      },
      'ui-theme-switch': {
        label: 'Variantes de estilo',
        text: 'Adiciona suporte para vários temas. Extrai cores, tamanhos de fonte e raios como nós variable e gera variantes claras/escuras/de marca.',
      },
      'ui-responsive': {
        label: 'Verificação responsiva',
        text: 'Adiciona um bloco parallel que verifica layouts de desktop, tablet e telemóvel em paralelo. Identifica deslocamentos, transbordos e zonas apertadas.',
      },
      'ui-accessibility': {
        label: 'Acessibilidade',
        text: 'Adiciona um agente de revisão de acessibilidade. Verifica contraste WCAG, acesso por teclado, ordem de foco, etiquetas ARIA e compatibilidade com leitores de ecrã.',
      },
      'ui-states': {
        label: 'Estados de interação',
        text: 'Adiciona nós para cobrir estados de carregamento, vazio, erro e sucesso. Garante feedback claro para cada interação chave.',
      },
      'ui-design-system': {
        label: 'Sistema de design',
        text: 'Adiciona um agente de alinhamento com o sistema de design para unificar estilos de componentes, espaçamento, raios, sombras e tokens de cor.',
      },
      'ui-motion': {
        label: 'Animação e transições',
        text: 'Adiciona um passo de design de microinterações e transições. Incorpora animações adequadas para mudanças de estado, carregamento e feedback.',
      },
      'ui-usability': {
        label: 'Avaliação de usabilidade',
        text: 'Adiciona um agente de avaliação de usabilidade que simula um utilizador real nos caminhos principais. Encontra bloqueios (demasiados passos, falta de pistas, ações arriscadas).',
      },
    },
  },
  'version-control': {
    label: 'Segurança VCS',
    items: {
      'vcs-isolated-workspace': {
        label: 'Espaço de trabalho isolado',
        text: 'Antes de passos que modifiquem ficheiros ou estado VCS, exige um espaço de trabalho isolado como Git worktree, P4 workspace-client ou SVN checkout.',
      },
      'vcs-status-check': {
        label: 'Verificação de estado',
        text: 'Identifica primeiro o sistema de controlo de versões em uso (Git, Perforce/P4, SVN ou outro). Realiza apenas verificações de só leitura.',
      },
      'vcs-protect-changes': {
        label: 'Proteger alterações',
        text: 'Protege as alterações não submetidas existentes do utilizador. Não as sobrescrevas, revertas, reponhas ou apagues automaticamente.',
      },
      'vcs-no-auto-submit': {
        label: 'Proibir submissão automática',
        text: 'Não faças commit, check-in, submit ou push automáticos, nem escrevas automaticamente num repositório remoto ou partilhado.',
      },
      'vcs-pre-submit-confirm': {
        label: 'Confirmar antes de submeter',
        text: 'Antes de qualquer commit, check-in ou submit, resume as alterações, ficheiros afetados, verificação realizada, riscos e método de reversão.',
      },
      'vcs-high-risk-confirm': {
        label: 'Confirmação de alto risco',
        text: 'Antes de eliminar, sobrescrever, reverter, sincronizar, atualizar, mudar de ramo ou renomear em lote, explica o âmbito do impacto e aguarda confirmação.',
      },
      'vcs-unknown-conservative': {
        label: 'VCS desconhecido — conservador',
        text: 'Se o VCS ou o estado do espaço de trabalho não puder ser confirmado, realiza apenas análise e recomendações de só leitura. Não executes ações que modifiquem ficheiros.',
      },
    },
  },
};

// ── Russian (ru-RU) ─────────────────────────────────────────────────────────

const ru: TranslationMap = {
  interactive: {
    label: 'Интерактивное уточнение',
    items: {
      'interactive-grill': { label: 'Допрос (grill-me)', text: 'grill-me' },
      'interactive-clarify': {
        label: 'Уточнить требования',
        text: 'Перед редактированием схемы используйте взаимодействие (select / input), чтобы подтвердить самое неоднозначное или отсутствующее решение. После моего ответа немедленно внесите его в схему рабочего процесса и выведите обновлённый IRGraph.',
      },
    },
  },
  clarity: {
    label: 'Ясность',
    items: {
      'clarity-goal': {
        label: 'Определить цель',
        text: 'Уточните конечную цель и критерии успеха этого рабочего процесса и опишите обязанности каждого узла одним предложением.',
      },
      'clarity-naming': {
        label: 'Унифицировать названия',
        text: 'Проверьте, что метки узлов и названия параметров согласованы и понятны. Переименуйте неоднозначные узлы.',
      },
      'clarity-simplify': {
        label: 'Упростить структуру',
        text: 'Найдите избыточные шаги, которые можно объединить или удалить, чтобы основная цепочка выполнения стала нагляднее.',
      },
    },
  },
  completeness: {
    label: 'Полнота',
    items: {
      'completeness-edges': {
        label: 'Покрыть граничные случаи',
        text: 'Перечислите необработанные граничные случаи и добавьте узлы branch для отсутствующих путей.',
      },
      'completeness-errors': {
        label: 'Обработка ошибок',
        text: 'Добавьте пути обработки сбоев для каждого узла agent, чтобы исключения не прерывали весь рабочий процесс.',
      },
      'completeness-data': {
        label: 'Связи данных',
        text: 'Проверьте, что все три результата параллельной проверки поступают в шаг verify, и добавьте недостающие data-связи.',
      },
    },
  },
  cost: {
    label: 'Стоимость',
    items: {
      'cost-model': {
        label: 'Понизить модель',
        text: 'Перенесите узлы низкой сложности на более дешёвые модели, такие как haiku, и оцените экономию.',
      },
      'cost-parallel': {
        label: 'Распараллелить',
        text: 'Найдите шаги, которые можно выполнять параллельно, и перестройте их в узел parallel, чтобы сократить общее время.',
      },
      'cost-cache': {
        label: 'Повторное использование и кеш',
        text: 'Найдите промежуточные результаты, которые можно кешировать или переиспользовать, чтобы избежать повторных вызовов agent.',
      },
    },
  },
  structure: {
    label: 'Структура',
    items: {
      'structure-split': {
        label: 'Разделить обязанности',
        text: 'Проверьте обязанности каждого узла agent. Разделите перегруженные agent на узлы с одной обязанностью и соедините их exec-связями по порядку зависимостей.',
      },
      'structure-parallelize': {
        label: 'Параллельная реорганизация',
        text: 'Найдите последовательные узлы agent на главной exec-оси без взаимных зависимостей по данным. Переместите их в блок parallel, оставив зависимые узлы в pipeline.',
      },
      'structure-phase': {
        label: 'Группировка по фазам',
        text: 'Используйте узлы phase для разделения рабочего процесса на логические этапы (сбор → анализ → выполнение → обобщение).',
      },
      'structure-converge': {
        label: 'Свести результаты',
        text: 'Добавьте агрегирующий agent после каждого блока parallel. Соедините выходы каждой параллельной ветви data-связями.',
      },
      'structure-explicit-data': {
        label: 'Явные data-связи',
        text: 'Проверьте неявную передачу контекста между узлами. Добавьте явные data-связи для реальных зависимостей и удалите избыточные.',
      },
    },
  },
  reliability: {
    label: 'Надёжность',
    items: {
      'reliability-retry': {
        label: 'Повтор с откатом',
        text: 'Добавьте настройки повтора для узлов agent, вызывающих внешние инструменты — около 3 попыток с экспоненциальным откатом и джиттером. Повторы должны быть идемпотентными.',
      },
      'reliability-fallback': {
        label: 'Путь отката',
        text: 'Добавьте уровни отката на основе branch для критических agents: при сбое переходите к более простому узлу правил, затем к более дешёвой модели, затем к очереди человеку.',
      },
      'reliability-boundary': {
        label: 'Граница ошибки',
        text: 'Используйте узлы branch для создания границ ошибок вокруг высокорисковых agents. Направляйте пути сбоя в ветви обработки или оповещения.',
      },
      'reliability-idempotent': {
        label: 'Идемпотентность и таймаут',
        text: 'Проверьте agents с побочными эффектами. Добавьте ключи идемпотентности и установите таймауты для вызовов LLM.',
      },
      'reliability-loop-fuse': {
        label: 'Предохранитель цикла',
        text: 'Убедитесь, что узлы loop имеют явное максимальное число итераций и условие выхода. Добавьте логику circuit-breaker.',
      },
      'reliability-production-grade': {
        label: 'Продакшн-надёжность',
        text: 'Этот код для продакшена. Он должен обладать надёжностью корпоративного уровня; не используйте подход MVP (минимально жизнеспособный продукт).',
      },
    },
  },
  performance: {
    label: 'Производительность и параллелизм',
    items: {
      'performance-critical-path': {
        label: 'Критический путь',
        text: 'Проанализируйте самую длинную цепочку зависимостей на exec-оси. Найдите узлы agent, которые можно вынести вперёд или распараллелить.',
      },
      'performance-model-tier': {
        label: 'Уровни моделей',
        text: 'Проверьте настройки моделей для каждого узла. Используйте лёгкие модели, такие как haiku, для простых задач, а сильные — для сложных рассуждений.',
      },
      'performance-dedupe': {
        label: 'Дедупликация',
        text: 'Найдите agents, повторяющие схожую работу. Объедините их в один переиспользуемый узел и распределите его вывод через data-связи.',
      },
      'performance-fanout': {
        label: 'Контроль веера',
        text: 'Проверьте ширину веера блоков parallel. Добавьте разумные ограничения параллелизма или пакетную обработку.',
      },
    },
  },
  verification: {
    label: 'Верификация и тестирование',
    items: {
      'verification-verifier': {
        label: 'Узел-верификатор',
        text: 'Вставьте verifier agent после критических выходных agents. Подайте выходные данные через data-связи и проверьте по явным критериям успеха.',
      },
      'verification-adversarial': {
        label: 'Состязательная проверка',
        text: 'Добавьте состязательный/red-team agent для пользовательского ввода или высокорисковых решений. Смоделируйте сценарии повышения привилегий и инъекций.',
      },
      'verification-selfcheck': {
        label: 'Цикл самопроверки',
        text: 'Добавьте цикл самопроверки для agents, производящих вывод. Используйте loop или branch для проверки формата и ограничений.',
      },
      'verification-criteria': {
        label: 'Критерии успеха',
        text: 'Добавьте проверяемые критерии успеха и выходные контракты к каждому узлу agent (формат, длина, обязательные поля).',
      },
    },
  },
  observability: {
    label: 'Наблюдаемость',
    items: {
      'observability-logs': {
        label: 'Ключевые логи',
        text: 'Вставьте узлы log на каждой границе phase и у критических выходов agent. Записывайте ID шага, сводку ввода и статус результата.',
      },
      'observability-branch': {
        label: 'Видимость ветвей',
        text: 'Добавьте узлы log в пути сбоя каждой ветви отката или ошибки. Захватывайте контекст сбоя.',
      },
      'observability-parallel': {
        label: 'Параллельная трассировка',
        text: 'Добавьте узлы log с общим корреляционным ID внутри каждой параллельной ветви. Записывайте длительность и вывод каждого agent.',
      },
      'observability-audit': {
        label: 'Аудиторский след',
        text: 'Добавьте узлы log вокруг agents с высокими привилегиями или внешними побочными эффектами. Записывайте обоснования решений и ключевые метаданные.',
      },
    },
  },
  security: {
    label: 'Безопасность и разрешения',
    items: {
      'security-approval': {
        label: 'Подтверждение человеком',
        text: 'Вставьте узел branch для подтверждения человеком перед необратимыми или высоковлиятельными действиями agent (удаление, платёж, внешняя отправка).',
      },
      'security-scope': {
        label: 'Граница разрешений',
        text: 'Проверьте agents, обращающиеся к внешним системам или конфиденциальным данным. Используйте узлы branch/log до и после для сужения области доступа.',
      },
      'security-redact': {
        label: 'Маскирование чувствительных данных',
        text: 'Добавьте узлы маскирования или минимизации данных там, где конфиденциальные поля проходят через логи или между agents.',
      },
      'security-escalate': {
        label: 'Эскалация исключений',
        text: 'Добавьте ветвь отката к человеку в конце цепочки откатов надёжности. Когда всё не удалось, направьте задачу в очередь человеку.',
      },
    },
  },
  'ui-ux': {
    label: 'UI и UX',
    items: {
      'ui-visual-review': {
        label: 'Визуальная проверка',
        text: 'Вставьте агент проверки UI-дизайна после agents, генерирующих интерфейсы. Проверьте выравнивание, отступы, контраст, типографскую иерархию и визуальную согласованность.',
      },
      'ui-theme-switch': {
        label: 'Варианты стилей',
        text: 'Добавьте поддержку нескольких тем. Извлеките цвета, размеры шрифтов и радиусы как узлы variable и сгенерируйте светлые/тёмные/брендовые варианты.',
      },
      'ui-responsive': {
        label: 'Адаптивная проверка',
        text: 'Добавьте блок parallel для параллельной проверки декстопных, планшетных и мобильных макетов. Выявите смещения, переполнения и зажатые области.',
      },
      'ui-accessibility': {
        label: 'Доступность',
        text: 'Добавьте агент проверки доступности. Проверьте цветовой контраст WCAG, доступ с клавиатуры, порядок фокуса, ARIA-метки и совместимость с экранными читалками.',
      },
      'ui-states': {
        label: 'Состояния взаимодействия',
        text: 'Добавьте узлы для покрытия состояний загрузки, пустоты, ошибки и успеха. Обеспечьте ясную обратную связь для каждого ключевого взаимодействия.',
      },
      'ui-design-system': {
        label: 'Дизайн-система',
        text: 'Добавьте агент выравнивания с дизайн-системой для унификации стилей компонентов, отступов, радиусов, теней и цветовых токенов.',
      },
      'ui-motion': {
        label: 'Анимация и переходы',
        text: 'Добавьте шаг проектирования микровзаимодействий и переходов. Внедрите подходящую анимацию для смены состояний, загрузки и обратной связи.',
      },
      'ui-usability': {
        label: 'Юзабилити-обход',
        text: 'Добавьте агент юзабилити-обхода, имитирующий реального пользователя на ключевых путях. Найдите блокеры (слишком много шагов, нехватка подсказок, рискованные действия).',
      },
    },
  },
  'version-control': {
    label: 'Безопасность VCS',
    items: {
      'vcs-isolated-workspace': {
        label: 'Изолированное рабочее пространство',
        text: 'Перед шагами, изменяющими файлы или состояние VCS, требуйте изолированное рабочее пространство, такое как Git worktree, P4 workspace-client или SVN checkout.',
      },
      'vcs-status-check': {
        label: 'Проверка состояния',
        text: 'Сначала определите используемую систему контроля версий (Git, Perforce/P4, SVN или другую). Выполняйте только проверки в режиме чтения.',
      },
      'vcs-protect-changes': {
        label: 'Защитить изменения',
        text: 'Защитите существующие незакоммиченные изменения пользователя. Не перезаписывайте, не откатывайте, не сбрасывайте и не удаляйте их автоматически.',
      },
      'vcs-no-auto-submit': {
        label: 'Запрет автоотправки',
        text: 'Не выполняйте автоматический commit, check in, submit или push, и не пишите автоматически в удалённый или общий репозиторий.',
      },
      'vcs-pre-submit-confirm': {
        label: 'Подтверждение перед отправкой',
        text: 'Перед любым commit, check in или submit обобщите изменения, затронутые файлы, выполненную проверку, потенциальные риски и способ отката.',
      },
      'vcs-high-risk-confirm': {
        label: 'Подтверждение высокого риска',
        text: 'Перед удалением, перезаписью, откатом, синхронизацией, обновлением, переключением ветки или массовым переименованием объясните масштаб воздействия и дождитесь подтверждения.',
      },
      'vcs-unknown-conservative': {
        label: 'Неизвестная VCS — консервативно',
        text: 'Если VCS или состояние рабочего пространства не удаётся подтвердить, выполняйте только анализ и рекомендации в режиме чтения. Не изменяйте файлы.',
      },
    },
  },
};

// ── Aggregate export ────────────────────────────────────────────────────────

/**
 * All non-default translation maps keyed by locale.
 * `zh-CN` is omitted (it is `DEFAULT_LOCALE`, seeded from the base items).
 * `en-US` is defined as `englishPromptTranslations` in sampleSessions.ts.
 */
export const PROMPT_TRANSLATIONS: Record<string, TranslationMap> = {
  'ar-SA': ar,
  'de-DE': de,
  'es-ES': es,
  'fr-FR': fr,
  'hi-IN': hi,
  'ja-JP': ja,
  'pt-BR': pt,
  'ru-RU': ru,
};
