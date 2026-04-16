import "../styles/Login.css";
import logo from "../assets/logo/logo1.jpg";

function Login() {
  return (
    <div>

      <div className="form-container fade-in">

        <div className="logo-container">
          <img src={logo} alt="Logo LocalJobs" />
          <h1>LocalJobs</h1>
        </div>

        <h2>Iniciar Sesión</h2>
        <p>Ingresa tus datos para acceder a tu cuenta.</p>

        <form className="login-form">

          <label htmlFor="email">Correo electrónico</label>
          <input
            type="email"
            id="email"
            placeholder="ejemplo@correo.com"
            required
          />

          <label htmlFor="password">Contraseña</label>
          <input
            type="password"
            id="password"
            placeholder="••••••••••"
            required
          />

          <button type="submit">Ingresar</button>

          <a href="#" className="forgot-link">
            ¿Olvidaste tu contraseña?
          </a>

        </form>
      </div>

      <footer className="login-footer">
        <p>© 2025 LocalJobs - Todos los derechos reservados.</p>
      </footer>

    </div>
  );
}

export default Login;