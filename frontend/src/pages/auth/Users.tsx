import React, { useEffect, useState } from 'react';
import { Users as UsersIcon, Plus, Edit2, Trash2, X } from 'lucide-react';
import { usersService, type User as UserType } from '../../services/users.service';
import '../fleet/Buses.css'; // Reusing generic table styles

export default function UsersPage() {
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserType | null>(null);
  
  const [formData, setFormData] = useState<Partial<UserType> & { password?: string }>({
    email: '',
    role: 'OPERATOR',
    password: ''
  });

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await usersService.getAll();
      setUsers(data.data);
    } catch (error) {
      console.error('Failed to load users', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleOpenModal = (user?: UserType) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        email: user.email,
        role: user.role,
      });
    } else {
      setEditingUser(null);
      setFormData({ email: '', role: 'OPERATOR', password: '' });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingUser) {
        // We do not update password through this simple endpoint usually, stripped for safety
        await usersService.update(editingUser.id, { role: formData.role });
      } else {
        await usersService.create(formData);
      }
      closeModal();
      loadUsers();
    } catch (error: any) {
      console.error('Failed to save user', error);
      alert(error.response?.data?.message || 'Error guardando el usuario');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Está seguro de eliminar este usuario?')) {
      try {
        await usersService.remove(id);
        loadUsers();
      } catch (error) {
        console.error('Failed to delete', error);
      }
    }
  };

  return (
    <div className="page-container animate-fade-in">
      <div className="page-header">
        <h1><UsersIcon size={28} color="var(--color-primary)" /> Gestión de Usuarios</h1>
        <button className="btn-primary" onClick={() => handleOpenModal()}>
          <Plus size={18} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
          Registrar Usuario
        </button>
      </div>

      <div className="table-container">
        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>Cargando usuarios...</div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Email</th>
                <th>Rol</th>
                <th>Organización</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                    No hay usuarios registrados.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id}>
                    <td><strong>{user.email}</strong></td>
                    <td>
                      <span className="status-badge" style={{ background: 'rgba(43, 75, 155, 0.15)', color: 'var(--color-primary)' }}>
                        {user.role}
                      </span>
                    </td>
                    <td>{user.organization?.name || 'Sistema Global'}</td>
                    <td>
                      <div className="actions-cell">
                        <button className="btn-icon" title="Editar" onClick={() => handleOpenModal(user)}>
                          <Edit2 size={18} />
                        </button>
                        <button className="btn-icon" title="Eliminar" onClick={() => handleDelete(user.id)}>
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

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content animate-fade-in" style={{ maxWidth: '400px' }}>
            <div className="modal-header">
              <h2>{editingUser ? 'Editar Usuario' : 'Registrar Nuevo Usuario'}</h2>
              <button className="btn-close" onClick={closeModal}><X size={24} /></button>
            </div>
            
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group">
                <label>Correo Electrónico</label>
                <input 
                  type="email" 
                  required 
                  placeholder="usuario@empresa.com" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  disabled={!!editingUser}
                />
              </div>

              {!editingUser && (
                <div className="form-group">
                  <label>Contraseña</label>
                  <input 
                    type="password" 
                    required 
                    placeholder="••••••••" 
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                  />
                </div>
              )}

              <div className="form-group">
                <label>Rol de Acceso</label>
                <select 
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value as any})}
                >
                  <option value="OPERATOR">Operador (Monitoreo)</option>
                  <option value="ORG_ADMIN">Administrador de Empresa</option>
                  <option value="SUPERADMIN">Super Administrador</option>
                </select>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={closeModal}>Cancelar</button>
                <button type="submit" className="btn-primary">
                  {editingUser ? 'Guardar Cambios' : 'Crear Usuario'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
