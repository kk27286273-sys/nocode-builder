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
  const [zoom, setZoom] = useState<number>(100);
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

      <div className="flex-1 h-full overflow-y-auto">
        <LivePreview data={data} zoom={zoom} setZoom={setZoom} />
      </div>
    </div>
  );
}