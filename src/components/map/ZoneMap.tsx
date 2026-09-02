import { useEffect, useRef, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import type { Zone } from '~/lib/indicators/types';

interface Props {
  zones: Zone[];
  selected: [string | null, string | null];
  onSelect: (zoneId: string) => void;
  height?: number;
}

const COLORS = {
  primary: '#0071e3',
  secondary: '#e30613',
  idle: '#8c949c',
};

/**
 * Mapa de zonas. Leaflet se importa dinámicamente dentro del efecto para que el
 * componente pueda renderizarse en el servidor sin tocar `window`.
 * Si los tiles no cargan, el resto de la interfaz sigue siendo utilizable.
 */
export default function ZoneMap({ zones, selected, onSelect, height = 320 }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const layerRef = useRef<any>(null);
  const leafletRef = useRef<any>(null);
  const onSelectRef = useRef(onSelect);
  const [failed, setFailed] = useState(false);

  onSelectRef.current = onSelect;

  // Inicialización (una sola vez)
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const L = (await import('leaflet')).default;
        if (cancelled || !containerRef.current || mapRef.current) return;

        leafletRef.current = L;
        const map = L.map(containerRef.current, { scrollWheelZoom: false }).setView(
          [41.65, -0.89],
          8,
        );
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 18,
          attribution: '© OpenStreetMap',
        }).addTo(map);
        mapRef.current = map;
        layerRef.current = L.layerGroup().addTo(map);
        setFailed(false);
        // El contenedor puede montarse oculto: forzamos el recálculo de tamaño.
        setTimeout(() => map.invalidateSize(), 60);
      } catch {
        if (!cancelled) setFailed(true);
      }
    })();

    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  // Pintado de marcadores cada vez que cambia la selección
  useEffect(() => {
    const L = leafletRef.current;
    const map = mapRef.current;
    const layer = layerRef.current;
    if (!L || !map || !layer) return;

    layer.clearLayers();
    const [a, b] = selected;

    for (const zone of zones) {
      const isA = zone.id === a;
      const isB = zone.id === b;
      const color = isA ? COLORS.primary : isB ? COLORS.secondary : COLORS.idle;
      const marker = L.circleMarker(zone.center, {
        radius: isA || isB ? 11 : 6,
        color: '#fff',
        weight: 2,
        fillColor: color,
        fillOpacity: isA || isB ? 1 : 0.6,
      });
      marker.bindTooltip(zone.name, { direction: 'top' });
      marker.on('click', () => onSelectRef.current(zone.id));
      marker.addTo(layer);
    }

    const focus = zones.filter((z) => z.id === a || z.id === b);
    if (focus.length === 1) {
      map.setView(focus[0]!.center, 12, { animate: true });
    } else if (focus.length > 1) {
      map.fitBounds(
        L.latLngBounds(focus.map((z) => z.center)),
        { padding: [50, 50], maxZoom: 12 },
      );
    }
  }, [zones, selected]);

  if (failed) {
    return (
      <div
        className="card grid place-items-center p-4 text-center text-sm text-ink-soft"
        style={{ height }}
      >
        No se ha podido cargar el mapa. Los datos de la zona siguen disponibles más abajo.
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      style={{ height }}
      className="w-full overflow-hidden rounded-card border border-line"
      role="application"
      aria-label="Mapa de zonas disponibles"
    />
  );
}
