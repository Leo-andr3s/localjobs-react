import React from 'react';
import "../styles/BienvenidoTrabajador.css"; 

// IMPORTACIONES DE IMÁGENES
import trabajadoresImg from "../assets/imagen-trabajador/trabajadores.jpg";
import trabajadorOk from "../assets/imagen-trabajador/trabajadorok.jpg";
import trabajadorGif from "../assets/imagen-trabajador/trabajador2.gif";

function BienvenidoTrabajador() {
  return (
    <div className="pantalla-motivacional aparecer">
      
      {/* --- SALUDO SUPERIOR --- */}
      <h2 className="saludo-usuario">Bienvenido, [Nombre]</h2>

      {/* Imagen de cabecera */}
      <img src={trabajadoresImg} alt="Nuestro Equipo" className="imagen-cabecera" />

      {/* Sección de Títulos */}
      <h1 className="titulo-gracias">¡GRACIAS!</h1>
      
      <p className="texto-agradecimiento-sena">
        Por participar y apoyar mi proyecto SENA registrándote como trabajador, de parte del equipo LocalJobs.
      </p>

      {/* Mensaje motivacional e imagen circular */}
      <main className="seccion-mensaje">
        <div className="mensaje-contenedor">
          <p className="texto-motivacional">
            "El éxito no es solo lo que logramos individualmente, sino lo que inspiramos en los demás."
          </p>
          <img src={trabajadorOk} alt="Todo ok" className="imagen-ok" />
        </div>
      </main>

      {/* GIF al final */}
      <footer className="seccion-final">
        <img src={trabajadorGif} alt="Celebración" className="gif-final" />
      </footer>
      
    </div>
  );
}

export default BienvenidoTrabajador;