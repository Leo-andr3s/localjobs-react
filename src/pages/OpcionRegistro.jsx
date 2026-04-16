import "../styles/OpcionRegistro.css";
import logo from "../assets/logo/logo1.jpg";
import { useNavigate } from "react-router-dom";

function OpcionRegistro() {
  const navigate = useNavigate();

  const handleChange = (e) => {
    const value = e.target.value;

    if (value === "employer") {
      navigate("/registro-empleador");
    } else if (value === "worker") {
      navigate("/registro-trabajador");
    }
  };

  return (
    <div className="register-option fade-in">

      {/* ===== LOGO ===== */}
      <div className="logo-container">
        <img src={logo} alt="Logo LocalJobs" />
        <h1>LocalJobs</h1>
      </div>

      {/* ===== PREGUNTA ===== */}
      <label>¿Cómo deseas registrarte?</label>

      {/* ===== SELECT ===== */}
      <select className="form-select" onChange={handleChange}>
        <option value="">Selecciona una opción</option>
        <option value="employer">Como empleador</option>
        <option value="worker">Como trabajador</option>
      </select>

    </div>
  );
}

export default OpcionRegistro;