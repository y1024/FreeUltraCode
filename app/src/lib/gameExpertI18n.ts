/**
 * CONTRACT: localized display strings for built-in game experts.
 *
 * The built-in `GAME_EXPERTS` catalog (lib/gameExperts.ts) stores canonical
 * `id`, English `name`, and English `group` values. Those ids/groups are stable
 * keys used by routing, prompt building, and persistence and must NOT change.
 *
 * This module is a pure presentation layer: given an expert and the active
 * locale, it returns a localized name/group for display in the settings UI.
 * Unknown ids/groups (e.g. user-created custom experts) fall back to the raw
 * value, so custom experts keep their author-provided names.
 */
import type { Locale } from './i18n';
import { SUPPORTED_LOCALES } from './i18n';
import type { GameExpertDefinition } from './gameExperts';

type LocaleMap = Partial<Record<Locale, string>>;

// Group/category labels. Small, reused set, fully translated for every locale.
const GROUP_LABELS: Record<string, LocaleMap> = {
  Leadership: { 'zh-CN': '领导', 'en-US': 'Leadership', 'fr-FR': 'Direction', 'ru-RU': 'Руководство', 'es-ES': 'Dirección', 'hi-IN': 'नेतृत्व', 'ar-SA': 'القيادة', 'pt-BR': 'Liderança', 'ja-JP': 'リーダーシップ', 'de-DE': 'Führung', 'ko-KR': '리더십' },
  Design: { 'zh-CN': '设计', 'en-US': 'Design', 'fr-FR': 'Conception', 'ru-RU': 'Дизайн', 'es-ES': 'Diseño', 'hi-IN': 'डिज़ाइन', 'ar-SA': 'التصميم', 'pt-BR': 'Design', 'ja-JP': 'デザイン', 'de-DE': 'Design', 'ko-KR': '디자인' },
  Programming: { 'zh-CN': '编程', 'en-US': 'Programming', 'fr-FR': 'Programmation', 'ru-RU': 'Программирование', 'es-ES': 'Programación', 'hi-IN': 'प्रोग्रामिंग', 'ar-SA': 'البرمجة', 'pt-BR': 'Programação', 'ja-JP': 'プログラミング', 'de-DE': 'Programmierung', 'ko-KR': '프로그래밍' },
  Engine: { 'zh-CN': '引擎', 'en-US': 'Engine', 'fr-FR': 'Moteur', 'ru-RU': 'Движок', 'es-ES': 'Motor', 'hi-IN': 'इंजन', 'ar-SA': 'المحرك', 'pt-BR': 'Motor', 'ja-JP': 'エンジン', 'de-DE': 'Engine', 'ko-KR': '엔진' },
  UI: { 'zh-CN': '界面', 'en-US': 'UI', 'fr-FR': 'Interface', 'ru-RU': 'Интерфейс', 'es-ES': 'Interfaz', 'hi-IN': 'यूआई', 'ar-SA': 'الواجهة', 'pt-BR': 'Interface', 'ja-JP': 'UI', 'de-DE': 'UI', 'ko-KR': 'UI' },
  Quality: { 'zh-CN': '质量', 'en-US': 'Quality', 'fr-FR': 'Qualité', 'ru-RU': 'Качество', 'es-ES': 'Calidad', 'hi-IN': 'गुणवत्ता', 'ar-SA': 'الجودة', 'pt-BR': 'Qualidade', 'ja-JP': '品質', 'de-DE': 'Qualität', 'ko-KR': '품질' },
  Production: { 'zh-CN': '制作', 'en-US': 'Production', 'fr-FR': 'Production', 'ru-RU': 'Производство', 'es-ES': 'Producción', 'hi-IN': 'प्रोडक्शन', 'ar-SA': 'الإنتاج', 'pt-BR': 'Produção', 'ja-JP': 'プロダクション', 'de-DE': 'Produktion', 'ko-KR': '프로덕션' },
  Audio: { 'zh-CN': '音频', 'en-US': 'Audio', 'fr-FR': 'Audio', 'ru-RU': 'Аудио', 'es-ES': 'Audio', 'hi-IN': 'ऑडियो', 'ar-SA': 'الصوت', 'pt-BR': 'Áudio', 'ja-JP': 'オーディオ', 'de-DE': 'Audio', 'ko-KR': '오디오' },
  Art: { 'zh-CN': '美术', 'en-US': 'Art', 'fr-FR': 'Art', 'ru-RU': 'Арт', 'es-ES': 'Arte', 'hi-IN': 'कला', 'ar-SA': 'الفن', 'pt-BR': 'Arte', 'ja-JP': 'アート', 'de-DE': 'Art', 'ko-KR': '아트' },
  Systems: { 'zh-CN': '系统', 'en-US': 'Systems', 'fr-FR': 'Systèmes', 'ru-RU': 'Системы', 'es-ES': 'Sistemas', 'hi-IN': 'सिस्टम्स', 'ar-SA': 'الأنظمة', 'pt-BR': 'Sistemas', 'ja-JP': 'システム', 'de-DE': 'Systeme', 'ko-KR': '시스템' },
  Live: { 'zh-CN': '运营', 'en-US': 'Live', 'fr-FR': 'Live', 'ru-RU': 'Лайв', 'es-ES': 'En vivo', 'hi-IN': 'लाइव', 'ar-SA': 'التشغيل المباشر', 'pt-BR': 'Ao vivo', 'ja-JP': 'ライブ運営', 'de-DE': 'Live-Betrieb', 'ko-KR': '라이브' },
  Narrative: { 'zh-CN': '叙事', 'en-US': 'Narrative', 'fr-FR': 'Narration', 'ru-RU': 'Нарратив', 'es-ES': 'Narrativa', 'hi-IN': 'कथा', 'ar-SA': 'السرد', 'pt-BR': 'Narrativa', 'ja-JP': 'ナラティブ', 'de-DE': 'Narrativ', 'ko-KR': '내러티브' },
  Release: { 'zh-CN': '发布', 'en-US': 'Release', 'fr-FR': 'Publication', 'ru-RU': 'Релиз', 'es-ES': 'Lanzamiento', 'hi-IN': 'रिलीज़', 'ar-SA': 'الإصدار', 'pt-BR': 'Lançamento', 'ja-JP': 'リリース', 'de-DE': 'Release', 'ko-KR': '릴리스' },
  Custom: { 'zh-CN': '自定义', 'en-US': 'Custom', 'fr-FR': 'Personnalisé', 'ru-RU': 'Пользовательский', 'es-ES': 'Personalizado', 'hi-IN': 'कस्टम', 'ar-SA': 'مخصص', 'pt-BR': 'Personalizado', 'ja-JP': 'カスタム', 'de-DE': 'Benutzerdefiniert', 'ko-KR': '사용자 정의' },
};

