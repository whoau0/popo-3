-- ==============================================================================
-- AccountingEasy (전산회계 입문자 맞춤형 모바일 웹앱)
-- 데이터베이스 스키마 및 마이그레이션 (PRD Section 6)
-- ==============================================================================

-- 1. 회계 용어 테이블 (glossary)
CREATE TABLE IF NOT EXISTS public.glossary (
    id SERIAL PRIMARY KEY,
    term VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    standard_definition TEXT NOT NULL,
    easy_explanation TEXT NOT NULL,
    example TEXT NOT NULL,
    accounting_tip TEXT,
    related_question_id INT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 인덱스 생성 (검색 성능 최적화)
CREATE INDEX IF NOT EXISTS idx_glossary_term ON public.glossary (term);
CREATE INDEX IF NOT EXISTS idx_glossary_category ON public.glossary (category);

-- RLS (Row Level Security) 설정: 전 사용자 조회(SELECT) 허용
ALTER TABLE public.glossary ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'glossary' AND policyname = 'Allow public read access for glossary'
    ) THEN
        CREATE POLICY "Allow public read access for glossary" 
        ON public.glossary FOR SELECT 
        USING (true);
    END IF;
END $$;


-- 2. 기출 및 연습 문제 테이블 (questions)
CREATE TABLE IF NOT EXISTS public.questions (
    id INT PRIMARY KEY,
    exam_session VARCHAR(100) NOT NULL,
    exam_session_id VARCHAR(50) NOT NULL,
    category VARCHAR(100) NOT NULL,
    question_text TEXT NOT NULL,
    options JSONB NOT NULL,
    correct_answer INT NOT NULL,
    easy_solution TEXT NOT NULL,
    exam_tip TEXT,
    related_glossary_term VARCHAR(100),
    t_accounts JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_questions_category ON public.questions (category);
CREATE INDEX IF NOT EXISTS idx_questions_exam_session ON public.questions (exam_session_id);

-- RLS 설정: 전 사용자 조회(SELECT) 허용
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'questions' AND policyname = 'Allow public read access for questions'
    ) THEN
        CREATE POLICY "Allow public read access for questions" 
        ON public.questions FOR SELECT 
        USING (true);
    END IF;
END $$;
