import { GLOSSARY_DATA, GLOSSARY_CATEGORIES } from '../src/data/glossaryData.js';
import { QUESTIONS_DATA, EXAM_SESSIONS, QUESTION_CATEGORIES } from '../src/data/questionData.js';
import { matchesKeywordOrChosung, getChosung } from '../src/utils/chosung.js';

console.log('====================================================');
console.log('🧪 AccountingEasy 종합 기능 및 데이터 무결성 검증 (Phase 3)');
console.log('====================================================\n');

let passedTests = 0;
let totalTests = 0;

function assert(condition, testName) {
  totalTests++;
  if (condition) {
    console.log(`✅ [PASS] ${testName}`);
    passedTests++;
  } else {
    console.error(`❌ [FAIL] ${testName}`);
    process.exitCode = 1;
  }
}

// 1. 용어 사전 검증
console.log('[1] 용어 사전 (Glossary) 데이터 검증');
assert(GLOSSARY_DATA.length >= 10, `용어 개수 충분 (${GLOSSARY_DATA.length}개 등록)`);
assert(GLOSSARY_CATEGORIES.length === 9, `대분류 9개 (전체, 자산, 부채, 자본, 수익, 비용, 기본원리, 원가회계, 부가가치세)`);

const invalidTerms = GLOSSARY_DATA.filter(g => !g.term || !g.easy_explanation || !g.standard_definition || !g.example);
assert(invalidTerms.length === 0, '모든 용어가 표준 정의, 쉬운 비유 설명, 일상 예시를 포함함');

// 2. 초성 검색 엔진 검증
console.log('\n[2] 한글 초성 검색 알고리즘 검증');
assert(matchesKeywordOrChosung('매출채권', 'ㅁㅊ'), "초성 'ㅁㅊ' 검색 시 '매출채권' 매칭 성공");
assert(matchesKeywordOrChosung('시산표 (Trial Balance)', 'ㅅㅅㅍ'), "초성 'ㅅㅅㅍ' 검색 시 '시산표' 매칭 성공");
assert(matchesKeywordOrChosung('현금과부족', 'ㅎㄱ'), "초성 'ㅎㄱ' 검색 시 '현금과부족' 매칭 성공");
assert(matchesKeywordOrChosung('선급비용', '비용'), "일반 키워드 '비용' 검색 시 '선급비용' 매칭 성공");
assert(!matchesKeywordOrChosung('매출채권', 'ㅂㅍ'), "비일치 초성 'ㅂㅍ' 검색 시 '매출채권' 제외 확인");

// 3. 기출문제 데이터 검증 (124회 2급 & 127회 1급)
console.log('\n[3] 기출문제 (Exam Questions) 무결성 검증');
assert(QUESTIONS_DATA.length === 30, `기출문제 총 30문항 적재 완료 (${QUESTIONS_DATA.length}문항)`);

const session124 = QUESTIONS_DATA.filter(q => q.exam_sessionId === '124-2');
const session127 = QUESTIONS_DATA.filter(q => q.exam_sessionId === '127-1');
assert(session124.length === 15, `제124회 전산회계 2급 기출 15문항 일치`);
assert(session127.length === 15, `제127회 전산회계 1급 기출 15문항 일치`);

const invalidOptions = QUESTIONS_DATA.filter(q => !Array.isArray(q.options) || q.options.length !== 4);
assert(invalidOptions.length === 0, '모든 기출문항이 4지선다형(보기 4개) 구조를 만족함');

const invalidAnswers = QUESTIONS_DATA.filter(q => q.correct_answer < 0 || q.correct_answer > 3);
assert(invalidAnswers.length === 0, '모든 기출문항의 정답 인덱스가 유효 범위(0~3) 내에 존재함');

const invalidSolutions = QUESTIONS_DATA.filter(q => !q.easy_solution || q.easy_solution.length < 10);
assert(invalidSolutions.length === 0, '모든 기출문항에 초보자 눈높이의 쉬운 해설이 작성됨');

// 4. 모바일 T계정 데이터 검증
console.log('\n[4] 모바일 반응형 T계정 (T-Account) 구조 검증');
const tAccountQuestions = QUESTIONS_DATA.filter(q => q.tAccounts && q.tAccounts.length > 0);
assert(tAccountQuestions.length >= 2, `T계정 구조화 문항 ${tAccountQuestions.length}개 탑재 확인`);
tAccountQuestions.forEach(q => {
  q.tAccounts.forEach(t => {
    assert(t.title && Array.isArray(t.debits) && Array.isArray(t.credits), `T계정 [${t.title}] 차변/대변 무결성 검증 완료`);
  });
});

// 6. 1급/2급 분리 및 연동 데이터 검증
console.log('\n[6] 1급 vs 2급 급수별 콘텐츠 연동 검증');
const level2Glossary = GLOSSARY_DATA.filter(g => !g.level || g.level.includes('2급'));
const level1Glossary = GLOSSARY_DATA.filter(g => !g.level || g.level.includes('1급'));
assert(level2Glossary.length >= 10, `2급 대상 용어 ${level2Glossary.length}개 유효`);
assert(level1Glossary.length >= 12, `1급 대상 용어 ${level1Glossary.length}개 유효 (원가/부가세 포함)`);

const level2Questions = QUESTIONS_DATA.filter(q => q.level === '2급');
const level1Questions = QUESTIONS_DATA.filter(q => q.level === '1급');
assert(level2Questions.length === 15, `2급 문제 15문항 필터링 검증`);
assert(level1Questions.length === 15, `1급 문제 15문항 필터링 검증`);

const session2 = EXAM_SESSIONS.filter(s => s.level === '2급');
const session1 = EXAM_SESSIONS.filter(s => s.level === '1급');
assert(session2.length === 1 && session2[0].name.includes('2급'), '2급 모의고사 회차 1건 유효');
assert(session1.length === 1 && session1[0].name.includes('1급'), '1급 모의고사 회차 1건 유효');

console.log('\n====================================================');
console.log(`🎉 최종 검증 결과: ${passedTests} / ${totalTests} 테스트 통과 (${Math.round((passedTests/totalTests)*100)}%)`);
console.log('====================================================');

