'use client';

import { useRouter } from 'next/navigation';
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

// Mock данные объектов
const mockObjects = [
  { id: 1, name: 'Кран подвесной', lat: 52.96, lon: 63.12, pipeline: 'MT-02', criticality: 'medium' },
  { id: 2, name: 'Турбокомпрессор ТВ-80-1', lat: 49.80, lon: 73.10, pipeline: 'MT-02', criticality: 'normal' },
  { id: 3, name: 'Участок трубы №45', lat: 51.16, lon: 71.47, pipeline: 'MT-01', criticality: 'high' },
  { id: 4, name: 'Кран шаровой', lat: 43.22, lon: 76.85, pipeline: 'MT-03', criticality: 'normal' },
  { id: 5, name: 'Компрессорная станция №2', lat: 50.28, lon: 57.21, pipeline: 'MT-01', criticality: 'medium' },
];

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

export default function LeafletMap() {
  const router = useRouter();
  
  return (
    <div className="w-full h-[600px] rounded-lg overflow-hidden">
      <MapContainer
        center={[48.0, 66.0]}
        zoom={6}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {mockObjects.map((obj) => (
          <Marker
            key={obj.id}
            position={[obj.lat, obj.lon]}
          >
            <Popup>
              <div style={{ fontFamily: 'var(--font-geist)' }}>
                <div className="font-semibold mb-1" style={{ color: 'var(--color-dark-blue)' }}>
                  {obj.name}
                </div>
                <div className="text-sm mb-2" style={{ color: 'var(--color-blue)' }}>
                  Магистраль: {obj.pipeline}
                </div>
                <div className="text-sm mb-2">
                  <span
                    className="inline-block px-2 py-1 rounded text-xs text-white"
                    style={{ backgroundColor: getCriticalityColor(obj.criticality) }}
                  >
                    {obj.criticality === 'high' ? 'Высокая' : obj.criticality === 'medium' ? 'Средняя' : 'Норма'}
                  </span>
                </div>
                <button
                  onClick={() => router.push(`/app/object/${obj.id}`)}
                  className="w-full mt-2 px-3 py-1 rounded text-xs font-semibold transition-colors hover:opacity-80"
                  style={{
                    backgroundColor: 'var(--color-dark-blue)',
                    color: 'var(--color-white)',
                    fontFamily: 'var(--font-geist)',
                  }}
                >
                  Подробнее
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

