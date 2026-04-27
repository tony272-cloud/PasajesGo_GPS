import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import { Route as RouteIcon, Save, Trash2 } from 'lucide-react';
import { routesService, type Route } from '../../services/routes.service';
import '../fleet/MapEditor.css';

// Using same token convention
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN || '';

export default function RoutesMap() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const draw = useRef<MapboxDraw | null>(null);

  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Create mode state
  const [isCreating, setIsCreating] = useState(false);
  const [routeName, setRouteName] = useState('');

  const loadRoutes = async () => {
    try {
      setLoading(true);
      const res = await routesService.getAll();
      setRoutes(res.data || []);
      
      // Render existing routes on map
      if (map.current && map.current.isStyleLoaded()) {
        renderExistingRoutes(res.data || []);
      }
    } catch (e) {
      console.error('Error loading routes', e);
    } finally {
      setLoading(false);
    }
  };

  const renderExistingRoutes = (routeList: Route[]) => {
    if (!map.current) return;
    
    // Clear previous
    routeList.forEach(r => {
      const sourceId = `route-${r.id}`;
      if (map.current!.getSource(sourceId)) {
        if (map.current!.getLayer(`layer-${r.id}`)) map.current!.removeLayer(`layer-${r.id}`);
        map.current!.removeSource(sourceId);
      }
    });

    routeList.forEach(r => {
      if (r.pathCoordinates && r.pathCoordinates.length > 0) {
        map.current!.addSource(`route-${r.id}`, {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: r.pathCoordinates
            }
          }
        });
        map.current!.addLayer({
          id: `layer-${r.id}`,
          type: 'line',
          source: `route-${r.id}`,
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': r.colorHex || 'var(--color-primary)',
            'line-width': 4,
            'line-opacity': 0.8
          }
        });
      }
    });
  };

  useEffect(() => {
    if (map.current) return; // initialize map only once

    map.current = new mapboxgl.Map({
      container: mapContainer.current!,
      style: 'mapbox://styles/mapbox/navigation-day-v1', // Clean light theme
      center: [-77.02824, -12.04318], // Lima
      zoom: 12,
    });

    draw.current = new MapboxDraw({
      displayControlsDefault: false,
      controls: {
        line_string: true,
        trash: true
      },
      styles: [
        // Default Draw styles (customized for PasajesGo Blue)
        {
          id: 'gl-draw-line-active',
          type: 'line',
          filter: ['all', ['==', '$type', 'LineString'], ['==', 'active', 'true']],
          layout: { 'line-cap': 'round', 'line-join': 'round' },
          paint: {
            'line-color': '#2B4B9B',
            'line-dasharray': [0.2, 2],
            'line-width': 4
          }
        },
        {
          id: 'gl-draw-line-inactive',
          type: 'line',
          filter: ['all', ['==', '$type', 'LineString'], ['==', 'active', 'false']],
          layout: { 'line-cap': 'round', 'line-join': 'round' },
          paint: {
            'line-color': '#2B4B9B',
            'line-width': 4
          }
        }
      ]
    });

    map.current.addControl(draw.current, 'top-left');

    map.current.on('load', () => {
      loadRoutes();
    });

    return () => {
      if (map.current) map.current.remove();
    };
  }, []);

  const handleCreateNew = () => {
    setIsCreating(true);
    setRouteName('');
    // Clear draw tool
    draw.current?.deleteAll();
    draw.current?.changeMode('draw_line_string');
  };

  const handleSaveRoute = async () => {
    if (!routeName) return alert('Por favor, ingrese un nombre para la ruta.');
    
    const data = draw.current?.getAll();
    if (!data || data.features.length === 0) {
      return alert('Debe dibujar una línea en el mapa usando la herramienta superior izquierda.');
    }

    const feature = data.features[0];
    if (feature.geometry.type !== 'LineString') {
      return alert('El dibujo debe ser una línea (Ruta).');
    }

    const coordinates = feature.geometry.coordinates as number[][];

    try {
      await routesService.create({
        name: routeName,
        pathCoordinates: coordinates,
        colorHex: '#2B4B9B' // Default PasajesGo Blue
      });
      
      setIsCreating(false);
      draw.current?.deleteAll();
      loadRoutes(); // Reload to see the new route painted statically
    } catch (e) {
      console.error('Error saving route', e);
      alert('Hubo un error al guardar la ruta.');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Eliminar esta ruta permanentemente?')) {
      await routesService.remove(id);
      loadRoutes();
    }
  };

  return (
    <div className="map-editor-page animate-fade-in">
      <aside className="editor-sidebar">
        <div className="editor-header">
          <RouteIcon size={24} color="var(--color-primary)" />
          <h1>Gestor de Rutas</h1>
        </div>

        <div className="editor-content">
          {!isCreating ? (
            <>
              <button className="btn-primary" onClick={handleCreateNew} style={{ width: '100%' }}>
                Dibujar Nueva Ruta
              </button>
              
              <div className="existing-list">
                <h3 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>RUTAS GUARDADAS</h3>
                {loading ? <p>Cargando...</p> : routes.map(r => (
                  <div key={r.id} className="list-item">
                    <h4>{r.name}</h4>
                    <div className="item-actions">
                      <button className="btn-icon" onClick={() => handleDelete(r.id)}>
                        <Trash2 size={16} color="var(--color-danger)" />
                      </button>
                    </div>
                  </div>
                ))}
                {!loading && routes.length === 0 && <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>No hay rutas.</p>}
              </div>
            </>
          ) : (
            <div className="create-panel animate-fade-in">
              <h3 style={{ fontSize: '1rem', marginBottom: '1rem' }}>Nueva Ruta</h3>
              
              <div className="controls-hint">
                <p>1. Use la herramienta de línea en el mapa para trazar el trayecto.</p>
                <p>2. Presione "Enter" para finalizar la línea.</p>
              </div>

              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label>Nombre de Ruta</label>
                <input 
                  type="text" 
                  placeholder="Ej: Corredor Azul" 
                  value={routeName}
                  onChange={(e) => setRouteName(e.target.value)}
                  style={{ width: '100%', marginTop: '0.5rem' }}
                />
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
                  onClick={handleSaveRoute}
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
