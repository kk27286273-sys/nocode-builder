'use client';

import React from 'react';

export default function KakaoChatButton() {
  const CHAT_URL = "http://pf.kakao.com/_qxmixiX/chat";

  return (
    <a
      href={CHAT_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="카카오톡 상담하기"
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        backgroundColor: '#FEE500',
        color: '#191919',
        borderRadius: '50px',
        padding: '12px 20px',
        fontWeight: 'bold',
        fontSize: '15px',
        boxShadow: '0 4px 14px rgba(0,0,0,0.2)',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        zIndex: 9999,
        textDecoration: 'none',
        cursor: 'pointer',
        transition: 'transform 0.2s ease',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
      onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
    >
      <svg width="22" height="22" viewBox="0 0 24 24" fill="#191919">
        <path d="M12 3c-5.523 0-10 3.582-10 8 0 2.872 1.886 5.378 4.73 6.72-.206.776-.77 2.822-.884 3.26-.142.544.198.533.418.385.174-.116 2.705-1.84 3.793-2.583.633.084 1.282.118 1.943.118 5.523 0 10-3.582 10-8s-4.477-8-10-8z"/>
      </svg>
      <span>카톡 실시간 상담</span>
    </a>
  );
}