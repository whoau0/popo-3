import React, { useState, useEffect } from 'react';
import { 
  Clock, AlertTriangle, CheckCircle2, ChevronRight, ChevronLeft, 
  Send, RotateCcw, Award, Bookmark, ArrowRight, Play, BookOpen 
} from 'lucide-react';
import { QUESTIONS_DATA, EXAM_SESSIONS } from '../data/questionData';
import TAccountCard from './TAccountCard';

export default function ExamScreen({
  selectedLevel = '2급',
  onFinishExam,
  onReviewWrong,
  bookmarks,
  onToggleBookmark
}) {
  const [selectedSession, setSelectedSession] = useState(null); // null이면 회차 선택 화면
  const [levelFilter, setLevelFilter] = useState(selectedLevel);
  const [examQuestions, setExamQuestions] = useState([]);
  const [timeLeft, setTimeLeft] = useState(20 * 60);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({}); // { [questionId]: optionIndex }
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [scoreResult, setScoreResult] = useState(null);

  useEffect(() => {
    if (selectedLevel) {
      setLevelFilter(selectedLevel);
    }
  }, [selectedLevel]);

  // 회차 시작
  const handleStartSession = (session) => {
    const questions = QUESTIONS_DATA.filter(q => q.exam_sessionId === session.id);
    setSelectedSession(session);
    setExamQuestions(questions);
    setTimeLeft(session.timeMinutes * 60);
    setCurrentIdx(0);
    setAnswers({});
    setIsSubmitted(false);
    setScoreResult(null);
  };

  // 타이머 작동
  useEffect(() => {
    if (!selectedSession || isSubmitted) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [selectedSession, isSubmitted, answers]);

  // 시간 포맷 (MM:SS)
  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const isWarning = timeLeft <= 300; // 5분 미만 경고

  // 답안 마킹
  const handleSelectOption = (idx) => {
    if (isSubmitted || !examQuestions[currentIdx]) return;
    setAnswers(prev => ({
      ...prev,
      [examQuestions[currentIdx].id]: idx
    }));
  };

  // 답안 제출
  const handleSubmit = (force = false) => {
    const unansweredCount = examQuestions.length - Object.keys(answers).length;
    if (!force && unansweredCount > 0) {
      const confirmSubmit = window.confirm(
        `아직 풀지 않은 문제가 ${unansweredCount}문제 있습니다.\n정말 이대로 최종 제출하시겠습니까?`
      );
      if (!confirmSubmit) return;
    }

    let correctCount = 0;
    const wrongList = [];

    examQuestions.forEach(q => {
      const userAns = answers[q.id];
      if (userAns === q.correct_answer) {
        correctCount++;
      } else {
        wrongList.push({
          question: q,
          userAnswer: userAns
        });
      }
    });

    const totalCount = examQuestions.length;
    const score = Math.round((correctCount / totalCount) * 100);
    const elapsedSeconds = (selectedSession.timeMinutes * 60) - timeLeft;

    const result = {
      sessionId: selectedSession.id,
      sessionName: selectedSession.name,
      score,
      correctCount,
      totalCount,
      isPass: score >= 70, // 전산회계 기준 70점 이상 합격
      elapsedTime: formatTime(elapsedSeconds),
      wrongList
    };

    setScoreResult(result);
    setIsSubmitted(true);
    if (onFinishExam) {
      onFinishExam(result);
    }
  };

  // 재시험
  const handleRestart = () => {
    setAnswers({});
    setTimeLeft(selectedSession.timeMinutes * 60);
    setCurrentIdx(0);
    setIsSubmitted(false);
    setScoreResult(null);
  };

  // 1. 회차 선택 화면 (PRD 3.4 '원하는 기출 회차 선택')
  if (!selectedSession) {
    return (
      <div className="animate-fade">
        <div style={{ marginBottom: 18 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
              실전 기출 모의고사
            </h2>
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                color: levelFilter === '1급' ? '#7c3aed' : '#2563eb',
                background: levelFilter === '1급' ? '#ede9fe' : '#dbeafe',
                padding: '3px 8px',
                borderRadius: 12
              }}
            >
              목표: {selectedLevel}
            </span>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            실제 시험과 동일하게 20분 타이머로 긴장감을 유지하며 실력을 점검하세요.
          </p>

          {/* 급수 필터 탭 */}
          <div style={{ display: 'flex', gap: 6, marginTop: 12 }}>
            {['전체', '2급', '1급'].map((lvl) => (
              <button
                key={lvl}
                className={`chip ${levelFilter === lvl ? 'active' : ''}`}
                onClick={() => setLevelFilter(lvl)}
                style={{
                  fontSize: '0.82rem',
                  padding: '5px 12px'
                }}
              >
                {lvl === '전체' ? '전체 회차' : `전산회계 ${lvl}`}
              </button>
            ))}
          </div>
        </div>

        {EXAM_SESSIONS.filter(session => levelFilter === '전체' || session.level === levelFilter).map((session) => (
          <div
            key={session.id}
            className="card"
            style={{
              padding: '18px',
              borderLeft: session.level === '1급' ? '5px solid #8b5cf6' : '5px solid #2563eb',
              marginBottom: 14
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span
                style={{
                  background: session.level === '1급' ? '#ede9fe' : '#dbeafe',
                  color: session.level === '1급' ? '#6d28d9' : '#1d4ed8',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  padding: '3px 8px',
                  borderRadius: 6
                }}
              >
                전산회계 {session.level}
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#64748b', fontSize: '0.78rem' }}>
                <Clock size={14} />
                <span>제한시간 {session.timeMinutes}분</span>
              </div>
            </div>

            <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#1e293b', marginBottom: 4 }}>
              {session.name}
            </div>

            <p style={{ fontSize: '0.82rem', color: '#64748b', marginBottom: 16 }}>
              객관식 이론시험 {session.count}문항 · 합격 기준 70점 이상
            </p>

            <button
              className="btn-primary"
              onClick={() => handleStartSession(session)}
              style={{
                background: session.level === '1급' ? '#7c3aed' : '#2563eb'
              }}
            >
              <Play size={16} />
              <span>실전 시험 응시하기</span>
            </button>
          </div>
        ))}
      </div>
    );
  }

  // 2. 시험 결과 성적표 화면 (PRD 3.4 '결과 리포트 출력')
  if (isSubmitted && scoreResult) {
    return (
      <div className="animate-fade">
        <div
          style={{
            background: scoreResult.isPass
              ? 'linear-gradient(135deg, #059669, #10b981)'
              : 'linear-gradient(135deg, #dc2626, #f43f5e)',
            borderRadius: 20,
            padding: '24px 20px',
            color: '#ffffff',
            textAlign: 'center',
            marginBottom: 20,
            boxShadow: '0 10px 20px -5px rgba(0,0,0,0.2)'
          }}
        >
          <Award size={48} style={{ margin: '0 auto 8px' }} />
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800 }}>
            {scoreResult.isPass ? '시험 합격권 통과! 🎉' : '조금만 더 보완해봐요! 💪'}
          </h2>
          <div style={{ fontSize: '2.5rem', fontWeight: 900, margin: '8px 0' }}>
            {scoreResult.score} <span style={{ fontSize: '1.2rem', fontWeight: 600 }}>점</span>
          </div>
          <div style={{ fontSize: '0.85rem', opacity: 0.95 }}>
            {scoreResult.sessionName} · 정답 {scoreResult.correctCount}/{scoreResult.totalCount}문항 · 소요 {scoreResult.elapsedTime}
          </div>
        </div>

        {/* 오답 문항 분석 */}
        <div style={{ marginBottom: 20 }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 12, color: '#1e293b' }}>
            오답 및 복습 대상 ({scoreResult.wrongList.length}문항)
          </h3>
          {scoreResult.wrongList.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '24px', color: '#10b981' }}>
              전 문항 만점입니다! 실전에 완벽하게 대비되어 있습니다 👏
            </div>
          ) : (
            scoreResult.wrongList.map(({ question, userAnswer }, index) => (
              <div key={question.id} className="card" style={{ borderLeft: '4px solid #ef4444', marginBottom: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                    {question.category}
                  </span>
                  <button
                    onClick={() => onToggleBookmark(question.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: bookmarks.includes(question.id) ? '#d97706' : '#cbd5e1',
                      cursor: 'pointer'
                    }}
                  >
                    <Bookmark size={15} fill={bookmarks.includes(question.id) ? '#d97706' : 'none'} />
                  </button>
                </div>

                <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#1e293b', marginBottom: 8 }}>
                  {question.question_text}
                </div>

                <div style={{ fontSize: '0.82rem', color: '#dc2626', marginBottom: 4 }}>
                  내 선택: {userAnswer !== undefined ? `${userAnswer + 1}번. ${question.options[userAnswer]}` : '미답변'}
                </div>

                <div style={{ fontSize: '0.82rem', color: '#059669', fontWeight: 600, marginBottom: 8 }}>
                  정답: {question.correct_answer + 1}번. {question.options[question.correct_answer]}
                </div>

                <div
                  style={{
                    background: '#f8fafc',
                    padding: '10px 12px',
                    borderRadius: 8,
                    fontSize: '0.82rem',
                    color: '#334155',
                    lineHeight: 1.5,
                    whiteSpace: 'pre-line'
                  }}
                >
                  {question.easy_solution}
                </div>
              </div>
            ))
          )}
        </div>

        {/* 하단 액션 버튼 */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
          <button className="btn-outline" onClick={handleRestart} style={{ flex: 1 }}>
            <RotateCcw size={16} />
            <span>다시 풀기</span>
          </button>
          <button
            className="btn-outline"
            onClick={() => setSelectedSession(null)}
            style={{ flex: 1 }}
          >
            <span>회차 목록으로</span>
          </button>
        </div>

        <button
          className="btn-primary"
          onClick={onReviewWrong}
        >
          <span>오답 노트로 이동하여 복습하기</span>
          <ArrowRight size={16} />
        </button>
      </div>
    );
  }

  // 3. 실전 시험 진행 화면 (PRD 3.4 '타이머 상시 노출 및 실전 마킹')
  const currentQ = examQuestions[currentIdx];
  const selectedOption = answers[currentQ?.id];
  const answeredCount = Object.keys(answers).length;
  const isBookmarked = currentQ && bookmarks.includes(currentQ.id);

  return (
    <div className="animate-fade">
      {/* 3.1 상단 고정 잔여 타이머 (5분 미만 붉은색 경고) */}
      <div
        style={{
          background: isWarning ? '#fee2e2' : '#eff6ff',
          border: `1.5px solid ${isWarning ? '#fca5a5' : '#bfdbfe'}`,
          borderRadius: 14,
          padding: '12px 16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 14
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Clock size={18} color={isWarning ? '#dc2626' : '#2563eb'} />
          <span
            style={{
              fontSize: '1.2rem',
              fontWeight: 800,
              fontVariantNumeric: 'tabular-nums',
              color: isWarning ? '#dc2626' : '#1e40af'
            }}
          >
            {formatTime(timeLeft)}
          </span>
          {isWarning && (
            <span style={{ fontSize: '0.72rem', color: '#b91c1c', fontWeight: 800 }}>
              (종료 5분 전!)
            </span>
          )}
        </div>

        <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#475569' }}>
          답안 마킹: <b style={{ color: '#2563eb' }}>{answeredCount}</b> / {examQuestions.length}
        </div>
      </div>

      {/* 3.2 문제 번호 빠른 네비게이터 칩 */}
      <div className="chips-scroll" style={{ marginBottom: 12 }}>
        {examQuestions.map((q, i) => {
          const isCurrent = i === currentIdx;
          const isDone = answers[q.id] !== undefined;
          const isQBookmarked = bookmarks.includes(q.id);

          return (
            <button
              key={q.id}
              onClick={() => setCurrentIdx(i)}
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                border: isCurrent ? '2.5px solid #2563eb' : '1px solid #cbd5e1',
                background: isDone ? '#2563eb' : '#ffffff',
                color: isDone ? '#ffffff' : '#334155',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
                flexShrink: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative'
              }}
            >
              <span>{i + 1}</span>
              {isQBookmarked && (
                <span
                  style={{
                    position: 'absolute',
                    top: 2,
                    right: 2,
                    width: 5,
                    height: 5,
                    borderRadius: '50%',
                    background: '#f59e0b'
                  }}
                />
              )}
            </button>
          );
        })}
      </div>

      <div className="grid-desktop-2">
        {/* 좌측: 문제 본문 및 T계정 카드 */}
        <div>
          <div className="card" style={{ marginBottom: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>
                [문항 {currentIdx + 1} / {examQuestions.length}] {currentQ.category}
              </span>
              <button
                onClick={() => onToggleBookmark(currentQ.id)}
                style={{
                  background: isBookmarked ? '#fef3c7' : '#f1f5f9',
                  border: isBookmarked ? '1px solid #fcd34d' : '1px solid #e2e8f0',
                  color: isBookmarked ? '#d97706' : '#94a3b8',
                  borderRadius: 6,
                  padding: '3px 8px',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  cursor: 'pointer'
                }}
              >
                <Bookmark size={13} fill={isBookmarked ? '#d97706' : 'none'} />
                <span>헷갈림</span>
              </button>
            </div>

            <div
              style={{
                fontSize: '1.02rem',
                fontWeight: 700,
                color: 'var(--text-main)',
                lineHeight: 1.6,
                whiteSpace: 'pre-line'
              }}
            >
              {currentQ.question_text}
            </div>

            {/* T계정 시각화 (PRD 5) */}
            {currentQ.tAccounts && currentQ.tAccounts.map((t, i) => (
              <TAccountCard
                key={i}
                title={t.title}
                debitTitle={t.debitTitle}
                creditTitle={t.creditTitle}
                debits={t.debits}
                credits={t.credits}
                footerLeft={t.footerLeft}
                footerRight={t.footerRight}
              />
            ))}
          </div>
        </div>

        {/* 우측: 4지선다형 보기 및 제출 */}
        <div>
          <div style={{ marginBottom: 18 }}>
        {currentQ.options.map((opt, idx) => {
          const isSelected = selectedOption === idx;
          return (
            <button
              key={idx}
              className={`option-btn ${isSelected ? 'selected' : ''}`}
              onClick={() => handleSelectOption(idx)}
            >
              <div className="option-num">{idx + 1}</div>
              <span style={{ flex: 1 }}>{opt}</span>
            </button>
          );
        })}
      </div>

      {/* 3.5 이전 / 다음 버튼 */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <button
          className="btn-outline"
          onClick={() => setCurrentIdx(prev => Math.max(0, prev - 1))}
          disabled={currentIdx === 0}
          style={{ flex: 1, opacity: currentIdx === 0 ? 0.4 : 1 }}
        >
          <ChevronLeft size={16} />
          <span>이전</span>
        </button>

        <button
          className="btn-outline"
          onClick={() => setCurrentIdx(prev => Math.min(examQuestions.length - 1, prev + 1))}
          disabled={currentIdx === examQuestions.length - 1}
          style={{ flex: 1, opacity: currentIdx === examQuestions.length - 1 ? 0.4 : 1 }}
        >
          <span>다음</span>
          <ChevronRight size={16} />
        </button>
      </div>

      {/* 3.6 최종 답안 제출 버튼 */}
      <button
        className="btn-primary"
        onClick={() => handleSubmit(false)}
        style={{
          background: answeredCount === examQuestions.length ? '#10b981' : '#2563eb'
        }}
      >
        <Send size={16} />
        <span>
          시험 답안 최종 제출 ({answeredCount}/{examQuestions.length})
        </span>
      </button>
        </div>
      </div>
    </div>
  );
}
