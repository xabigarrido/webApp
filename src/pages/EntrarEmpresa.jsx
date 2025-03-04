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

function CrearEmpresa() {
  const [position, setPosition] = useState([37.7749, -122.4194]); // San Francisco inicial
  const [loading, setLoading] = useState(true);
  const [metrosRange, setMetrosRange] = useState(500);
  const [marker, setMarker] = useState(null); // Inicializar como null
  const [dataEmpresa, setDataEmpresa] = useState({
    nameEmpresa: "",
    distancePick: 0,
  });

  useEffect(() => {
    // Primero, obtenemos la ubicación del usuario
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

    // Luego, escuchamos los mensajes desde Expo
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
              nameEmpresa: coords.nameEmpresa || "Sin nombre", // Verifica si hay nombre
              distancePick: distancePick, // Usamos el valor de distancia convertido
            });
          }
        }
      } catch (error) {
        console.error("Error al recibir coordenadas desde Expo:", error); // Manejamos errores de parsing
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  // Estado que verifica si todo está listo para renderizar
  const isReady = !loading && marker !== null && dataEmpresa.nameEmpresa;

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {!isReady ? (
        <p>Cargando datos...</p>
      ) : (
        <>
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

export default CrearEmpresa;
