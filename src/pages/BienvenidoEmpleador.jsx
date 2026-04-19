import React from 'react';
import "../styles/BienvenidoEmpleador.css"; 

// 1. IMPORTACIONES (Asegúrate de que los nombres de la izquierda coincidan con los de abajo)
import buenJefe from "../assets/imagen-empleador/buenjefe.webp";
import contratadoOk from "../assets/imagen-empleador/contratado.webp";
import jefeGif from "../assets/imagen-empleador/jefe1.gif";

function BienvenidoEmpleador() {
  return (
    <div className="pantalla-motivaciona aparecer">
      
      {/* SALUDO SUPERIOR */}
      <h2 className="saludo-usuario">Bienvenido, [Nombre]</h2>

      {/* 2. AQUÍ ESTABA EL ERROR: Cambié 'imagenPrincipal' por 'buenJefe' */}
      <img src={buenJefe} alt="Bienvenida Empleador" className="imagen-cabecera" />

      <h1 className="titulo-gracias">¡GRACIAS!</h1>
      
      <p className="texto-agradecimiento-sena">
        Por participar y apoyar mi proyecto SENA registrándote como empleador, de parte del equipo LocalJobs.
      </p>

      <main className="seccion-mensaje">
        <div className="mensaje-contenedor">
          <p className="texto-motivacional">
            "El talento correcto transforma empresas. Gracias por confiar en nosotros para fortalecer su equipo profesional."
          </p>
          <img src={contratadoOk} alt="Empleado contratado" className="imagen-ok" />
        </div>
      </main>

      <footer className="seccion-final">
        <img src={jefeGif} alt="Celebración" className="gif-final" />
      </footer>
      
    </div>
  );
}

export default BienvenidoEmpleador;