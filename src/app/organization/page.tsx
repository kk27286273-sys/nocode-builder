'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { supabase } from '@/lib/supabase/client';

type Organization = { id: string; name: string; role: string };
type Member = { id: string; email: string; role: string; assigned: boolean };
type Dashboard = {
  role: string;
  assigned: number;
  pending: number;
  subscription: { seat_limit: number; status: string; paid_through: string; payment_failed_at: string | null; plan: string | null; monthly_amount: number | null } | null;
  members: Member[];
  invites: { email: string; expiresAt: string; acceptedAt: string | null; cancelledAt: string | null }[];
  audit: { id: number; target_id: string; is_assigned: boolean; occurred_at: string }[];
};
const button = 'rounded border border-slate-300 bg-white px-3 py-2 text-sm font-semibold disabled:opacity-50';
const primary = 'rounded bg-blue-700 px-4 py-2 text-sm font-bold text-white disabled:opacity-50';
const labels: Record<string, string> = { branch_manager: '지점장', assistant_manager: '보조 관리자', agent: '설계사' };
const date = (value: string) => new Date(value).toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' });

export default function OrganizationPage() {
  const [token, setToken] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [returnToCheckout, setReturnToCheckout] = useState(false);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [org, setOrg] = useState('');
  const [dashboard, setDashboard] = useState<Dashboard | null>(null);
  const [entitlement, setEntitlement] = useState<boolean | null>(null);
  const [signup, setSignup] = useState(false);
  const [invite, setInvite] = useState('');
  const [inviteLink, setInviteLink] = useState('');
  const [tab, setTab] = useState('현황');
  const [filter, setFilter] = useState('');
  const [selected, setSelected] = useState<string[]>([]);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        setDashboard(null); setOrg(''); setOrganizations([]); setInviteLink(''); setTab('현황');
      }
      setToken(session?.access_token || null);
      setReady(true);
    });
    setInvite(new URLSearchParams(window.location.hash.slice(1)).get('invite') || '');
    setReturnToCheckout(new URLSearchParams(window.location.search).get('checkout') === '1');
    return () => data.subscription.unsubscribe();
  }, []);

  const request = useCallback(async (action: string, fields: Record<string, unknown> = {}) => {
    const response = await fetch('/api/medinsure/organization', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ action, organizationId: org, ...fields }),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error);
    return result;
  }, [token, org]);

  useEffect(() => {
    if (!token) {
      setOrganizations([]); setOrg(''); setDashboard(null);
      return;
    }
    let current = true;
    request('list').then(({ data }) => {
      if (!current) return;
      setOrganizations(data);
      if (!org) setOrg(data[0]?.id || '');
    }).catch((err) => { if (current) setError(err.message); });
    return () => { current = false; };
  }, [token, org, request]);

  useEffect(() => {
    if (!token || !org || organizations.find((item) => item.id === org)?.role === 'agent') return;
    let current = true;
    request('dashboard').then(({ data }) => {
      if (current) setDashboard(data);
    }).catch((err) => { if (current) setError(err.message); });
    return () => { current = false; };
  }, [token, org, request, organizations]);

  const isAgent = organizations.find((item) => item.id === org)?.role === 'agent';
  useEffect(() => {
    setEntitlement(null);
    if (!token || !isAgent) return;
    const controller = new AbortController();
    fetch('/api/medinsure/entitlement', {
      headers: { Authorization: `Bearer ${token}` }, signal: controller.signal,
    }).then(async (response) => {
      if (!response.ok) throw new Error('이용권 상태를 확인하지 못했습니다.');
      const result = await response.json();
      if (!controller.signal.aborted) setEntitlement(result.allowed);
    }).catch((err) => { if (!controller.signal.aborted) setError(err.message); });
    return () => controller.abort();
  }, [token, isAgent, org]);

  async function authenticate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const credentials = { email: String(form.get('email')), password: String(form.get('password')) };
    setBusy(true); setError(''); setNotice('');
    try {
      const result = signup ? await supabase.auth.signUp(credentials) : await supabase.auth.signInWithPassword(credentials);
      if (result.error) throw result.error;
      if (signup && !result.data.session) setNotice('가입 확인 이메일을 확인한 뒤 로그인해 주세요.');
    } catch (err) {
      setError(err instanceof Error ? err.message : '인증에 실패했습니다.');
    } finally { setBusy(false); }
  }

  async function mutate(action: string, fields: Record<string, unknown>) {
    setBusy(true); setError(''); setNotice('');
    try {
      const result = await request(action, fields);
      if (result.inviteToken) setInviteLink(`${window.location.origin}/organization#invite=${result.inviteToken}`);
      if (action === 'accept') {
        window.history.replaceState(null, '', '/organization');
        setInvite('');
        const list = await request('list');
        setOrganizations(list.data);
        setDashboard(null);
        setOrg(result.data.organizationId);
      } else {
        const updated = await request('dashboard');
        setDashboard(updated.data);
      }
      setSelected([]);
      setNotice(action === 'invite' ? '초대 링크를 발급했습니다. 대상 직원에게 전달해 주세요.' : '변경을 저장했습니다.');
    } catch (err) {
      setError(err instanceof Error ? err.message : '요청에 실패했습니다.');
    } finally { setBusy(false); }
  }

  function changeSeats(targets: Member[], assign: boolean) {
    if (!targets.length) return;
    const names = targets.map((item) => item.email).join(', ');
    if (!window.confirm(assign ? `${names}에게 이용권을 배정할까요?`
      : `${names}의 이용권을 회수할까요? EXE 분석 기능은 제한되며 로컬 자료는 보존됩니다.`)) return;
    const ids = targets.map((item) => item.id);
    void mutate('seats', { assign: assign ? ids : [], revoke: assign ? [] : ids });
  }

  const assigned = dashboard?.assigned || 0;
  const pending = dashboard?.pending || 0;
  const subscription = dashboard?.subscription;
  const isManager = dashboard?.role === 'branch_manager';

  return <main className="min-h-screen bg-slate-50 text-slate-900">
    <div className="mx-auto max-w-6xl space-y-6 px-5 py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div><Link href="/medinsure" className="text-sm font-bold text-blue-800">MedinSure</Link>
          <h1 className="mt-2 text-3xl font-black">조직 관리</h1></div>
        {token && <button className={button} disabled={busy} onClick={() => { setInviteLink(''); void supabase.auth.signOut(); }}>로그아웃</button>}
      </div>
      {error && <p role="alert" className="rounded bg-red-50 p-3 text-red-800">{error}</p>}
      {notice && <p role="status" className="rounded bg-blue-50 p-3 text-blue-900">{notice}</p>}
      {token && returnToCheckout && <Link href="/medinsure#plans" className="inline-block rounded bg-blue-700 px-4 py-2 font-bold text-white">선택한 요금제로 돌아가기</Link>}
      {!ready && <p>계정을 확인하고 있습니다.</p>}
      {ready && !token && <form onSubmit={authenticate} className="max-w-md space-y-4 rounded-xl border bg-white p-6">
        <h2 className="text-xl font-bold">{signup ? '회원가입' : '로그인'}</h2>
        <label className="block text-sm font-semibold">이메일<input className="mt-1 block w-full rounded border p-2" name="email" type="email" autoComplete="email" required /></label>
        <label className="block text-sm font-semibold">비밀번호<input className="mt-1 block w-full rounded border p-2" name="password" type="password" autoComplete={signup ? 'new-password' : 'current-password'} required /></label>
        <div className="flex flex-wrap gap-2"><button className={primary} disabled={busy}>{signup ? '가입하기' : '로그인'}</button>
          <button type="button" className={button} onClick={() => setSignup(!signup)}>{signup ? '로그인 화면' : '회원가입'}</button></div>
        <div className="flex gap-4 text-sm text-blue-800"><Link href="/medinsure/legal/terms">이용약관</Link><Link href="/medinsure/legal/privacy">개인정보처리방침</Link></div>
      </form>}
      {token && invite && <section className="rounded-xl border bg-white p-5">
        <h2 className="font-bold">조직 초대</h2><p className="my-2 text-sm">초대된 이메일의 계정으로 수락하세요. 이용권은 관리자가 별도로 배정합니다.</p>
        <button className={primary} disabled={busy} onClick={() => void mutate('accept', { token: invite })}>초대 수락</button>
      </section>}
      {token && !org && <p className="rounded bg-white p-5">소속 조직이 없습니다. 지점장에게 초대 링크를 요청하세요.</p>}
      {token && org && <label className="block font-semibold">선택한 조직
        <select className="ml-3 rounded border bg-white p-2" value={org} disabled={busy} onChange={(e) => {
          setDashboard(null); setInviteLink(''); setSelected([]); setTab('현황'); setOrg(e.target.value);
        }}>{organizations.map((item) => <option key={item.id} value={item.id}>{item.name} · {labels[item.role]}</option>)}</select>
      </label>}
      {token && org && isAgent && <p>설계사 계정 · {entitlement === null ? '이용권 확인 중' :
        entitlement ? 'EXE 이용권 활성' : '활성 이용권이 없습니다. 소속 조직의 관리자에게 문의하세요.'}</p>}
      {dashboard && <div className="space-y-5">
        <nav aria-label="조직 메뉴" className="flex flex-wrap gap-2">
          {['현황', '직원', '이용권', ...(isManager ? ['보조 관리자', '구독·결제'] : [])].map((item) =>
            <button type="button" aria-pressed={tab === item} className={tab === item ? primary : button} key={item} onClick={() => { setTab(item); setSelected([]); }}>{item}</button>)}
        </nav>
        {tab === '현황' && <>
          <dl className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {Object.entries({ '계약 이용권': subscription?.seat_limit || 0, '배정 완료': assigned, '배정 가능': Math.max(0, (subscription?.seat_limit || 0) - assigned), '초대 대기': pending }).map(([key, value]) =>
              <div className="rounded-xl border bg-white p-4" key={key}><dt className="text-sm text-slate-600">{key}</dt><dd className="mt-2 text-2xl font-black">{value}</dd></div>)}
          </dl>
          {subscription && <p className="rounded-xl border bg-white p-4 text-sm">
            {subscription.plan || '테스트 계약'} · 구독 상태 {subscription.status} · 현재 이용 기간 종료 {date(subscription.paid_through)}
          </p>}
          <section className="rounded-xl border bg-white p-5"><h2 className="font-bold">최근 이용권 변경</h2>
            <ul className="mt-2 space-y-2 text-sm">{dashboard.audit.map((item) => <li key={item.id}>{date(item.occurred_at)} · {dashboard.members.find((member) => member.id === item.target_id)?.email || '이전 구성원'} · {item.is_assigned ? '배정' : '회수'}</li>)}</ul>
          </section>
        </>}
        {tab === '직원' && <section className="space-y-4 rounded-xl border bg-white p-5">
          <form className="flex flex-wrap items-end gap-2" onSubmit={(e) => {
            e.preventDefault(); const form = new FormData(e.currentTarget); void mutate('invite', { email: form.get('email') });
          }}>
            <label className="text-sm font-semibold">초대할 이메일<input className="mt-1 block rounded border p-2" name="email" type="email" required /></label>
            <button className={primary} disabled={busy}>초대 링크 발급</button>
          </form>
          {inviteLink && <label className="block text-sm">발급된 초대 링크<input className="mt-1 block w-full rounded border p-2" value={inviteLink} readOnly onFocus={(e) => e.target.select()} /></label>}
          <ul className="space-y-2 text-sm">{dashboard.invites.map((item) => {
            const status = item.acceptedAt ? '수락' : item.cancelledAt ? '취소' : Date.parse(item.expiresAt) <= Date.now() ? '만료' : '대기';
            return <li key={item.email + item.expiresAt} className="flex flex-wrap items-center gap-2">
              <span>{item.email} · {status}</span>
              {status === '대기' && <button className={button} disabled={busy} onClick={() => void mutate('cancel_invite', { email: item.email })}>취소</button>}
              {['대기', '만료'].includes(status) && <button className={button} disabled={busy} onClick={() => void mutate('invite', { email: item.email })}>새 링크 발급</button>}
            </li>;
          })}</ul>
        </section>}
        {['직원', '이용권', '보조 관리자'].includes(tab) && <section className="space-y-3 rounded-xl border bg-white p-5">
          <label className="text-sm font-semibold">직원 검색<input className="ml-2 rounded border p-2" value={filter} onChange={(e) => setFilter(e.target.value)} /></label>
          {tab === '이용권' && <div className="flex gap-2">
            <button className={primary} disabled={busy || !selected.length} onClick={() => changeSeats(dashboard.members.filter((m) => selected.includes(m.id) && !m.assigned), true)}>선택 배정</button>
            <button className={button} disabled={busy || !selected.length} onClick={() => changeSeats(dashboard.members.filter((m) => selected.includes(m.id) && m.assigned), false)}>선택 회수</button>
            <button className={button} disabled={busy || selected.length !== 2} onClick={() => {
              const targets = dashboard.members.filter((member) => selected.includes(member.id));
              const from = targets.find((member) => member.assigned);
              const to = targets.find((member) => !member.assigned);
              if (!from || !to) { setError('배정된 직원과 미배정 직원을 한 명씩 선택해 주세요.'); return; }
              if (window.confirm(`${from.email}의 이용권을 회수하여 ${to.email}에게 배정할까요? 로컬 자료는 보존됩니다.`))
                void mutate('seats', { assign: [to.id], revoke: [from.id] });
            }}>선택 재배정</button>
          </div>}
          <ul className="divide-y">{dashboard.members.filter((m) => m.email.toLowerCase().includes(filter.toLowerCase())).map((member) =>
            <li className="flex flex-wrap items-center justify-between gap-3 py-3 text-sm" key={member.id}>
              <span>{tab === '이용권' && <input className="mr-2" type="checkbox" aria-label={`${member.email} 선택`} checked={selected.includes(member.id)} onChange={(e) =>
                setSelected(e.target.checked ? [...selected, member.id] : selected.filter((id) => id !== member.id))} />}
                <strong>{member.email}</strong> · {labels[member.role]} · {member.assigned ? '배정 완료' : '미배정'}</span>
              {tab === '이용권' && <button className={button} disabled={busy} onClick={() => changeSeats([member], !member.assigned)}>{member.assigned ? '이용권 회수' : '이용권 배정'}</button>}
              {tab === '직원' && (member.role === 'agent' || (isManager && member.role === 'assistant_manager')) &&
                <button className={button} disabled={busy} onClick={() => {
                  if (window.confirm(`${member.email}의 조직 소속을 해제할까요? 배정된 이용권도 회수됩니다.`))
                    void mutate('remove_member', { userId: member.id });
                }}>소속 해제</button>}
              {isManager && tab === '보조 관리자' && member.role !== 'branch_manager' && <button className={button} disabled={busy}
                onClick={() => void mutate('delegate', { userId: member.id, enabled: member.role !== 'assistant_manager' })}>
                {member.role === 'assistant_manager' ? '보조 권한 회수' : '보조 관리자 지정'}</button>}
            </li>)}</ul>
        </section>}
        {tab === '구독·결제' && isManager && <section className="space-y-2 rounded-xl border bg-white p-5">
          <h2 className="font-bold">구독 상태</h2>
          <p>{subscription ? `${subscription.status} · 계약 ${subscription.seat_limit}명` : '활성 계약 정보가 없습니다.'}</p>
          {subscription && <p>이용 기간 종료 {date(subscription.paid_through)}</p>}
          {typeof subscription?.monthly_amount === 'number' && <p>계약 월 금액 {subscription.monthly_amount.toLocaleString('ko-KR')}원</p>}
          {subscription?.status === 'past_due' && subscription.payment_failed_at && <p>결제 유예 종료 {date(new Date(Date.parse(subscription.payment_failed_at) + 72 * 3600000).toISOString())}</p>}
          <Link href="/medinsure#plans" className="inline-block text-sm font-bold text-blue-800">요금제 및 서버 견적 확인</Link>
        </section>}
      </div>}
    </div>
  </main>;
}
