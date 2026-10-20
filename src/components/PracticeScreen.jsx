import React, { useState, useEffect } from 'react';
import { Bookmark, CheckCircle2, XCircle, ArrowLeft, ArrowRight, Lightbulb, Sparkles, BookOpen } from 'lucide-react';
import { QUESTIONS_DATA, LEVEL_CATEGORIES, QUESTION_CATEGORIES } from '../data/questionData';
import TAccountCard from './TAccountCard';

export default function PracticeScreen({
  selectedLevel = '2급',
  targetQuestionId,
  bookmarks,
  onToggleBookmark,
  onRecordSolve,
  onNavigateToGlossary
}) {
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);

  const targetSessionId = selectedLevel === '1급' ? '127-1' : '124-2';

  // 1. 해당 급수의 문제만 필터링
  const levelQuestions = QUESTIONS_DATA.filter(q => q.exam_sessionId === targetSessionId);

  // 2. 카테고리별 문제 필터링
  const filteredQuestions = levelQuestions.filter((q) => {
    if (selectedCategory === '전체') return true;
    return q.category === selectedCategory;
  });

  const categories = LEVEL_CATEGORIES[selectedLevel] || QUESTION_CATEGORIES;

  // 급수 변경 시 인덱스 및 카테고리 초기화
  useEffect(() => {
    setSelectedCategory('전체');
    setCurrentIndex(0);
    setSelectedOption(null);
    setShowExplanation(false);
  }, [selectedLevel]);

  // 외부에서 특정 문제 ID(예: 용어사전에서 바로가기)로 진입한 경우
  useEffect(() => {
    if (targetQuestionId) {
      const foundIdx = filteredQuestions.findIndex(q => q.id === targetQuestionId);
      if (foundIdx !== -1) {
        setCurrentIndex(foundIdx);
      } else {
        setSelectedCategory('전체');
        const allIdx = levelQuestions.findIndex(q => q.id === targetQuestionId);
        if (allIdx !== -1) setCurrentIndex(allIdx);
      }
      setSelectedOption(null);
      setShowExplanation(false);
    }
  }, [targetQuestionId]);

  // 카테고리 변경 시 인덱스 리셋
  const handleCategoryChange = (cat) => {
    setSelectedCategory(cat);
    setCurrentIndex(0);
    setSelectedOption(null);
    setShowExplanation(false);
  };

  const currentQ = filteredQuestions[currentIndex] || filteredQuestions[0];
  const isBookmarked = currentQ && bookmarks.includes(currentQ.id);

  // 보기 선택 핸들러 (즉각 정답 확인)
  const handleSelectOption = (idx) => {
    if (selectedOption !== null) return; // 이미 선택했으면 고정
    setSelectedOption(idx);
    setShowExplanation(true);

    const isCorrect = idx === currentQ.correct_answer;
    onRecordSolve(currentQ.id, isCorrect);
  };

  // 다음 문제
  const handleNext = () => {
    if (currentIndex < filteredQuestions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setShowExplanation(false);
    }
  };

  // 이전 문제
  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setSelectedOption(null);
      setShowExplanation(false);
    }
  };

  if (!currentQ) {
    return (
      <div style={{ textAlign: 'center', padding: '40px 20px', color: '#94a3b8' }}>
        해당 카테고리에 등록된 문제가 없습니다.
      </div>
    );
  }

  const isAnswered = selectedOption !== null;
  const isCorrect = selectedOption === currentQ.correct_answer;

  return (
    <div className="animate-fade">
      {/* 1. 카테고리 칩 스크롤 */}
      <div className="chips-scroll">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`chip ${selectedCategory === cat ? 'active' : ''}`}
            onClick={() => handleCategoryChange(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 2. 문제 상단 진행도 및 북마크 */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 12
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span
            style={{
              background: '#e2e8f0',
              color: '#334155',
              fontWeight: 700,
              fontSize: '0.78rem',
              padding: '3px 9px',
              borderRadius: 6
            }}
          >
            {currentIndex + 1} / {filteredQuestions.length}
          </span>
          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
            {currentQ.exam_session}
          </span>
        </div>

        {/* 헷갈리는 문제 북마크 토글 */}
        <button
          onClick={() => onToggleBookmark(currentQ.id)}
          style={{
            background: isBookmarked ? '#fef3c7' : '#f1f5f9',
            border: isBookmarked ? '1px solid #fcd34d' : '1px solid #e2e8f0',
            color: isBookmarked ? '#d97706' : '#94a3b8',
            borderRadius: 8,
            padding: '5px 10px',
            fontSize: '0.78rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            cursor: 'pointer'
          }}
        >
          <Bookmark size={15} fill={isBookmarked ? '#d97706' : 'none'} />
          <span>{isBookmarked ? '북마크됨' : '헷갈려요'}</span>
        </button>
      </div>

      {/* 프로그레스 바 */}
      <div
        style={{
          height: 4,
          background: '#e2e8f0',
          borderRadius: 2,
          overflow: 'hidden',
          marginBottom: 16
        }}
      >
        <div
          style={{
            height: '100%',
            background: '#2563eb',
            width: `${((currentIndex + 1) / filteredQuestions.length) * 100}%`,
            transition: 'width 0.3s ease'
          }}
        />
      </div>

      <div className="grid-desktop-2">
        {/* 좌측: 문제 지문 및 T계정 카드 */}
        <div>
          <div className="card" style={{ marginBottom: 16 }}>
            <div
              style={{
                fontSize: '1.05rem',
                fontWeight: 700,
                color: 'var(--text-main)',
                lineHeight: 1.6,
                whiteSpace: 'pre-line'
              }}
            >
              {currentQ.question_text}
            </div>

            {/* T계정 시각화 */}
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

        {/* 우측: 4지선다 보기 및 해설 */}
        <div>
          <div style={{ marginBottom: 16 }}>
        {currentQ.options.map((opt, idx) => {
          let btnClass = 'option-btn';
          if (isAnswered) {
            if (idx === currentQ.correct_answer) {
              btnClass += ' correct';
            } else if (idx === selectedOption) {
              btnClass += ' wrong';
            }
          }

          return (
            <button
              key={idx}
              className={btnClass}
              onClick={() => handleSelectOption(idx)}
              disabled={isAnswered}
            >
              <div className="option-num">{idx + 1}</div>
              <span style={{ flex: 1 }}>{opt}</span>
              {isAnswered && idx === currentQ.correct_answer && (
                <CheckCircle2 size={18} color="#10b981" style={{ flexShrink: 0 }} />
              )}
              {isAnswered && idx === selectedOption && idx !== currentQ.correct_answer && (
                <XCircle size={18} color="#ef4444" style={{ flexShrink: 0 }} />
              )}
            </button>
          );
        })}
      </div>

      {/* 5. 정답 후 노출되는 쉬운 해설 & 팁 카드 */}
      {showExplanation && (
        <div className="animate-fade" style={{ marginBottom: 18 }}>
          <div
            style={{
              background: isCorrect ? '#ecfdf5' : '#fff1f2',
              border: `1.5px solid ${isCorrect ? '#a7f3d0' : '#fecdd3'}`,
              borderRadius: 14,
              padding: 16,
              marginBottom: 12
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
              {isCorrect ? (
                <>
                  <CheckCircle2 size={20} color="#059669" />
                  <span style={{ fontWeight: 800, color: '#065f46', fontSize: '0.95rem' }}>
                    정답입니다! 완벽해요 👍
                  </span>
                </>
              ) : (
                <>
                  <XCircle size={20} color="#e11d48" />
                  <span style={{ fontWeight: 800, color: '#9f1239', fontSize: '0.95rem' }}>
                    아쉽네요! 정답은 {currentQ.correct_answer + 1}번입니다.
                  </span>
                </>
              )}
            </div>

            {/* 쉬운 눈높이 해설 */}
            <div
              style={{
                fontSize: '0.88rem',
                color: '#1e293b',
                lineHeight: 1.6,
                whiteSpace: 'pre-line',
                background: '#ffffff',
                padding: '12px 14px',
                borderRadius: 10,
                border: '1px solid rgba(0,0,0,0.05)',
                marginBottom: 10
              }}
            >
              {currentQ.easy_solution}
            </div>

            {/* 시험 팁 */}
            {currentQ.exam_tip && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 6,
                  fontSize: '0.8rem',
                  color: '#475569',
                  background: 'rgba(255, 255, 255, 0.7)',
                  padding: '8px 10px',
                  borderRadius: 8
                }}
              >
                <Sparkles size={15} color="#eab308" style={{ flexShrink: 0, marginTop: 2 }} />
                <span><b>핵심 포인트:</b> {currentQ.exam_tip}</span>
              </div>
            )}

            {/* 연관 용어 사전 바로가기 링크 */}
            {currentQ.related_glossary_term && (
              <button
                onClick={() => onNavigateToGlossary(currentQ.related_glossary_term)}
                style={{
                  marginTop: 10,
                  background: 'none',
                  border: 'none',
                  color: '#2563eb',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  cursor: 'pointer',
                  padding: 4
                }}
              >
                <BookOpen size={14} />
                <span>"{currentQ.related_glossary_term}" 용어 설명 다시 확인하기 &rarr;</span>
              </button>
            )}
          </div>
        </div>
      )}
        </div>
      </div>

      {/* 6. 이전 / 다음 네비게이션 버튼 */}
      <div style={{ display: 'flex', gap: 10 }}>
        <button
          className="btn-outline"
          onClick={handlePrev}
          disabled={currentIndex === 0}
          style={{ flex: 1, opacity: currentIndex === 0 ? 0.4 : 1 }}
        >
          <ArrowLeft size={16} />
          <span>이전 문제</span>
        </button>

        <button
          className="btn-primary"
          onClick={handleNext}
          disabled={currentIndex === filteredQuestions.length - 1}
          style={{
            flex: 1.5,
            opacity: currentIndex === filteredQuestions.length - 1 ? 0.5 : 1
          }}
        >
          <span>다음 문제</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
