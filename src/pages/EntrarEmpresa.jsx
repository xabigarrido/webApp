import { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
function AutoPopupMarker({ position }) {
  const markerRef = useRef(null);

  useEffect(() => {
    // Esperamos 500ms para asegurarnos de que el marcador se haya renderizado
    const timer = setTimeout(() => {
      if (markerRef.current) {
        markerRef.current.openPopup();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [markerRef]);

  return (
    <Marker position={position} ref={markerRef} icon={customIcon}>
      <Popup>¡Estás aquí!</Popup>
    </Marker>
  );
}
const customIcon = new L.Icon({
  iconUrl: "/images/marker.png", // Ruta relativa a la carpeta 'public'
  iconSize: [50, 50], // Ajusta según el tamaño de tu imagen
  iconAnchor: [20, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export default function CrearEmpresa() {
  const [position, setPosition] = useState([37.7749, -122.4194]); // San Francisco inicial
  const [loading, setLoading] = useState(true);
  const [marker, setMarker] = useState([37.7749, -122.4194]); // San Francisco inicial
  const [dataEmpresa, setDataEmpresa] = useState({
    nameEmpresa: "dewdew",
    distancePick: 0,
    trabajando: "false",
  });
  useEffect(() => {
    setDataEmpresa({
      nameEmpresa: window.nameEmpresa,
      distancePick: window.distancePick,
      trabajando: window.trabajando,
    });
    setMarker([window.latEmpresa, window.longEmpresa]);
  }, []);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const userLocation = [pos.coords.latitude, pos.coords.longitude];
        setPosition(userLocation);
        setLoading(false);
      },
      () => {
        alert("No se pudo obtener la ubicación");
        setLoading(false);
      }
    );

    const handleMessage = (event) => {
      try {
        if (typeof event.data === "string") {
          const coords = JSON.parse(event.data); // Parseamos el JSON

          // Verificamos que las coordenadas lat y lng existen
          if (coords.lat && coords.lng) {
            // Actualizamos la posición del marcador
            setMarker([coords.lat, coords.lng]);

            // Aseguramos que 'distancePick' sea un número válido
            const distancePick = !isNaN(Number(coords.distancePick))
              ? Number(coords.distancePick) // Si es un número válido, lo usamos
              : 500; // Si no, establecemos un valor por defecto (500)

            // Actualizamos el estado de la empresa
            setDataEmpresa({
              nameEmpresa: coords.nameEmpresa, // Nombre de la empresa
              distancePick: distancePick, // Usamos el valor de distancia convertido
              trabajando: coords.trabajando,
            });
          }
        }
      } catch (error) {
        console.error("Error al recibir coordenadas desde Expo:", error); // Manejamos errores de parsing
      }
    };

    // Detectamos el sistema operativo a partir del user agent
    const isIOS =
      /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    const isAndroid = /Android/.test(navigator.userAgent);

    if (isAndroid) {
      // En Android se utiliza 'document'
      document.addEventListener("message", handleMessage);
    }
    if (isIOS) {
      // En iOS se utiliza 'window'
      window.addEventListener("message", handleMessage);
    }

    return () => {
      if (isAndroid) {
        document.removeEventListener("message", handleMessage);
      } else {
        window.removeEventListener("message", handleMessage);
      }
    };
  }, []);

  const handleSendLocation = () => {
    const miData = { action: "confirm", ubicacionEmpleado: position };

    // Asegúrate de que window.ReactNativeWebView esté definido antes de intentar usarlo
    if (typeof window !== "undefined" && window.ReactNativeWebView) {
      window.ReactNativeWebView.postMessage(JSON.stringify(miData));
    } else {
      console.error("ReactNativeWebView no está disponible.");
    }
  };
  const handleCancel = () => {
    const miData = { action: "cancel", ubicacionEmpleado: position };

    // Asegúrate de que window.ReactNativeWebView esté definido antes de intentar usarlo
    if (typeof window !== "undefined" && window.ReactNativeWebView) {
      window.ReactNativeWebView.postMessage(JSON.stringify(miData));
    } else {
      console.error("ReactNativeWebView no está disponible.");
    }
  };
  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {loading ? (
        <p>Cargando ubicación...</p>
      ) : (
        <>
          <div
            style={{
              width: "100%",
              backgroundColor: "#ffffff",
              padding: "20px 30px",
              borderRadius: "15px",
              textAlign: "center",
              position: "fixed",
              bottom: "80px",
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 9999,
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              maxWidth: "500px",
              transition: "all 0.3s ease",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "15px",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  width: "100%",
                  gap: 10,
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <button
                  onClick={handleSendLocation}
                  style={{
                    backgroundColor: "#007BFF",
                    color: "#fff",
                    padding: "12px 30px",
                    borderRadius: "8px",
                    border: "none",
                    fontSize: "16px",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    width: "40%",
                    fontWeight: "600",
                  }}
                >
                  {dataEmpresa.trabajando === "true"
                    ? "Iniciar turno"
                    : "Cerrar turno"}
                </button>
                <button
                  onClick={handleCancel}
                  style={{
                    backgroundColor: "#ff0000",
                    color: "#fff",
                    padding: "12px 30px",
                    borderRadius: "8px",
                    border: "none",
                    fontSize: "16px",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    width: "40%",
                    fontWeight: "600",
                  }}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
          <div style={{ flexGrow: 1 }}>
            <MapContainer
              center={position}
              zoom={15}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <AutoPopupMarker position={position} />

              {marker && (
                <>
                  <Marker position={marker} icon={customIcon}>
                    <Popup>{dataEmpresa.nameEmpresa}</Popup>
                  </Marker>
                  <Circle
                    center={marker}
                    radius={dataEmpresa.distancePick}
                    pathOptions={{
                      color: "blue",
                      fillColor: "blue",
                      fillOpacity: 0.2,
                    }}
                  />
                </>
              )}
            </MapContainer>
          </div>
        </>
      )}
    </div>
  );
}
