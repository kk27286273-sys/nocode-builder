'use client';

import React, { useState } from 'react';
import imageCompression from 'browser-image-compression';
import { supabase } from '@/lib/supabase/client';

const IMAGE_BUCKET = 'site-images';
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const MAX_LOGO_SIZE = 100 * 1024;
const LOGO_MAX_DIMENSION = 512;

interface ImageUploadFieldProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  siteId?: string | null;
  purpose?: 'logo' | 'general' | 'solution';
}

export default function ImageUploadField({
  label,
  value,
  onChange,
  siteId,
  purpose = 'general',
}: ImageUploadFieldProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMsg('');

    const input = e.currentTarget;
    const file = input.files?.[0];
    if (!file) return;

    if (!siteId) {
      setErrorMsg('사이트 ID가 확인되지 않아 업로드할 수 없습니다.');
      input.value = '';
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      setErrorMsg('JPG, PNG, WebP, GIF 파일만 가능합니다.');
      input.value = '';
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setErrorMsg('이미지는 10MB 이하만 가능합니다.');
      input.value = '';
      return;
    }

    setIsUploading(true);

    try {
      const isGif = file.type === 'image/gif';
      const isLogo = purpose === 'logo';
      const isSolution = purpose === 'solution';

      let uploadFile: File | Blob = file;

      if (!isGif) {
        uploadFile = await imageCompression(file, {
          maxSizeMB: isLogo
            ? MAX_LOGO_SIZE / (1024 * 1024)
            : isSolution
              ? 0.25
              : 0.5,
          maxWidthOrHeight: isLogo
            ? LOGO_MAX_DIMENSION
            : isSolution
              ? 640
              : 1920,
          useWebWorker: true,
          fileType: 'image/webp',
          initialQuality: 0.82,
        });

        if (uploadFile.type !== 'image/webp') {
          throw new Error('이미지를 WebP 형식으로 변환하지 못했습니다.');
        }

        if (isLogo && uploadFile.size > MAX_LOGO_SIZE) {
          throw new Error(
            '로고를 100KB 이하로 압축하지 못했습니다. 더 작은 이미지로 다시 시도해 주세요.',
          );
        }
      }

      const safeSiteId = String(siteId).replace(/[^a-zA-Z0-9_-]/g, '');
      if (!safeSiteId) {
        throw new Error('사이트 ID 형식이 올바르지 않습니다.');
      }

      const extension = uploadFile.type === 'image/webp' ? 'webp' : 'gif';
      const filePath = `${safeSiteId}/${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 8)}.${extension}`;

      const { error: uploadError } = await supabase.storage
        .from(IMAGE_BUCKET)
        .upload(filePath, uploadFile, {
          cacheControl: '31536000',
          upsert: false,
          contentType: uploadFile.type,
        });

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from(IMAGE_BUCKET)
        .getPublicUrl(filePath);

      if (!publicUrlData?.publicUrl) {
        throw new Error('공개 URL 생성에 실패했습니다.');
      }

      onChange(publicUrlData.publicUrl);
    } catch (err: unknown) {
      setErrorMsg(
        err instanceof Error ? err.message : '이미지 업로드에 실패했습니다.',
      );
    } finally {
      setIsUploading(false);
      input.value = '';
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-[11px] font-medium text-slate-500">
        {label}
      </label>

      {value ? (
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
          <img
            src={value}
            alt={label}
            width={320}
            height={160}
            className="max-h-40 w-full object-contain"
          />
        </div>
      ) : (
        <div className="flex h-20 items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 text-xs text-slate-400">
          등록된 이미지가 없습니다
        </div>
      )}

      <div className="flex items-center gap-2">
        <label className="cursor-pointer rounded bg-blue-600 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-blue-700">
          {isUploading
            ? '업로드 중…'
            : value
              ? '이미지 변경'
              : '이미지 업로드'}
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