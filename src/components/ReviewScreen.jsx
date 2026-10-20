import React, { useState } from 'react';
import { Bookmark, AlertCircle, CheckCircle2, RotateCcw, BookOpen, Trash2 } from 'lucide-react';
import { QUESTIONS_DATA } from '../data/questionData';

export default function ReviewScreen({
  selectedLevel = '2급',
  bookmarks,
  onToggleBookmark,
  solvedHistory,
  onStartQuestion,
  onClearHistory
}) {
  const [filterType, setFilterType] = useState('wrong'); // 'wrong' | 'bookmark'
  const [levelFilter, setLevelFilter] = useState(selectedLevel);

  React.useEffect(() => {
    if (selectedLevel) {
      setLevelFilter(selectedLevel);
    }
  }, [selectedLevel]);

  // 틀린 문제 목록
  const wrongQuestions = QUESTIONS_DATA.filter((q) => {
    if (levelFilter !== '전체' && q.level !== levelFilter) return false;
    const history = solvedHistory[q.id];
    return history && !history.isCorrect;
  });

  // 북마크된 문제 목록
  const bookmarkedQuestions = QUESTIONS_DATA.filter((q) => {
    if (levelFilter !== '전체' && q.level !== levelFilter) return false;
    return bookmarks.includes(q.id);
  });

  const currentList = filterType === 'wrong' ? wrongQuestions : bookmarkedQuestions;

  return (
    <div className="animate-fade">
      {/* 급수 필터 탭 */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
        {['전체', '2급', '1급'].map((lvl) => (
          <button
            key={lvl}
            className={`chip ${levelFilter === lvl ? 'active' : ''}`}
            onClick={() => setLevelFilter(lvl)}
            style={{
              fontSize: '0.82rem',
              padding: '4px 12px'
            }}
          >
            {lvl === '전체' ? '전체 급수' : `${lvl}`}
          </button>
        ))}
      </div>

      {/* 탭 전환: 오답 노트 vs 북마크 */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <button
          className={`btn-outline ${filterType === 'wrong' ? 'active' : ''}`}
          onClick={() => setFilterType('wrong')}
          style={{
            flex: 1,
            background: filterType === 'wrong' ? '#fee2e2' : '#ffffff',
            borderColor: filterType === 'wrong' ? '#f87171' : '#e2e8f0',
            color: filterType === 'wrong' ? '#991b1b' : '#64748b'
          }}
        >
          <AlertCircle size={16} />
          <span>오답 노트 ({wrongQuestions.length})</span>
        </button>

        <button
          className={`btn-outline ${filterType === 'bookmark' ? 'active' : ''}`}
          onClick={() => setFilterType('bookmark')}
          style={{
            flex: 1,
            background: filterType === 'bookmark' ? '#fef3c7' : '#ffffff',
            borderColor: filterType === 'bookmark' ? '#fcd34d' : '#e2e8f0',
            color: filterType === 'bookmark' ? '#92400e' : '#64748b'
          }}
        >
          <Bookmark size={16} fill={filterType === 'bookmark' ? '#92400e' : 'none'} />
          <span>북마크 ({bookmarkedQuestions.length})</span>
        </button>
      </div>

      {/* 목록 헤더 & 비우기 액션 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, padding: '0 4px' }}>
        <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>
          {filterType === 'wrong' ? '틀렸던 문제 복습' : '헷갈려서 찜한 문제'} ({currentList.length}개)
        </span>
        {currentList.length > 0 && filterType === 'wrong' && (
          <button
            onClick={onClearHistory}
            style={{
              background: 'none',
              border: 'none',
              color: '#94a3b8',
              fontSize: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              cursor: 'pointer'
            }}
          >
            <Trash2 size={13} />
            <span>기록 초기화</span>
          </button>
        )}
      </div>

      {/* 빈 상태 */}
      {currentList.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '50px 20px', color: '#94a3b8' }}>
          <CheckCircle2 size={44} color="#10b981" style={{ margin: '0 auto 12px', opacity: 0.8 }} />
          <p style={{ fontSize: '0.95rem', fontWeight: 700, color: '#334155' }}>
            {filterType === 'wrong' ? '오답으로 등록된 문제가 없습니다!' : '북마크한 문제가 없습니다.'}
          </p>
          <p style={{ fontSize: '0.82rem', marginTop: 4 }}>
            {filterType === 'wrong' ? '문제를 풀다가 틀린 문항이 이곳에 자동으로 모입니다.' : '문제 풀이 중 "헷갈려요"를 누르면 여기에 저장됩니다.'}
          </p>
        </div>
      ) : (
        <div className="grid-desktop-2">
          {currentList.map((q) => {
            const isBookmarked = bookmarks.includes(q.id);
            return (
              <div key={q.id} className="card" style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                  <span
                    style={{
                      background: 'var(--bg-card-sub)',
                      fontSize: '0.74rem',
                      color: 'var(--text-muted)',
                      padding: '2px 8px',
                      borderRadius: 6,
                      fontWeight: 600
                    }}
                  >
                    {q.category} · 문항 {q.id}
                  </span>

                  <button
                    onClick={() => onToggleBookmark(q.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: isBookmarked ? '#d97706' : 'var(--text-sub)',
                      cursor: 'pointer',
                      padding: 2
                    }}
                  >
                    <Bookmark size={18} fill={isBookmarked ? '#d97706' : 'none'} />
                  </button>
                </div>

                {/* 지문 */}
                <div style={{ fontSize: '0.96rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: 10, lineHeight: 1.5 }}>
                  {q.question_text}
                </div>

                {/* 정답 및 쉬운 해설 */}
                <div
                  style={{
                    background: 'var(--bg-card-sub)',
                    border: '1px solid var(--border)',
                    borderRadius: 10,
                    padding: '12px',
                    marginBottom: 10
                  }}
                >
                  <div style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--success)', marginBottom: 4 }}>
                    정답: {q.correct_answer + 1}번. {q.options[q.correct_answer]}
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.5, whiteSpace: 'pre-line' }}>
                    {q.easy_solution}
                  </div>
                </div>

                {/* 다시 풀어보기 버튼 */}
                <button
                  className="btn-primary"
                  onClick={() => onStartQuestion(q.id)}
                  style={{
                    padding: '10px 14px',
                    fontSize: '0.85rem',
                    minHeight: 40
                  }}
                >
                  <RotateCcw size={15} />
                  <span>이 문제 집중 다시 풀기</span>
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
