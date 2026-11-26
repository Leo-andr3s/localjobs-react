import "../styles/Inicio.css";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
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

  const [todasLasVacantes, setTodasLasVacantes] = useState([]);
  const [terminoBusqueda, setTerminoBusqueda] = useState("");
  const [mostrarLista, setMostrarLista] = useState(false);
  const [cargandoVacantes, setCargandoVacantes] = useState(false);
  const [errorCarga, setErrorCarga] = useState("");

  const buscadorRef = useRef(null);

  // Efecto de rotación de imágenes de fondo
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
    if (!hero) return;
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

  // Cargar las vacantes disponibles al abrir la página de inicio
  useEffect(() => {
    cargarVacantes();
  }, []);

  // Cerrar el desplegable si el usuario hace clic fuera del buscador
  useEffect(() => {
    const manejarClicExterno = (event) => {
      if (buscadorRef.current && !buscadorRef.current.contains(event.target)) {
        setMostrarLista(false);
      }
    };
    document.addEventListener("mousedown", manejarClicExterno);
    return () => document.removeEventListener("mousedown", manejarClicExterno);
  }, []);

  const cargarVacantes = async () => {
    setCargandoVacantes(true);
    setErrorCarga("");
    try {
      const res = await axios.get(`${API_URL}/vacantes`);
      setTodasLasVacantes(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error al cargar vacantes en inicio:", err);
      setErrorCarga("No se pudieron cargar las vacantes.");
    } finally {
      setCargandoVacantes(false);
    }
  };

  // Normalizar texto para comparar sin problemas de mayúsculas o acentos
  const normalizar = (str) =>
    (str || "")
      .toString()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

  const textoNormalizado = normalizar(terminoBusqueda.trim());

  const vacantesFiltradas = todasLasVacantes.filter((v) => {
    if (!textoNormalizado) return true;
    return (
      normalizar(v.titulo).includes(textoNormalizado) ||
      normalizar(v.nombre_empresa).includes(textoNormalizado) ||
      normalizar(v.nombre_empleador).includes(textoNormalizado) ||
      normalizar(v.ubicacion).includes(textoNormalizado) ||
      normalizar(v.descripcion).includes(textoNormalizado)
    );
  });

  const handleAbrirBuscador = () => {
    setMostrarLista(true);
    if (todasLasVacantes.length === 0 && !cargandoVacantes) {
      cargarVacantes();
    }
  };

  const handleSubmitBusqueda = (e) => {
    e.preventDefault();
    handleAbrirBuscador();
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
            <li>
              <a
                href="#buscar"
                onClick={(e) => {
                  e.preventDefault();
                  handleAbrirBuscador();
                  buscadorRef.current?.querySelector("input")?.focus();
                }}
              >
                Empleos
              </a>
            </li>
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
      <section className="hero" style={{ overflow: "visible" }}>
        <div className="hero-content" style={{ position: "relative", zIndex: 5 }}>
          <h1>
            Encuentra el trabajo ideal <span className="resaltar">cerca de ti</span>
          </h1>

          <p>
            Conecta con empresas locales y descubre oportunidades laborales en tu zona.
          </p>

          {/* CONTENEDOR RELATIVO PARA LA BARRA Y SU DESPLEGABLE */}
          <div
            ref={buscadorRef}
            style={{
              position: "relative",
              maxWidth: "560px",
              margin: "0 auto",
              width: "100%"
            }}
          >
            <form className="search-box" onSubmit={handleSubmitBusqueda} style={{ margin: 0 }}>
              <input
                type="text"
                placeholder="Buscar empleo o empresa..."
                value={terminoBusqueda}
                onFocus={handleAbrirBuscador}
                onClick={handleAbrirBuscador}
                onChange={(e) => {
                  setTerminoBusqueda(e.target.value);
                  setMostrarLista(true);
                }}
                autoComplete="off"
              />
              <button type="submit">Buscar</button>
            </form>

            {/* LISTA DESPLEGABLE DE VACANTES EN TIEMPO REAL */}
            {mostrarLista && (
              <div
                style={{
                  position: "absolute",
                  top: "calc(100% + 8px)",
                  left: 0,
                  right: 0,
                  backgroundColor: "#ffffff",
                  color: "#222",
                  borderRadius: "10px",
                  boxShadow: "0 10px 28px rgba(0, 0, 0, 0.25)",
                  border: "1px solid #d0d7de",
                  zIndex: 9999,
                  maxHeight: "340px",
                  overflowY: "auto",
                  textAlign: "left"
                }}
              >
                {/* Encabezado del desplegable */}
                <div
                  style={{
                    padding: "10px 14px",
                    borderBottom: "1px solid #eee",
                    backgroundColor: "#f8fafb",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    fontSize: "0.85rem",
                    color: "#555",
                    position: "sticky",
                    top: 0,
                    zIndex: 2
                  }}
                >
                  <span>
                    {cargandoVacantes
                      ? "Cargando vacantes..."
                      : `${vacantesFiltradas.length} ${vacantesFiltradas.length === 1 ? "resultado" : "resultados"}`}
                  </span>
                  {terminoBusqueda && (
                    <button
                      type="button"
                      onClick={() => setTerminoBusqueda("")}
                      style={{
                        background: "none",
                        border: "none",
                        color: "#00857A",
                        fontWeight: "bold",
                        cursor: "pointer",
                        fontSize: "0.82rem",
                        padding: 0
                      }}
                    >
                      Limpiar texto
                    </button>
                  )}
                </div>

                {/* Cuerpo del desplegable */}
                {cargandoVacantes ? (
                  <div style={{ padding: "18px", textAlign: "center", color: "#666", fontSize: "0.95rem" }}>
                    Buscando ofertas disponibles...
                  </div>
                ) : errorCarga ? (
                  <div style={{ padding: "18px", textAlign: "center", color: "#c62828", fontSize: "0.95rem" }}>
                    {errorCarga}
                  </div>
                ) : vacantesFiltradas.length === 0 ? (
                  <div style={{ padding: "22px 16px", textAlign: "center", color: "#555" }}>
                    <strong style={{ display: "block", fontSize: "1rem", color: "#222", marginBottom: "4px" }}>
                      0 resultados
                    </strong>
                    <span style={{ fontSize: "0.88rem" }}>
                      No hay vacantes disponibles que coincidan con "{terminoBusqueda}".
                    </span>
                  </div>
                ) : (
                  vacantesFiltradas.map((v) => (
                    <div
                      key={v.id}
                      onClick={() => navigate("/login")}
                      style={{
                        padding: "12px 16px",
                        borderBottom: "1px solid #f0f0f0",
                        cursor: "pointer",
                        transition: "background-color 0.15s ease"
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f1f9f8")}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#ffffff")}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "8px" }}>
                        <strong style={{ color: "#00857A", fontSize: "1rem" }}>{v.titulo}</strong>
                        <span style={{ fontSize: "0.82rem", fontWeight: "600", color: "#2e7d32" }}>
                          {v.salario ? `$${v.salario}` : "A convenir"}
                        </span>
                      </div>
                      <div style={{ fontSize: "0.85rem", color: "#444", marginTop: "3px" }}>
                        <strong>Empresa:</strong> {v.nombre_empresa || v.nombre_empleador || "Empresa local"} •{" "}
                        <strong>Ubicación:</strong> {v.ubicacion || "No especificada"}
                      </div>
                      {v.descripcion && (
                        <div
                          style={{
                            fontSize: "0.82rem",
                            color: "#666",
                            marginTop: "4px",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis"
                          }}
                        >
                          {v.descripcion}
                        </div>
                      )}
                      <div style={{ fontSize: "0.78rem", color: "#00857A", fontWeight: "600", marginTop: "5px" }}>
                        Clic para iniciar sesión y postularte →
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
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

