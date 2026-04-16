import "../styles/Inicio.css";
import { Link } from "react-router-dom";
import { useEffect } from "react";

// ✅ IMPORTAR LOGO
import logo from "../assets/logo/logo1.jpg";

// ✅ IMPORTAR FONDOS
import plomero from "../assets/fondos/plomero.jpg";
import barredor from "../assets/fondos/barredor.jpg";
import cuidador from "../assets/fondos/cuidador.jpg";
import domicilios from "../assets/fondos/domicilios.jpg";
import lavador from "../assets/fondos/lavador.jpg";
import pintor from "../assets/fondos/pintor.jpg";
import carpintero from "../assets/fondos/carpintero.jpg";
import albanil from "../assets/fondos/albanil.jpg";

function Inicio() {

  useEffect(() => {
    const imagenes = [
      plomero,
      barredor,
      cuidador,
      domicilios,
      lavador,
      pintor,
      carpintero,
      albanil
    ];

    const hero = document.querySelector(".hero");
    let overlayActual = null;

    function cambiarFondo() {
      const randomIndex = Math.floor(Math.random() * imagenes.length);
      const nuevaImagen = imagenes[randomIndex];

      const overlay = document.createElement("div");
      overlay.classList.add("hero-overlay");
      overlay.style.backgroundImage = `url(${nuevaImagen})`;
      hero.appendChild(overlay);

      requestAnimationFrame(() => {
        overlay.style.opacity = 1;
      });

      setTimeout(() => {
        if (overlayActual) overlayActual.remove();
        overlayActual = overlay;
      }, 1500);
    }

    const intervalo = setInterval(cambiarFondo, 3000);
    cambiarFondo();

    return () => clearInterval(intervalo);
  }, []);

  return (
    <div>

      {/* HEADER */}
      <header>
        <div className="logo">
          <img src={logo} alt="Logo de LocalJobs" />
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

        <div className="header-buttons">
          <Link to="/login" className="btn-login">Iniciar Sesión</Link>
          <Link to="/registro" className="btn-register">Registrarse</Link>
        </div>
      </header>

      {/* HERO */}
      <section className="hero">
        <div className="hero-content">
          <h1>
            Encuentra el trabajo ideal <span className="resaltar">cerca de ti</span>
          </h1>

          <p>
            Conecta con empresas locales y descubre oportunidades laborales en tu zona.
          </p>

          <form className="search-box">
            <input type="text" placeholder="Buscar empleo o empresa..." />
            <button type="submit">Buscar</button>
          </form>
        </div>
      </section>

      {/* FEATURES */}
      <section className="features">
        <h2>¿Por qué elegir LocalJobs?</h2>

        <div className="cards">
          <div className="card">
            <h3>🔍 Búsqueda local</h3>
            <p>Encuentra empleos cerca de tu ubicación y evita largos desplazamientos.</p>
          </div>

          <div className="card">
            <h3>💼 Empresas verificadas</h3>
            <p>Trabaja con negocios locales que valoran tu talento y compromiso.</p>
          </div>

          <div className="card">
            <h3>🚀 Fácil de usar</h3>
            <p>Regístrate, busca y postula a empleos en pocos clics.</p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <p>© 2025 LocalJobs. Todos los derechos reservados.</p>

        <div className="socials">
          <a href="#">Facebook</a>
          <a href="#">Instagram</a>
          <a href="#">LinkedIn</a>
        </div>
      </footer>

    </div>
  );
}

export default Inicio;