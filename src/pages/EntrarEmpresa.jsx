import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Circle } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function Mapa() {
  const [userPosition, setUserPosition] = useState(null); // Ubicación del usuario
  const [expoPosition, setExpoPosition] = useState(null); // Ubicación desde Expo
  const defaultPosition = [40.4168, -3.7038]; // Coordenadas por defecto (Madrid)

  useEffect(() => {
    // Obtener la ubicación del usuario
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserPosition([pos.coords.latitude, pos.coords.longitude]);
      },
      (error) => {
        console.error("Error obteniendo ubicación del usuario:", error);
        setUserPosition(defaultPosition); // Si falla, usa la ubicación por defecto
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );

    // Escuchar mensajes desde Expo
    const handleMessage = (event) => {
      try {
        if (typeof event.data === "string") {
          const coords = JSON.parse(event.data);
          if (coords.lat && coords.lng) {
            setExpoPosition([coords.lat, coords.lng]);
          }
        }
      } catch (error) {
        console.error("Error al recibir coordenadas desde Expo:", error);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return (
    <div style={{ height: "100vh", width: "100vw" }}>
      <MapContainer
        center={userPosition || defaultPosition} // Se carga el mapa incluso si la posición del usuario es null
        zoom={15}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {/* Marcador del usuario */}
        {userPosition && <Marker position={userPosition} />}

        {/* Marcador y círculo de la ubicación desde Expo */}
        {expoPosition && (
          <>
            <Marker position={expoPosition} />
            <Circle
              center={expoPosition}
              radius={500}
              pathOptions={{
                color: "red",
                fillColor: "red",
                fillOpacity: 0.2,
              }}
            />
          </>
        )}
      </MapContainer>
    </div>
  );
}
