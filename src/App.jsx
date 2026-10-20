import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import HomeScreen from './components/HomeScreen';
import GlossaryScreen from './components/GlossaryScreen';
import PracticeScreen from './components/PracticeScreen';
import ExamScreen from './components/ExamScreen';
import ReviewScreen from './components/ReviewScreen';
import { QUESTIONS_DATA } from './data/questionData';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [selectedGlossaryTerm, setSelectedGlossaryTerm] = useState(null);
  const [targetPracticeQuestionId, setTargetPracticeQuestionId] = useState(null);

  // 학습 목표 급수 (1급 vs 2급)
  const [selectedLevel, setSelectedLevel] = useState(() => {
    try {
      return localStorage.getItem('accounting_selected_level') || '2급';
    } catch {
      return '2급';
    }
  });

  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem('accounting_theme') || 'light';
    } catch {
      return 'light';
    }
  });

  const [fontSize, setFontSize] = useState(() => {
    try {
      return localStorage.getItem('accounting_font_size') || 'normal';
    } catch {
      return 'normal';
    }
  });

  // 급수 변경 시 로컬 스토리지 동기화
  useEffect(() => {
    try {
      localStorage.setItem('accounting_selected_level', selectedLevel);
    } catch (e) {
      console.error(e);
    }
  }, [selectedLevel]);

  // 테마 & 폰트 크기 DOM 속성 동기화
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem('accounting_theme', theme);
    } catch (e) {
      console.error(e);
    }
  }, [theme]);

  useEffect(() => {
    document.documentElement.setAttribute('data-font-size', fontSize);
    try {
      localStorage.setItem('accounting_font_size', fontSize);
    } catch (e) {
      console.error(e);
    }
  }, [fontSize]);

  const handleToggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const handleToggleFontSize = () => {
    setFontSize(prev => (prev === 'normal' ? 'large' : 'normal'));
  };

  // 로컬 스토리지 상태 관리
  const [bookmarks, setBookmarks] = useState(() => {
    try {
      const saved = localStorage.getItem('accounting_bookmarks');
      return saved ? JSON.parse(saved) : [104, 110]; // 초기 예시 2개 포함
    } catch {
      return [104, 110];
    }
  });

  const [solvedHistory, setSolvedHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('accounting_solved_history');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // 상태 변경 시 로컬 스토리지 동기화
  useEffect(() => {
    try {
      localStorage.setItem('accounting_bookmarks', JSON.stringify(bookmarks));
    } catch (e) {
      console.error(e);
    }
  }, [bookmarks]);

  useEffect(() => {
    try {
      localStorage.setItem('accounting_solved_history', JSON.stringify(solvedHistory));
    } catch (e) {
      console.error(e);
    }
  }, [solvedHistory]);

  // 북마크 토글 핸들러
  const handleToggleBookmark = (questionId) => {
    setBookmarks(prev => {
      if (prev.includes(questionId)) {
        return prev.filter(id => id !== questionId);
      } else {
        return [...prev, questionId];
      }
    });
  };

  // 문제 풀이 기록 핸들러
  const handleRecordSolve = (questionId, isCorrect) => {
    setSolvedHistory(prev => ({
      ...prev,
      [questionId]: {
        isCorrect,
        timestamp: Date.now()
      }
    }));
  };

  // 통계 계산 (선택된 급수 기준 + 전체)
  const levelQuestionIds = new Set(
    QUESTIONS_DATA.filter(q => q.level === selectedLevel).map(q => q.id)
  );
  const solvedLevelEntries = Object.entries(solvedHistory).filter(([qid]) => levelQuestionIds.has(Number(qid)));
  const totalSolved = solvedLevelEntries.length;
  const correctCount = solvedLevelEntries.filter(([, v]) => v.isCorrect).length;
  const levelBookmarks = bookmarks.filter(id => levelQuestionIds.has(id));

  const stats = {
    totalSolved,
    correctCount,
    bookmarks: levelBookmarks,
    allBookmarksCount: bookmarks.length,
    totalLevelQuestions: levelQuestionIds.size
  };

  // 용어사전 특정 용어로 바로가기
  const handleSelectTerm = (termName) => {
    setSelectedGlossaryTerm(termName);
    setActiveTab('glossary');
  };

  // 연습문제 특정 문항으로 바로가기
  const handleStartPracticeQuestion = (questionId) => {
    setTargetPracticeQuestionId(questionId);
    setActiveTab('practice');
  };

  // 데이터 초기화
  const [isMobilePreview, setIsMobilePreview] = useState(false);

  const handleResetData = () => {
    if (window.confirm('학습 기록과 북마크를 모두 초기화하시겠습니까?')) {
      setBookmarks([]);
      setSolvedHistory({});
      localStorage.removeItem('accounting_bookmarks');
      localStorage.removeItem('accounting_solved_history');
    }
  };

  return (
    <div className="app-container">
      <div className={`responsive-shell ${isMobilePreview ? 'preview-mobile' : ''}`}>
        {/* 상단 헤더 (데스크톱 네비게이션 및 모니터/모바일 뷰 전환 지원) */}
        <Header 
          currentTab={activeTab} 
          onTabChange={setActiveTab}
          onResetData={handleResetData}
          theme={theme}
          onToggleTheme={handleToggleTheme}
          fontSize={fontSize}
          onToggleFontSize={handleToggleFontSize}
          isMobilePreview={isMobilePreview}
          onToggleMobilePreview={() => setIsMobilePreview(prev => !prev)}
          bookmarkCount={bookmarks.length}
        />

        {/* 메인 화면 뷰포트 */}
        <main className="app-content">
          {activeTab === 'home' && (
            <HomeScreen
              selectedLevel={selectedLevel}
              onSelectLevel={setSelectedLevel}
              onNavigate={setActiveTab}
              stats={stats}
              onSelectTerm={handleSelectTerm}
              onStartPracticeQuestion={handleStartPracticeQuestion}
            />
          )}

          {activeTab === 'glossary' && (
            <GlossaryScreen
              selectedLevel={selectedLevel}
              initialTerm={selectedGlossaryTerm}
              onStartQuestion={handleStartPracticeQuestion}
            />
          )}

          {activeTab === 'practice' && (
            <PracticeScreen
              selectedLevel={selectedLevel}
              targetQuestionId={targetPracticeQuestionId}
              bookmarks={bookmarks}
              onToggleBookmark={handleToggleBookmark}
              onRecordSolve={handleRecordSolve}
              onNavigateToGlossary={handleSelectTerm}
            />
          )}

          {activeTab === 'exam' && (
            <ExamScreen
              selectedLevel={selectedLevel}
              bookmarks={bookmarks}
              onToggleBookmark={handleToggleBookmark}
              onFinishExam={(result) => {
                // 모의고사 결과를 풀이 기록에 반영
                result.wrongList.forEach(w => {
                  handleRecordSolve(w.question.id, false);
                });
              }}
              onReviewWrong={() => setActiveTab('review')}
            />
          )}

          {activeTab === 'review' && (
            <ReviewScreen
              selectedLevel={selectedLevel}
              bookmarks={bookmarks}
              onToggleBookmark={handleToggleBookmark}
              solvedHistory={solvedHistory}
              onStartQuestion={handleStartPracticeQuestion}
              onClearHistory={() => setSolvedHistory({})}
            />
          )}
        </main>

        {/* 하단 고정 네비게이션 */}
        <BottomNav
          activeTab={activeTab}
          onTabChange={setActiveTab}
          bookmarkCount={bookmarks.length}
        />
      </div>
    </div>
  );
}
