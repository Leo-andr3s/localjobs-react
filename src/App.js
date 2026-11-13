import { Routes, Route } from "react-router-dom";


import Inicio from "./pages/Inicio";
import Login from "./pages/Login";
import OpcionRegistro from "./pages/OpcionRegistro";
import FormularioEmpleador from "./pages/FormularioEmpleador";
import FormularioTrabajador from "./pages/FormularioTrabajador";
import BienvenidoTrabajador from './pages/BienvenidoTrabajador';
import BienvenidoEmpleador from './pages/BienvenidoEmpleador';

function App() {
 return (
   <Routes>
     <Route path="/" element={<Inicio />} />
     <Route path="/login" element={<Login />} />
     <Route path="/registro" element={<OpcionRegistro />} />
     <Route path="/registro-empleador" element={<FormularioEmpleador />} />
     <Route path="/registro-trabajador" element={<FormularioTrabajador />} />
     <Route path="/bienvenido-trabajador" element={<BienvenidoTrabajador />} />
     <Route path="/bienvenido-empleador" element={<BienvenidoEmpleador />} />
   </Routes>
 );
}


export default App;
