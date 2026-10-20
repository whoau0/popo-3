// 초성 추출 유틸리티
const CHOSUNG_LIST = [
  'ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ', 
  'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'
];

export function getChosung(str) {
  if (!str) return '';
  let result = '';
  for (let i = 0; i < str.length; i++) {
    const code = str.charCodeAt(i) - 44032;
    if (code >= 0 && code <= 11171) {
      const chosungIndex = Math.floor(code / 588);
      result += CHOSUNG_LIST[chosungIndex];
    } else {
      result += str.charAt(i);
    }
  }
  return result;
}

export function matchesKeywordOrChosung(text, query) {
  if (!query) return true;
  const cleanQuery = query.trim().toLowerCase();
  const cleanText = text.toLowerCase();

  // 1. 일반 텍스트 포함 여부
  if (cleanText.includes(cleanQuery)) return true;

  // 2. 검색어가 자모(초성)로만 이루어져 있는지 확인
  const isOnlyChosung = /^[ㄱ-ㅎ]+$/.test(cleanQuery);
  if (isOnlyChosung) {
    const textChosung = getChosung(cleanText);
    return textChosung.includes(cleanQuery);
  }

  return false;
}
