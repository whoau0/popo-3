# AccountingEasy (전산회계 입문자 맞춤형 모바일 학습 및 기출문제 웹앱)

전산회계 2급 / 1급 자격증을 준비하는 초보자 및 비전공자가 난해한 회계 용어를 일상 언어로 쉽게 이해하고, 이동 중 스마트폰 환경에서 기출문제를 회차별·유형별로 풀어볼 수 있는 **반응형 모바일 학습 웹 애플리케이션**입니다.

---

## 🚀 주요 기능 및 핵심 가치

### 1. 📖 쉬운 회계 용어 사전 (`Glossary`)
- **초성 검색 지원**: `ㅁㅊ` 검색 시 `매출채권`, `ㅅㅅㅍ` 검색 시 `시산표` 즉각 탐색
- **대분류 탭 필터링**: 자산, 부채, 자본, 수익, 비용, 기본원리 카테고리 필터
- **4단 구조화 아코디언 카드**:
  - 💡 **초보자 눈높이 비유 설명**: 일상적 비유로 개념을 직관적으로 이해
  - 📖 **공인 시험 표준 정의**: 출제 기준 학술 정의
  - 🛒 **실생활 속 예시**: 일상 소비/거래 사례
  - ⚡ **실전 분개 & 시험 꿀팁**: 계정과목 구분 및 함정 방지 팁
- **원클릭 문제 풀이 연동**: 용어 하단 [관련 기출문제 바로 풀어보기] 버튼을 누르면 해당 유형의 문제로 즉시 전환

### 2. 🎯 유형별 집중 연습 모드 (`Practice Mode`)
- **주제별 카테고리 집중 공략**: 계정과목 분류, 분개 원리, 자산·부채 측정, 결산정리/시산표, 재무제표 기본, 원가회계, 부가가치세
- **즉각 피드백 & 4지선다 터치 UI**: 보기 선택 즉시 정답(초록)/오답(빨강) 시각 피드백 제공
- **헷갈려요 (북마크)**: 어려운 문제를 원터치로 북마크하여 오답 노트에 보관
- **모바일 최적화 T계정 (T-Account)**: 차변(Dr.)과 대변(Cr.)이 작은 화면(360px)에서도 깨지지 않도록 반응형 그리드로 렌더링

### 3. ⏱️ 회차별 실전 모의고사 모드 (`Exam Mode`)
- **실제 시험 회차 수록**:
  - **제124회 전산회계 2급** (이론 객관식 15문항)
  - **제127회 전산회계 1급** 최신 기출 (이론 객관식 15문항)
- **20분 상시 카운트다운 타이머**: 남은 시간 5분 미만 시 시각적 붉은색 경고 알림
- **실전 마킹 UX**: 풀이 중 정답 노출 비활성화, 1~15번 마킹 상태 실시간 네비게이터 제공
- **시간 만료 시 자동 제출** 및 최종 제출 확인 알림
- **종합 결과 성적표**: 70점 기준 합격/불합격 판정, 총점, 소요 시간, 오답 목록 및 상세 해설 제공

### 4. 📝 오답 노트 & 북마크 (`Review`)
- 시험 또는 연습에서 틀린 문항과 '헷갈려요'로 찜한 문제를 자동 수집
- 언제든 다시 풀기 및 초보자 해설 복습 가능
- 회원가입 없이 브라우저 `localStorage`에 학습 진행률, 점수, 북마크 자동 영구 보관

### 5. 📱 UI/UX & 접근성 (Mobile First)
- **스마트폰 너비 360px ~ 430px 최적화**: 한 손 터치 및 가로 스크롤 완전 방지
- **최소 48px 이상 터치 타깃**: 흔들리는 대중교통 이동 중에도 오터치 방지
- **주간/야간(다크) 고대비 테마**: 상단 헤더의 `🌙 / ☀️` 버튼으로 눈부심 없는 야간 모드 전환
- **글자 크기 조절 (접근성)**: 상단 헤더의 `Type(대/보)` 버튼으로 115% 확대 모드 지원

---

## 🛠️ 기술 스택 및 구조

- **Frontend**: React 19, Vite 6, Lucide React
- **CSS / Styling**: CSS Custom Properties (Light/Dark High-Contrast Theme, Mobile Frame Simulation)
- **Database / Backend**: Supabase (PostgreSQL), RESTful API, Local JSON Seed Fallback
- **Storage**: Browser LocalStorage (Persistence for Solved History, Bookmarks, Theme, Font Size)

```
popo-3/
├── PSD.md                           # 제품 요구사항 정의서 (PRD)
├── README.md                        # 프로젝트 설명서
├── index.html                       # 모바일 뷰포트 HTML
├── package.json                     # 의존성 및 스크립트
├── vite.config.js                   # Vite 설정
├── supabase/
│   ├── schema.sql                   # glossary, questions 테이블 DDL & RLS 정책
│   └── seed.sql                     # 초기 Seed 데이터 INSERT 쿼리
├── tests/
│   └── verify_flow.js               # 종합 기능 및 데이터 무결성 검증 스크립트
└── src/
    ├── main.jsx                     # 진입점
    ├── App.jsx                      # 메인 레이아웃 및 탭 상태 관리
    ├── index.css                    # 반응형 모바일 & 다크 테마 스타일
    ├── components/
    │   ├── Header.jsx               # 상단 헤더 (테마, 글자크기, 초기화)
    │   ├── BottomNav.jsx            # 하단 고정 네비게이션
    │   ├── HomeScreen.jsx           # 홈 화면 (학습 통계 요약, 코스 카드)
    │   ├── GlossaryScreen.jsx       # 쉬운 회계 용어 사전 (초성 검색)
    │   ├── PracticeScreen.jsx       # 유형별 집중 연습 모드
    │   ├── ExamScreen.jsx           # 회차별 20분 타이머 실전 모의고사
    │   ├── ReviewScreen.jsx         # 오답 노트 & 북마크
    │   └── TAccountCard.jsx         # 모바일 반응형 회계 T계정 위젯
    ├── data/
    │   ├── glossaryData.js          # 용어 12종 데이터셋
    │   └── questionData.js          # 124회/127회 기출문제 30문항 데이터셋
    ├── services/
    │   ├── supabaseClient.js        # Supabase 클라이언트 SDK 설정
    │   └── dbService.js             # 하이브리드 DB 서비스 (Cloud + Local Fallback)
    └── utils/
        └── chosung.js               # 한글 초성 분해 및 검색 유틸
```

---

## 🏃 실행 및 테스트 방법

### 1. 로컬 개발 서버 실행
```bash
npm run dev
```
- 브라우저 접속: `http://localhost:3000`
- 스마트폰(동일 Wi-Fi): `http://192.168.160.58:3000`

### 2. 프로덕션 빌드 및 미리보기
```bash
npm run build
npm run preview
```

### 3. 무결성 검증 테스트 실행
```bash
node tests/verify_flow.js
```
모든 20개 테스트 항목(용어 무결성, 초성 검색, 124회/127회 30문항 적재, T계정 구조, 20분 타이머 세션)이 100% 통과합니다.

### 4. Supabase 연동 (선택 사항)
1. Supabase 프로젝트 생성 후 `supabase/schema.sql`과 `supabase/seed.sql` 실행
2. `.env` 파일에 URL 및 ANON KEY 입력:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```
(미설정 시에도 내장된 로컬 Seed 데이터로 즉시 완벽 동작합니다.)
