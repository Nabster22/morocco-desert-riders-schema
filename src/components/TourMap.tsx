import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

interface TourMapProps {
  lat?: number;
  lng?: number;
  zoom?: number;
  markers?: Array<{
    lat: number;
    lng: number;
    title: string;
    description?: string;
  }>;
  className?: string;
}

// Morocco city coordinates
export const cityCoordinates: Record<string, { lat: number; lng: number }> = {
  Agadir: { lat: 30.4278, lng: -9.5981 },
  Dakhla: { lat: 23.6848, lng: -15.958 },
  Erfoud: { lat: 31.4314, lng: -4.2286 },
  Marrakech: { lat: 31.6295, lng: -7.9811 },
};

const TourMap = ({
  lat = 31.7917,
  lng = -7.0926,
  zoom = 6,
  markers = [],
  className = 'h-[400px] w-full rounded-xl',
}: TourMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Initialize map
    mapInstanceRef.current = L.map(mapRef.current).setView([lat, lng], zoom);

    // Add tile layer with custom styling
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(mapInstanceRef.current);

    // Add markers
    markers.forEach((marker) => {
      if (mapInstanceRef.current) {
        const leafletMarker = L.marker([marker.lat, marker.lng]).addTo(mapInstanceRef.current);
        if (marker.title) {
          leafletMarker.bindPopup(`
            <div class="font-sans">
              <h3 class="font-semibold text-sm">${marker.title}</h3>
              ${marker.description ? `<p class="text-xs text-gray-600 mt-1">${marker.description}</p>` : ''}
            </div>
          `);
        }
      }
    });

    // Cleanup
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [lat, lng, zoom, markers]);

  return <div ref={mapRef} className={className} />;
};

export default TourMap;
