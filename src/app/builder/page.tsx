'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { publishSite } from '@/utils/publishSite';
import { defaultB2BTemplate, B2BTemplateData } from '@/data/templates';
import EditorSidebar from '@/components/builder/EditorSidebar';
import LivePreview from '@/components/builder/LivePreview';

export default function BuilderPage() {
  const [siteId, setSiteId] = useState<string | null>(null);
  const [data, setData] = useState<B2BTemplateData>(() => defaultB2BTemplate);
  const [zoom, setZoom] = useState<number>(80);
  const [saving, setSaving] = useState(false);
  const [publishedUrl, setPublishedUrl] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const savedDraft = localStorage.getItem('thsoft_builder_draft');
    if (savedDraft) {
      try {
        const parsed = JSON.parse(savedDraft);
        if (parsed && typeof parsed === 'object') {
          setData(parsed);
        }
      } catch (e) {
        console.error('Draft load error:', e);
      }
    }

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

  const handleDataChange = (updater: any) => {
    setData((prev) => {
      const nextData = typeof updater === 'function' ? updater(prev) : updater;
      if (typeof window !== 'undefined') {
        localStorage.setItem('thsoft_builder_draft', JSON.stringify(nextData));
      }
      return nextData;
    });
  };

  const handlePublish = async () => {
    setSaving(true);
    try {
      const result = await publishSite(data, siteId);
      const targetId = (result as any)?.id || (result as any)?.siteId || siteId;
      if (targetId) {
        const viewUrl = `${window.location.origin}/p/${targetId}`;
        setPublishedUrl(viewUrl);
        alert('성공적으로 저장 및 발행되었습니다!');
      }
    } catch (err) {
      console.error(err);
      alert('발행 중 오류가 발생했습니다.');
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

      handleDataChange((prev: B2BTemplateData) => {
        if (targetKey === 'hero') {
          return {
            ...prev,
            hero: { ...prev.hero, mediaUrl: uploadedUrl, mediaType: 'image' },
          };
        } else if (targetKey === 'logo') {
          return {
            ...prev,
            company: { ...prev.company, logoUrl: uploadedUrl },
          };
        } else if (targetKey === 'solution' && typeof index === 'number') {
          const newSolutions = [...data.solutions];
          newSolutions[index] = { ...newSolutions[index], image: uploadedUrl };
          return { ...prev, solutions: newSolutions };
        }
        return prev;
      });
    } catch (error) {
      console.error('이미지 업로드 실패:', error);
      alert('이미지 업로드 중 오류가 발생했습니다.');
    } finally {
      setUploadingImage(false);
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-900 font-sans">
      <div className="w-[380px] h-full flex-shrink-0 border-r border-slate-800 bg-slate-950 overflow-y-auto">
        <EditorSidebar
          data={data}
          setData={handleDataChange}
          onPublish={handlePublish}
          saving={saving}
          setIsPaymentOpen={setIsPaymentOpen}
          uploadingImage={uploadingImage}
          handleImageUpload={handleImageUpload}
          onOpenPayment={() => setIsPaymentOpen(true)}
        />
      </div>

      <div className="flex-1 h-full overflow-y-auto bg-slate-800 flex justify-center items-start p-4 md:p-8">
        <div className="w-full max-w-5xl bg-white rounded-xl shadow-2xl overflow-hidden min-h-[800px]">
          <LivePreview data={data} zoom={zoom} setZoom={setZoom} />
        </div>
      </div>
    </div>
  );
}
