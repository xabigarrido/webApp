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
    <Marker position={position} ref={markerRef}>
      <Popup>¡Estás aquí!</Popup>
    </Marker>
  );
}

function ClickHandler({ onMapClick }) {
  useMapEvents({
    click(e) {
      onMapClick(e); // Asegúrate de que el evento sea correctamente manejado
    },
  });
  return null;
}

export default function App() {
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
        <p>Cargando ubicación...</p>
      ) : (
        <>
          {/* Contenedor superior con input y botón */}
          <div
            style={{
              width: "100%",
              backgroundColor: "white",
              padding: 10,
              borderRadius: 10,
              textAlign: "center",
              position: "fixed",
              zIndex: 890890,
            }}
          >
            <p style={{ fontSize: 20 }}>Marca el lugar de tu empresa</p>
            <p style={{ fontSize: 16 }}>
              Metros de distancia para poder acceder
            </p>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 10,
              }}
            >
              <div style={{ display: "flex", flexDirection: "column" }}>
                <input
                  type="number"
                  inputMode="numeric"
                  style={{ padding: 10 }}
                  placeholder="500 metros"
                  onChange={(event) =>
                    setMetrosRange(Number(event.target.value))
                  } // Convertí el valor a número
                />
                <button onClick={handleSendLocation}>Agregar ubicación</button>
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
                  <Marker position={marker}>
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
