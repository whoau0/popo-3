import React, { useState, useMemo } from 'react';
import { Search, ChevronDown, ChevronUp, BookOpen, Lightbulb, ShoppingBag, Zap, ArrowRight, X } from 'lucide-react';
import { GLOSSARY_DATA, GLOSSARY_CATEGORIES } from '../data/glossaryData';
import { matchesKeywordOrChosung } from '../utils/chosung';

export default function GlossaryScreen({ 
  selectedLevel = '2급',
  onStartQuestion, 
  initialTerm 
}) {
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [searchQuery, setSearchQuery] = useState(initialTerm || '');
  const [expandedId, setExpandedId] = useState(initialTerm ? GLOSSARY_DATA.find(g => g.term === initialTerm)?.id || null : null);

  // 급수별 카테고리 필터링
  const availableCategories = useMemo(() => {
    if (selectedLevel === '2급') {
      return ['전체', '자산', '부채', '자본', '수익', '비용', '기본원리'];
    } else {
      return ['전체', '원가회계', '부가가치세', '자산', '부채', '자본', '기본원리'];
    }
  }, [selectedLevel]);

  // 필터링 (급수 + 카테고리 + 초성/키워드 검색)
  const filteredList = useMemo(() => {
    return GLOSSARY_DATA.filter((item) => {
      // 1. 급수 일치 여부
      const matchLevel = !item.level || item.level.includes(selectedLevel);
      if (!matchLevel) return false;

      // 2. 카테고리 일치 여부
      const matchCat = selectedCategory === '전체' || item.category === selectedCategory;

      // 3. 초성 & 키워드 검색
      const matchSearch = matchesKeywordOrChosung(item.term, searchQuery) ||
                          matchesKeywordOrChosung(item.standard_definition, searchQuery) ||
                          matchesKeywordOrChosung(item.easy_explanation, searchQuery);

      return matchCat && matchSearch;
    });
  }, [selectedLevel, selectedCategory, searchQuery]);

  const toggleExpand = (id) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  return (
    <div className="animate-fade">
      {/* 상단 검색바 (초성 검색 지원) */}
      <div className="search-wrapper">
        <Search className="search-icon" size={18} />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={`전산회계 ${selectedLevel} 용어 검색 (예: 초성 'ㅁㅊ', 키워드)`}
          className="search-input"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            style={{
              position: 'absolute',
              right: 14,
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              color: 'var(--text-sub)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* 대분류 필터 탭 */}
      <div className="chips-scroll">
        {availableCategories.map((cat) => (
          <button
            key={cat}
            className={`chip ${selectedCategory === cat ? 'active' : ''}`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 결과 수 안내 & 급수 배지 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, paddingLeft: 4 }}>
        <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
          전산회계 <b style={{ color: selectedLevel === '1급' ? '#7c3aed' : 'var(--primary)' }}>{selectedLevel}</b> 용어 총 <b style={{ color: 'var(--primary)' }}>{filteredList.length}</b>개
        </div>
        <span
          style={{
            fontSize: '0.72rem',
            padding: '2px 8px',
            borderRadius: 6,
            background: selectedLevel === '1급' ? 'rgba(124, 58, 237, 0.15)' : 'var(--primary-light)',
            color: selectedLevel === '1급' ? '#7c3aed' : 'var(--primary)',
            fontWeight: 700
          }}
        >
          {selectedLevel} 코스
        </span>
      </div>

      {/* 용어 카드 목록 (데스크톱 2열 그리드) */}
      {filteredList.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-sub)' }}>
          <BookOpen size={40} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
          <p style={{ fontSize: '0.92rem' }}>검색 결과가 없습니다.</p>
          <p style={{ fontSize: '0.8rem', marginTop: 4 }}>다른 키워드나 초성(예: ㅁㅊ, ㅈㅈ)으로 찾아보세요.</p>
        </div>
      ) : (
        <div className="grid-desktop-2">
          {filteredList.map((item) => {
            const isExpanded = expandedId === item.id;
            return (
              <div key={item.id} className="glossary-card">
                {/* 카드 헤더 (누르면 아코디언 토글) */}
                <div
                  className="glossary-header"
                  onClick={() => toggleExpand(item.id)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span className={`glossary-badge ${item.category}`}>
                      {item.category}
                    </span>
                    <span style={{ fontSize: '1.02rem', fontWeight: 700, color: 'var(--text-main)' }}>
                      {item.term}
                    </span>
                  </div>
                  {isExpanded ? (
                    <ChevronUp size={20} color="var(--text-muted)" />
                  ) : (
                    <ChevronDown size={20} color="var(--text-muted)" />
                  )}
                </div>

                {/* 카드 상세 본문 (아코디언) */}
                {isExpanded && (
                  <div className="glossary-body">
                    {/* 1. 초보자용 비유 설명 */}
                    <div className="section-box" style={{ background: 'var(--success-light)', borderColor: 'rgba(16, 185, 129, 0.25)' }}>
                      <div className="section-title" style={{ color: 'var(--success)' }}>
                        <Lightbulb size={14} />
                        <span>초보자용 비유 설명</span>
                      </div>
                      <div style={{ color: 'var(--text-main)', lineHeight: 1.55, fontWeight: 500 }}>
                        {item.easy_explanation}
                      </div>
                    </div>

                    {/* 2. 실제 회계 정의 (시험 기준) */}
                    <div className="section-box">
                      <div className="section-title">
                        <BookOpen size={14} />
                        <span>실제 시험 표준 정의</span>
                      </div>
                      <div style={{ color: 'var(--text-main)', lineHeight: 1.55 }}>
                        {item.standard_definition}
                      </div>
                    </div>

                    {/* 3. 일상 예시 */}
                    <div className="section-box">
                      <div className="section-title">
                        <ShoppingBag size={14} />
                        <span>실생활 속 예시</span>
                      </div>
                      <div style={{ color: 'var(--text-muted)', lineHeight: 1.55 }}>
                        {item.example}
                      </div>
                    </div>

                    {/* 4. 분개 및 시험 꿀팁 */}
                    <div className="section-box" style={{ background: 'var(--warning-light)', borderColor: 'rgba(245, 158, 11, 0.25)' }}>
                      <div className="section-title" style={{ color: 'var(--warning)' }}>
                        <Zap size={14} />
                        <span>실전 분개 & 시험 꿀팁</span>
                      </div>
                      <div style={{ color: 'var(--text-main)', lineHeight: 1.55 }}>
                        {item.accounting_tip}
                      </div>
                    </div>

                    {/* 5. [관련 문제 바로 풀어보기] 버튼 */}
                    {item.relatedQuestionId && (
                      <button
                        onClick={() => onStartQuestion(item.relatedQuestionId)}
                        className="btn-primary"
                        style={{
                          marginTop: 4,
                          background: selectedLevel === '1급' ? '#7c3aed' : '#2563eb'
                        }}
                      >
                        <span>관련 기출문제 바로 풀어보기</span>
                        <ArrowRight size={16} />
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
