import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // Solo una vez
import axios from "axios";
import "../styles/FormularioTrabajador.css";

function RegistroTrabajador() {
  const [formData, setFormData] = useState({
    nombre_completo: "",
    tipo_documento: "",
    numero_documento: "",
    email: "",
    password: "",
    confirmarPassword: "",
    telefono: "",
    ubicacion: "",
    profesion_oficio: "",
    experiencia: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmarPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }

    try {
      const response = await axios.post("http://localhost:3001/registrar-trabajador", formData);
      
      if (response.status === 200) {
        alert("¡Registro exitoso!");
        // Saltamos enviando el nombre en el estado
        navigate("/bienvenido-trabajador", { 
          state: { nombre: formData.nombre_completo } 
        });
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error al conectar con el servidor");
    }
  };

  return (
    <div>
      <header>
        <div className="logo"><h1>LocalJobs</h1></div>
        <nav>
          <ul>
            <li><Link to="/">Inicio</Link></li>
            <li><a href="#">Empleos</a></li>
            <li><a href="#">Empresas</a></li>
            <li><a href="#">Contacto</a></li>
          </ul>
        </nav>
      </header>

      <div className="form-container fade-in">
        <h2>Registro de Trabajador</h2>
        <p>Crea tu cuenta para encontrar oportunidades laborales cerca de ti.</p>

        <form className="register-form" onSubmit={handleSubmit}>
          
          <label>Nombre completo</label>
          <input 
            type="text" 
            name="nombre_completo" 
            placeholder="Ingresa tu nombre y apellidos" 
            onChange={handleChange} 
            required 
          />

          <label>Tipo de documento</label>
          <select 
            name="tipo_documento" 
            onChange={handleChange} 
            required
            defaultValue=""
          >
            <option value="" disabled>Seleccione...</option>
            <option value="cc">Cédula de Ciudadanía</option>
            <option value="ce">Cédula de extranjería</option>
            <option value="pe">Permiso Especial</option>
            <option value="nit">NIT</option>
          </select>

          <label>Número de documento</label>
          <input type="text" name="numero_documento" placeholder="Ingresa tu número" onChange={handleChange} required />

          <label>Correo electrónico</label>
          <input type="email" name="email" placeholder="tucorreo@ejemplo.com" onChange={handleChange} required />
          
          <label>Contraseña</label>
          <input type="password" name="password" placeholder="Mínimo 8 caracteres" onChange={handleChange} required />
          
          <label>Confirmar contraseña</label>
          <input type="password" name="confirmarPassword" placeholder="Repite la contraseña" onChange={handleChange} required />

          <label>Teléfono</label>
          <input type="tel" name="telefono" placeholder="3101010101" onChange={handleChange} required />

          <label>Ubicación</label>
          <input type="text" name="ubicacion" placeholder="Dirección" onChange={handleChange} required />

          <label>Profesión u oficio</label>
          <input type="text" name="profesion_oficio" placeholder="Ej. electricista" onChange={handleChange} required />

          <label>Experiencia</label>
          <input type="text" name="experiencia" placeholder="Ej. 2 años" onChange={handleChange} />

          <label>
            <input type="checkbox" required /> Acepto términos y condiciones
          </label>

          <button type="submit">Registrar trabajador</button>
        </form>
      </div>

      <footer>
        <p>© 2026 LocalJobs</p>
      </footer>
    </div>
  );
}

export default RegistroTrabajador;