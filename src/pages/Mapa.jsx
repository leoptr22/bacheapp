import { MapContainer, TileLayer, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";
import { useState, useEffect } from "react";
import supabase from "../services/supabaseClient";

// Componentes propios
import MapView from "../components/Map/MapView";
import MarkerItem from "../components/Map/MarkerItem";
import Formulario from "../components/Map/Formulario";
import Geolocation from "./Geolocalizacion";
import NoticiasModal from "../pages/NoticiasModal";

// Estilos
import "leaflet/dist/leaflet.css";

// FIX iconos Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function ClickMapa({ setCoordsTemp, setMostrarForm }) {
  useMapEvents({
    click(e) {
      setCoordsTemp({ lat: e.latlng.lat, lng: e.latlng.lng });
      setMostrarForm(true);
    },
  });
  return null;
}

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

  useEffect(() => {
    async function obtenerUsuario() {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    }
    obtenerUsuario();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  async function obtenerDireccion(lat, lng) {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
      const data = await response.json();
      return data.display_name || "Sin dirección";
    } catch { return "Sin dirección"; }
  }

  async function guardarBache() {
    if (!coordsTemp) return;
    const direccion = await obtenerDireccion(coordsTemp.lat, coordsTemp.lng);
    setBaches((prev) => [...prev, { id: Date.now(), lat: coordsTemp.lat, lng: coordsTemp.lng, direccion, estado, severidad, foto }]);
    setMostrarForm(false);
    setCoordsTemp(null);
  }

  function resolverBache(id) {
    setBaches((prev) => prev.filter((b) => b.id !== id));
  }

  return (
    <div style={{ 
      height: "100vh", 
      width: "100vw", 
      display: "flex", 
      flexDirection: "column", 
      backgroundColor: "#121212",
      overflow: "hidden", 
      position: "fixed",  
      top: 0,
      left: 0
    }}>
      
      {/* CABECERA - Altura fija */}
      <header style={{ 
        height: "60px", 
        padding: "0 20px", 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center", 
        backgroundColor: "#1a1a1a", 
        borderBottom: "1px solid #333", 
        zIndex: 1001,
        flexShrink: 0,
        boxSizing: "border-box"
      }}>
        {user && (
          <div style={{ 
            background: "rgba(197, 45, 45, 0.9)", 
            padding: " 10px", 
            borderRadius: "20px", 
            fontSize: "20px", 
            fontWeight: "Thin",
            display: "flex", 
            alignItems: "center", 
            gap: "8px"
          }}>
           <span>👤</span>
<span>{
  (user?.email?.split("@")[0] || user?.displayName || "Usuario").slice(0, 6)
}</span>
          </div>
        )}

        <h1 style={{ fontSize: "20px", fontWeight: "900", color: "#fff", margin: 0, textAlign: "center", flex: 1 }}>
          GUALE<span style={{ color: "#ffc107" }}>BACHE</span>
        </h1>

        <button onClick={handleLogout} className="btn btn-danger btn-sm" style={{ borderRadius: "20px", fonfontWeight: "bold" }}>
          SALIR
        </button>
      </header>

      <main style={{ 
        flex: 1, 
        position: "relative",
        display: "flex",
        flexDirection: "column",
        padding: "10px",
        boxSizing: "border-box",
        overflow: "hidden", 
        minHeight: 0
      }}>
        <Geolocation setMiUbicacion={setMiUbicacion} setPrecision={setPrecision} />
        
        <div style={{ 
          flex: 1, 
          width: "100%", 
          borderRadius: "12px", 
          overflow: "hidden", 
          boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
          border: "1px solid #333",
          position: "relative",
          zIndex: 1
        }}>
          <MapContainer 
            center={[-33.01, -58.52]} 
            zoom={15} 
            zoomControl={true} 
            style={{ height: "100%", width: "100%" }}
          >
            <RecentrarMapa coords={miUbicacion} />
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <ClickMapa setCoordsTemp={setCoordsTemp} setMostrarForm={setMostrarForm} />
            <MapView miUbicacion={miUbicacion} precision={precision} />
            {baches.map((bache) => (
              <MarkerItem key={bache.id} bache={bache} onResolver={resolverBache} />
            ))}
          </MapContainer>
        </div>
      </main>

      {/* MODALES - No ocupan espacio en el flujo de la pantalla */}
      <Formulario mostrarForm={mostrarForm} setMostrarForm={setMostrarForm} estado={estado} setEstado={setEstado} severidad={severidad} setSeveridad={setSeveridad} guardarBache={guardarBache} setFoto={setFoto} />
      <NoticiasModal />
    </div>
  );
}

export default Mapa;