
import MarkerPopup from "./MarketPopup";

import { Marker, Popup } from "react-leaflet";

export default function MarkerItem({ bache, onResolver }) {
  return (
    <Marker position={[bache.lat, bache.lng]}>
      <Popup>
        <MarkerPopup 
          bache={bache} 
          onResolver={onResolver} 
        />
      </Popup>
    </Marker>
  );
}