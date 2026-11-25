import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import "../styles/BienvenidoTrabajador.css";

function BienvenidoTrabajador() {
  const location = useLocation();
  const navigate = useNavigate();

  // Obtener usuario desde location.state o, como respaldo, desde localStorage
  const usuarioStorage = (() => {
    try {
      return JSON.parse(localStorage.getItem('usuario')) || {};
    } catch {
      return {};
    }
  })();

  const usuario = location.state?.usuario || usuarioStorage;
  const trabajadorId = usuario?.id || null;
  const nombreTrabajador =
    location.state?.nombre ||
    usuario?.nombre_completo ||
    usuario?.nombre ||
    "Trabajador";

  // Estados para las vacantes, postulaciones hechas y mensajes
  const [vacantes, setVacantes] = useState([]);
  const [postulacionesIds, setPostulacionesIds] = useState(new Set());
  const [mensaje, setMensaje] = useState('');

  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001";

  // Cargar las vacantes y las postulaciones del trabajador al montar o cambiar de trabajadorId
  useEffect(() => {
    fetchDatosIniciales();
  }, [trabajadorId]);

  const fetchDatosIniciales = async () => {
    try {
      // 1. Obtener todas las vacantes disponibles
      const resVacantes = await axios.get(`${API_URL}/vacantes`);
      setVacantes(resVacantes.data);

      // 2. Obtener las postulaciones solo si existe un ID válido del trabajador actual
      if (trabajadorId) {
        const resPostulaciones = await axios.get(`${API_URL}/postulaciones/trabajador/${trabajadorId}`);
        const ids = new Set(resPostulaciones.data.map(p => p.vacante_id));
        setPostulacionesIds(ids);
      } else {
        setPostulacionesIds(new Set());
      }
    } catch (error) {
      console.error('Error al cargar datos:', error);
    }
  };

  const handlePostularse = async (vacanteId) => {
    if (!trabajadorId) {
      setMensaje('No se identificó tu cuenta de trabajador. Vuelve a iniciar sesión.');
      setTimeout(() => setMensaje(''), 4000);
      return;
    }

    try {
      await axios.post(`${API_URL}/postulaciones`, {
        vacante_id: vacanteId,
        trabajador_id: trabajadorId
      });

      // Actualizamos el estado local agregando esta vacante a las postuladas
      setPostulacionesIds(prev => new Set(prev).add(vacanteId));

      setMensaje('¡Te has postulado con éxito a la vacante!');
      setTimeout(() => setMensaje(''), 4000);
    } catch (error) {
      console.error('Error al postularse:', error);
      // Si el backend rechaza por duplicado o ya está postulado, actualizamos el botón de igual forma
      setPostulacionesIds(prev => new Set(prev).add(vacanteId));
      setMensaje(error.response?.data?.error || 'Ya te encuentras postulado a esta oferta.');
      setTimeout(() => setMensaje(''), 4000);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('usuario');
    navigate("/", { state: null });
  };

  return (
    <div className="pantalla-motivacional aparecer" style={{ paddingBottom: '40px' }}>

      {/* BARRA SUPERIOR CON EL COLOR CORPORATIVO */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        padding: '12px 30px',
        boxSizing: 'border-box',
        backgroundColor: '#00857A',
        marginBottom: '25px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h3 className="saludo-usuario" style={{ margin: 0, fontSize: '1.2rem', color: '#FFFFFF', fontWeight: 'bold' }}>
          Bienvenido, {nombreTrabajador}
        </h3>
        <button
          onClick={handleLogout}
          style={{
            background: '#FFFFFF',
            color: '#000000',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '5px',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '0.9rem',
            whiteSpace: 'nowrap',
            boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
          }}
        >
          Cerrar Sesión
        </button>
      </div>

      {/* Título de la sección */}
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h2 style={{ color: '#00857A' }}>Panel de Oportunidades Laborales</h2>
        <p style={{ color: '#555' }}>Explora las ofertas de empleo disponibles y postúlate fácilmente.</p>

        {!trabajadorId && (
          <p style={{ color: '#c62828', fontWeight: 'bold', marginTop: '8px' }}>
            Sesión sin ID de trabajador detectado. Inicia sesión nuevamente para postularte.
          </p>
        )}

        {/* Mensaje informativo con el color corporativo #00857A */}
        {mensaje && (
          <p style={{ color: '#00857A', fontWeight: 'bold', marginTop: '10px' }}>
            {mensaje}
          </p>
        )}
      </div>

      {/* SECCIÓN: Listado de Vacantes Disponibles */}
      <section style={{ margin: '20px auto', maxWidth: '800px', textAlign: 'left', padding: '0 20px' }}>
        <h3 style={{ marginBottom: '15px', color: '#333' }}>Ofertas de Empleo Disponibles</h3>
        {vacantes.length === 0 ? (
          <p style={{ color: '#666', background: '#f9f9f9', padding: '15px', borderRadius: '8px' }}>No hay vacantes publicadas en este momento.</p>
        ) : (
          <div style={{ display: 'grid', gap: '15px' }}>
            {vacantes.map((v) => {
              const yaPostulado = postulacionesIds.has(v.id);
              return (
                <div key={v.id} style={{ background: '#fff', border: '1px solid #ddd', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                  <h4 style={{ margin: '0 0 8px 0', color: '#00857A', fontSize: '1.2rem' }}>{v.titulo}</h4>
                  <p style={{ margin: '4px 0' }}><strong>Empresa:</strong> {v.nombre_empresa || 'Empresa Confederada'}</p>
                  <p style={{ margin: '4px 0' }}><strong>Ubicación:</strong> {v.ubicacion}</p>
                  <p style={{ margin: '4px 0' }}><strong>Salario:</strong> {v.salario || 'A convenir'}</p>
                  <p style={{ margin: '12px 0 15px 0', color: '#444' }}>{v.descripcion}</p>

                  <button
                    onClick={() => !yaPostulado && handlePostularse(v.id)}
                    disabled={yaPostulado || !trabajadorId}
                    style={{
                      background: '#00857A',
                      color: '#FFF',
                      border: 'none',
                      padding: '10px 18px',
                      borderRadius: '5px',
                      cursor: (yaPostulado || !trabajadorId) ? 'default' : 'pointer',
                      fontWeight: 'bold',
                      opacity: (yaPostulado || !trabajadorId) ? 0.65 : 1
                    }}
                  >
                    {yaPostulado ? 'Postulado ✓' : 'Postularme'}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </section>

    </div>
  );
}

export default BienvenidoTrabajador;