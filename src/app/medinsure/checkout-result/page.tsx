'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { supabase } from '@/lib/supabase/client';

export default function CheckoutResultPage() {
  const [message, setMessage] = useState('테스트 결제를 확인하고 있습니다.');
  const confirmation = useRef<Promise<string> | null>(null);
  useEffect(() => {
    let current = true;
    async function confirm() {
      const query = new URLSearchParams(window.location.search);
      if (query.has('failed')) return '테스트 카드 등록이 취소되었거나 실패했습니다.';
      const orderId = query.get('orderId');
      const customerKey = query.get('customerKey');
      const authKey = query.get('authKey');
      // Remove the one-time credential from the address bar and browser history.
      window.history.replaceState(null, '', '/medinsure/checkout-result');
      if (!orderId || !customerKey || !authKey) return '확인할 테스트 주문이 없습니다.';
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) throw new Error('로그인이 만료되었습니다.');
        const response = await fetch('/api/medinsure/test-checkout', {
          method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.access_token}` },
          body: JSON.stringify({ action: 'confirm', orderId, customerKey, authKey }),
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error);
        return '테스트 결제를 확인하고 테스트 이용권을 활성화했습니다.';
      } catch (err) { return err instanceof Error ? err.message : '테스트 결제를 확인하지 못했습니다.'; }
    }
    confirmation.current ??= confirm();
    void confirmation.current.then((result) => { if (current) setMessage(result); });
    return () => { current = false; };
  }, []);
  return <main className="mx-auto min-h-[55vh] max-w-2xl space-y-5 px-6 py-16">
    <h1 className="text-3xl font-black">테스트 결제 결과</h1>
    <p role="status">{message}</p>
    <Link href="/organization" className="text-blue-800 underline">조직 관리</Link>
  </main>;
}
