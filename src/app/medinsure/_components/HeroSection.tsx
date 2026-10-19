'use client';

import React from 'react';

export default function HeroSection() {
  return (
    <>
      <section className="cta-section relative flex h-screen w-full items-center justify-center overflow-hidden px-5 py-[100px] text-center font-poppins">
        {/* 배경 이미지 + 줌 애니메이션 */}
        <div
          className="absolute inset-0 h-[120%] w-[120%]"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?auto=format&fit=crop&w=1600&q=80')`,
            backgroundPosition: 'center center',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            animation: 'zoom-bg 15s ease-in-out infinite alternate',
            zIndex: 0,
          }}
        />

        {/* 어두운 오버레이 */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(135deg, rgba(4, 30, 56, 0.82), rgba(2, 44, 74, 0.88))',
            zIndex: 1,
          }}
        />

        {/* 콘텐츠 */}
        <div
          className="cta-content relative z-20 max-w-2xl"
          style={{
            animation: 'fadeInUp 1s ease forwards',
          }}
        >
          <span
            className="inline-block mb-6 px-4.5 py-1.75 border border-white border-opacity-45 rounded-full text-xs font-semibold tracking-widest"
            style={{
              animation: 'fadeInDown 1s ease forwards 0.1s',
              opacity: 0,
            }}
          >
            MEDINSURE
          </span>

          <h2
            className="mb-5 text-5xl font-bold text-white"
            style={{
              animation: 'fadeInDown 1s ease forwards 0.3s',
              opacity: 0,
            }}
          >
            당신의 보험, 더 똑똑하게
          </h2>

          <p
            className="mb-10 text-lg font-normal text-blue-100"
            style={{
              animation: 'fadeInDown 1s ease forwards 0.5s',
              opacity: 0,
            }}
          >
            5년 진료기록 기반 보장분석으로 놓친 보험금을 찾아드립니다
          </p>

          <div
            className="flex gap-3.5 justify-center flex-wrap"
            style={{
              animation: 'fadeInUp 1s ease forwards 0.8s',
              opacity: 0,
            }}
          >
            <button
              className="inline-block rounded-full px-8 py-3.5 font-semibold text-white transition-all hover:scale-105"
              style={{
                background: '#1d7fd4',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.filter = 'brightness(1.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.filter = 'brightness(1)';
              }}
            >
              무료로 분석받기
            </button>
            <button
              className="inline-block rounded-full px-8 py-3.5 font-semibold text-white border border-white border-opacity-60 transition-all hover:scale-105 hover:bg-white hover:bg-opacity-10"
            >
              서비스 알아보기
            </button>
          </div>
        </div>

        {/* 스크롤 인디케이터 */}
        <div
          className="absolute bottom-8.5 left-1/2 z-20 flex flex-col items-center gap-2 text-xs tracking-widest text-white text-opacity-75"
          style={{
            transform: 'translateX(-50%)',
            animation: 'fadeInUp 1s ease forwards 1.3s',
            opacity: 0,
          }}
        >
          <span
            style={{
              width: '1px',
              height: '42px',
              background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0))',
              animation: 'scroll-line 1.8s ease-in-out infinite',
            }}
          />
          SCROLL
        </div>
      </section>

      <style>{`
        @import url("https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap");

        .font-poppins {
          font-family: "Poppins", "Noto Sans KR", sans-serif;
        }

        @keyframes fadeInUp {
          0% {
            opacity: 0;
            transform: translateY(30px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInDown {
          0% {
            opacity: 0;
            transform: translateY(-30px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes zoom-bg {
          0% {
            transform: scale(1);
          }
          100% {
            transform: scale(1.08);
          }
        }

        @keyframes scroll-line {
          0% {
            opacity: 0.2;
            transform: scaleY(0.4);
            transform-origin: top;
          }
          50% {
            opacity: 1;
            transform: scaleY(1);
            transform-origin: top;
          }
          100% {
            opacity: 0.2;
            transform: scaleY(0.4);
            transform-origin: top;
          }
        }

        @media (max-width: 768px) {
          .cta-content h2 {
            font-size: 30px;
          }

          .cta-content p {
            font-size: 16px;
          }

          button {
            width: 100%;
            max-width: 280px;
          }
        }
      `}</style>
    </>
  );
}