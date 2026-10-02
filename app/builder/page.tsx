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
    setSaving(true);
    try {
      const result = await publishSite(data, siteId);
      const targetId = (result as any)?.id || (result as any)?.siteId || siteId;
      if (targetId) {
        alert('성공적으로 저장 및 발행되었습니다!');
      }
    } catch (err) {
      console.error(err);
      alert('발행 중 오류가 발생했습니다.');
    } finally {
      setSaving(false);
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
        handleImageUpload={() => {}}
        onOpenPayment={() => setIsPaymentOpen(true)}
      />
      <LivePreview data={data} zoom={zoom} setZoom={setZoom} />
    </div>
  );
}
