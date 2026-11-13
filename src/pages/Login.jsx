import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Login.css";
import logo from "../assets/logo/logo1.jpg"; // Importación correcta

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://127.0.0.1:3001/login", {
        email,
        password,
      });

      if (response.data.success) {
        const usuario = response.data.usuario;

        // 1. Guardamos los datos de la sesión en el almacenamiento local
        localStorage.setItem("usuario", JSON.stringify(usuario));

        // 2. Redirigimos según el tipo de usuario y enviamos el estado
        if (usuario.tipo === "trabajador") {
          navigate("/bienvenido-trabajador", { state: { nombre: usuario.nombre } });
        } else if (usuario.tipo === "empleador") {
          navigate("/bienvenido-empleador", { state: { nombre: usuario.nombre } });
        }
      }
    } catch (error) {
      console.error("Error en login:", error);
      alert("Correo o contraseña incorrectos");
    }
  };

  return (
    <div>
      <div className="form-container fade-in">
        <div className="logo-container">
          <img src={logo} alt="Logo LocalJobs" />
          <h1>LocalJobs</h1>
        </div>

        <h2>Iniciar Sesión</h2>
        <p>Ingresa tus datos para acceder a tu cuenta.</p>

        <form className="login-form" onSubmit={handleSubmit}>
          <label htmlFor="email">Correo electrónico</label>
          <input
            type="email"
            id="email"
            placeholder="ejemplo@correo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label htmlFor="password">Contraseña</label>
          <input
            type="password"
            id="password"
            placeholder="••••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">Ingresar</button>

          <a href="#" className="forgot-link">
            ¿Olvidaste tu contraseña?
          </a>
        </form>
      </div>

      <footer className="login-footer">
        <p>© 2026 LocalJobs - Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}

export default Login;