# OpenWorkflows

<div align="center">
  <a href="../../README.md">English</a> | <a href="README.zh-CN.md">中文</a> | <a href="README.fr.md">Français</a> | <a href="README.de.md">Deutsch</a> | <a href="README.es.md">Español</a> | <a href="README.pt-BR.md">Português</a> | <a href="README.ru.md">Русский</a> | <a href="README.ja.md">日本語</a> | 한국어 | <a href="README.hi.md">हिन्दी</a> | <a href="README.ar.md">العربية</a>
</div>

Claude Code는 멀티 에이전트 단계, 병렬 분기, 파이프라인을 실행 가능한 스크립트로 오케스트레이션하는 Workflow 기능을 도입했습니다. OpenWorkflows는 이 패턴을 시각적 멀티 모델 편집기로 전환합니다: 하나의 Workflow 그래프를 구축한 다음 Claude Code, Codex, Gemini 및 향후 로컬 또는 클라우드 모델 런타임에서 실행하거나 적용할 수 있습니다.

공유 IR은 워크플로우 구조의 이식성을 유지하면서 각 노드가 런타임에 대응하는 모델, 프롬프트, 스키마 및 실행 설정을 선택할 수 있도록 합니다.

<p align="center">
  <img src="images/0-标题使用.png" alt="OpenWorkflows 편집기 스크린샷" width="960">
</p>

## 사용 튜토리얼

- [OpenWorkflows 사용 튜토리얼](claude-code-workflow-openworkflow.ko.md) - 일반 설정과 AI 입력창의 런타임 선택부터 블루프린트 생성, 실행, 외관 전환까지 스크린샷과 함께 단계별로 안내합니다.

## 멀티 모델 Workflow 지원

- OpenWorkflows는 Claude Code의 Workflow 아이디어를 단일 LLM 런타임을 넘어 확장합니다.
- 동일한 Workflow 그래프를 시각적으로 편집하고 Claude Code, Codex, Gemini 또는 추가 어댑터에 대상으로 지정할 수 있습니다.
- 에이전트 단계, 병렬 분기, 파이프라인과 같은 Claude Code 스타일 프리미티브가 이식 가능한 그래프 노드가 됩니다.
- 각 노드는 고유한 프롬프트, 모델 계층, 스키마 및 실행 설정을 가질 수 있습니다.
- 스크립트 뷰는 현재 그래프를 실행 가능한 Claude Code 스타일 Workflow 스크립트로 컴파일하며, 어댑터 레이어는 다른 모델 런타임을 지원할 준비가 되어 있습니다.

## OpenWorkflows를 사용하는 이유

- 오른쪽 하단 AI 입력창에 목표를 설명하면 편집 가능한 Workflow 블루프린트가 생성됩니다.
- 대규모 멀티 에이전트 스크립트를 수동으로 편집하는 대신 시각적 워크플로우를 작성할 수 있습니다.
- 일반적인 워크플로우 재작성 및 검토 프롬프트가 포함된 재사용 가능한 프롬프트 라이브러리.
- 이전 작업으로 빠르게 돌아갈 수 있는 워크스페이스 및 세션 기록.
- 캔버스에서 노드별 실행 상태를 표시하는 실행/중지 컨트롤.
- 브라우저 측 AI 지원을 위한 로컬 API 키 저장소, 기기에만 보관됩니다.

## 빠른 시작

```bash
cd app
npm install
npm run dev
```

데스크톱 앱의 경우:

```bash
cd app
npm run desktop
```

Windows 릴리스 패키지의 경우:

```bash
cd app
npm run package
```

저장소 루트에서 `run.bat`은 필요 시 앱을 빌드하고 실행하며, `build.bat`은 Windows 설치 프로그램을 패키징합니다.

## 기본 사용법

1. 새 워크플로우를 만들거나 기존 워크플로우를 엽니다.
2. 오른쪽 하단 AI 입력창에 작업을 설명합니다. OpenWorkflows가 Workflow 블루프린트를 자동으로 생성합니다.
3. 동일한 입력창에 후속 지침을 입력하여 블루프린트를 계속 다듬거나, 오른쪽 패널의 일반 프롬프트를 클릭하여 구조, 완전성, 비용, 안정성 및 롤백 중심의 편집을 수행합니다.
4. 프롬프트, 모델, 스키마 또는 실행 매개변수를 수동으로 편집해야 할 때는 개별 노드를 선택합니다.
5. Claude Code, Codex, Gemini 등의 런타임 어댑터를 선택하고 필요에 따라 노드 모델을 조정합니다.
6. 상단의 실행 버튼을 클릭하여 워크플로우를 실행하고, 노드별 상태 업데이트를 확인하며 언제든지 중지할 수 있습니다.
7. 기록 레일에서 세션이나 워크스페이스를 전환하여 이전 작업을 계속합니다.

## 프로젝트 구조

```text
app/
  src/                 React + TypeScript 프론트엔드
    core/              IR, 파서, 에미터, 왕복 검증 로직
    canvas/            React Flow 캔버스 및 노드 컴포넌트
    panels/            사이드바, 프롬프트 패널, AI 도크
    store/             Zustand 애플리케이션 상태
  src-tauri/           Rust/Tauri 데스크톱 백엔드 및 패키징 설정
  doc/                 사용 튜토리얼 및 스크린샷
pencil/                Pencil 디자인 파일
run.bat                필요 시 빌드하고 Windows 앱 실행
build.bat              Windows 설치 프로그램 패키징
```

## 추가 문서

- [영어 README](../../README.md)
- [영어 사용 튜토리얼](claude-code-workflow-openworkflow.en.md)

## 검증

```bash
cd app
npm run typecheck
npm run lint
npm run package
```

## 라이선스

아직 라이선스가 지정되지 않았습니다.
