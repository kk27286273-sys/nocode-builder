'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { publishSite } from '@/utils/publishSite';
import { defaultB2BTemplate, B2BTemplateData } from '@/data/templates';
import EditorSidebar from '@/components/builder/EditorSidebar';
import LivePreview from '@/components/builder/LivePreview';

export default function BuilderPage() {
  const [siteId, setSiteId] = useState<string | null>(null);
  const [data, setData] = useState<B2BTemplateData>(() => ({
    ...defaultB2BTemplate,
    navigation: defaultB2BTemplate.navigation || { navLinks: [] },
    hero: defaultB2BTemplate.hero || {
      badge: '',
      title: '',
      subtitle: '',
      mediaUrl: '',
    },
    solutionsSection: defaultB2BTemplate.solutionsSection || {
      title: '',
      subtitle: '',
    },
    reviewsSection: defaultB2BTemplate.reviewsSection || {
      title: '',
      subtitle: '',
    },
    stats: defaultB2BTemplate?.stats || [],
    solutions: defaultB2BTemplate?.solutions || [],
    reviews: defaultB2BTemplate?.reviews || [],
    faqs: defaultB2BTemplate?.faqs || [],
  }));

  const [zoom, setZoom] = useState<number>(80);
  const [saving, setSaving] = useState(false);
  const [publishedUrl, setPublishedUrl] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const id = params.get('siteId');
    if (id) {
      setSiteId(id);
      setPublishedUrl(`${window.location.origin}/p/${id}`);
      supabase
        .from('sites')
        .select('data')
        .eq('id', id)
        .single()
        .then(({ data: siteRecord, error }) => {
          if (!error && siteRecord?.data) {
            setData(siteRecord.data);
          }
        });
    }
  }, []);

  const handlePublish = async () => {
    const newWindow = window.open('about:blank', '_blank');
    if (newWindow) {
      newWindow.document.write(
        '<div style="display:flex;justify-content:center;align-items:center;height:100vh;font-family:sans-serif;color:#475569;"><h2>사이트를 배포하고 있습니다. 잠시만 기다려주세요...</h2></div>'
      );
    }

    setSaving(true);
    try {
      const result = await publishSite(data, siteId);
      const targetId =
        (result as any)?.id || (result as any)?.siteId || siteId;

      if (targetId) {
        const viewUrl = `${window.location.origin}/p/${targetId}`;
        setPublishedUrl(viewUrl);

        if (newWindow) {
          newWindow.location.href = viewUrl;
        }
      } else {
        if (newWindow) newWindow.close();
        alert('사이트 발행 중 식별자(ID)를 찾을 수 없습니다.');
      }
    } catch (err) {
      console.error(err);
      if (newWindow) newWindow.close();
      alert('사이트 발행 중 오류가 발생했습니다.');
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    targetKey: 'hero' | 'logo' | 'solution',
    index?: number
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `uploads/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('site-assets')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from('site-assets')
        .getPublicUrl(filePath);

      const uploadedUrl = publicUrlData.publicUrl;

      if (targetKey === 'hero') {
        setData((prev) => ({
          ...prev,
          hero: { ...prev.hero, mediaUrl: uploadedUrl, mediaType: 'image' },
        }));
      } else if (targetKey === 'logo') {
        setData((prev) => ({
          ...prev,
          company: { ...prev.company, logoUrl: uploadedUrl },
        }));
      } else if (targetKey === 'solution' && typeof index === 'number') {
        const newSolutions = [...data.solutions];
        newSolutions[index].image = uploadedUrl;
        setData((prev) => ({ ...prev, solutions: newSolutions }));
      }
    } catch (error) {
      console.error('이미지 업로드 실패:', error);
      alert('이미지 업로드 중 오류가 발생했습니다.');
    } finally {
      setUploadingImage(false);
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-100 font-sans">
      <EditorSidebar
        data={data}
        setData={setData}
        onPublish={handlePublish}
        saving={saving}
        setIsPaymentOpen={setIsPaymentOpen}
        uploadingImage={uploadingImage}
        handleImageUpload={handleImageUpload}
        onOpenPayment={() => setIsPaymentOpen(true)}
      />

      <LivePreview data={data} zoom={zoom} setZoom={setZoom} />

      {/* 결제 모달 (선택 사항) */}
      {isPaymentOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-slate-900">
              제작 대행 및 정기 관리 신청
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              스탠다드(원페이지): 제작비 50만 원 / 월 관리비 49,900원
              <br />
              프로(멀티페이지): 제작비 80만 원 / 월 관리비 79,900원
            </p>
            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => setIsPaymentOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200"
              >
                닫기
              </button>
              <button
                onClick={() => {
                  alert(
                    '결제 및 전자세금계산서 발행은 고객센터(010-0000-0000)로 문의하시면 즉시 처리해 드립니다.'
                  );
                  setIsPaymentOpen(false);
                }}
                className="px-4 py-2 text-xs font-bold text-white bg-sky-600 rounded-lg hover:bg-sky-700"
              >
                상담 진행
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}