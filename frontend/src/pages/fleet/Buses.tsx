import React, { useEffect, useState } from 'react';
import { BusIcon, Plus, Edit2, Trash2, X, RefreshCw } from 'lucide-react';
import { busService, type Bus as BusType } from '../../services/bus.service';
import './Buses.css';

export default function BusesPage() {
  const [buses, setBuses] = useState<BusType[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBus, setEditingBus] = useState<BusType | null>(null);
  const [formData, setFormData] = useState<Partial<BusType>>({
    plate: '',
    internalCode: '',
    capacity: 40,
    status: 'ACTIVE'
  });

  const loadBuses = async () => {
    try {
      setLoading(true);
      const data = await busService.getAll();
      setBuses(data.data); // Assuming backend returns { data: [...], total, page... }
    } catch (error) {
      console.error('Failed to load buses', error);
      // Fallback if the backend is empty or not seeding properly yet
      // setBuses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBuses();
  }, []);

  const handleOpenModal = (bus?: BusType) => {
    if (bus) {
      setEditingBus(bus);
      setFormData({
        plate: bus.plate,
        internalCode: bus.internalCode,
        capacity: bus.capacity,
        status: bus.status
      });
    } else {
      setEditingBus(null);
      setFormData({ plate: '', internalCode: '', capacity: 40, status: 'ACTIVE' });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingBus(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingBus) {
        await busService.update(editingBus.id, formData);
      } else {
        await busService.create(formData);
      }
      closeModal();
      loadBuses();
    } catch (error) {
      console.error('Failed to save bus', error);
      alert('Error guardando el bus');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Está seguro de eliminar este bus?')) {
      try {
        await busService.remove(id);
        loadBuses();
      } catch (error) {
        console.error('Failed to delete', error);
      }
    }
  };

  const handleRotateToken = async (id: string) => {
    if (window.confirm('¿Desea rotar el token de autenticación GPS de este bus? El antiguo dispositivo se desconectará.')) {
      try {
        const res = await busService.rotateToken(id);
        alert(`Nuevo token generado: ${res.token}. Cópielo e insértelo en la aplicación móvil del conductor.`);
        loadBuses();
      } catch (error) {
        console.error('Failed to rotate token', error);
      }
    }
  };

  return (
    <div className="page-container animate-fade-in">
      <div className="page-header">
        <h1><BusIcon size={28} color="var(--color-primary)" /> Gestión de Flota (Buses)</h1>
        <button className="btn-primary" onClick={() => handleOpenModal()}>
          <Plus size={18} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
          Registrar Bus
        </button>
      </div>

      <div className="table-container">
        <div className="table-controls">
          <input type="text" placeholder="Buscar por placa o código..." className="search-input" />
        </div>

        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>Cargando datos de flota...</div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Código Interno</th>
                <th>Placa</th>
                <th>Capacidad</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {buses.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                    No hay buses registrados.
                  </td>
                </tr>
              ) : (
                buses.map((bus) => (
                  <tr key={bus.id}>
                    <td><strong>{bus.internalCode}</strong></td>
                    <td>{bus.plate}</td>
                    <td>{bus.capacity} pax</td>
                    <td>
                      <span className={`status-badge status-${bus.status.toLowerCase()}`}>
                        {bus.status === 'ACTIVE' ? 'ACTIVO' : bus.status === 'MAINTENANCE' ? 'MANTENIMIENTO' : 'INACTIVO'}
                      </span>
                    </td>
                    <td>
                      <div className="actions-cell">
                        <button className="btn-icon" title="Editar" onClick={() => handleOpenModal(bus)}>
                          <Edit2 size={18} />
                        </button>
                        <button className="btn-icon" title="Rotar Token GPS" onClick={() => handleRotateToken(bus.id)}>
                          <RefreshCw size={18} color="var(--color-warning)" />
                        </button>
                        <button className="btn-icon" title="Eliminar" onClick={() => handleDelete(bus.id)}>
                          <Trash2 size={18} color="var(--color-danger)" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content animate-fade-in">
            <div className="modal-header">
              <h2>{editingBus ? 'Editar Bus' : 'Registrar Nuevo Bus'}</h2>
              <button className="btn-close" onClick={closeModal}><X size={24} /></button>
            </div>
            
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-row">
                <div className="form-group">
                  <label>Placa</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="ABC-123" 
                    value={formData.plate}
                    onChange={(e) => setFormData({...formData, plate: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Código Interno</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="BUS-001" 
                    value={formData.internalCode}
                    onChange={(e) => setFormData({...formData, internalCode: e.target.value})}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Capacidad (Pasajeros)</label>
                  <input 
                    type="number" 
                    required 
                    min="1"
                    value={formData.capacity}
                    onChange={(e) => setFormData({...formData, capacity: parseInt(e.target.value)})}
                  />
                </div>
                <div className="form-group">
                  <label>Estado</label>
                  <select 
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value as any})}
                  >
                    <option value="ACTIVE">Activo</option>
                    <option value="MAINTENANCE">En Mantenimiento</option>
                    <option value="INACTIVE">Inactivo</option>
                  </select>
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={closeModal}>Cancelar</button>
                <button type="submit" className="btn-primary">
                  {editingBus ? 'Guardar Cambios' : 'Crear Bus'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
