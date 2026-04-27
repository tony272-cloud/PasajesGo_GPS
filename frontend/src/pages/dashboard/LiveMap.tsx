import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { socketService } from '../../services/socket.service';
import './LiveMap.css';

// Fix Leaflet default icon path issues in React
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface BusLocation {
  busId: string;
  lat: number;
  lng: number;
  speed: number;
  heading: number;
  ts: string;
}

// Custom Bus Icon Creator
const createBusIcon = (heading: number, isMoving: boolean) => {
  const color = isMoving ? '#10B981' : '#F59E0B'; // Green if moving, Yellow if stopped
  
  // Create a circular marker with a Bus SVG inside
  // We use a small arrow on the edge to indicate heading
  const html = `
    <div style="
      width: 36px; 
      height: 36px; 
      background-color: ${color}; 
      border: 3px solid white; 
      border-radius: 50%; 
      display: flex; 
      align-items: center; 
      justify-content: center;
      box-shadow: 0 4px 6px rgba(0,0,0,0.3);
    ">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M8 6v6"/><path d="M15 6v6"/><path d="M2 12h19.6"/><path d="M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.4-.1-.8-.2-1.2l-1.4-5C20.1 6.8 19.1 6 18 6H4a2 2 0 0 0-2 2v10h3"/><circle cx="7" cy="18" r="2"/><path d="M9 18h5"/><circle cx="16" cy="18" r="2"/>
      </svg>
    </div>
  `;
  
  return L.divIcon({
    html,
    className: '',
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -18],
  });
};

export default function LiveMap() {
  const [buses, setBuses] = useState<{ [key: string]: BusLocation }>({});
  const [stats, setStats] = useState({ active: 0, moving: 0, stopped: 0 });

  // 1. Load Initial Data & WebSockets
  useEffect(() => {
    socketService.on('bus:position', (data: BusLocation) => {
      setBuses((prev) => ({
        ...prev,
        [data.busId]: data,
      }));
    });

    return () => {
      socketService.off('bus:position');
    };
  }, []);

  // 2. Update Stats
  useEffect(() => {
    let movingCount = 0;
    Object.values(buses).forEach((bus) => {
      if (bus.speed > 0) movingCount++;
    });

    setStats({
      active: Object.keys(buses).length,
      moving: movingCount,
      stopped: Object.keys(buses).length - movingCount,
    });
  }, [buses]);

  return (
    <div className="map-container">
      <MapContainer 
        center={[-13.531950, -71.967463]} 
        zoom={14} 
        style={{ height: '100%', width: '100%', minHeight: 'calc(100vh - 64px)' }}
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />

        {Object.values(buses).map((bus) => (
          <Marker 
            key={bus.busId} 
            position={[bus.lat, bus.lng]} 
            icon={createBusIcon(bus.heading, bus.speed > 0)}
          >
            <Popup className="glass-popup">
              <div style={{ color: 'black', padding: '5px' }}>
                <strong>Bus ID: {bus.busId.substring(0,8)}</strong><br/>
                Speed: {bus.speed.toFixed(1)} km/h<br/>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      
      {/* Floating Glass Overlay for Metrics */}
      <div className="map-overlay-panel animate-fade-in">
        <div className="overlay-header">
          <h3>Centro de Control</h3>
          <div className="live-badge">
            <div className="live-dot" /> EN VIVO
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <span className="label">Buses Activos</span>
            <span className="value">{stats.active}</span>
          </div>
          <div className="stat-card">
            <span className="label">En Movimiento</span>
            <span className="value" style={{ color: 'var(--color-accent)' }}>{stats.moving}</span>
          </div>
          <div className="stat-card" style={{ gridColumn: 'span 2' }}>
            <span className="label">Detenidos</span>
            <span className="value" style={{ color: 'var(--color-warning)' }}>{stats.stopped}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
