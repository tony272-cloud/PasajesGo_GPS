import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import { Bell, Save, Trash2 } from 'lucide-react';
import { geofencesService, type Geofence, AlertType } from '../../services/geofences.service';
import '../fleet/MapEditor.css';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN || '';

export default function GeofencesMap() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const draw = useRef<MapboxDraw | null>(null);

  const [geofences, setGeofences] = useState<Geofence[]>([]);
  const [loading, setLoading] = useState(false);
  
  const [isCreating, setIsCreating] = useState(false);
  const [fenceName, setFenceName] = useState('');
  const [alertType, setAlertType] = useState<AlertType>(AlertType.GEOFENCE_ENTER);

  const loadGeofences = async () => {
    try {
      setLoading(true);
      const res = await geofencesService.getAll();
      setGeofences(res.data || []);
      
      if (map.current && map.current.isStyleLoaded()) {
        renderExistingGeofences(res.data || []);
      }
    } catch (e) {
      console.error('Error loading geofences', e);
    } finally {
      setLoading(false);
    }
  };

  const renderExistingGeofences = (fenceList: Geofence[]) => {
    if (!map.current) return;
    
    // Clear previous
    fenceList.forEach(f => {
      const sourceId = `fence-${f.id}`;
      if (map.current!.getSource(sourceId)) {
        if (map.current!.getLayer(`layer-fill-${f.id}`)) map.current!.removeLayer(`layer-fill-${f.id}`);
        if (map.current!.getLayer(`layer-line-${f.id}`)) map.current!.removeLayer(`layer-line-${f.id}`);
        map.current!.removeSource(sourceId);
      }
    });

    fenceList.forEach(f => {
      if (f.polygonCoordinates && f.polygonCoordinates.length > 0) {
        map.current!.addSource(`fence-${f.id}`, {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'Polygon',
              coordinates: f.polygonCoordinates
            }
          }
        });
        
        const isEnter = f.alertType === AlertType.GEOFENCE_ENTER || f.alertType === AlertType.SPEEDING;
        const color = isEnter ? '#EF4444' : '#F59E0B'; // Red or Yellow

        map.current!.addLayer({
          id: `layer-fill-${f.id}`,
          type: 'fill',
          source: `fence-${f.id}`,
          paint: {
            'fill-color': color,
            'fill-opacity': 0.2
          }
        });

        map.current!.addLayer({
          id: `layer-line-${f.id}`,
          type: 'line',
          source: `fence-${f.id}`,
          paint: {
            'line-color': color,
            'line-width': 2
          }
        });
      }
    });
  };

  useEffect(() => {
    if (map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current!,
      style: 'mapbox://styles/mapbox/navigation-day-v1',
      center: [-77.02824, -12.04318],
      zoom: 12,
    });

    draw.current = new MapboxDraw({
      displayControlsDefault: false,
      controls: {
        polygon: true,
        trash: true
      }
    });

    map.current.addControl(draw.current, 'top-left');

    map.current.on('load', () => {
      loadGeofences();
    });

    return () => {
      if (map.current) map.current.remove();
    };
  }, []);

  const handleCreateNew = () => {
    setIsCreating(true);
    setFenceName('');
    draw.current?.deleteAll();
    draw.current?.changeMode('draw_polygon');
  };

  const handleSaveFence = async () => {
    if (!fenceName) return alert('Por favor, ingrese un nombre.');
    
    const data = draw.current?.getAll();
    if (!data || data.features.length === 0) {
      return alert('Debe dibujar un polígono en el mapa.');
    }

    const feature = data.features[0];
    if (feature.geometry.type !== 'Polygon') {
      return alert('El dibujo debe ser un Polígono cerrado.');
    }

    const coordinates = feature.geometry.coordinates as number[][][];

    try {
      await geofencesService.create({
        name: fenceName,
        polygonCoordinates: coordinates,
        alertType: alertType
      });
      
      setIsCreating(false);
      draw.current?.deleteAll();
      loadGeofences();
    } catch (e) {
      console.error('Error saving geofence', e);
      alert('Hubo un error al guardar.');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Eliminar esta geocerca permanentemente?')) {
      await geofencesService.remove(id);
      loadGeofences();
    }
  };

  return (
    <div className="map-editor-page animate-fade-in">
      <aside className="editor-sidebar">
        <div className="editor-header">
          <Bell size={24} color="var(--color-danger)" />
          <h1>Zonas de Alerta</h1>
        </div>

        <div className="editor-content">
          {!isCreating ? (
            <>
              <button className="btn-primary" onClick={handleCreateNew} style={{ width: '100%' }}>
                Dibujar Nueva Zona
              </button>
              
              <div className="existing-list">
                <h3 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>GEOFENCES ACTIVOS</h3>
                {loading ? <p>Cargando...</p> : geofences.map(f => (
                  <div key={f.id} className="list-item">
                    <div>
                      <h4>{f.name}</h4>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{f.alertType}</span>
                    </div>
                    <div className="item-actions">
                      <button className="btn-icon" onClick={() => handleDelete(f.id)}>
                        <Trash2 size={16} color="var(--color-danger)" />
                      </button>
                    </div>
                  </div>
                ))}
                {!loading && geofences.length === 0 && <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>No hay zonas.</p>}
              </div>
            </>
          ) : (
            <div className="create-panel animate-fade-in">
              <h3 style={{ fontSize: '1rem', marginBottom: '1rem' }}>Nueva Geocerca</h3>
              
              <div className="controls-hint">
                <p>1. Clic en el mapa para iniciar el polígono.</p>
                <p>2. Clic en el punto inicial o presione "Enter" para cerrarlo.</p>
              </div>

              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label>Nombre de Zona</label>
                <input 
                  type="text" 
                  placeholder="Ej: Zona de Riesgo (Sur)" 
                  value={fenceName}
                  onChange={(e) => setFenceName(e.target.value)}
                  style={{ width: '100%', marginTop: '0.5rem' }}
                />
              </div>

              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label>Tipo de Alerta Automática</label>
                <select 
                  value={alertType}
                  onChange={(e) => setAlertType(e.target.value as AlertType)}
                  style={{ width: '100%', marginTop: '0.5rem' }}
                >
                  <option value={AlertType.GEOFENCE_ENTER}>Alerta al Entrar</option>
                  <option value={AlertType.GEOFENCE_EXIT}>Alerta al Salir</option>
                  <option value={AlertType.SPEEDING}>Límite de Velocidad (Zona Segura)</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button 
                  className="btn-secondary" 
                  onClick={() => { setIsCreating(false); draw.current?.deleteAll(); }}
                  style={{ flex: 1 }}
                >
                  Cancelar
                </button>
                <button 
                  className="btn-primary" 
                  onClick={handleSaveFence}
                  style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                >
                  <Save size={16} /> Guardar
                </button>
              </div>
            </div>
          )}
        </div>
      </aside>
      
      <main className="map-pane">
        <div ref={mapContainer} style={{ width: '100%', height: '100%' }} />
      </main>
    </div>
  );
}
