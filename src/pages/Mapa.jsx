import { MapContainer,TileLayer, useMapEvents,useMap} from "react-leaflet";

import MapView from "../components/Map/MapView";
import MarkerItem from "../components/Map/MarkerItem";

import Formulario from "../components/Map/Formulario";
import { useState, useEffect } from "react";
import Geolocation from "./Geolocalizacion";

import "leaflet/dist/leaflet.css";


//  FIX iconos Leaflet (Vite bug)
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});


// 📍 Detectar click en mapa
function ClickMapa({ setCoordsTemp, setMostrarForm }) {
  useMapEvents({
    click(e) {
      setCoordsTemp({
        lat: e.latlng.lat,
        lng: e.latlng.lng,
      });
      setMostrarForm(true);
    },
  });
  return null;
}


// 🔄 Recentrar mapa cuando cambia ubicación
function RecentrarMapa({ coords }) {
  const map = useMap();

  useEffect(() => {
    if (coords) {
      map.setView(coords, 16, { animate: true });
    }
  }, [coords, map]);

  return null;
}


function Mapa() {

  const [baches, setBaches] = useState([]);
  const [coordsTemp, setCoordsTemp] = useState(null);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [estado, setEstado] = useState("Reparar");
  const [severidad, setSeveridad] = useState("Media");

  const [miUbicacion, setMiUbicacion] = useState(null);
  const [precision, setPrecision] = useState(null);


  // 🌍 Reverse geocode
  async function obtenerDireccion(lat, lng) {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      const data = await response.json();
      return data.display_name || "Sin dirección";
    } catch {
      return "Sin dirección";
    }
  }


  // 💾 Guardar bache
  async function guardarBache() {
    if (!coordsTemp) return;

    const direccion = await obtenerDireccion(
      coordsTemp.lat,
      coordsTemp.lng
    );

    setBaches((prev) => [
      ...prev,
      {
        id: Date.now(),
        lat: coordsTemp.lat,
        lng: coordsTemp.lng,
        direccion,
        estado,
        severidad,
      },
    ]);

    setMostrarForm(false);
    setCoordsTemp(null);
  }


  //  Resolver bache
  function resolverBache(id) {
    setBaches((prev) => prev.filter((b) => b.id !== id));
  }


  return (
    <div className="container-fluid p-0" style={{ width: "'95%", height: "85vh" }}>

      {/*  Obtener ubicación */}
      <Geolocation
        setMiUbicacion={setMiUbicacion}
        setPrecision={setPrecision}
      />

      <MapContainer
        center={[-33.01, -58.52]}
        zoom={14}
        style={{ height: "100%", width: "100%" }}
      >

        <RecentrarMapa coords={miUbicacion} />

        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <ClickMapa
          setCoordsTemp={setCoordsTemp}
          setMostrarForm={setMostrarForm}
        />

        {/*  Mi ubicación */}
       <MapView miUbicacion={miUbicacion} precision={precision} />

        {/*  Baches */}

            {baches.map((bache) => (
        <MarkerItem 
          key={bache.id} 
          bache={bache} 
          onResolver={resolverBache} 
        />
           ))}

      </MapContainer>


  {/*  formulario */}


      <Formulario 
        mostrarForm={mostrarForm}
        setMostrarForm={setMostrarForm}
        estado={estado}
        setEstado={setEstado}
        severidad={severidad}
        setSeveridad={setSeveridad}
        guardarBache={guardarBache}
      />


      

    </div>
  );
}

export default Mapa;