// Per-expert display names keyed by built-in expert id. Technology proper nouns
// (Unity, Unreal, Godot, GAS, DOTS, UMG, Blueprint, GDScript, Shader, etc.) are
// kept as-is; only the role descriptors are localized.
const NAME_LABELS: Record<string, LocaleMap> = {
  'technical-director': { 'zh-CN': '技术总监', 'en-US': 'Technical Director', 'fr-FR': 'Directeur technique', 'ru-RU': 'Технический директор', 'es-ES': 'Director técnico', 'hi-IN': 'तकनीकी निदेशक', 'ar-SA': 'المدير الفني', 'pt-BR': 'Diretor técnico', 'ja-JP': 'テクニカルディレクター', 'de-DE': 'Technischer Direktor', 'ko-KR': '기술 디렉터' },
  'game-designer': { 'zh-CN': '游戏设计师', 'en-US': 'Game Designer', 'fr-FR': 'Concepteur de jeu', 'ru-RU': 'Гейм-дизайнер', 'es-ES': 'Diseñador de juegos', 'hi-IN': 'गेम डिज़ाइनर', 'ar-SA': 'مصمم الألعاب', 'pt-BR': 'Designer de jogos', 'ja-JP': 'ゲームデザイナー', 'de-DE': 'Game Designer', 'ko-KR': '게임 디자이너' },
  'gameplay-programmer': { 'zh-CN': '玩法程序', 'en-US': 'Gameplay Programmer', 'fr-FR': 'Programmeur gameplay', 'ru-RU': 'Программист геймплея', 'es-ES': 'Programador de jugabilidad', 'hi-IN': 'गेमप्ले प्रोग्रामर', 'ar-SA': 'مبرمج اللعب', 'pt-BR': 'Programador de gameplay', 'ja-JP': 'ゲームプレイプログラマー', 'de-DE': 'Gameplay-Programmierer', 'ko-KR': '게임플레이 프로그래머' },
  'unity-specialist': { 'zh-CN': 'Unity 专家', 'en-US': 'Unity Specialist', 'fr-FR': 'Spécialiste Unity', 'ru-RU': 'Специалист по Unity', 'es-ES': 'Especialista en Unity', 'hi-IN': 'Unity विशेषज्ञ', 'ar-SA': 'خبير Unity', 'pt-BR': 'Especialista em Unity', 'ja-JP': 'Unity スペシャリスト', 'de-DE': 'Unity-Spezialist', 'ko-KR': 'Unity 전문가' },
  'unreal-specialist': { 'zh-CN': 'Unreal 专家', 'en-US': 'Unreal Specialist', 'fr-FR': 'Spécialiste Unreal', 'ru-RU': 'Специалист по Unreal', 'es-ES': 'Especialista en Unreal', 'hi-IN': 'Unreal विशेषज्ञ', 'ar-SA': 'خبير Unreal', 'pt-BR': 'Especialista em Unreal', 'ja-JP': 'Unreal スペシャリスト', 'de-DE': 'Unreal-Spezialist', 'ko-KR': 'Unreal 전문가' },
  'godot-specialist': { 'zh-CN': 'Godot 专家', 'en-US': 'Godot Specialist', 'fr-FR': 'Spécialiste Godot', 'ru-RU': 'Специалист по Godot', 'es-ES': 'Especialista en Godot', 'hi-IN': 'Godot विशेषज्ञ', 'ar-SA': 'خبير Godot', 'pt-BR': 'Especialista em Godot', 'ja-JP': 'Godot スペシャリスト', 'de-DE': 'Godot-Spezialist', 'ko-KR': 'Godot 전문가' },
  'ui-programmer': { 'zh-CN': 'UI 程序', 'en-US': 'UI Programmer', 'fr-FR': 'Programmeur UI', 'ru-RU': 'UI-программист', 'es-ES': 'Programador de UI', 'hi-IN': 'UI प्रोग्रामर', 'ar-SA': 'مبرمج واجهة المستخدم', 'pt-BR': 'Programador de UI', 'ja-JP': 'UI プログラマー', 'de-DE': 'UI-Programmierer', 'ko-KR': 'UI 프로그래머' },
  'ux-designer': { 'zh-CN': 'UX 设计师', 'en-US': 'UX Designer', 'fr-FR': 'Concepteur UX', 'ru-RU': 'UX-дизайнер', 'es-ES': 'Diseñador UX', 'hi-IN': 'UX डिज़ाइनर', 'ar-SA': 'مصمم تجربة المستخدم', 'pt-BR': 'Designer de UX', 'ja-JP': 'UX デザイナー', 'de-DE': 'UX-Designer', 'ko-KR': 'UX 디자이너' },
  'ai-programmer': { 'zh-CN': 'AI 程序', 'en-US': 'AI Programmer', 'fr-FR': 'Programmeur IA', 'ru-RU': 'AI-программист', 'es-ES': 'Programador de IA', 'hi-IN': 'AI प्रोग्रामर', 'ar-SA': 'مبرمج الذكاء الاصطناعي', 'pt-BR': 'Programador de IA', 'ja-JP': 'AI プログラマー', 'de-DE': 'KI-Programmierer', 'ko-KR': 'AI 프로그래머' },
  'network-programmer': { 'zh-CN': '网络程序', 'en-US': 'Network Programmer', 'fr-FR': 'Programmeur réseau', 'ru-RU': 'Сетевой программист', 'es-ES': 'Programador de red', 'hi-IN': 'नेटवर्क प्रोग्रामर', 'ar-SA': 'مبرمج الشبكات', 'pt-BR': 'Programador de rede', 'ja-JP': 'ネットワークプログラマー', 'de-DE': 'Netzwerk-Programmierer', 'ko-KR': '네트워크 프로그래머' },
  'performance-analyst': { 'zh-CN': '性能分析师', 'en-US': 'Performance Analyst', 'fr-FR': 'Analyste performance', 'ru-RU': 'Аналитик производительности', 'es-ES': 'Analista de rendimiento', 'hi-IN': 'परफ़ॉर्मेंस विश्लेषक', 'ar-SA': 'محلل الأداء', 'pt-BR': 'Analista de desempenho', 'ja-JP': 'パフォーマンスアナリスト', 'de-DE': 'Performance-Analyst', 'ko-KR': '성능 분석가' },
  'qa-tester': { 'zh-CN': 'QA 测试', 'en-US': 'QA Tester', 'fr-FR': 'Testeur QA', 'ru-RU': 'QA-тестировщик', 'es-ES': 'Tester de QA', 'hi-IN': 'QA टेस्टर', 'ar-SA': 'مختبر الجودة', 'pt-BR': 'Testador de QA', 'ja-JP': 'QA テスター', 'de-DE': 'QA-Tester', 'ko-KR': 'QA 테스터' },
  'tools-programmer': { 'zh-CN': '工具程序', 'en-US': 'Tools Programmer', 'fr-FR': 'Programmeur d’outils', 'ru-RU': 'Программист инструментов', 'es-ES': 'Programador de herramientas', 'hi-IN': 'टूल्स प्रोग्रामर', 'ar-SA': 'مبرمج الأدوات', 'pt-BR': 'Programador de ferramentas', 'ja-JP': 'ツールプログラマー', 'de-DE': 'Tools-Programmierer', 'ko-KR': '툴 프로그래머' },
  'audio-designer': { 'zh-CN': '音效设计师', 'en-US': 'Audio Designer', 'fr-FR': 'Concepteur audio', 'ru-RU': 'Аудиодизайнер', 'es-ES': 'Diseñador de audio', 'hi-IN': 'ऑडियो डिज़ाइनर', 'ar-SA': 'مصمم الصوت', 'pt-BR': 'Designer de áudio', 'ja-JP': 'オーディオデザイナー', 'de-DE': 'Audio-Designer', 'ko-KR': '오디오 디자이너' },
  'visual-effects-artist': { 'zh-CN': '特效美术', 'en-US': 'VFX Artist', 'fr-FR': 'Artiste VFX', 'ru-RU': 'VFX-художник', 'es-ES': 'Artista de VFX', 'hi-IN': 'VFX कलाकार', 'ar-SA': 'فنان المؤثرات البصرية', 'pt-BR': 'Artista de VFX', 'ja-JP': 'VFX アーティスト', 'de-DE': 'VFX-Artist', 'ko-KR': 'VFX 아티스트' },
  'save-systems-engineer': { 'zh-CN': '存档系统工程师', 'en-US': 'Save Systems Engineer', 'fr-FR': 'Ingénieur systèmes de sauvegarde', 'ru-RU': 'Инженер систем сохранения', 'es-ES': 'Ingeniero de sistemas de guardado', 'hi-IN': 'सेव सिस्टम्स इंजीनियर', 'ar-SA': 'مهندس أنظمة الحفظ', 'pt-BR': 'Engenheiro de sistemas de save', 'ja-JP': 'セーブシステムエンジニア', 'de-DE': 'Speichersystem-Ingenieur', 'ko-KR': '세이브 시스템 엔지니어' },
  'accessibility-specialist': { 'zh-CN': '无障碍专家', 'en-US': 'Accessibility Specialist', 'fr-FR': 'Spécialiste accessibilité', 'ru-RU': 'Специалист по доступности', 'es-ES': 'Especialista en accesibilidad', 'hi-IN': 'सुलभता विशेषज्ञ', 'ar-SA': 'خبير إمكانية الوصول', 'pt-BR': 'Especialista em acessibilidade', 'ja-JP': 'アクセシビリティスペシャリスト', 'de-DE': 'Barrierefreiheits-Spezialist', 'ko-KR': '접근성 전문가' },
  'analytics-engineer': { 'zh-CN': '数据分析工程师', 'en-US': 'Analytics Engineer', 'fr-FR': 'Ingénieur analytique', 'ru-RU': 'Инженер аналитики', 'es-ES': 'Ingeniero de analítica', 'hi-IN': 'एनालिटिक्स इंजीनियर', 'ar-SA': 'مهندس التحليلات', 'pt-BR': 'Engenheiro de analytics', 'ja-JP': 'アナリティクスエンジニア', 'de-DE': 'Analytics-Ingenieur', 'ko-KR': '애널리틱스 엔지니어' },
  'art-director': { 'zh-CN': '美术总监', 'en-US': 'Art Director', 'fr-FR': 'Directeur artistique', 'ru-RU': 'Арт-директор', 'es-ES': 'Director de arte', 'hi-IN': 'कला निदेशक', 'ar-SA': 'المدير الفني للرسوم', 'pt-BR': 'Diretor de arte', 'ja-JP': 'アートディレクター', 'de-DE': 'Art Director', 'ko-KR': '아트 디렉터' },
  'audio-director': { 'zh-CN': '音频总监', 'en-US': 'Audio Director', 'fr-FR': 'Directeur audio', 'ru-RU': 'Аудиодиректор', 'es-ES': 'Director de audio', 'hi-IN': 'ऑडियो निदेशक', 'ar-SA': 'مدير الصوت', 'pt-BR': 'Diretor de áudio', 'ja-JP': 'オーディオディレクター', 'de-DE': 'Audio-Direktor', 'ko-KR': '오디오 디렉터' },
  'community-manager': { 'zh-CN': '社区经理', 'en-US': 'Community Manager', 'fr-FR': 'Gestionnaire de communauté', 'ru-RU': 'Комьюнити-менеджер', 'es-ES': 'Gestor de comunidad', 'hi-IN': 'कम्युनिटी मैनेजर', 'ar-SA': 'مدير المجتمع', 'pt-BR': 'Gerente de comunidade', 'ja-JP': 'コミュニティマネージャー', 'de-DE': 'Community-Manager', 'ko-KR': '커뮤니티 매니저' },
  'creative-director': { 'zh-CN': '创意总监', 'en-US': 'Creative Director', 'fr-FR': 'Directeur créatif', 'ru-RU': 'Креативный директор', 'es-ES': 'Director creativo', 'hi-IN': 'क्रिएटिव निदेशक', 'ar-SA': 'المدير الإبداعي', 'pt-BR': 'Diretor criativo', 'ja-JP': 'クリエイティブディレクター', 'de-DE': 'Creative Director', 'ko-KR': '크리에이티브 디렉터' },
  'devops-engineer': { 'zh-CN': 'DevOps 工程师', 'en-US': 'DevOps Engineer', 'fr-FR': 'Ingénieur DevOps', 'ru-RU': 'DevOps-инженер', 'es-ES': 'Ingeniero DevOps', 'hi-IN': 'DevOps इंजीनियर', 'ar-SA': 'مهندس DevOps', 'pt-BR': 'Engenheiro DevOps', 'ja-JP': 'DevOps エンジニア', 'de-DE': 'DevOps-Ingenieur', 'ko-KR': 'DevOps 엔지니어' },
  'economy-designer': { 'zh-CN': '经济设计师', 'en-US': 'Economy Designer', 'fr-FR': 'Concepteur d’économie', 'ru-RU': 'Дизайнер экономики', 'es-ES': 'Diseñador de economía', 'hi-IN': 'इकॉनमी डिज़ाइनर', 'ar-SA': 'مصمم الاقتصاد', 'pt-BR': 'Designer de economia', 'ja-JP': 'エコノミーデザイナー', 'de-DE': 'Economy-Designer', 'ko-KR': '이코노미 디자이너' },
  'engine-programmer': { 'zh-CN': '引擎程序', 'en-US': 'Engine Programmer', 'fr-FR': 'Programmeur moteur', 'ru-RU': 'Программист движка', 'es-ES': 'Programador de motor', 'hi-IN': 'इंजन प्रोग्रामर', 'ar-SA': 'مبرمج المحرك', 'pt-BR': 'Programador de motor', 'ja-JP': 'エンジンプログラマー', 'de-DE': 'Engine-Programmierer', 'ko-KR': '엔진 프로그래머' },
  'godot-csharp-specialist': { 'zh-CN': 'Godot C# 专家', 'en-US': 'Godot C# Specialist', 'fr-FR': 'Spécialiste Godot C#', 'ru-RU': 'Специалист по Godot C#', 'es-ES': 'Especialista en Godot C#', 'hi-IN': 'Godot C# विशेषज्ञ', 'ar-SA': 'خبير Godot C#', 'pt-BR': 'Especialista em Godot C#', 'ja-JP': 'Godot C# スペシャリスト', 'de-DE': 'Godot-C#-Spezialist', 'ko-KR': 'Godot C# 전문가' },
  'godot-gdextension-specialist': { 'zh-CN': 'Godot GDExtension 专家', 'en-US': 'Godot GDExtension Specialist', 'fr-FR': 'Spécialiste Godot GDExtension', 'ru-RU': 'Специалист по Godot GDExtension', 'es-ES': 'Especialista en Godot GDExtension', 'hi-IN': 'Godot GDExtension विशेषज्ञ', 'ar-SA': 'خبير Godot GDExtension', 'pt-BR': 'Especialista em Godot GDExtension', 'ja-JP': 'Godot GDExtension スペシャリスト', 'de-DE': 'Godot-GDExtension-Spezialist', 'ko-KR': 'Godot GDExtension 전문가' },
  'godot-gdscript-specialist': { 'zh-CN': 'Godot GDScript 专家', 'en-US': 'Godot GDScript Specialist', 'fr-FR': 'Spécialiste Godot GDScript', 'ru-RU': 'Специалист по Godot GDScript', 'es-ES': 'Especialista en Godot GDScript', 'hi-IN': 'Godot GDScript विशेषज्ञ', 'ar-SA': 'خبير Godot GDScript', 'pt-BR': 'Especialista em Godot GDScript', 'ja-JP': 'Godot GDScript スペシャリスト', 'de-DE': 'Godot-GDScript-Spezialist', 'ko-KR': 'Godot GDScript 전문가' },
  'godot-shader-specialist': { 'zh-CN': 'Godot Shader 专家', 'en-US': 'Godot Shader Specialist', 'fr-FR': 'Spécialiste Godot Shader', 'ru-RU': 'Специалист по шейдерам Godot', 'es-ES': 'Especialista en Godot Shader', 'hi-IN': 'Godot Shader विशेषज्ञ', 'ar-SA': 'خبير Godot Shader', 'pt-BR': 'Especialista em Godot Shader', 'ja-JP': 'Godot シェーダースペシャリスト', 'de-DE': 'Godot-Shader-Spezialist', 'ko-KR': 'Godot 셰이더 전문가' },
  'lead-programmer': { 'zh-CN': '主程', 'en-US': 'Lead Programmer', 'fr-FR': 'Programmeur principal', 'ru-RU': 'Ведущий программист', 'es-ES': 'Programador principal', 'hi-IN': 'लीड प्रोग्रामर', 'ar-SA': 'كبير المبرمجين', 'pt-BR': 'Programador líder', 'ja-JP': 'リードプログラマー', 'de-DE': 'Lead-Programmierer', 'ko-KR': '리드 프로그래머' },
  'level-designer': { 'zh-CN': '关卡设计师', 'en-US': 'Level Designer', 'fr-FR': 'Concepteur de niveaux', 'ru-RU': 'Дизайнер уровней', 'es-ES': 'Diseñador de niveles', 'hi-IN': 'लेवल डिज़ाइनर', 'ar-SA': 'مصمم المراحل', 'pt-BR': 'Designer de níveis', 'ja-JP': 'レベルデザイナー', 'de-DE': 'Level-Designer', 'ko-KR': '레벨 디자이너' },
  'live-ops-designer': { 'zh-CN': '运营设计师', 'en-US': 'Live Ops Designer', 'fr-FR': 'Concepteur live ops', 'ru-RU': 'Дизайнер live-ops', 'es-ES': 'Diseñador de live ops', 'hi-IN': 'लाइव ऑप्स डिज़ाइनर', 'ar-SA': 'مصمم التشغيل المباشر', 'pt-BR': 'Designer de live ops', 'ja-JP': 'ライブオプスデザイナー', 'de-DE': 'Live-Ops-Designer', 'ko-KR': '라이브 옵스 디자이너' },
  'localization-lead': { 'zh-CN': '本地化负责人', 'en-US': 'Localization Lead', 'fr-FR': 'Responsable localisation', 'ru-RU': 'Руководитель локализации', 'es-ES': 'Responsable de localización', 'hi-IN': 'लोकलाइज़ेशन लीड', 'ar-SA': 'مسؤول التعريب', 'pt-BR': 'Líder de localização', 'ja-JP': 'ローカライズリード', 'de-DE': 'Lokalisierungsleiter', 'ko-KR': '현지화 리드' },
  'narrative-director': { 'zh-CN': '叙事总监', 'en-US': 'Narrative Director', 'fr-FR': 'Directeur narratif', 'ru-RU': 'Нарративный директор', 'es-ES': 'Director narrativo', 'hi-IN': 'कथा निदेशक', 'ar-SA': 'مدير السرد', 'pt-BR': 'Diretor narrativo', 'ja-JP': 'ナラティブディレクター', 'de-DE': 'Narrativ-Direktor', 'ko-KR': '내러티브 디렉터' },
  'producer': { 'zh-CN': '制作人', 'en-US': 'Producer', 'fr-FR': 'Producteur', 'ru-RU': 'Продюсер', 'es-ES': 'Productor', 'hi-IN': 'प्रोड्यूसर', 'ar-SA': 'المنتج', 'pt-BR': 'Produtor', 'ja-JP': 'プロデューサー', 'de-DE': 'Producer', 'ko-KR': '프로듀서' },
  'prototyper': { 'zh-CN': '原型师', 'en-US': 'Prototyper', 'fr-FR': 'Prototypeur', 'ru-RU': 'Прототипировщик', 'es-ES': 'Prototipador', 'hi-IN': 'प्रोटोटाइपर', 'ar-SA': 'مصمم النماذج الأولية', 'pt-BR': 'Prototipador', 'ja-JP': 'プロトタイパー', 'de-DE': 'Prototyper', 'ko-KR': '프로토타이퍼' },
  'qa-lead': { 'zh-CN': 'QA 负责人', 'en-US': 'QA Lead', 'fr-FR': 'Responsable QA', 'ru-RU': 'Руководитель QA', 'es-ES': 'Responsable de QA', 'hi-IN': 'QA लीड', 'ar-SA': 'مسؤول ضمان الجودة', 'pt-BR': 'Líder de QA', 'ja-JP': 'QA リード', 'de-DE': 'QA-Leiter', 'ko-KR': 'QA 리드' },
  'release-manager': { 'zh-CN': '发布经理', 'en-US': 'Release Manager', 'fr-FR': 'Responsable des versions', 'ru-RU': 'Менеджер релизов', 'es-ES': 'Gestor de lanzamientos', 'hi-IN': 'रिलीज़ मैनेजर', 'ar-SA': 'مدير الإصدار', 'pt-BR': 'Gerente de lançamento', 'ja-JP': 'リリースマネージャー', 'de-DE': 'Release-Manager', 'ko-KR': '릴리스 매니저' },
  'security-engineer': { 'zh-CN': '安全工程师', 'en-US': 'Security Engineer', 'fr-FR': 'Ingénieur sécurité', 'ru-RU': 'Инженер по безопасности', 'es-ES': 'Ingeniero de seguridad', 'hi-IN': 'सुरक्षा इंजीनियर', 'ar-SA': 'مهندس الأمن', 'pt-BR': 'Engenheiro de segurança', 'ja-JP': 'セキュリティエンジニア', 'de-DE': 'Sicherheitsingenieur', 'ko-KR': '보안 엔지니어' },
  'sound-designer': { 'zh-CN': '声音设计师', 'en-US': 'Sound Designer', 'fr-FR': 'Concepteur sonore', 'ru-RU': 'Саунд-дизайнер', 'es-ES': 'Diseñador de sonido', 'hi-IN': 'साउंड डिज़ाइनर', 'ar-SA': 'مصمم الصوت', 'pt-BR': 'Designer de som', 'ja-JP': 'サウンドデザイナー', 'de-DE': 'Sound-Designer', 'ko-KR': '사운드 디자이너' },
  'systems-designer': { 'zh-CN': '系统设计师', 'en-US': 'Systems Designer', 'fr-FR': 'Concepteur de systèmes', 'ru-RU': 'Дизайнер систем', 'es-ES': 'Diseñador de sistemas', 'hi-IN': 'सिस्टम्स डिज़ाइनर', 'ar-SA': 'مصمم الأنظمة', 'pt-BR': 'Designer de sistemas', 'ja-JP': 'システムデザイナー', 'de-DE': 'Systems-Designer', 'ko-KR': '시스템 디자이너' },
  'technical-artist': { 'zh-CN': '技术美术', 'en-US': 'Technical Artist', 'fr-FR': 'Artiste technique', 'ru-RU': 'Технический художник', 'es-ES': 'Artista técnico', 'hi-IN': 'तकनीकी कलाकार', 'ar-SA': 'فنان تقني', 'pt-BR': 'Artista técnico', 'ja-JP': 'テクニカルアーティスト', 'de-DE': 'Technical Artist', 'ko-KR': '테크니컬 아티스트' },
  'ue-blueprint-specialist': { 'zh-CN': 'UE Blueprint 专家', 'en-US': 'UE Blueprint Specialist', 'fr-FR': 'Spécialiste UE Blueprint', 'ru-RU': 'Специалист по UE Blueprint', 'es-ES': 'Especialista en UE Blueprint', 'hi-IN': 'UE Blueprint विशेषज्ञ', 'ar-SA': 'خبير UE Blueprint', 'pt-BR': 'Especialista em UE Blueprint', 'ja-JP': 'UE Blueprint スペシャリスト', 'de-DE': 'UE-Blueprint-Spezialist', 'ko-KR': 'UE 블루프린트 전문가' },
  'ue-gas-specialist': { 'zh-CN': 'UE GAS 专家', 'en-US': 'UE GAS Specialist', 'fr-FR': 'Spécialiste UE GAS', 'ru-RU': 'Специалист по UE GAS', 'es-ES': 'Especialista en UE GAS', 'hi-IN': 'UE GAS विशेषज्ञ', 'ar-SA': 'خبير UE GAS', 'pt-BR': 'Especialista em UE GAS', 'ja-JP': 'UE GAS スペシャリスト', 'de-DE': 'UE-GAS-Spezialist', 'ko-KR': 'UE GAS 전문가' },
  'ue-replication-specialist': { 'zh-CN': 'UE 网络复制专家', 'en-US': 'UE Replication Specialist', 'fr-FR': 'Spécialiste réplication UE', 'ru-RU': 'Специалист по репликации UE', 'es-ES': 'Especialista en replicación UE', 'hi-IN': 'UE रेप्लिकेशन विशेषज्ञ', 'ar-SA': 'خبير النسخ في UE', 'pt-BR': 'Especialista em replicação UE', 'ja-JP': 'UE レプリケーションスペシャリスト', 'de-DE': 'UE-Replication-Spezialist', 'ko-KR': 'UE 리플리케이션 전문가' },
  'ue-umg-specialist': { 'zh-CN': 'UE UMG 专家', 'en-US': 'UE UMG Specialist', 'fr-FR': 'Spécialiste UE UMG', 'ru-RU': 'Специалист по UE UMG', 'es-ES': 'Especialista en UE UMG', 'hi-IN': 'UE UMG विशेषज्ञ', 'ar-SA': 'خبير UE UMG', 'pt-BR': 'Especialista em UE UMG', 'ja-JP': 'UE UMG スペシャリスト', 'de-DE': 'UE-UMG-Spezialist', 'ko-KR': 'UE UMG 전문가' },
  'unity-addressables-specialist': { 'zh-CN': 'Unity Addressables 专家', 'en-US': 'Unity Addressables Specialist', 'fr-FR': 'Spécialiste Unity Addressables', 'ru-RU': 'Специалист по Unity Addressables', 'es-ES': 'Especialista en Unity Addressables', 'hi-IN': 'Unity Addressables विशेषज्ञ', 'ar-SA': 'خبير Unity Addressables', 'pt-BR': 'Especialista em Unity Addressables', 'ja-JP': 'Unity Addressables スペシャリスト', 'de-DE': 'Unity-Addressables-Spezialist', 'ko-KR': 'Unity Addressables 전문가' },
  'unity-dots-specialist': { 'zh-CN': 'Unity DOTS 专家', 'en-US': 'Unity DOTS Specialist', 'fr-FR': 'Spécialiste Unity DOTS', 'ru-RU': 'Специалист по Unity DOTS', 'es-ES': 'Especialista en Unity DOTS', 'hi-IN': 'Unity DOTS विशेषज्ञ', 'ar-SA': 'خبير Unity DOTS', 'pt-BR': 'Especialista em Unity DOTS', 'ja-JP': 'Unity DOTS スペシャリスト', 'de-DE': 'Unity-DOTS-Spezialist', 'ko-KR': 'Unity DOTS 전문가' },
  'unity-shader-specialist': { 'zh-CN': 'Unity Shader 专家', 'en-US': 'Unity Shader Specialist', 'fr-FR': 'Spécialiste Unity Shader', 'ru-RU': 'Специалист по шейдерам Unity', 'es-ES': 'Especialista en Unity Shader', 'hi-IN': 'Unity Shader विशेषज्ञ', 'ar-SA': 'خبير Unity Shader', 'pt-BR': 'Especialista em Unity Shader', 'ja-JP': 'Unity シェーダースペシャリスト', 'de-DE': 'Unity-Shader-Spezialist', 'ko-KR': 'Unity 셰이더 전문가' },
  'unity-ui-specialist': { 'zh-CN': 'Unity UI 专家', 'en-US': 'Unity UI Specialist', 'fr-FR': 'Spécialiste Unity UI', 'ru-RU': 'Специалист по Unity UI', 'es-ES': 'Especialista en Unity UI', 'hi-IN': 'Unity UI विशेषज्ञ', 'ar-SA': 'خبير Unity UI', 'pt-BR': 'Especialista em Unity UI', 'ja-JP': 'Unity UI スペシャリスト', 'de-DE': 'Unity-UI-Spezialist', 'ko-KR': 'Unity UI 전문가' },
  'world-builder': { 'zh-CN': '世界构建师', 'en-US': 'World Builder', 'fr-FR': 'Créateur de monde', 'ru-RU': 'Создатель миров', 'es-ES': 'Constructor de mundos', 'hi-IN': 'वर्ल्ड बिल्डर', 'ar-SA': 'باني العوالم', 'pt-BR': 'Construtor de mundos', 'ja-JP': 'ワールドビルダー', 'de-DE': 'World Builder', 'ko-KR': '월드 빌더' },
  'writer': { 'zh-CN': '文案', 'en-US': 'Writer', 'fr-FR': 'Rédacteur', 'ru-RU': 'Сценарист', 'es-ES': 'Guionista', 'hi-IN': 'लेखक', 'ar-SA': 'الكاتب', 'pt-BR': 'Roteirista', 'ja-JP': 'ライター', 'de-DE': 'Autor', 'ko-KR': '작가' },
};

