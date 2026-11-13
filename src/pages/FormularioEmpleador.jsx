import React, { useState } from "react";
import axios from "axios";
import "../styles/FormularioEmpleador.css";
import { Link, useNavigate } from "react-router-dom";

function FormularioEmpleador() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombre_empresa: "",
    tipo_documento: "",
    numero_documento: "",
    telefono: "",
    ubicacion: "",
    email: "",
    password: "",
    confirmarPassword: ""
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmarPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }

    try {
      const response = await axios.post("http://localhost:3001/registrar-empleador", formData);
      
      if (response.status === 200 || response.status === 201) {
        const datosUsuario = response.data.usuario || {
          id: response.data.id || response.data.empleadorId,
          empresa: formData.nombre_empresa,
          nombre_completo: formData.nombre_empresa
        };

        localStorage.setItem('usuario', JSON.stringify(datosUsuario));

        alert("¡Registro exitoso! Ya puedes publicar tu vacante.");
        navigate("/bienvenido-empleador");
      }
    } catch (err) {
      console.error("Error al registrar empresa:", err);
      setError(err.response?.data?.error || "Error al conectar con el servidor");
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', fontFamily: 'Arial, sans-serif' }}>
      
      {/* BARRA SUPERIOR VERDE INSTITUCIONAL */}
      <header style={{ backgroundColor: '#00897b', padding: '15px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#fff', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <h1 style={{ margin: 0, fontSize: '22px', fontWeight: 'bold', color: '#fff' }}>LocalJobs</h1>
        <nav style={{ display: 'flex', gap: '20px' }}>
          <Link to="/" style={{ textDecoration: 'none', color: '#fff', fontWeight: '600' }}>Inicio</Link>
          <Link to="/empleos" style={{ textDecoration: 'none', color: '#fff', fontWeight: '600' }}>Empleos</Link>
          <Link to="/empresas" style={{ textDecoration: 'none', color: '#fff', fontWeight: '600' }}>Empresas</Link>
          <Link to="/contacto" style={{ textDecoration: 'none', color: '#fff', fontWeight: '600' }}>Contacto</Link>
        </nav>
      </header>

      {/* CONTENEDOR CON ANIMACIÓN FADE-IN Y TARJETA CENTRADA */}
      <div className="fade-in" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '40px 20px', flex: 1 }}>
        <div style={{ 
          background: '#ffffff', 
          padding: '40px 50px', 
          borderRadius: '12px', 
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)', 
          width: '100%', 
          maxWidth: '520px' 
        }}>
          
          <h2 style={{ color: '#00897b', textAlign: 'center', marginBottom: '8px', fontSize: '26px', fontWeight: 'bold' }}>Registro de Empleador</h2>
          <p style={{ color: '#666', textAlign: 'center', marginBottom: '30px', fontSize: '14px', lineHeight: '1.4' }}>
            Completa tus datos para publicar ofertas de trabajo en LocalJobs.
          </p>

          {error && <p style={{ color: "red", fontWeight: "bold", textAlign: "center", marginBottom: '15px' }}>{error}</p>}

          <form onSubmit={handleSubmit}>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', color: '#00897b', fontWeight: 'bold', marginBottom: '8px', fontSize: '14px' }}>Nombre del empleador o empresa</label>
              <input 
                type="text" 
                name="nombre_empresa" 
                placeholder="Ej. Panadería La Espiga" 
                value={formData.nombre_empresa}
                onChange={handleChange}
                required 
                style={inputStyle}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', color: '#00897b', fontWeight: 'bold', marginBottom: '8px', fontSize: '14px' }}>Tipo de documento</label>
              <select name="tipo_documento" value={formData.tipo_documento} onChange={handleChange} required style={inputStyle}>
                <option value="" disabled>Seleccione...</option>
                <option value="CC">Cédula de ciudadanía (CC)</option>
                <option value="CE">Cédula de extranjería (CE)</option>
                <option value="NIT">NIT</option>
              </select>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', color: '#00897b', fontWeight: 'bold', marginBottom: '8px', fontSize: '14px' }}>Número de documento</label>
              <input 
                type="text" 
                name="numero_documento" 
                placeholder="Ingrese su número de documento" 
                value={formData.numero_documento}
                onChange={handleChange}
                required 
                style={inputStyle}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', color: '#00897b', fontWeight: 'bold', marginBottom: '8px', fontSize: '14px' }}>Teléfono</label>
              <input 
                type="tel" 
                name="telefono" 
                placeholder="3101010101" 
                value={formData.telefono}
                onChange={handleChange}
                required 
                style={inputStyle}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', color: '#00897b', fontWeight: 'bold', marginBottom: '8px', fontSize: '14px' }}>Ubicación</label>
              <input 
                type="text" 
                name="ubicacion" 
                placeholder="Dirección principal" 
                value={formData.ubicacion}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', color: '#00897b', fontWeight: 'bold', marginBottom: '8px', fontSize: '14px' }}>Correo electrónico</label>
              <input 
                type="email" 
                name="email" 
                placeholder="empresa@ejemplo.com" 
                value={formData.email}
                onChange={handleChange}
                required 
                style={inputStyle}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', color: '#00897b', fontWeight: 'bold', marginBottom: '8px', fontSize: '14px' }}>Contraseña</label>
              <input 
                type="password" 
                name="password" 
                placeholder="Crea una contraseña segura" 
                value={formData.password}
                onChange={handleChange}
                required 
                style={inputStyle}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', color: '#00897b', fontWeight: 'bold', marginBottom: '8px', fontSize: '14px' }}>Confirmar contraseña</label>
              <input 
                type="password" 
                name="confirmarPassword" 
                placeholder="Repite la contraseña" 
                value={formData.confirmarPassword}
                onChange={handleChange}
                required 
                style={inputStyle}
              />
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "25px", fontSize: "14px", color: "#555" }}>
              <input type="checkbox" required style={{ width: '18px', height: '18px', accentColor: '#00897b', cursor: 'pointer' }} /> 
              <span>Acepto términos y condiciones</span>
            </div>

            <button type="submit" style={{
              backgroundColor: '#00897b',
              color: 'white',
              padding: '14px',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              width: '100%',
              fontSize: '16px',
              fontWeight: 'bold',
              boxShadow: '0 4px 10px rgba(0, 137, 123, 0.2)',
              transition: 'background 0.2s'
            }}>
              Registrar empresa o persona
            </button>

          </form>
        </div>
      </div>

      {/* FOOTER */}
      <footer style={{ textAlign: 'center', padding: '20px', color: '#888', fontSize: '13px', backgroundColor: '#ffffff', borderTop: '1px solid #eaeaea' }}>
        <p>© 2026 LocalJobs</p>
      </footer>
    </div>
  );
}

const inputStyle = {
  width: '100%',
  padding: '12px 15px',
  boxSizing: 'border-box',
  border: '1.5px solid #00897b',
  borderRadius: '8px',
  fontSize: '14px',
  outline: 'none',
  backgroundColor: '#fff',
  color: '#333'
};

export default FormularioEmpleador;