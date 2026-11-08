'use client';

import React, { useEffect, useRef, useState } from 'react';

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
  const inputRef = useRef<HTMLInputElement>(null);
  const requestRef = useRef<AbortController | null>(null);
  useEffect(() => () => requestRef.current?.abort(), []);

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
    const controller = new AbortController();
    requestRef.current = controller;

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('siteId', siteId);
      formData.append('purpose', purpose);

      const response = await fetch('/api/images/upload', {
        method: 'POST',
        body: formData,
        signal: controller.signal,
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

      if (!controller.signal.aborted) onChange(result);
    } catch (error) {
      if (controller.signal.aborted) return;
      setErrorMsg(
        error instanceof Error
          ? error.message
          : '이미지 업로드에 실패했습니다.',
      );
    } finally {
      if (!controller.signal.aborted) setIsUploading(false);
      if (requestRef.current === controller) requestRef.current = null;
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
        <input ref={inputRef} type="file" aria-label={label} accept="image/jpeg,image/png,image/webp,image/gif"
          disabled={isUploading} hidden onChange={handleUpload} />
        <button type="button" onClick={() => inputRef.current?.click()} disabled={isUploading || !siteId}
          aria-label={`${label} 파일 선택`}
          className="rounded bg-blue-600 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-blue-700 disabled:opacity-50">
          {isUploading ? '업로드 중…' : '파일 선택'}
        </button>

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

      {errorMsg && <p role="alert" className="text-[11px] text-rose-600">{errorMsg}</p>}
    </div>
  );
}
