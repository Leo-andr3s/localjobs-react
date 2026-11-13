import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BienvenidoEmpleador = () => {
  // Obtener la información del usuario logueado guardada en localStorage
  const usuarioGuardado = JSON.parse(localStorage.getItem('usuario')) || {};
  
  const [vacantes, setVacantes] = useState([]);
  const [postulantes, setPostulantes] = useState([]);
  const [vacanteSeleccionada, setVacanteSeleccionada] = useState(null);
  
  // Estado para el formulario de publicar / editar vacante
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    ubicacion: '',
    salario: ''
  });

  // Estado para saber si estamos editando una vacante (guarda el ID)
  const [vacanteEditandoId, setVacanteEditandoId] = useState(null);

  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  // Cargar vacantes del empleador al iniciar
  useEffect(() => {
    if (usuarioGuardado.id) {
      cargarVacantes();
    }
  }, []);

  const cargarVacantes = async () => {
    try {
      const res = await axios.get(`http://localhost:3001/vacantes/empleador/${usuarioGuardado.id}`);
      setVacantes(res.data);
    } catch (err) {
      console.error('Error al cargar vacantes:', err);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // FUNCIÓN PARA PUBLICAR O ACTUALIZAR VACANTE
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje('');
    setError('');

    if (!usuarioGuardado.id) {
      setError('No se detectó la sesión del empleador. Vuelve a iniciar sesión.');
      return;
    }

    try {
      if (vacanteEditandoId) {
        // MODO EDICIÓN (PUT)
        await axios.put(`http://localhost:3001/vacantes/${vacanteEditandoId}`, formData);
        setMensaje('¡Vacante actualizada con éxito!');
      } else {
        // MODO CREACIÓN (POST)
        const payload = {
          empleador_id: usuarioGuardado.id,
          ...formData
        };
        await axios.post('http://localhost:3001/vacantes', payload);
        setMensaje('¡Vacante publicada con éxito!');
      }

      // Limpiar formulario y estado de edición
      setFormData({ titulo: '', descripcion: '', ubicacion: '', salario: '' });
      setVacanteEditandoId(null);
      cargarVacantes();
    } catch (err) {
      console.error('DETALLE DEL ERROR:', err.response ? err.response.data : err.message);
      setError(`Error al guardar: ${err.response?.data?.error || err.message}`);
    }
  };

  // Cargar datos en el formulario para editar
  const iniciarEdicion = (vacante) => {
    setVacanteEditandoId(vacante.id);
    setFormData({
      titulo: vacante.titulo,
      descripcion: vacante.descripcion,
      ubicacion: vacante.ubicacion,
      salario: vacante.salario
    });
    setMensaje('');
    setError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Cancelar edición
  const cancelarEdicion = () => {
    setVacanteEditandoId(null);
    setFormData({ titulo: '', descripcion: '', ubicacion: '', salario: '' });
  };

  // Función para eliminar vacante
  const eliminarVacante = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta vacante?')) {
      try {
        await axios.delete(`http://localhost:3001/vacantes/${id}`);
        setMensaje('Vacante eliminada correctamente');
        cargarVacantes();
        if (vacanteSeleccionada) {
          setVacanteSeleccionada(null);
          setPostulantes([]);
        }
      } catch (err) {
        console.error('Error al eliminar:', err);
        setError('No se pudo eliminar la vacante');
      }
    }
  };

  // Función para ver los postulantes de una vacante
  const verPostulantes = async (vacanteId, titulo) => {
    try {
      const res = await axios.get(`http://localhost:3001/vacantes/${vacanteId}/postulaciones`);
      setPostulantes(res.data);
      setVacanteSeleccionada(titulo);
    } catch (err) {
      console.error('Error al obtener postulantes:', err);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f4f6f8', 
      padding: '30px 20px', 
      fontFamily: 'Inter, system-ui, sans-serif' 
    }}>
      <div style={{ maxWidth: '850px', margin: '0 auto' }}>
        
        {/* Cabecera de Bienvenida */}
        <div style={{ 
          background: '#ffffff', 
          padding: '25px 30px', 
          borderRadius: '12px', 
          marginBottom: '30px', 
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderLeft: '6px solid #00897b'
        }}>
          <div>
            <h2 style={{ color: '#00897b', margin: '0 0 5px 0', fontSize: '24px' }}>
              Bienvenido, {usuarioGuardado.empresa || usuarioGuardado.nombre_completo || 'Empleador'}
            </h2>
            <p style={{ color: '#666', margin: 0, fontSize: '14px' }}>Gestiona tus ofertas de trabajo y revisa postulantes en tiempo real.</p>
          </div>
          <button 
            onClick={() => { localStorage.clear(); window.location.href = '/'; }}
            style={{ 
              backgroundColor: '#ffebee', 
              color: '#c62828', 
              border: 'none', 
              padding: '8px 16px', 
              borderRadius: '6px', 
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '13px'
            }}
          >
            Cerrar Sesión
          </button>
        </div>

        {/* FORMULARIO DE PUBLICACIÓN / EDICIÓN DE VACANTE */}
        <div style={{ 
          background: '#ffffff', 
          padding: '30px', 
          borderRadius: '12px', 
          marginBottom: '35px', 
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
          border: '1px solid #e0e0e0'
        }}>
          <h3 style={{ color: '#00897b', marginTop: 0, marginBottom: '20px', fontSize: '20px' }}>
            {vacanteEditandoId ? '✏️ Editar Oferta de Empleo' : '💼 Publicar Nueva Oferta de Empleo'}
          </h3>

          {mensaje && <div style={{ background: '#e8f5e9', color: '#2e7d32', padding: '12px', borderRadius: '6px', marginBottom: '20px', fontSize: '14px', fontWeight: 'bold', textAlign: 'center' }}>{mensaje}</div>}
          {error && <div style={{ background: '#ffebee', color: '#c62828', padding: '12px', borderRadius: '6px', marginBottom: '20px', fontSize: '14px', fontWeight: 'bold', textAlign: 'center' }}>{error}</div>}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '18px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: '#00897b', fontSize: '14px' }}>Título del Empleo</label>
              <input
                type="text"
                name="titulo"
                placeholder="Ej. Asistente de Ventas"
                value={formData.titulo}
                onChange={handleChange}
                required
                style={{ 
                  width: '100%', 
                  padding: '12px', 
                  borderRadius: '8px', 
                  border: '1px solid #b2dfdb', 
                  backgroundColor: '#f9fbfb',
                  fontSize: '15px',
                  boxSizing: 'border-box',
                  outline: 'none'
                }}
              />
            </div>

            <div style={{ marginBottom: '18px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: '#00897b', fontSize: '14px' }}>Descripción y Requisitos</label>
              <textarea
                name="descripcion"
                placeholder="Ej. Buena presentación, amabilidad y experiencia en atención al cliente..."
                value={formData.descripcion}
                onChange={handleChange}
                required
                rows="4"
                style={{ 
                  width: '100%', 
                  padding: '12px', 
                  borderRadius: '8px', 
                  border: '1px solid #b2dfdb', 
                  backgroundColor: '#f9fbfb',
                  fontSize: '15px',
                  boxSizing: 'border-box', 
                  resize: 'vertical',
                  outline: 'none'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: '#00897b', fontSize: '14px' }}>Ubicación</label>
                <input
                  type="text"
                  name="ubicacion"
                  placeholder="Ej. Centro, Bogotá"
                  value={formData.ubicacion}
                  onChange={handleChange}
                  required
                  style={{ 
                    width: '100%', 
                    padding: '12px', 
                    borderRadius: '8px', 
                    border: '1px solid #b2dfdb', 
                    backgroundColor: '#f9fbfb',
                    fontSize: '15px',
                    boxSizing: 'border-box',
                    outline: 'none'
                  }}
                />
              </div>

              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: '#00897b', fontSize: '14px' }}>Salario</label>
                <input
                  type="text"
                  name="salario"
                  placeholder="Ej. $1.200.000"
                  value={formData.salario}
                  onChange={handleChange}
                  required
                  style={{ 
                    width: '100%', 
                    padding: '12px', 
                    borderRadius: '8px', 
                    border: '1px solid #b2dfdb', 
                    backgroundColor: '#f9fbfb',
                    fontSize: '15px',
                    boxSizing: 'border-box',
                    outline: 'none'
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                type="submit"
                style={{
                  backgroundColor: vacanteEditandoId ? '#ffa000' : '#00897b',
                  color: 'white',
                  padding: '12px 20px',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  flex: 1,
                  fontSize: '16px',
                  fontWeight: 'bold',
                  boxShadow: '0 2px 6px rgba(0, 137, 123, 0.3)'
                }}
              >
                {vacanteEditandoId ? 'Guardar Cambios' : 'Publicar Vacante'}
              </button>

              {vacanteEditandoId && (
                <button
                  type="button"
                  onClick={cancelarEdicion}
                  style={{
                    backgroundColor: '#757575',
                    color: 'white',
                    padding: '12px 20px',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '16px',
                    fontWeight: 'bold'
                  }}
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </div>

        {/* LISTA DE VACANTES PUBLICADAS */}
        <h3 style={{ color: '#333', fontSize: '20px', marginBottom: '15px' }}>📋 Mis Vacantes Publicadas</h3>
        {vacantes.length === 0 ? (
          <p style={{ color: '#666', fontStyle: 'italic', background: '#fff', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>No has publicado vacantes aún.</p>
        ) : (
          vacantes.map((v) => (
            <div key={v.id} style={{ 
              background: '#fff', 
              padding: '20px', 
              marginBottom: '15px', 
              borderRadius: '10px', 
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              borderLeft: '5px solid #00897b',
              border: '1px solid #e0e0e0',
              borderLeftWidth: '5px'
            }}>
              <h4 style={{ margin: '0 0 8px 0', color: '#00897b', fontSize: '18px' }}>{v.titulo}</h4>
              <p style={{ margin: '0 0 10px 0', color: '#555', fontSize: '14px', lineHeight: '1.5' }}>{v.descripcion}</p>
              <p style={{ margin: '0 0 15px 0', color: '#666', fontSize: '13px' }}>
                📍 <strong>Ubicación:</strong> {v.ubicacion} | 💰 <strong>Salario:</strong> ${v.salario} | 👥 <strong>Postulados:</strong> {v.total_postulaciones || 0}
              </p>
              
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => verPostulantes(v.id, v.titulo)}
                  style={{ backgroundColor: '#0288d1', color: 'white', border: 'none', padding: '8px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}
                >
                  Ver Postulados
                </button>
                
                <button
                  onClick={() => iniciarEdicion(v)}
                  style={{ backgroundColor: '#ffa000', color: 'white', border: 'none', padding: '8px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}
                >
                  Editar
                </button>

                <button
                  onClick={() => eliminarVacante(v.id)}
                  style={{ backgroundColor: '#d32f2f', color: 'white', border: 'none', padding: '8px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))
        )}

        {/* SECCIÓN DE POSTULANTES */}
        {vacanteSeleccionada && (
          <div style={{ 
            marginTop: '35px', 
            background: '#ffffff', 
            padding: '25px', 
            borderRadius: '12px', 
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
            border: '1px solid #b2dfdb' 
          }}>
            <h3 style={{ color: '#00897b', marginTop: 0, marginBottom: '15px' }}>👥 Candidatos para: {vacanteSeleccionada}</h3>
            {postulantes.length === 0 ? (
              <p style={{ color: '#666', fontStyle: 'italic', margin: 0 }}>Aún no hay candidatos postulados a esta oferta.</p>
            ) : (
              <ul style={{ paddingLeft: '20px', margin: 0 }}>
                {postulantes.map((p) => (
                  <li key={p.postulacion_id} style={{ marginBottom: '12px', color: '#333' }}>
                    <strong>{p.nombre_completo}</strong> - <em style={{ color: '#00897b' }}>{p.oficio}</em> <br />
                    <span style={{ fontSize: '13px', color: '#666' }}>📧 Email: {p.email} | 📞 Teléfono: {p.telefono} | 📍 Ciudad: {p.ciudad}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BienvenidoEmpleador;