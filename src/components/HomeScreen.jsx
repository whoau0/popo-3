import React from 'react';
import { 
  BookOpen, Target, Clock, ArrowRight, Flame, 
  Lightbulb, CheckCircle2, Trophy, Sparkles 
} from 'lucide-react';
import { GLOSSARY_DATA } from '../data/glossaryData';

export default function HomeScreen({
  selectedLevel = '2급',
  onSelectLevel,
  onNavigate,
  stats,
  onSelectTerm,
  onStartPracticeQuestion
}) {
  // 선택된 급수에 맞는 오늘의 추천 용어
  const todayTerm = selectedLevel === '1급'
    ? GLOSSARY_DATA.find(g => g.id === 'g13') || GLOSSARY_DATA[0] // 1급: 제조원가 3요소
    : GLOSSARY_DATA[0]; // 2급: 매출채권

  const accuracy = stats.totalSolved > 0 
    ? Math.round((stats.correctCount / stats.totalSolved) * 100) 
    : 0;

  return (
    <div className="animate-fade">
      {/* 1. 학습 목표 급수 선택 섹터 (1급 vs 2급) */}
      <div
        className="card"
        style={{
          padding: '16px 18px',
          marginBottom: 16,
          background: 'var(--bg-card)',
          border: '1.5px solid var(--border)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Trophy size={18} color="var(--primary)" />
            <span style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--text-main)' }}>
              학습 목표 급수 선택
            </span>
          </div>
          <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
            언제든 변경 가능
          </span>
        </div>

        {/* 1급 vs 2급 선택 버튼 2열 그리드 */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {/* 전산회계 2급 버튼 */}
          <div
            onClick={() => onSelectLevel('2급')}
            style={{
              padding: '14px 16px',
              borderRadius: 14,
              border: selectedLevel === '2급' ? '2.5px solid #2563eb' : '1.5px solid var(--border)',
              background: selectedLevel === '2급' ? 'var(--primary-light)' : 'var(--bg-card-sub)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              position: 'relative'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
              <span
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  padding: '2px 8px',
                  borderRadius: 6,
                  background: selectedLevel === '2급' ? '#2563eb' : 'var(--border)',
                  color: selectedLevel === '2급' ? '#ffffff' : 'var(--text-muted)'
                }}
              >
                기초 입문
              </span>
              {selectedLevel === '2급' && (
                <CheckCircle2 size={18} color="#2563eb" />
              )}
            </div>
            <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-main)', marginTop: 4 }}>
              전산회계 2급
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 2, lineHeight: 1.4 }}>
              재무회계 기초 원리<br />제124회 기출문제
            </div>
          </div>

          {/* 전산회계 1급 버튼 */}
          <div
            onClick={() => onSelectLevel('1급')}
            style={{
              padding: '14px 16px',
              borderRadius: 14,
              border: selectedLevel === '1급' ? '2.5px solid #7c3aed' : '1.5px solid var(--border)',
              background: selectedLevel === '1급' ? 'rgba(124, 58, 237, 0.12)' : 'var(--bg-card-sub)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              position: 'relative'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
              <span
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  padding: '2px 8px',
                  borderRadius: 6,
                  background: selectedLevel === '1급' ? '#7c3aed' : 'var(--border)',
                  color: selectedLevel === '1급' ? '#ffffff' : 'var(--text-muted)'
                }}
              >
                취업 추천
              </span>
              {selectedLevel === '1급' && (
                <CheckCircle2 size={18} color="#7c3aed" />
              )}
            </div>
            <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-main)', marginTop: 4 }}>
              전산회계 1급
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 2, lineHeight: 1.4 }}>
              원가회계 + 부가가치세<br />제127회 최신 기출
            </div>
          </div>
        </div>
      </div>

      {/* 2. 상단: 선택된 급수의 학습 통계 요약 카드 */}
      <div
        style={{
          background: selectedLevel === '1급'
            ? 'linear-gradient(135deg, #4c1d95, #7c3aed)'
            : 'linear-gradient(135deg, #1e3a8a, #2563eb)',
          borderRadius: 20,
          padding: '20px',
          color: '#ffffff',
          marginBottom: 20,
          boxShadow: selectedLevel === '1급'
            ? '0 10px 20px -5px rgba(124, 58, 237, 0.4)'
            : '0 10px 20px -5px rgba(37, 99, 235, 0.4)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8rem', opacity: 0.9, marginBottom: 4 }}>
              <Flame size={16} color="#fbbf24" fill="#fbbf24" />
              <span>전산회계 {selectedLevel} 맞춤 코스 진행 중</span>
            </div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>
              {selectedLevel === '1급' ? '전산회계 1급 학습 현황' : '전산회계 2급 학습 현황'}
            </h2>
          </div>
          <span
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              fontSize: '0.74rem',
              fontWeight: 700,
              padding: '4px 10px',
              borderRadius: 20,
              backdropFilter: 'blur(8px)'
            }}
          >
            {selectedLevel === '1급' ? '제127회 기출' : '제124회 기출'}
          </span>
        </div>

        {/* 통계 지표 그리드 */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.14)',
              borderRadius: 14,
              padding: '12px 10px',
              textAlign: 'center'
            }}
          >
            <div style={{ fontSize: '0.75rem', opacity: 0.85, marginBottom: 2 }}>{selectedLevel} 푼 문제</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800 }}>
              {stats.totalSolved} <span style={{ fontSize: '0.75rem', fontWeight: 500 }}>문제</span>
            </div>
          </div>

          <div
            style={{
              background: 'rgba(255, 255, 255, 0.14)',
              borderRadius: 14,
              padding: '12px 10px',
              textAlign: 'center'
            }}
          >
            <div style={{ fontSize: '0.75rem', opacity: 0.85, marginBottom: 2 }}>정답률</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#6ee7b7' }}>
              {accuracy}%
            </div>
          </div>

          <div
            style={{
              background: 'rgba(255, 255, 255, 0.14)',
              borderRadius: 14,
              padding: '12px 10px',
              textAlign: 'center'
            }}
          >
            <div style={{ fontSize: '0.75rem', opacity: 0.85, marginBottom: 2 }}>북마크</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fef08a' }}>
              {stats.bookmarks?.length || 0} <span style={{ fontSize: '0.75rem', fontWeight: 500 }}>개</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. 급수 맞춤 핵심 학습 코스 메뉴 3개 */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
          <span>{selectedLevel} 추천 학습 코스</span>
        </div>

        <div className="grid-desktop-3">
          {/* 메뉴 1: 쉬운 회계 용어 사전 */}
          <div
            onClick={() => onNavigate('glossary')}
            className="card"
            style={{
              cursor: 'pointer',
              borderLeft: selectedLevel === '1급' ? '5px solid #7c3aed' : '5px solid #2563eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '18px 16px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: selectedLevel === '1급' ? '#ede9fe' : '#eff6ff',
                  color: selectedLevel === '1급' ? '#7c3aed' : '#2563eb',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                <BookOpen size={24} />
              </div>
              <div>
                <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  ① {selectedLevel} 쉬운 용어 사전
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 2 }}>
                  {selectedLevel === '1급'
                    ? '원가회계·부가가치세 및 1급 핵심 용어'
                    : '계정과목, 분개, 거래 8요소 기초 용어'}
                </div>
              </div>
            </div>
            <ArrowRight size={18} color="var(--text-sub)" />
          </div>

          {/* 메뉴 2: 유형별 집중 연습 */}
          <div
            onClick={() => onNavigate('practice')}
            className="card"
            style={{
              cursor: 'pointer',
              borderLeft: '5px solid #10b981',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '18px 16px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: '#ecfdf5',
                  color: '#10b981',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                <Target size={24} />
              </div>
              <div>
                <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  ② {selectedLevel} 유형별 집중 연습
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 2 }}>
                  {selectedLevel === '1급'
                    ? '원가/세무/재무 1문항씩 즉시 풀이'
                    : '계정과목/결산 1문항씩 즉시 풀이'}
                </div>
              </div>
            </div>
            <ArrowRight size={18} color="var(--text-sub)" />
          </div>

          {/* 메뉴 3: 회차별 실전 모의고사 */}
          <div
            onClick={() => onNavigate('exam')}
            className="card"
            style={{
              cursor: 'pointer',
              borderLeft: '5px solid #f59e0b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '18px 16px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: '#fffbeb',
                  color: '#d97706',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                <Clock size={24} />
              </div>
              <div>
                <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  ③ {selectedLevel} 실전 모의고사
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 2 }}>
                  {selectedLevel === '1급'
                    ? '제127회 기출 15문항 · 20분 타이머'
                    : '제124회 기출 15문항 · 20분 타이머'}
                </div>
              </div>
            </div>
            <ArrowRight size={18} color="var(--text-sub)" />
          </div>
        </div>
      </div>

      {/* 4. 급수 맞춤 오늘의 추천 용어 배너 */}
      <div
        className="card"
        style={{
          background: selectedLevel === '1급'
            ? 'linear-gradient(to right, rgba(124, 58, 237, 0.08), rgba(124, 58, 237, 0.15))'
            : 'linear-gradient(to right, rgba(37, 99, 235, 0.08), rgba(37, 99, 235, 0.15))',
          border: selectedLevel === '1급' ? '1.5px solid #c4b5fd' : '1.5px solid #bfdbfe',
          padding: '18px 20px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8, color: selectedLevel === '1급' ? '#6d28d9' : '#1d4ed8' }}>
          <Lightbulb size={18} />
          <span style={{ fontSize: '0.82rem', fontWeight: 800 }}>{selectedLevel} 오늘의 1분 용어 상식</span>
        </div>
        <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: 6 }}>
          {todayTerm.term}{' '}
          <span
            style={{
              fontSize: '0.74rem',
              fontWeight: 700,
              color: selectedLevel === '1급' ? '#6d28d9' : '#1d4ed8',
              background: 'var(--bg-card)',
              padding: '2px 8px',
              borderRadius: 8,
              border: '1px solid var(--border)'
            }}
          >
            {todayTerm.category}
          </span>
        </div>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.55, marginBottom: 14 }}>
          "{todayTerm.easy_explanation}"
        </p>
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={() => onSelectTerm(todayTerm.term)}
            className="btn-outline"
            style={{ flex: 1, fontSize: '0.85rem' }}
          >
            상세 해설 보기
          </button>
          <button
            onClick={() => onStartPracticeQuestion(todayTerm.relatedQuestionId)}
            className="btn-primary"
            style={{
              flex: 1,
              fontSize: '0.85rem',
              background: selectedLevel === '1급' ? '#7c3aed' : '#2563eb'
            }}
          >
            관련 문제 풀기
          </button>
        </div>
      </div>
    </div>
  );
}
