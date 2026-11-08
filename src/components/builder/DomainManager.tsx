'use client';
import { useEffect, useState } from 'react';
type Domain = { domain: string; status: string; verification_token: string };
async function readDomains(siteId: string, signal?: AbortSignal): Promise<Domain[]> {
  const response = await fetch(`/api/domains?siteId=${encodeURIComponent(siteId)}`, { cache: 'no-store', signal });
  const body = await response.json(); if (!response.ok) throw new Error(body.error);
  return body.data || [];
}
export default function DomainManager({ siteId }: { siteId: string }) {
  const [domains, setDomains] = useState<Domain[]>([]), [input, setInput] = useState('');
  const [message, setMessage] = useState(''), [busy, setBusy] = useState(false);
  useEffect(() => {
    const controller = new AbortController();
    readDomains(siteId, controller.signal).then(data => { if (!controller.signal.aborted) setDomains(data); })
      .catch(error => { if (!controller.signal.aborted) setMessage(error.message); });
    return () => controller.abort();
  }, [siteId]);
  async function act(domain: string, action: string) {
    setBusy(true); setMessage('');
    try {
      const response = await fetch('/api/domains', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ siteId, domain, action }) });
      const body = await response.json(); if (!response.ok) throw new Error(body.error);
      setDomains(await readDomains(siteId)); setInput(''); setMessage('처리했습니다. Vercel 도메인 등록과 DNS 설정도 확인하세요.');
    } catch (error) { setMessage(error instanceof Error ? error.message : '처리 실패'); }
    finally { setBusy(false); }
  }
  return <details className="border rounded p-3 m-3 bg-white text-slate-900">
    <summary>사용자 지정 도메인 관리</summary>
    <p className="text-sm my-2">등록 → TXT 소유권 확인 → Vercel·DNS 설정 확인 → 활성화 순서로 연결합니다.</p>
    <label>연결할 도메인 <input className="border p-1" value={input} onChange={e => setInput(e.target.value)} placeholder="medinsure.co.kr" /></label>
    <button type="button" disabled={busy} onClick={() => act(input, 'register')} className="border p-1 m-1">등록</button>
    {domains.map(item => <div key={item.domain} className="border-t py-2 text-sm break-all">
      <strong>{item.domain}</strong> — {{ pending: '소유권 확인 대기', verified: '소유권 확인 완료', active: '활성', disabled: '비활성' }[item.status] || item.status}
      <p>TXT 이름: _thsoft-verification.{item.domain}<br />TXT 값: thsoft-site={item.verification_token}</p>
      {['verify','activate','disable','delete'].map((action, i) => <button type="button" className="border p-1 m-1" disabled={busy} key={action} onClick={() => { if (action !== 'delete' || confirm('도메인 매핑을 삭제하시겠습니까?')) void act(item.domain, action); }}>{['소유권 확인','활성화','비활성화','삭제'][i]}</button>)}
    </div>)}
    <p role="status">{message}</p>
  </details>;
}
