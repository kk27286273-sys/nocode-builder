'use client';

import React, { useState } from 'react';

interface ImageUploadResult {
  url: string;
  srcSet: string | null;
  width: number | null;
  height: number | null;
}

interface ImageUploadFieldProps {
  label: string;
  value: string;
  onChange: (result: ImageUploadResult | null) => void;
  siteId?: string | null;
  purpose?: 'logo' | 'general' | 'solution';
}

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
];

export default function ImageUploadField({
  label,
  value,
  onChange,
  siteId,
  purpose = 'general',
}: ImageUploadFieldProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMsg('');

    const input = event.currentTarget;
    const file = input.files?.[0];
    if (!file) return;

    if (!siteId) {
      setErrorMsg('사이트 ID가 없어 업로드할 수 없습니다.');
      input.value = '';
      return;
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      setErrorMsg('JPG, PNG, WebP, GIF 파일만 업로드할 수 있습니다.');
      input.value = '';
      return;
    }

    if (file.size <= 0 || file.size > MAX_FILE_SIZE) {
      setErrorMsg('이미지는 10MB 이하만 업로드할 수 있습니다.');
      input.value = '';
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('siteId', siteId);
      formData.append('purpose', purpose);

      const response = await fetch('/api/images/upload', {
        method: 'POST',
        body: formData,
      });

      const result = (await response.json()) as
        | ImageUploadResult
        | { error?: string };

      if (!response.ok || !('url' in result) || !result.url) {
        throw new Error(
          'error' in result && result.error
            ? result.error
            : '이미지 업로드에 실패했습니다.',
        );
      }

      onChange(result);
    } catch (error) {
      setErrorMsg(
        error instanceof Error
          ? error.message
          : '이미지 업로드에 실패했습니다.',
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
          등록된 이미지가 없습니다.
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
            onClick={() => onChange(null)}
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