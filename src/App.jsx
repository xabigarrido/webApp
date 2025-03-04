import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Index from "./pages/Index";
import CrearEmpresa from "./pages/CrearEmpresa";
import EntrarEmpresa from "./pages/EntrarEmpresa";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/crearEmpresa" element={<CrearEmpresa />} />
        <Route path="/entrarEmpresa" element={<EntrarEmpresa />} />
        <Route path="/" element={<Index />} />
      </Routes>
    </Router>
  );
}

export default App;
