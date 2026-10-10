'use client';

import React from 'react';

export const InputField = ({
  label,
  value,
  onChange,
  type = 'text',
  placeholder = '',
}: {
  label: string;
  value: any;
  onChange: (val: string) => void;
  type?: string;
  placeholder?: string;
}) => (
  <div className="space-y-1">
    <label className="text-[11px] font-medium text-slate-500">{label}</label>
    <input
      type={type}
      value={value ?? ''}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full rounded border border-slate-200 bg-white p-2 text-xs outline-none focus:ring-1 focus:ring-blue-500"
    />
  </div>
);

export const TextAreaField = ({
  label,
  value,
  onChange,
  placeholder = '',
  h = 'h-20',
}: {
  label: string;
  value: any;
  onChange: (val: string) => void;
  placeholder?: string;
  h?: string;
}) => (
  <div className="space-y-1">
    <label className="text-[11px] font-medium text-slate-500">{label}</label>
    <textarea
      value={value ?? ''}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`w-full ${h} resize-y rounded border border-slate-200 bg-white p-2 text-xs outline-none focus:ring-1 focus:ring-blue-500`}
    />
  </div>
);