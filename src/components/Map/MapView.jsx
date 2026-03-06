//paara refactorizar el mapa y que quede mas limpio el codigo, se creo este componente MapView.jsx, el cual se encarga de renderizar el mapa y los marcadores, ademas de recibir las props necesarias para mostrar la ubicacion del usuario y los baches

import { Marker, Popup, Circle } from "react-leaflet";

export default function MapView({ miUbicacion, precision }) {
  if (!miUbicacion) return null;

  return (
    <>
      <Marker position={miUbicacion}>
        <Popup>Estás aquí 📍</Popup>
      </Marker>

      {precision && (
        <Circle
          center={miUbicacion}
          radius={precision}
          pathOptions={{ fillColor: 'blue', color: 'blue', opacity: 0.3 }}
        />
      )}
    </>
  );
}