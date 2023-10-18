import React, { useState, useEffect } from "react";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";
import axios from "axios";
import { useTranslation } from "react-i18next";

const containerStyle = {
  width: "100%",
  height: "400px",
};
const customAxios = axios.create();

const Maps = ({ onClick, setCurrentAddress }) => {
  const { t, i18n } = useTranslation();

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_API_KEY,
  });
  const [coords, setCoords] = useState({ lat: 0, lng: 0 });
  const [map, setMap] = React.useState(null);
  const [markerPosition, setMarkerPosition] = useState({});
  useEffect(() => {
    const success = (e) => {
      const _coords = {
        lat: parseFloat(e.coords.latitude),
        lng: parseFloat(e.coords.longitude),
      };
      setCoords(_coords);
      setCurrentAddress && setMarkerPosition(_coords);
    };
    navigator.geolocation.getCurrentPosition(success);
  }, []);
  const onLoad = React.useCallback(
    function callback(map) {
      const bounds = new window.google.maps.LatLngBounds(coords);
      map.fitBounds(bounds);
      setMap(map);
    },
    [coords]
  );
  const onUnmount = React.useCallback(function callback(map) {
    setMap(null);
  }, []);

  const changeMarketPosition = (r) => {
    setMarkerPosition({
      lat: parseFloat(r.latLng.lat()),
      lng: parseFloat(r.latLng.lng()),
    });
  };

  useEffect(() => {
    markerPosition.lat &&
      customAxios
        .get(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${markerPosition.lat},${markerPosition.lng}&key=${process.env.REACT_APP_GOOGLE_API_KEY}`,
          { headers: { "Accept-Language": i18n.language } }
        )
        .then(({ data }) => {
          onClick(data.results[0]);
        });
  }, [markerPosition.lat]);
  return isLoaded && coords.lat ? (
    <div className="p-auto">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={coords}
        zoom={10}
        onLoad={onLoad}
        onUnmount={onUnmount}
        onClick={changeMarketPosition}
      >
        {markerPosition.lat && (
          <Marker position={markerPosition} onClick={(e) => console.log(e)} />
        )}
      </GoogleMap>
    </div>
  ) : (
    <></>
  );
};

export default React.memo(Maps);
