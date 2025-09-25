import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Polyline, Popup, useMapEvent } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-polylinedecorator";
import { useTravel } from "../contexts/TravelContext";

// Funktion: Stadtname anhand von Koordinaten abrufen
async function getCityByCoords(lat, lng) {
  try {
    const res = await fetch(
      `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lng}&type=city&limit=1&apiKey=${import.meta.env.VITE_GEOAPIFY_KEY}`
    );

    if (!res.ok) {
      console.error("Geoapify API Fehler:", res.status, res.statusText);
      return null;
    }

    const data = await res.json();
    if (data.features && data.features.length > 0) {
      const feature = data.features[0];
      const cityName = feature.properties.city || feature.properties.name || "Unbekannt";
      const countryName = feature.properties.country || "Unbekanntes Land";
      const [lon, latitude] = feature.geometry.coordinates;

      return { name: cityName, country: countryName, lat: latitude, lng: lon };
    }
  } catch (err) {
    console.error("Fehler beim Abrufen von Geoapify:", err);
  }
  return null;
}

export default function LeafletMap() {
  const { routePoints, setRoutePoints } = useTravel();

  // State für DaisyUI Alert
  const [alert, setAlert] = useState(null);

  // Funktion: Alert anzeigen und nach 3 Sekunden automatisch ausblenden
  const showAlert = (message, type = "info") => {
    setAlert({ message, type });
    setTimeout(() => setAlert(null), 3000);
  };

  // Klick-Handler für die Karte
  function ClickHandler() {
    useMapEvent("click", async (e) => {
      const city = await getCityByCoords(e.latlng.lat, e.latlng.lng);

      if (!city) {
        showAlert("Keine Stadt in der Nähe gefunden!", "error");
        return;
      }

      const exists = routePoints.some(pt => pt.name === city.name);

      if (exists) {
        showAlert("Stadt ist bereits in der Route!", "warning");
      } else {
        setRoutePoints([...routePoints, city]);
        showAlert(`Gewählte Stadt: ${city.name}, Land: ${city.country}`, "success");
      }
    });
    return null;
  }

  // Route zurücksetzen
  const resetRoute = () => setRoutePoints([]);

  // Letzten Punkt entfernen
  const undoLastPoint = () => setRoutePoints(prev => prev.slice(0, -1));

  // Pfeile auf Linie darstellen
  useEffect(() => {
    const map = window._leaflet_map_instance;
    if (!map || routePoints.length < 2) return;

    // Alte Pfeile entfernen
    map.eachLayer(layer => {
      if (layer.options && layer.options._isArrowDecorator) map.removeLayer(layer);
    });

    // Neue Linie erstellen
    const polyline = L.polyline(routePoints.map(pt => [pt.lat, pt.lng]));

    // Pfeile auf Linie hinzufügen
    const decorator = L.polylineDecorator(polyline, {
      patterns: [{
        offset: 25,
        repeat: 50,
        symbol: L.Symbol.arrowHead({
          pixelSize: 10,
          polygon: false,
          pathOptions: { stroke: true, color: "red", weight: 2 }
        })
      }]
    }).addTo(map);

    decorator.options._isArrowDecorator = true;
  }, [routePoints]);

  return (
    <div className="relative w-full h-screen">
      {/* Karte */}
      <MapContainer
        center={[20, 0]}
        zoom={3}
        style={{ height: "100%", width: "100%" }}
        whenCreated={mapInstance => { window._leaflet_map_instance = mapInstance; }}
      >
        {/* TileLayer */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />

        {/* Klick-Handler */}
        <ClickHandler />

        {/* Marker */}
        {routePoints.map((pt, idx) => (
          <Marker
            key={idx}
            position={{ lat: pt.lat, lng: pt.lng }}
            icon={L.icon({
              iconUrl: idx === 0
                ? "https://maps.google.com/mapfiles/ms/icons/green-dot.png"
                : "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
              iconSize: [32, 32],
              iconAnchor: [16, 32],
            })}
          >
            <Popup>
              {idx === 0 ? "Startpunkt" : `Zwischenpunkt ${idx}`}<br />
              Stadt: {pt.name}<br />
              Land: {pt.country}<br />
              Lat: {pt.lat.toFixed(4)}, Lng: {pt.lng.toFixed(4)}
            </Popup>
          </Marker>
        ))}

        {/* Linie */}
        {routePoints.length > 1 && (
          <Polyline positions={routePoints.map(pt => [pt.lat, pt.lng])} color="red" weight={3} />
        )}
      </MapContainer>

      {/* DaisyUI Alert – außerhalb von MapContainer, absolut über der Karte */}
      {alert && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000]">
          <div
            className={`alert shadow-lg ${
              alert.type === "success"
                ? "alert-success"
                : alert.type === "error"
                ? "alert-error"
                : "alert-warning"
            }`}
          >
            <span>{alert.message}</span>
          </div>
        </div>
      )}
    </div>
  );
}
