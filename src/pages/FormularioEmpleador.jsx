import "../styles/FormularioEmpleador.css";
import { Link } from "react-router-dom";

function RegistroEmpleador() {
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
      <section className="form-container fade-in">
        <h2>Registro de Empleador</h2>
        <p>Completa tus datos para publicar ofertas de trabajo en LocalJobs.</p>

        <form className="register-form">

          <label>Nombre del empleador o empresa</label>
          <input type="text" placeholder="Ej. Panadería La Espiga" required />

          <label>Tipo de documento</label>
          <select required>
            <option disabled selected>Seleccione...</option>
            <option value="CC">Cédula de ciudadanía (CC)</option>
            <option value="CE">Cédula de extranjería (CE)</option>
            <option value="nit">NIT</option>
          </select>

          <label>Número de documento</label>
          <input type="text" placeholder="Ingrese su número de documento" required />

          <label>Correo electrónico</label>
          <input type="email" placeholder="empresa@ejemplo.com" required />

          <label>Teléfono</label>
          <input type="tel" placeholder="3101010101" required />

          <label>Ubicación</label>
          <input type="text" placeholder="Dirección principal" />

          <label>Contraseña</label>
          <input type="password" placeholder="Crea una contraseña segura" required />

          <label>Confirmar contraseña</label>
          <input type="password" placeholder="Repite la contraseña" required />

          <label>
            <input type="checkbox" required /> Acepto términos y condiciones
          </label>

          <button type="submit" className="btn-register">
            Registrar empresa o persona
          </button>

        </form>
      </section>

      {/* FOOTER */}
      <footer>
        <p>© 2025 LocalJobs</p>
      </footer>

    </div>
  );
}

export default RegistroEmpleador;