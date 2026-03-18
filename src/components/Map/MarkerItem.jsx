import L from "leaflet";
import { Marker, Popup } from "react-leaflet";
import MarkerPopup from "./MarketPopup";

export default function MarkerItem({ bache, onResolver }) {
  
  // Logica para elegir el color y la clase según severidad/estado
  const obtenerEstiloBache = (bache) => {
    if (bache.estado === "En reparación") return { color: "#ffc107", clase: "pulso-amarillo" };
    if (bache.severidad === "Alta") return { color: "#ff4d4d", clase: "pulso-rojo" };
    if (bache.severidad === "Media") return { color: "#ffc107", clase: "pulso-amarillo" };
    return { color: "#28a745", clase: "pulso-verde" }; // Baja o por defecto
  };

  const { color, clase } = obtenerEstiloBache(bache);

  //  css de los marcadores personalizados con efecto de pulso
  const bacheIcon = L.divIcon({
    className: "contenedor-bache-custom",
    html: `
      <div class="${clase}" style="
        background-color: ${color};
        /* AUMENTAMOS EL TAMAÑO AQUÍ (de 14px a 24px) */
        width: 24px;
        height: 24px;
        border-radius: 50%;
        border: 3px solid white; /* Borde un poco más grueso */
        box-shadow: 0 0 10px rgba(0,0,0,0.6);
      "></div>
      <style>
        .contenedor-bache-custom { background: none !important; border: none !important; }
        
        .pulso-rojo { animation: pulse-red 1.5s infinite; }
        .pulso-amarillo { animation: pulse-yellow 1.8s infinite; }
        .pulso-verde { animation: pulse-green 2s infinite; }

        @keyframes pulse-red {
          0% { box-shadow: 0 0 0 0 rgba(255, 77, 77, 0.8); }
          /* ONDA MÁS GRANDE TAMBIÉN */
          70% { box-shadow: 0 0 0 25px rgba(255, 77, 77, 0); }
          100% { box-shadow: 0 0 0 0 rgba(255, 77, 77, 0); }
        }
        @keyframes pulse-yellow {
          0% { box-shadow: 0 0 0 0 rgba(255, 193, 7, 0.8); }
          70% { box-shadow: 0 0 0 20px rgba(255, 193, 7, 0); }
          100% { box-shadow: 0 0 0 0 rgba(255, 193, 7, 0); }
        }
        @keyframes pulse-green {
          0% { box-shadow: 0 0 0 0 rgba(40, 167, 69, 0.8); }
          70% { box-shadow: 0 0 0 15px rgba(40, 167, 69, 0); }
          100% { box-shadow: 0 0 0 0 rgba(40, 167, 69, 0); }
        }
      </style>
    `,
   
    iconSize: [24, 24],
    iconAnchor: [12, 12], // La mitad del tamaño para centrarlo
    popupAnchor: [0, -15] // Ajuste para que el popup abra arriba del punto más grande
  });

  return (
    <Marker position={[bache.lat, bache.lng]} icon={bacheIcon}>
      <Popup closeButton={false}>
        <MarkerPopup 
          bache={bache} 
          onResolver={onResolver} 
        />
      </Popup>
    </Marker>
  );
}