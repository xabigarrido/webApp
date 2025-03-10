import { useParams, useSearchParams } from "react-router-dom";

function MesaQr() {
  const { id } = useParams(); // Obtiene el ID de la mesa desde la URL
  const [searchParams] = useSearchParams();
  const empresa = searchParams.get("empresa"); // Obtiene la empresa desde los query params

  return (
    <div className="bg-red-500">
      <h1>Mesa QR</h1>
      <p>ID de Mesa: {id}</p>
      <p>Empresa: {empresa}</p>
    </div>
  );
}

export default MesaQr;
