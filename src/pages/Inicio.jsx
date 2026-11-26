import "../styles/Inicio.css";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

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
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001";

  const [terminoBusqueda, setTerminoBusqueda] = useState("");
  const [resultados, setResultados] = useState([]);
  const [busquedaRealizada, setBusquedaRealizada] = useState(false);
  const [buscando, setBuscando] = useState(false);
  const [errorBusqueda, setErrorBusqueda] = useState("");

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

  const handleBuscar = async (e) => {
    e.preventDefault();
    setErrorBusqueda("");
    setBuscando(true);
    setBusquedaRealizada(true);

    try {
      const res = await axios.get(`${API_URL}/vacantes`);
      const todasLasVacantes = Array.isArray(res.data) ? res.data : [];
      const texto = terminoBusqueda.trim().toLowerCase();

      if (!texto) {
        setResultados(todasLasVacantes);
      } else {
        const filtradas = todasLasVacantes.filter((v) =>
          (v.titulo || "").toLowerCase().includes(texto) ||
          (v.nombre_empresa || "").toLowerCase().includes(texto) ||
          (v.nombre_empleador || "").toLowerCase().includes(texto) ||
          (v.ubicacion || "").toLowerCase().includes(texto) ||
          (v.descripcion || "").toLowerCase().includes(texto)
        );
        setResultados(filtradas);
      }
    } catch (err) {
      console.error("Error al buscar vacantes:", err);
      setErrorBusqueda("No se pudieron cargar las vacantes en este momento.");
      setResultados([]);
    } finally {
      setBuscando(false);
    }
  };

  const limpiarBusqueda = () => {
    setTerminoBusqueda("");
    setResultados([]);
    setBusquedaRealizada(false);
    setErrorBusqueda("");
  };

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
            <li><a href="#resultados-busqueda" onClick={(e) => {
              if (!busquedaRealizada) {
                e.preventDefault();
                document.querySelector(".search-box input")?.focus();
              }
            }}>Empleos</a></li>
            <li><Link to="/registro">Empresas</Link></li>
            <li><a href="#contacto-footer">Contacto</a></li>
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

          <form className="search-box" onSubmit={handleBuscar}>
            <input
              type="text"
              placeholder="Buscar empleo o empresa..."
              value={terminoBusqueda}
              onChange={(e) => setTerminoBusqueda(e.target.value)}
            />
            <button type="submit" disabled={buscando}>
              {buscando ? "Buscando..." : "Buscar"}
            </button>
          </form>
        </div>
      </section>

      {/* RESULTADOS DE BÚSQUEDA */}
      {busquedaRealizada && (
        <section
          id="resultados-busqueda"
          style={{
            maxWidth: "900px",
            margin: "35px auto",
            padding: "0 20px"
          }}
        >
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "10px",
            marginBottom: "16px"
          }}>
            <h2 style={{ margin: 0, color: "#00857A", fontSize: "1.4rem" }}>
              {terminoBusqueda.trim()
                ? `Resultados para "${terminoBusqueda.trim()}" (${resultados.length})`
                : `Todas las vacantes disponibles (${resultados.length})`}
            </h2>
            <button
              type="button"
              onClick={limpiarBusqueda}
              style={{
                background: "#eceff1",
                color: "#333",
                border: "1px solid #cfd8dc",
                padding: "7px 14px",
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: "600",
                fontSize: "0.9rem"
              }}
            >
              Cerrar búsqueda
            </button>
          </div>

          {errorBusqueda && (
            <p style={{ color: "#c62828", fontWeight: "600" }}>{errorBusqueda}</p>
          )}

          {!buscando && resultados.length === 0 && !errorBusqueda ? (
            <div style={{
              background: "#fff",
              border: "1px solid #ddd",
              padding: "20px",
              borderRadius: "8px",
              textAlign: "center",
              color: "#555"
            }}>
              No encontramos vacantes que coincidan con tu búsqueda. Intenta con otra palabra o empresa.
            </div>
          ) : (
            <div style={{ display: "grid", gap: "15px" }}>
              {resultados.map((v) => (
                <div
                  key={v.id}
                  style={{
                    background: "#fff",
                    border: "1px solid #ddd",
                    borderLeft: "5px solid #00857A",
                    padding: "18px 20px",
                    borderRadius: "8px",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.05)"
                  }}
                >
                  <h3 style={{ margin: "0 0 6px 0", color: "#00857A", fontSize: "1.15rem" }}>
                    {v.titulo}
                  </h3>
                  <p style={{ margin: "4px 0", fontSize: "0.95rem" }}>
                    <strong>Empresa:</strong> {v.nombre_empresa || v.nombre_empleador || "Empresa local"}
                  </p>
                  <p style={{ margin: "4px 0", fontSize: "0.95rem" }}>
                    <strong>Ubicación:</strong> {v.ubicacion || "No especificada"}
                  </p>
                  <p style={{ margin: "4px 0", fontSize: "0.95rem" }}>
                    <strong>Salario:</strong> {v.salario || "A convenir"}
                  </p>
                  <p style={{ margin: "10px 0 14px 0", color: "#444", fontSize: "0.95rem" }}>
                    {v.descripcion}
                  </p>
                  <button
                    type="button"
                    onClick={() => navigate("/login")}
                    style={{
                      background: "#00857A",
                      color: "#fff",
                      border: "none",
                      padding: "9px 16px",
                      borderRadius: "6px",
                      cursor: "pointer",
                      fontWeight: "bold",
                      fontSize: "0.9rem"
                    }}
                  >
                    Iniciar sesión para postularte
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

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
      <footer id="contacto-footer">
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