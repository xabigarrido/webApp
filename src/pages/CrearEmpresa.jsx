import { useEffect, useRef, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import LoadingMessage from "./LoadingMessage";
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
function ClickHandler({ onMapClick }) {
  useMapEvents({
    click(e) {
      onMapClick(e); // Asegúrate de que el evento sea correctamente manejado
    },
  });
  return null;
}

export default function CrearEmpresa() {
  const [position, setPosition] = useState([37.7749, -122.4194]); // San Francisco inicial
  const [loading, setLoading] = useState(true);
  const [metrosRange, setMetrosRange] = useState(500);
  const [marker, setMarker] = useState([37.7749, -122.4194]); // San Francisco inicial

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const userLocation = [pos.coords.latitude, pos.coords.longitude];
        setPosition(userLocation);
        setMarker(userLocation); // Aseguramos que el marcador también tenga la ubicación inicial
        setLoading(false);
      },
      () => {
        alert("No se pudo obtener la ubicación");
        setLoading(false);
      }
    );
  }, []);

  const handleMapClick = (event) => {
    const { lat, lng } = event.latlng;
    setMarker([lat, lng]); // Guarda solo un marcador
  };

  const handleSendLocation = () => {
    const miData = { ubicacionEmpresa: marker, metrosRange };

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
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#6d6d6d",
            flex: 1, // Asegura que el contenedor ocupe todo el espacio disponible
          }}
        >
          <LoadingMessage />
        </div>
      ) : (
        <>
          {/* Contenedor superior con input y botón */}
          <div
            style={{
              width: "100%",
              padding: "20px 30px",
              borderRadius: "15px",
              textAlign: "center",
              position: "fixed",
              top: "20px",
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 9999,
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              maxWidth: "500px",
              transition: "all 0.3s ease",
              backgroundColor: "white",
              color: "black",
            }}
          >
            <p
              style={{
                fontSize: "24px",
                fontWeight: "600",
                color: "#333",
                marginBottom: "10px",
              }}
            >
              Marca el lugar de tu empresa
            </p>
            <p
              style={{
                fontSize: "16px",
                color: "#555",
                marginBottom: "20px",
                lineHeight: "1.5",
              }}
            >
              Metros de distancia para poder acceder
            </p>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "15px",
                flexDirection: "column",
              }}
            >
              <div style={{ width: "100%" }}>
                <input
                  type="number"
                  inputMode="numeric"
                  placeholder="500 metros"
                  onChange={(event) =>
                    setMetrosRange(Number(event.target.value))
                  }
                  style={{
                    width: "90%",
                    padding: "12px 18px",
                    fontSize: "16px",
                    borderRadius: "8px",
                    border: "2px solid #ddd",
                    outline: "none",
                    boxSizing: "border-box",
                    transition: "all 0.3s ease",
                    marginBottom: "15px",
                    backgroundColor: "white",
                    color: "black",
                  }}
                  onFocus={(e) => (e.target.style.border = "2px solid #007BFF")}
                  onBlur={(e) => (e.target.style.border = "2px solid #ddd")}
                />
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
                    width: "90%",
                    fontWeight: "600",
                  }}
                >
                  Agregar ubicación
                </button>
              </div>
            </div>
          </div>

          {/* Contenedor del mapa que ocupa todo el espacio restante */}
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
                    <Popup>Ubicación seleccionada</Popup>
                  </Marker>
                  <Circle
                    center={marker}
                    radius={metrosRange}
                    pathOptions={{
                      color: "blue",
                      fillColor: "blue",
                      fillOpacity: 0.2,
                    }}
                  />
                </>
              )}
              <ClickHandler onMapClick={handleMapClick} />
            </MapContainer>
          </div>
        </>
      )}
    </div>
  );
}
