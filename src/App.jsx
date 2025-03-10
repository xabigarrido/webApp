import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Index from "./pages/Index";
import CrearEmpresa from "./pages/CrearEmpresa";
import EntrarEmpresa from "./pages/EntrarEmpresa";
import MesaQr from "./pages/MesaQr";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/mesa/:id" element={<MesaQr />} />
        <Route path="/crearEmpresa" element={<CrearEmpresa />} />
        <Route path="/entrarEmpresa" element={<EntrarEmpresa />} />
      </Routes>
    </Router>
  );
}

export default App;
