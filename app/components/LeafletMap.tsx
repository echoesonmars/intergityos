'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Исправление иконок для Leaflet в Next.js
// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Динамический импорт для избежания SSR проблем
const MapContainer = dynamic(() => import('react-leaflet').then((mod) => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then((mod) => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then((mod) => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then((mod) => mod.Popup), { ssr: false });
const ZoomControl = dynamic(() => import('react-leaflet').then((mod) => mod.ZoomControl), { ssr: false });

interface MapDefect {
  id: string | number;
  lat: number;
  lng: number;
  criticality: 'normal' | 'medium' | 'high';
  severity: string;
  type: string;
  segment: number;
  pipeline: string;
}

const getCriticalityColor = (criticality: string) => {
  switch (criticality) {
    case 'high':
      return '#dc2626';
    case 'medium':
      return '#ffbd2e';
    case 'normal':
      return '#28ca42';
    default:
      return '#94B4C1';
  }
};

// Создание кастомных иконок маркеров
const createCustomIcon = (color: string) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        width: 32px;
        height: 32px;
        background-color: ${color};
        border: 3px solid white;
        border-radius: 50%;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="
          width: 12px;
          height: 12px;
          background-color: white;
          border-radius: 50%;
        "></div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
  });
};

interface LeafletMapProps {
  selectedMethod?: string;
  selectedCriticality?: string;
  height?: string;
  showLegend?: boolean;
}

export default function LeafletMap({ selectedMethod: _selectedMethod = 'all', selectedCriticality = 'all', height = '600px', showLegend = true }: LeafletMapProps) {
  // selectedMethod зарезервирован для будущей фильтрации по методам
  void _selectedMethod;
  const router = useRouter();
  const [defects, setDefects] = useState<MapDefect[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDefects = async () => {
      try {
        setIsLoading(true);
        const params = new URLSearchParams();
        if (selectedCriticality !== 'all') {
          params.append('criticality', selectedCriticality);
        }
        if (_selectedMethod !== 'all') {
          params.append('method', _selectedMethod);
        }

        const response = await fetch(`/api/map/defects?${params.toString()}`);
        if (response.ok) {
          const data = await response.json();
          setDefects(data);
        }
      } catch (error) {
        console.error('Error fetching map defects:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDefects();
  }, [selectedCriticality, _selectedMethod]);

  // Фильтрация объектов
  const filteredObjects = useMemo(() => {
    return defects.map((defect) => ({
      id: defect.id,
      name: `Сегмент ${defect.segment} - ${defect.type}`,
      lat: defect.lat,
      lon: defect.lng,
      pipeline: defect.pipeline,
      criticality: defect.criticality,
    }));
  }, [defects]);

  // Кастомные стили для карты
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .leaflet-container {
        font-family: var(--font-geist);
        background: var(--color-cream);
      }
      .leaflet-popup-content-wrapper {
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(33, 52, 72, 0.15);
      }
      .leaflet-popup-tip {
        box-shadow: 0 2px 4px rgba(33, 52, 72, 0.1);
      }
      .leaflet-control-zoom {
        border: none;
        box-shadow: 0 2px 8px rgba(33, 52, 72, 0.15);
      }
      .leaflet-control-zoom a {
        background-color: var(--color-white);
        color: var(--color-dark-blue);
        border: 1px solid var(--color-light-blue);
        font-weight: 600;
      }
      .leaflet-control-zoom a:hover {
        background-color: var(--color-cream);
      }
      .custom-marker {
        background: transparent !important;
        border: none !important;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  if (isLoading) {
    return (
      <div className="relative w-full rounded-lg overflow-hidden flex items-center justify-center" style={{ height, background: 'var(--color-cream)' }}>
        <div className="text-center">
          <p style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-blue)' }}>Загрузка карты...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full rounded-lg overflow-hidden" style={{ height }}>
      <MapContainer
        center={[48.0, 66.0]}
        zoom={6}
        minZoom={5}
        maxZoom={18}
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={19}
        />
        <ZoomControl position="topright" />
        
        {filteredObjects.map((obj) => {
          const iconColor = getCriticalityColor(obj.criticality);
          const customIcon = createCustomIcon(iconColor);
          
          return (
            <Marker
              key={obj.id}
              position={[obj.lat, obj.lon]}
              icon={customIcon}
            >
              <Popup
                closeButton={true}
                className="custom-popup"
                maxWidth={280}
              >
                <div className="min-w-[240px]" style={{ fontFamily: 'var(--font-geist)' }}>
                  <div className="font-semibold mb-2 text-base" style={{ color: 'var(--color-dark-blue)' }}>
                    {obj.name}
                  </div>
                  <div className="text-sm mb-2" style={{ color: 'var(--color-blue)' }}>
                    Магистраль: <span className="font-semibold">{obj.pipeline}</span>
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <span
                      className="inline-block px-2.5 py-1 rounded-md text-xs font-semibold text-white shadow-sm"
                      style={{ backgroundColor: iconColor }}
                    >
                      {obj.criticality === 'high' ? 'Высокая' : obj.criticality === 'medium' ? 'Средняя' : 'Норма'}
                    </span>
                    <span className="text-xs" style={{ color: 'var(--color-blue)' }}>
                      ID: {obj.id}
                    </span>
                  </div>
                  <button
                    onClick={() => router.push(`/app/object/${obj.id}`)}
                    className="w-full mt-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all hover:scale-105 hover:shadow-md"
                    style={{
                      backgroundColor: 'var(--color-dark-blue)',
                      color: 'var(--color-white)',
                      fontFamily: 'var(--font-geist)',
                    }}
                  >
                    Подробнее →
                  </button>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
      
      {/* Легенда */}
      {showLegend && (
      <div
        className="absolute bottom-4 left-4 z-[1000] p-4 rounded-lg shadow-lg"
        style={{
          background: 'var(--color-white)',
          border: '1px solid var(--color-light-blue)',
          fontFamily: 'var(--font-geist)',
        }}
      >
        <div className="text-sm font-semibold mb-2" style={{ color: 'var(--color-dark-blue)' }}>
          Критичность
        </div>
        <div className="space-y-1.5">
          {[
            { label: 'Норма', color: '#28ca42' },
            { label: 'Средняя', color: '#ffbd2e' },
            { label: 'Высокая', color: '#dc2626' },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              <div
                style={{
                  width: '16px',
                  height: '16px',
                  backgroundColor: item.color,
                  borderRadius: '50%',
                  border: '2px solid white',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                }}
              />
              <span className="text-xs" style={{ color: 'var(--color-dark-blue)' }}>
                {item.label}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-3 pt-3 border-t" style={{ borderColor: 'var(--color-light-blue)' }}>
          <div className="text-xs" style={{ color: 'var(--color-blue)' }}>
            Объектов: {filteredObjects.length}
          </div>
        </div>
      </div>
      )}
    </div>
  );
}

