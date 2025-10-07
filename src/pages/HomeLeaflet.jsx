import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvent, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Roter Marker mit weißer Umrandung
const redMarkerIcon = L.divIcon({
  className: "custom-marker",
  html: `<div style="
      width:16px;
      height:16px;
      background:red;
      border:2px solid white;
      border-radius:50%;
  "></div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

export default function LeafletMap() {
  // Punkt definieren
  const point = {
    type: "point",
    longitude: 13.54008,
    latitude: 52.45714,
  };

  // Marker-Position auf point setzen
  const [markerPosition, setMarkerPosition] = useState({
    lat: point.latitude,
    lng: point.longitude,
  });

  // Klick-Handler, um Marker zu verschieben
  function ClickHandler() {
    const map = useMap();
    useMapEvent("click", (e) => {
      setMarkerPosition({ lat: e.latlng.lat, lng: e.latlng.lng });
      map.setView(e.latlng, map.getZoom());
    });
    return null;
  }

  // Legende unten links
  function Legend() {
    const map = useMap();
    useEffect(() => {
      const legend = L.control({ position: "bottomleft" });
      legend.onAdd = function () {
        const div = L.DomUtil.create("div", "info legend");
        div.style.background = "white";
        div.style.padding = "6px 8px";
        div.style.borderRadius = "4px";
        div.style.boxShadow = "0 0 5px rgba(0,0,0,0.3)";
        div.innerHTML =
          "<b>Legende</b><br>" +
          "<i style='background:red;width:12px;height:12px;display:inline-block;margin-right:5px;'></i> Marker";
        return div;
      };
      legend.addTo(map);
      return () => legend.remove();
    }, [map]);
    return null;
  }

  // Zoom-Control oben links
  function ZoomControl({ position = "topleft" }) {
    const map = useMap();
    useEffect(() => {
      const zoom = L.control.zoom({ position });
      zoom.addTo(map);
      return () => map.removeControl(zoom);
    }, [map, position]);
    return null;
  }

  return (
    <MapContainer
      center={[50, 10]} // Deutschland
      zoom={6} // Standardzoom
      style={{ height: "100vh", width: "100%" }}
      zoomControl={false} // Position manuell
    >
      {/* Basemap */}
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />

      {/* Klick-Handler */}
      <ClickHandler />

      {/* Marker */}
      {markerPosition && (
        <Marker position={[markerPosition.lat, markerPosition.lng]} icon={redMarkerIcon}>
          <Popup>
            Lat: {markerPosition.lat.toFixed(4)}, Lng: {markerPosition.lng.toFixed(4)}
          </Popup>
        </Marker>
      )}

      {/* Legende */}
      <Legend />

      {/* Zoom-Control */}
      <ZoomControl />
    </MapContainer>
  );
}
