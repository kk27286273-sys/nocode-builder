-- sites 테이블에 구독 관련 필드 추가
ALTER TABLE public.sites 
ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'inactive', -- active, inactive, past_due
ADD COLUMN IF NOT EXISTS subscription_tier TEXT DEFAULT 'business',    -- standard, business, premium
ADD COLUMN IF NOT EXISTS current_period_end TIMESTAMP WITH TIME ZONE;

-- 결제 로그(payments) 테이블 생성
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    site_id UUID REFERENCES public.sites(id) ON DELETE SET NULL,
    imp_uid TEXT NOT NULL,          -- 포트원 결제 고유번호
    merchant_uid TEXT NOT NULL,     -- 가맹점 주문번호
    amount NUMERIC NOT NULL,        -- 결제 금액
    status TEXT NOT NULL,           -- paid, failed, cancelled
    customer_email TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- payments RLS 활성화 (관리자/웹훅 전용)
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;