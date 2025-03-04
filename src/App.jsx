import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Index from "./pages/Index";
import CrearEmpresa from "./pages/CrearEmpresa";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/CrearEmpresa" element={<CrearEmpresa />} />
      </Routes>
    </Router>
  );
}

export default App;
