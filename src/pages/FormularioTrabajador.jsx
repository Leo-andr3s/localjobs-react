import "../styles/FormularioTrabajador.css";
import { Link } from "react-router-dom";

function RegistroTrabajador() {
  return (
    <div>

      {/* HEADER */}
      <header>
        <div className="logo">
          <h1>LocalJobs</h1>
        </div>

        <nav>
          <ul>
            <li><Link to="/">Inicio</Link></li>
            <li><a href="#">Empleos</a></li>
            <li><a href="#">Empresas</a></li>
            <li><a href="#">Contacto</a></li>
          </ul>
        </nav>
      </header>

      {/* FORMULARIO */}
      <div className="form-container fade-in">
        <h2>Registro de Trabajador</h2>
        <p>Crea tu cuenta para encontrar oportunidades laborales cerca de ti.</p>

        <form className="register-form">
          <label>Nombre completo</label>
          <input type="text" placeholder="Ingresa tu nombre y apellidos" required />

          <label>Tipo de documento</label>
          <select required>
            <option disabled selected>Seleccione...</option>
            <option value="cc">Cédula de Ciudadanía</option>
            <option value="ce">Cédula de extranjería</option>
            <option value="pe">Permiso Especial</option>
            <option value="nit">NIT</option>
          </select>

          <label>Número de documento</label>
          <input type="text" placeholder="Ingresa tu número de documento" required />

          <label>Correo electrónico</label>
          <input type="email" placeholder="tucorreo@ejemplo.com" required />

          <label>Teléfono</label>
          <input type="tel" placeholder="3101010101" required />

          <label>Ubicación</label>
          <input type="text" placeholder="Dirección" required />

          <label>Profesión u oficio</label>
          <input type="text" placeholder="Ej. electricista" required />

          <label>Experiencia</label>
          <input type="text" placeholder="Ej. 2 años en servicio al cliente" />

          <label>
            <input type="checkbox" required /> Acepto términos y condiciones
          </label>

          <button type="submit">Registrar trabajador</button>
        </form>
      </div>

      {/* FOOTER */}
      <footer>
        <p>© 2025 LocalJobs</p>
      </footer>

    </div>
  );
}

export default RegistroTrabajador;