import { supabase, isSupabaseConfigured } from './supabaseClient';
import { GLOSSARY_DATA } from '../data/glossaryData';
import { QUESTIONS_DATA } from '../data/questionData';

/**
 * 용어 사전 데이터 패치 (Supabase 우선, 연결 실패 시 로컬 Seed Fallback)
 */
export async function getGlossaryList() {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('glossary')
        .select('*')
        .order('id', { ascending: true });

      if (!error && data && data.length > 0) {
        return data.map(item => ({
          id: `g${item.id}`,
          term: item.term,
          category: item.category,
          standard_definition: item.standard_definition,
          easy_explanation: item.easy_explanation,
          example: item.example,
          accounting_tip: item.accounting_tip,
          relatedQuestionId: item.related_question_id
        }));
      }
    } catch (err) {
      console.warn('Supabase fetch failed, falling back to local seed data:', err);
    }
  }

  // 로컬 Seed 데이터 반환
  return GLOSSARY_DATA;
}

/**
 * 기출 및 연습 문제 데이터 패치 (Supabase 우선, 로컬 Seed Fallback)
 */
export async function getQuestionList() {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .order('id', { ascending: true });

      if (!error && data && data.length > 0) {
        return data.map(item => ({
          id: item.id,
          exam_sessionId: item.exam_session_id,
          exam_session: item.exam_session,
          category: item.category,
          question_text: item.question_text,
          options: Array.isArray(item.options) ? item.options : JSON.parse(item.options || '[]'),
          correct_answer: item.correct_answer,
          easy_solution: item.easy_solution,
          exam_tip: item.exam_tip,
          related_glossary_term: item.related_glossary_term,
          tAccounts: item.t_accounts ? (Array.isArray(item.t_accounts) ? item.t_accounts : JSON.parse(item.t_accounts)) : null
        }));
      }
    } catch (err) {
      console.warn('Supabase questions fetch failed, falling back to local seed data:', err);
    }
  }

  // 로컬 Seed 데이터 반환
  return QUESTIONS_DATA;
}

/**
 * 북마크 저장 및 불러오기 (Local Storage 연동)
 */
export function getSavedBookmarks() {
  try {
    const saved = localStorage.getItem('accounting_bookmarks');
    return saved ? JSON.parse(saved) : [104, 110];
  } catch {
    return [104, 110];
  }
}

export function saveBookmarks(bookmarks) {
  try {
    localStorage.setItem('accounting_bookmarks', JSON.stringify(bookmarks));
  } catch (e) {
    console.error('Failed to save bookmarks:', e);
  }
}

/**
 * 문제 풀이 이력 저장 및 불러오기 (Local Storage 연동)
 */
export function getSavedSolvedHistory() {
  try {
    const saved = localStorage.getItem('accounting_solved_history');
    return saved ? JSON.parse(saved) : {};
  } catch {
    return {};
  }
}

export function saveSolvedHistory(history) {
  try {
    localStorage.setItem('accounting_solved_history', JSON.stringify(history));
  } catch (e) {
    console.error('Failed to save solved history:', e);
  }
}
