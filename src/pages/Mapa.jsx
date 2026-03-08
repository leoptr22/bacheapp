import { MapContainer, TileLayer, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";

import supabase from "../services/supabaseClient";

import MapView from "../components/Map/MapView";
import MarkerItem from "../components/Map/MarkerItem";

import Formulario from "../components/Map/Formulario";
import { useState, useEffect } from "react";
import Geolocation from "./Geolocalizacion";

import "leaflet/dist/leaflet.css";


// FIX iconos Leaflet
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});


// Detectar click en mapa
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


// Recentrar mapa cuando cambia ubicación
function RecentrarMapa({ coords }) {
  const map = useMap();

  useEffect(() => {
    if (coords) {
      map.setView(coords, 18, { animate: true });
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

  const [user, setUser] = useState(null);
  const [foto, setFoto] = useState(null);

  const [miUbicacion, setMiUbicacion] = useState(null);
  const [precision, setPrecision] = useState(null);


  // obtener usuario logueado
  useEffect(() => {
    async function obtenerUsuario() {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    }

    obtenerUsuario();
  }, []);


  // Reverse geocode
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


  // Guardar bache
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
        foto
      },
    ]);

    setMostrarForm(false);
    setCoordsTemp(null);
  }


  // Resolver bache
  function resolverBache(id) {
    setBaches((prev) => prev.filter((b) => b.id !== id));
  }


  return (

    <div
      style={{
        height: "calc(100vh - 120px)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}
    >

      <div
        style={{
          width: "1300px",
          maxWidth: "95%",
          height: "100%",
          position: "relative"
        }}
      >

         {user && (
  <div
    style={{
      position: "fixed",
      top: 20,
      left: 20,
      background: "rgba(255,255,255,0.9)",
      color: "black",
      padding: "6px 12px",
      borderRadius: "8px",
      zIndex: 9999,
      backdropFilter: "blur(4px)",
      boxShadow: "0 2px 8px rgba(0,0,0,0.25)"
    }}
  >
    👤 {user.email}
  </div>
)}


        <Geolocation
          setMiUbicacion={setMiUbicacion}
          setPrecision={setPrecision}
        />


        <MapContainer
          center={[-33.01, -58.52]}
          zoom={18}
          style={{
            height: "100%",
            width: "100%",
            borderRadius: "12px",
            boxShadow: "0 15px 40px rgba(0,0,0,0.35)"
          }}
        >

          <RecentrarMapa coords={miUbicacion} />

          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <ClickMapa
            setCoordsTemp={setCoordsTemp}
            setMostrarForm={setMostrarForm}
          />

          <MapView
            miUbicacion={miUbicacion}
            precision={precision}
          />

          {baches.map((bache) => (
            <MarkerItem
              key={bache.id}
              bache={bache}
              onResolver={resolverBache}
            />
          ))}

        </MapContainer>

      </div>


      <Formulario
        mostrarForm={mostrarForm}
        setMostrarForm={setMostrarForm}
        estado={estado}
        setEstado={setEstado}
        severidad={severidad}
        setSeveridad={setSeveridad}
        guardarBache={guardarBache}
        setFoto={setFoto}
      />

    </div>
  );
}

export default Mapa;