/**
 * All localized display names for a built-in expert, across every supported
 * locale, plus the canonical English `name`. Used by locale-agnostic slash
 * resolution so `/引擎程序`, `/Engine Programmer`, `/엔진 프로그래머`, etc. all
 * map to the same expert regardless of the active UI language. Custom experts
 * (no translation entry) return just their author-provided name.
 */
export function gameExpertNameAliases(expert: GameExpertDefinition): string[] {
  const out = new Set<string>([expert.name]);
  const table = NAME_LABELS[expert.id];
  if (table) {
    for (const locale of SUPPORTED_LOCALES) {
      const label = table[locale];
      if (label) out.add(label);
    }
  }
  return [...out];
}

/**
 * All localized labels for a group/category string, across every supported
 * locale, plus the raw value. Lets a hierarchy segment like `编程` / `Programming`
 * / `프로그래밍` resolve to the same group no matter the UI language.
 */
export function gameGroupAliases(group: string): string[] {
  const out = new Set<string>([group]);
  const table = GROUP_LABELS[group];
  if (table) {
    for (const locale of SUPPORTED_LOCALES) {
      const label = table[locale];
      if (label) out.add(label);
    }
  }
  return [...out];
}

/**
 * Resolve the localized display name for a game expert.
 * Built-in experts use the translation table; custom experts (and any id not in
 * the table) fall back to the raw `name` provided by the definition.
 */
export function localizedGameExpertName(
  expert: GameExpertDefinition,
  locale: Locale,
): string {
  return NAME_LABELS[expert.id]?.[locale] ?? expert.name;
}

/**
 * Resolve the localized group/category label for a game expert.
 * Unknown groups (e.g. a custom group string) fall back to the raw value.
 */
export function localizedGameExpertGroup(
  expert: GameExpertDefinition,
  locale: Locale,
): string {
  return GROUP_LABELS[expert.group]?.[locale] ?? expert.group;
}

/**
 * Resolve the localized label for a raw group/category string. Used by the
 * category tab bar, which works with group strings rather than expert objects.
 * Unknown groups fall back to the raw value (so custom groups keep their name).
 */
export function localizedGameGroupLabel(group: string, locale: Locale): string {
  return GROUP_LABELS[group]?.[locale] ?? group;
}
