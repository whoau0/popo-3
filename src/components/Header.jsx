import React from 'react';
import { 
  Sparkles, RotateCcw, Moon, Sun, Type, 
  Home, BookOpen, Target, Clock, BookmarkCheck, Smartphone, Monitor 
} from 'lucide-react';

export default function Header({ 
  currentTab, 
  onTabChange,
  onResetData, 
  theme = 'light', 
  onToggleTheme,
  fontSize = 'normal',
  onToggleFontSize,
  isMobilePreview = false,
  onToggleMobilePreview,
  bookmarkCount = 0
}) {
  const navItems = [
    { id: 'home', label: '홈', icon: Home },
    { id: 'glossary', label: '쉬운 용어', icon: BookOpen },
    { id: 'practice', label: '유형 연습', icon: Target },
    { id: 'exam', label: '실전 모의', icon: Clock },
    { id: 'review', label: '오답 노트', icon: BookmarkCheck, badge: bookmarkCount }
  ];

  return (
    <header className="app-header">
      {/* 1. 로고 & 브랜드명 */}
      <div className="header-brand" onClick={() => onTabChange && onTabChange('home')}>
        <div style={{
          width: 36,
          height: 36,
          borderRadius: 10,
          background: 'linear-gradient(135deg, #2563eb, #6366f1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ffffff',
          flexShrink: 0,
          boxShadow: '0 4px 10px rgba(37, 99, 235, 0.3)'
        }}>
          <Sparkles size={20} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1.2 }}>
            AccountingEasy
          </span>
          <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            전산회계 맞춤 학습
          </span>
        </div>
      </div>

      {/* 2. 데스크톱/노트북 화면용 중앙 네비게이션 (모바일에서는 CSS로 자동 숨김) */}
      <nav className="desktop-nav">
        {navItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              className={`desktop-nav-btn ${isActive ? 'active' : ''}`}
              onClick={() => onTabChange(item.id)}
            >
              <IconComponent size={17} />
              <span>{item.label}</span>
              {item.badge > 0 && (
                <span className="desktop-nav-badge">{item.badge}</span>
              )}
            </button>
          );
        })}
      </nav>

      {/* 3. 우측 컨트롤 툴바 (뷰모드 전환, 폰트크기, 테마, 리셋) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        {/* 모니터 / 모바일 뷰 전환 버튼 */}
        <button
          onClick={onToggleMobilePreview}
          title={isMobilePreview ? '와이드 모니터 화면으로 전환' : '스마트폰 화면 크기로 미리보기'}
          style={{
            background: isMobilePreview ? 'var(--primary-light)' : 'none',
            border: '1px solid var(--border)',
            color: isMobilePreview ? 'var(--primary)' : 'var(--text-muted)',
            cursor: 'pointer',
            padding: '6px 10px',
            borderRadius: 8,
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            fontSize: '0.78rem',
            fontWeight: 700
          }}
        >
          {isMobilePreview ? <Smartphone size={16} /> : <Monitor size={16} />}
          <span style={{ display: 'none', '@media (min-width: 640px)': { display: 'inline' } }}>
            {isMobilePreview ? '모바일' : '와이드'}
          </span>
        </button>

        {/* 글자 크기 토글 */}
        <button
          onClick={onToggleFontSize}
          title={fontSize === 'normal' ? '큰 글씨 모드로 전환' : '보통 글씨로 전환'}
          style={{
            background: fontSize === 'large' ? 'var(--primary-light)' : 'none',
            border: 'none',
            color: fontSize === 'large' ? 'var(--primary)' : 'var(--text-muted)',
            cursor: 'pointer',
            padding: 6,
            borderRadius: 8,
            display: 'flex',
            alignItems: 'center',
            fontSize: '0.78rem',
            fontWeight: 700
          }}
        >
          <Type size={17} />
        </button>

        {/* 다크 모드 토글 */}
        <button
          onClick={onToggleTheme}
          title={theme === 'light' ? '야간 고대비 모드(다크)로 전환' : '주간 모드(라이트)로 전환'}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            padding: 6,
            borderRadius: 8,
            display: 'flex',
            alignItems: 'center'
          }}
        >
          {theme === 'light' ? <Moon size={17} /> : <Sun size={17} color="#fbbf24" />}
        </button>

        {/* 초기화 */}
        <button
          onClick={onResetData}
          title="학습 데이터 초기화"
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-sub)',
            cursor: 'pointer',
            padding: 6,
            borderRadius: 8,
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <RotateCcw size={16} />
        </button>
      </div>
    </header>
  );
}
