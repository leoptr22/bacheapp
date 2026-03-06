import { useEffect } from "react";

function Geolocation({ setMiUbicacion, setPrecision }) {

  useEffect(() => {

    if (navigator.geolocation) {

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;

          setMiUbicacion([latitude, longitude]);
          setPrecision(position.coords.accuracy);
        },
        (error) => {
          console.log("Error:", error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    }

  }, [setMiUbicacion, setPrecision]);

  return null;
}

export default Geolocation;