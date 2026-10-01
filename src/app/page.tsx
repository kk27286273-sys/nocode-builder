'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { publishSite } from '@/utils/publishSite';
import { useAutoSave } from '@/hooks/useAutoSave';
import { compressImage } from '@/utils/compressImage';
import { defaultB2BTemplate, B2BTemplateData } from '@/data/templates';
import EditorSidebar from '@/components/builder/EditorSidebar';
import LivePreview from '@/components/builder/LivePreview';

export default function BuilderPage() {
  const [siteId, setSiteId] = useState<string | null>(null);
  const [data, setData] = useState<B2BTemplateData>(() => ({
    ...defaultB2BTemplate,
    navigation: defaultB2BTemplate.navigation || { navLinks: [] },
    hero: defaultB2BTemplate.hero || { badge: '', title: '', subtitle: '', mediaUrl: '' },
    solutionsSection: defaultB2BTemplate.solutionsSection || { title: '', subtitle: '' },
    reviewsSection: defaultB2BTemplate.reviewsSection || { title: '', subtitle: '' },
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
        .select('content')
        .eq('id', id)
        .single()
        .then(({ data: record, error }) => {
          if (!error && record?.content) {
            setData((prev) => ({ ...prev, ...record.content }));
          }
        });
    }
  }, []);

  const { clearDraft, lastSavedTime } = useAutoSave(
    siteId,
    data,
    (restoredData) => setData(restoredData)
  );

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    targetKey: 'solution' | 'logo' | 'hero',
    index?: number
  ) => {
    const rawFile = e.target.files?.[0];
    if (!rawFile) return;

    try {
      setUploadingImage(true);
      const file = await compressImage(rawFile);
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.webp`;
      const filePath = `uploads/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file, { contentType: 'image/webp', upsert: true });

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

      const publicUrl = publicUrlData.publicUrl;

      if (targetKey === 'solution' && typeof index === 'number') {
        setData((prev) => {
          const nextSolutions = [...(prev.solutions || [])];
          nextSolutions[index] = { ...nextSolutions[index], image: publicUrl };
          return { ...prev, solutions: nextSolutions };
        });
      } else if (targetKey === 'logo') {
        setData((prev) => ({
          ...prev,
          company: { ...prev.company, logoUrl: publicUrl },
        }));
      } else if (targetKey === 'hero') {
        setData((prev) => ({
          ...prev,
          hero: { ...prev.hero, mediaType: 'image', mediaUrl: publicUrl },
        }));
      }
    } catch (err: any) {
      console.error('Image upload failed:', err);
      alert('이미지 업로드에 실패했습니다. Storage 설정을 확인하세요.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handlePublish = async () => {
    // 1. 버튼을 클릭하자마자 브라우저 차단 없이 빈 새 탭을 먼저 엽니다.
    const newWindow = window.open('about:blank', '_blank');
    if (newWindow) {
      newWindow.document.write('<div style="display:flex;justify-content:center;align-items:center;height:100vh;font-family:sans-serif;color:#475569;"><h2>사이트를 배포하고 있습니다. 잠시만 기다려주세요...</h2></div>');
    }

    setSaving(true);
    try {
      // 2. 서버에 데이터 저장 및 배포 수행
      const result = await publishSite(data, siteId);
      const targetId = result?.id || siteId;

      if (targetId) {
        const viewUrl = `${window.location.origin}/p/${targetId}`;
        setPublishedUrl(viewUrl);

        // 3. 배포가 완료되면 미리 열어둔 새 탭의 주소를 완성된 페이지로 변경합니다.
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
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gray-100 font-sans text-gray-900">
      <EditorSidebar
        data={data}
        setData={setData}
        uploadingImage={uploadingImage}
        handleImageUpload={handleImageUpload}
        publishedUrl={publishedUrl}
        lastSavedTime={lastSavedTime}
        saving={saving}
        siteId={siteId}
        onPublish={handlePublish}
        onOpenPayment={() => setIsPaymentOpen(true)}
      />

      <LivePreview data={data} zoom={zoom} setZoom={setZoom} />

      {/* 포트원 구독 결제 모달 */}
      {isPaymentOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl max-w-sm w-full p-6 text-center space-y-4">
            <h3 className="text-lg font-bold text-gray-900">웹사이트 관리 대행 구독</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              월 99,000원으로 고속 호스팅, 도메인 연결, 실시간 상담 알림 및 정기 유지보수를 지원합니다.
            </p>
            <div className="border-y py-3 text-xl font-extrabold text-blue-600">월 99,000원</div>
            <div className="flex gap-2">
              <button
                onClick={() => setIsPaymentOpen(false)}
                className="flex-1 py-2 text-xs font-semibold text-gray-700 bg-gray-100 rounded hover:bg-gray-200"
              >
                닫기
              </button>
              <button
                onClick={() => {
                  alert('포트원 정기 결제창을 호출합니다.');
                  setIsPaymentOpen(false);
                }}
                className="flex-1 py-2 text-xs font-semibold text-white bg-blue-600 rounded hover:bg-blue-700"
              >
                구독 결제하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}