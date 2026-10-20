import React from 'react';
import { Home, BookOpen, Target, Clock, BookmarkCheck } from 'lucide-react';

export default function BottomNav({ activeTab, onTabChange, bookmarkCount = 0 }) {
  const navItems = [
    { id: 'home', label: '홈', icon: Home },
    { id: 'glossary', label: '용어사전', icon: BookOpen },
    { id: 'practice', label: '유형연습', icon: Target },
    { id: 'exam', label: '실전모의', icon: Clock },
    { id: 'review', label: '오답노트', icon: BookmarkCheck, badge: bookmarkCount }
  ];

  return (
    <nav className="bottom-nav">
      {navItems.map((item) => {
        const IconComponent = item.icon;
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            className={`nav-item ${isActive ? 'active' : ''}`}
            onClick={() => onTabChange(item.id)}
            style={{ position: 'relative' }}
          >
            <IconComponent size={22} />
            <span>{item.label}</span>
            {item.badge > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: 2,
                  right: 12,
                  background: '#ef4444',
                  color: '#ffffff',
                  fontSize: '0.62rem',
                  fontWeight: 700,
                  borderRadius: 10,
                  padding: '1px 5px',
                  minWidth: 16,
                  textAlign: 'center'
                }}
              >
                {item.badge}
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );
}
