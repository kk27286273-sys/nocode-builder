'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface LeadItem {
  id: string;
  created_at: string;
  name: string;
  phone: string;
  memo: string;
  status: string;
}

export default function AdminPage() {
  const [leads, setLeads] = useState<LeadItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchLeads = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLeads(data || []);
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleStatusToggle = async (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === '완료' ? '대기중' : '완료';
    const { error } = await supabase
      .from('leads')
      .update({ status: nextStatus })
      .eq('id', id);

    if (!error) {
      setLeads((prev) =>
        prev.map((lead) => (lead.id === id ? { ...lead, status: nextStatus } : lead))
      );
    }
  };

  // 리드 삭제 함수
  const handleDeleteLead = async (id: string, name: string) => {
    if (!confirm(`정말 '${name}' 님의 문의 내역을 삭제하시겠습니까?\n삭제 후에는 복구할 수 없습니다.`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('leads')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setLeads((prev) => prev.filter((lead) => lead.id !== id));
      alert('문의 내역이 삭제되었습니다.');
    } catch (err: any) {
      alert('삭제 실패: ' + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-6 md:p-10 font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-black text-slate-900">B2B 상담 접수 관리 대시보드</h1>
            <p className="text-xs text-slate-500 mt-1">인바운드로 유입된 잠재 고객 리드 및 견적 신청 목록입니다.</p>
          </div>
          <button
            onClick={fetchLeads}
            className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-lg text-xs font-semibold shadow-sm transition"
          >
            새로고침
          </button>
        </div>

        {errorMsg && (
          <div className="p-4 mb-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl">
            DB 조회 오류: {errorMsg}
          </div>
        )}

        {loading ? (
          <div className="p-12 text-center text-slate-400 text-sm bg-white rounded-xl border">
            데이터를 불러오는 중입니다...
          </div>
        ) : leads.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-xl border border-slate-200">
            <p className="text-slate-600 font-medium">아직 접수된 상담 내역이 없습니다.</p>
            <p className="text-xs text-slate-400 mt-1">발행된 웹사이트 견적 폼에서 테스트로 제출해 보세요.</p>
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <table className="w-full text-left border-collapse text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs">
                <tr>
                  <th className="py-3 px-4">접수 일시</th>
                  <th className="py-3 px-4">성함 / 담당자</th>
                  <th className="py-3 px-4">연락처</th>
                  <th className="py-3 px-4">문의 내용</th>
                  <th className="py-3 px-4 text-center">처리 상태</th>
                  <th className="py-3 px-4 text-center">관리</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 text-xs text-slate-400 whitespace-nowrap">
                      {new Date(lead.created_at).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-800">{lead.name}</td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(lead.phone);
                          alert('연락처가 복사되었습니다: ' + lead.phone);
                        }}
                        title="클릭하여 복사"
                        className="text-blue-600 font-mono text-xs hover:underline"
                      >
                        {lead.phone}
                      </button>
                    </td>
                    <td className="py-3 px-4 text-slate-600 max-w-xs truncate" title={lead.memo}>
                      {lead.memo || '-'}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => handleStatusToggle(lead.id, lead.status)}
                        className={`text-xs px-2.5 py-1 rounded-full font-bold transition ${
                          lead.status === '완료'
                            ? 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                            : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                        }`}
                      >
                        {lead.status || '대기중'}
                      </button>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => handleDeleteLead(lead.id, lead.name)}
                        className="text-xs text-red-600 hover:text-red-800 font-semibold px-2 py-1 rounded border border-red-200 hover:bg-red-50 transition"
                      >
                        삭제
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}