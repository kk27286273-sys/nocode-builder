'use client';

import { useEffect, useRef, useState } from 'react';
import Script from 'next/script';

interface NaverAddressMapProps {
  address?: string;
  mapUrl?: string;
  title?: string;
}

declare global {
  interface Window {
    naver: any;
  }
}

export default function NaverAddressMap({
  address,
  mapUrl,
  title = '오시는 길',
}: NaverAddressMapProps) {
  const mapElementRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);

  const [apiReady, setApiReady] = useState(false);
  const [mapError, setMapError] = useState('');

  const clientId = process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID;

  useEffect(() => {
    if (!apiReady || !address || !mapElementRef.current || !window.naver) {
      return;
    }

    const maps = window.naver.maps;

    setMapError('');

    maps.Service.geocode(
      {
        query: address,
      },
      (status: any, response: any) => {
        if (status !== maps.Service.Status.OK) {
          setMapError('입력한 주소의 위치를 찾을 수 없습니다.');
          return;
        }

        const items = response?.v2?.addresses || [];

        if (items.length === 0) {
          setMapError('입력한 주소의 위치를 찾을 수 없습니다.');
          return;
        }

        const firstAddress = items[0];

        const latitude = Number(firstAddress.y);
        const longitude = Number(firstAddress.x);

        const position = new maps.LatLng(latitude, longitude);

        if (!mapRef.current) {
          mapRef.current = new maps.Map(mapElementRef.current, {
            center: position,
            zoom: 16,
            zoomControl: true,
            zoomControlOptions: {
              position: maps.Position.RIGHT_CENTER,
            },
            mapTypeControl: true,
          });
        } else {
          mapRef.current.setCenter(position);
          mapRef.current.setZoom(16);
        }

        if (markerRef.current) {
          markerRef.current.setMap(null);
        }

        markerRef.current = new maps.Marker({
          position,
          map: mapRef.current,
          title: address,
        });
      },
    );
  }, [apiReady, address]);

  if (!address) {
    return null;
  }

  if (!clientId) {
    return (
      <section className="mt-12 rounded-3xl border border-slate-200 bg-slate-50 p-6">
        <h3 className="mb-3 text-xl font-bold text-slate-900">{title}</h3>
        <p className="text-sm text-slate-600">
          {address}
        </p>
        <p className="mt-3 text-xs text-red-500">
          네이버 지도 API 키가 설정되지 않았습니다.
        </p>
      </section>
    );
  }

  return (
    <>
      <Script
        src={`https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${clientId}&submodules=geocoder`}
        strategy="afterInteractive"
        onLoad={() => setApiReady(true)}
        onError={() => setMapError('네이버 지도를 불러오지 못했습니다.')}
      />

      <section className="mt-12 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm md:p-6">
        <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-blue-600">
              Location
            </p>
            <h3 className="text-2xl font-bold text-slate-900">{title}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              {address}
            </p>
          </div>

          {mapUrl && (
            <a
              href={mapUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex w-fit rounded-lg bg-green-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-green-700"
            >
              네이버 지도에서 열기
            </a>
          )}
        </div>

        <div
          ref={mapElementRef}
          className="h-[320px] w-full overflow-hidden rounded-2xl bg-slate-100 md:h-[420px]"
        />

        {mapError && (
          <p className="mt-3 text-sm text-red-500">
            {mapError}
          </p>
        )}
      </section>
    </>
  );
}