'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface Lead {
  id: string;
  site_id: string;
  name: string;
  phone: string;
  message: string;
  note: string;
  status: 'pending' | 'completed';
  created_at: string;
}

export default function AdminPage() {
  const [siteId, setSiteId] = useState('my-shop');
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);
  const [savingNoteId, setSavingNoteId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null); // 복사 피드백용

  const fetchLeads = async () => {
    if (!siteId.trim()) return;
    setLoading(true);

    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .eq('site_id', siteId.trim().toLowerCase())
      .order('created_at', { ascending: false });

    if (error) {
      alert('데이터 조회 실패: ' + error.message);
    } else {
      const formatted = (data || []).map((item) => ({
        ...item,
        status: item.status || 'pending',
      }));
      setLeads(formatted);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleNoteChange = async (id: string, newNote: string) => {
    setLeads((prev) =>
      prev.map((item) => (item.id === id ? { ...item, note: newNote } : item))
    );

    setSavingNoteId(id);
    const { error } = await supabase
      .from('leads')
      .update({ note: newNote })
      .eq('id', id);

    if (error) alert('비고 저장 실패: ' + error.message);
    setSavingNoteId(null);
  };

  const toggleStatus = async (id: string, currentStatus: 'pending' | 'completed') => {
    const nextStatus = currentStatus === 'completed' ? 'pending' : 'completed';

    setLeads((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: nextStatus } : item))
    );

    const { error } = await supabase
      .from('leads')
      .update({ status: nextStatus })
      .eq('id', id);

    if (error) {
      alert('상태 변경 실패: ' + error.message);
      setLeads((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status: currentStatus } : item))
      );
    }
  };

  // 전화번호 원클릭 클립보드 복사
  const copyPhone = (id: string, phone: string) => {
    navigator.clipboard.writeText(phone);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const downloadCSV = () => {
    if (leads.length === 0) {
      alert('다운로드할 데이터가 없습니다.');
      return;
    }

    const headers = ['접수일시,성함,연락처,문의내용,관리자비고,상담상태'];
    const rows = leads.map((l) =>
      `"${new Date(l.created_at).toLocaleString()}","${l.name}","${l.phone}","${(l.message || '').replace(/"/g, '""')}","${(l.note || '').replace(/"/g, '""')}","${l.status === 'completed' ? '상담 완료' : '상담 대기'}"`
    );

    const csvContent = '\uFEFF' + [headers, ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${siteId}_신청자목록_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-10 font-sans text-slate-800">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* 상단 헤더 */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div>
            <h1 className="text-xl font-bold text-slate-900">상담 및 신청서 관리 센터</h1>
            <p className="text-xs text-slate-500 mt-1">
              접수된 고객 목록을 확인하고 번호를 복사하거나 진행 상태를 관리하세요.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center bg-slate-100 rounded-lg px-2 border border-slate-200 text-xs">
              <span className="text-slate-400">/p/</span>
              <input
                type="text"
                value={siteId}
                onChange={(e) => setSiteId(e.target.value)}
                placeholder="사이트 ID 입력"
                className="bg-transparent p-2 outline-none font-medium text-slate-800 w-28 sm:w-36"
              />
            </div>
            <button
              onClick={fetchLeads}
              disabled={loading}
              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition shrink-0"
            >
              {loading ? '조회 중...' : '조회'}
            </button>
          </div>
        </header>

        {/* 요약 바 & 다운로드 */}
        <div className="flex items-center justify-between bg-white px-6 py-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-sm space-x-3">
            <span>총 신청: <b className="text-slate-900">{leads.length}</b>건</span>
            <span className="text-red-500 font-bold">
              대기: {leads.filter((l) => l.status !== 'completed').length}건
            </span>
            <span className="text-blue-600 font-bold">
              완료: {leads.filter((l) => l.status === 'completed').length}건
            </span>
          </div>
          <button
            onClick={downloadCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition"
          >
            <span>📥</span> 엑셀(CSV) 다운로드
          </button>
        </div>

        {/* 테이블 */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100/75 border-b border-slate-200 text-slate-600 font-bold">
                  <th className="p-4">접수 일시</th>
                  <th className="p-4">성함</th>
                  <th className="p-4">연락처 (클릭 시 복사)</th>
                  <th className="p-4">문의 내용</th>
                  <th className="p-4 min-w-[180px]">비고 (관리자 메모)</th>
                  <th className="p-4 text-center">연결</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {leads.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-10 text-center text-slate-400">
                      {loading ? '데이터를 불러오는 중입니다...' : '아직 접수된 신청 내역이 없습니다.'}
                    </td>
                  </tr>
                ) : (
                  leads.map((lead) => {
                    const isCompleted = lead.status === 'completed';

                    return (
                      <tr key={lead.id} className="hover:bg-slate-50 transition">
                        <td className="p-4 text-slate-500 whitespace-nowrap">
                          {new Date(lead.created_at).toLocaleString('ko-KR', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </td>
                        <td className="p-4 font-bold text-slate-900 whitespace-nowrap">
                          {lead.name}
                        </td>

                        {/* 전화 걸기 대신 간편 복사 버튼 적용 */}
                        <td className="p-4 whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => copyPhone(lead.id, lead.phone)}
                            className="font-mono text-slate-800 hover:text-blue-600 bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded transition flex items-center gap-1.5 cursor-pointer"
                            title="클릭하여 번호 복사"
                          >
                            <span>{lead.phone}</span>
                            <span className="text-[10px] text-slate-400">
                              {copiedId === lead.id ? '✓ 복사됨!' : '📋'}
                            </span>
                          </button>
                        </td>

                        <td className="p-4 text-slate-600 min-w-[180px]">
                          {lead.message || <span className="text-slate-300">-</span>}
                        </td>
                        
                        {/* 비고란 */}
                        <td className="p-3">
                          <div className="relative">
                            <input
                              type="text"
                              value={lead.note || ''}
                              onChange={(e) => {
                                const val = e.target.value;
                                setLeads((prev) =>
                                  prev.map((item) =>
                                    item.id === lead.id ? { ...item, note: val } : item
                                  )
                                );
                              }}
                              onBlur={(e) => handleNoteChange(lead.id, e.target.value)}
                              placeholder="메모 입력"
                              className="w-full text-xs p-1.5 border border-slate-200 rounded outline-none focus:border-blue-500 bg-white"
                            />
                            {savingNoteId === lead.id && (
                              <span className="absolute right-2 top-2 text-[10px] text-blue-500 animate-pulse">
                                저장 중...
                              </span>
                            )}
                          </div>
                        </td>

                        {/* 연결 탭: 상담 상태 토글 버튼 */}
                        <td className="p-4 text-center whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => toggleStatus(lead.id, lead.status)}
                            className={`px-3 py-1.5 rounded-full font-bold text-[11px] transition shadow-xs cursor-pointer ${
                              isCompleted
                                ? 'bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-100'
                                : 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100'
                            }`}
                          >
                            {isCompleted ? '● 상담 완료' : '● 상담 대기'}
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}