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
  const [misPostulaciones, setMisPostulaciones] = useState([]);
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
        const listaPostulaciones = resPostulaciones.data || [];
        setMisPostulaciones(listaPostulaciones);
        const ids = new Set(listaPostulaciones.map(p => p.vacante_id));
        setPostulacionesIds(ids);
      } else {
        setMisPostulaciones([]);
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
      fetchDatosIniciales();
      setTimeout(() => setMensaje(''), 4000);
    } catch (error) {
      console.error('Error al postularse:', error);
      // Si el backend rechaza por duplicado o ya está postulado, actualizamos el botón de igual forma
      setPostulacionesIds(prev => new Set(prev).add(vacanteId));
      setMensaje(error.response?.data?.error || 'Ya te encuentras postulado a esta oferta.');
      fetchDatosIniciales();
      setTimeout(() => setMensaje(''), 4000);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('usuario');
    navigate("/", { state: null });
  };

  const obtenerEtiquetaEstado = (estado) => {
    switch (estado) {
      case 'aceptado':
        return {
          texto: 'Seleccionado / Aceptado',
          bg: '#e8f5e9',
          color: '#1b5e20',
          border: '#66bb6a'
        };
      case 'en_revision':
        return {
          texto: 'En revisión',
          bg: '#e3f2fd',
          color: '#0d47a1',
          border: '#90caf9'
        };
      case 'no_seleccionado':
        return {
          texto: 'No seleccionado',
          bg: '#ffebee',
          color: '#b71c1c',
          border: '#ef9a9a'
        };
      default:
        return {
          texto: 'Pendiente',
          bg: '#fff8e1',
          color: '#8d6e63',
          border: '#ffe082'
        };
    }
  };

  const postulacionPorVacante = new Map(
    misPostulaciones.map(p => [p.vacante_id, p])
  );

  const postulacionesAceptadas = misPostulaciones.filter(p => p.estado === 'aceptado');

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
      <div style={{ textAlign: 'center', marginBottom: '20px', padding: '0 20px' }}>
        <h2 style={{ color: '#00857A' }}>Panel de Oportunidades Laborales</h2>
        <p style={{ color: '#555' }}>Explora las ofertas de empleo disponibles, postúlate fácilmente y revisa el estado de tus procesos.</p>

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

        {/* AVISO DESTACADO SI FUE SELECCIONADO / ACEPTADO */}
        {postulacionesAceptadas.length > 0 && (
          <div style={{
            maxWidth: '800px',
            margin: '16px auto 0 auto',
            backgroundColor: '#e8f5e9',
            border: '1px solid #66bb6a',
            color: '#1b5e20',
            padding: '14px 18px',
            borderRadius: '8px',
            textAlign: 'left',
            fontSize: '14px',
            lineHeight: '1.5'
          }}>
            <strong>¡Felicitaciones!</strong> Fuiste seleccionado/aceptado en{' '}
            {postulacionesAceptadas.map((item, idx) => (
              <span key={item.postulacion_id}>
                <strong>{item.titulo_vacante}</strong> ({item.nombre_empresa || item.nombre_empleador || 'Empresa'})
                {idx < postulacionesAceptadas.length - 1 ? ', ' : ''}
              </span>
            ))}
            . La persona o empresa que te aceptó se comunicará contigo pronto.
          </div>
        )}
      </div>

      {/* SECCIÓN: Mis Postulaciones */}
      {trabajadorId && (
        <section style={{ margin: '20px auto 30px auto', maxWidth: '800px', textAlign: 'left', padding: '0 20px' }}>
          <h3 style={{ marginBottom: '12px', color: '#333' }}>Mis Postulaciones</h3>
          {misPostulaciones.length === 0 ? (
            <p style={{ color: '#666', background: '#f9f9f9', padding: '14px', borderRadius: '8px' }}>
              Aún no te has postulado a ninguna vacante.
            </p>
          ) : (
            <div style={{ display: 'grid', gap: '12px' }}>
              {misPostulaciones.map((p) => {
                const badge = obtenerEtiquetaEstado(p.estado);
                return (
                  <div
                    key={p.postulacion_id}
                    style={{
                      background: '#fff',
                      border: `1px solid ${badge.border}`,
                      borderLeft: `5px solid ${badge.color}`,
                      padding: '15px 18px',
                      borderRadius: '8px',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.04)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                      <div>
                        <strong style={{ fontSize: '16px', color: '#00857A' }}>{p.titulo_vacante}</strong>
                        <span style={{ color: '#555', marginLeft: '8px', fontSize: '14px' }}>
                          • {p.nombre_empresa || p.nombre_empleador || 'Empresa'}
                        </span>
                      </div>
                      <span style={{
                        backgroundColor: badge.bg,
                        color: badge.color,
                        padding: '4px 10px',
                        borderRadius: '999px',
                        fontSize: '12px',
                        fontWeight: 'bold'
                      }}>
                        {badge.texto}
                      </span>
                    </div>

                    {p.estado === 'aceptado' && (
                      <p style={{ margin: '10px 0 0 0', fontSize: '13px', color: '#1b5e20', fontWeight: '600', lineHeight: '1.5' }}>
                        Fuiste aceptado/seleccionado para este puesto. La persona o empresa ({p.nombre_empresa || p.nombre_empleador || 'Empleador'}) se comunicará contigo para continuar el proceso.
                        {(p.telefono_empresa || p.email_empresa) && (
                          <span style={{ fontWeight: 'normal', display: 'block', marginTop: '4px', color: '#2e7d32' }}>
                            Datos de contacto: {p.telefono_empresa ? `Tel. ${p.telefono_empresa}` : ''}
                            {p.telefono_empresa && p.email_empresa ? ' | ' : ''}
                            {p.email_empresa ? `Correo: ${p.email_empresa}` : ''}
                          </span>
                        )}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>
      )}

      {/* SECCIÓN: Listado de Vacantes Disponibles */}
      <section style={{ margin: '20px auto', maxWidth: '800px', textAlign: 'left', padding: '0 20px' }}>
        <h3 style={{ marginBottom: '15px', color: '#333' }}>Ofertas de Empleo Disponibles</h3>
        {vacantes.length === 0 ? (
          <p style={{ color: '#666', background: '#f9f9f9', padding: '15px', borderRadius: '8px' }}>No hay vacantes publicadas en este momento.</p>
        ) : (
          <div style={{ display: 'grid', gap: '15px' }}>
            {vacantes.map((v) => {
              const postulacionActual = postulacionPorVacante.get(v.id);
              const yaPostulado = postulacionesIds.has(v.id) || Boolean(postulacionActual);
              const estadoBadge = postulacionActual ? obtenerEtiquetaEstado(postulacionActual.estado) : null;

              return (
                <div key={v.id} style={{ background: '#fff', border: '1px solid #ddd', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px', flexWrap: 'wrap' }}>
                    <h4 style={{ margin: '0 0 8px 0', color: '#00857A', fontSize: '1.2rem' }}>{v.titulo}</h4>
                    {estadoBadge && (
                      <span style={{
                        backgroundColor: estadoBadge.bg,
                        color: estadoBadge.color,
                        padding: '4px 10px',
                        borderRadius: '999px',
                        fontSize: '12px',
                        fontWeight: 'bold'
                      }}>
                        {estadoBadge.texto}
                      </span>
                    )}
                  </div>
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