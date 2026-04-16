import { Routes, Route } from "react-router-dom";

import Inicio from "./pages/Inicio";
import Login from "./pages/Login";
import OpcionRegistro from "./pages/OpcionRegistro";
import FormularioEmpleador from "./pages/FormularioEmpleador";
import FormularioTrabajador from "./pages/FormularioTrabajador";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Inicio />} />
      <Route path="/login" element={<Login />} />
      <Route path="/registro" element={<OpcionRegistro />} />
      <Route path="/registro-empleador" element={<FormularioEmpleador />} />
      <Route path="/registro-trabajador" element={<FormularioTrabajador />} />
    </Routes>
  );
}

export default App;