'use client';

import React, { useState } from 'react';
import { supabase } from '@/lib/supabase/client';

const IMAGE_BUCKET = 'site-images';

interface ImageUploadFieldProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  siteId?: string | null;
}

export default function ImageUploadField({
  label,
  value,
  onChange,
  siteId,
}: ImageUploadFieldProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMsg('');
    const file = e.target.files?.[0];
    if (!file) return;

    if (!siteId) {
      setErrorMsg('사이트 ID가 확인되지 않아 업로드할 수 없습니다.');
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      setErrorMsg('JPG, PNG, WebP, GIF 파일만 가능합니다.');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setErrorMsg('이미지는 10MB 이하만 가능합니다.');
      return;
    }

    setIsUploading(true);
    try {
      const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
      const safeSiteId = String(siteId).replace(/[^a-zA-Z0-9_-]/g, '');
      const filePath = `${safeSiteId}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from(IMAGE_BUCKET)
        .upload(filePath, file, { cacheControl: '3600', upsert: false, contentType: file.type });

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from(IMAGE_BUCKET)
        .getPublicUrl(filePath);

      if (!publicUrlData?.publicUrl) throw new Error('공개 URL 생성 실패');

      onChange(publicUrlData.publicUrl);
    } catch (err: any) {
      setErrorMsg(err.message || '업로드에 실패했습니다.');
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-[11px] font-medium text-slate-500">{label}</label>

      {value ? (
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
          <img src={value} alt={label} className="max-h-40 w-full object-contain" />
        </div>
      ) : (
        <div className="flex h-20 items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 text-xs text-slate-400">
          등록된 이미지가 없습니다
        </div>
      )}

      <div className="flex items-center gap-2">
        <label className="cursor-pointer rounded bg-blue-600 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-blue-700">
          {isUploading ? '업로드 중…' : value ? '이미지 변경' : '이미지 업로드'}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            disabled={isUploading}
            className="hidden"
            onChange={handleUpload}
          />
        </label>
        {value && (
          <button
            type="button"
            onClick={() => onChange('')}
            disabled={isUploading}
            className="rounded border border-slate-300 px-3 py-1.5 text-xs font-bold text-slate-600 transition hover:text-rose-600"
          >
            삭제
          </button>
        )}
      </div>

      {errorMsg && <p className="text-[11px] text-rose-600">{errorMsg}</p>}
    </div>
  );
}