import React, { useEffect, useRef, useState } from "react";
import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import Graphic from "@arcgis/core/Graphic";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import Point from "@arcgis/core/geometry/Point";
import Polyline from "@arcgis/core/geometry/Polyline";
import SimpleMarkerSymbol from "@arcgis/core/symbols/SimpleMarkerSymbol";
import SimpleLineSymbol from "@arcgis/core/symbols/SimpleLineSymbol";
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
      const f = data.features[0];
      const city = f.properties.city || f.properties.name || "Unbekannte Stadt";
      const country = f.properties.country || "Unbekanntes Land";
      const [lon, lat2] = f.geometry.coordinates;
      return { name: city, country, lat: lat2, lng: lon };
    }
  } catch (e) {
    console.error("Fehler beim Abrufen von Geoapify:", e);
  }
  return null;
}

export default function ArcMap() {
  const { routePoints, setRoutePoints } = useTravel();
  const mapDiv = useRef(null);
  const viewRef = useRef(null);
  const pointLayerRef = useRef(null);
  const lineLayerRef = useRef(null);

  const [alert, setAlert] = useState(null);

  // Hinweis anzeigen
  const showAlert = (message, type = "info") => {
    setAlert({ message, type });
    setTimeout(() => setAlert(null), 3000);
  };

  // Karte initialisieren
  useEffect(() => {
    if (!mapDiv.current) return;

    const map = new Map({
      basemap: { portalItem: { id: "f56c2695190f4f4da032f79b2d51aaa9" } }, // ArcGIS Light Gray Canvas
    });

    const view = new MapView({
      container: mapDiv.current,
      map,
      center: [10, 50], // Deutschland
      zoom: 5,
    });

    const pointLayer = new GraphicsLayer();
    const lineLayer = new GraphicsLayer({ elevationInfo: { mode: "relative-to-ground" } });

    map.addMany([lineLayer, pointLayer]);
    viewRef.current = view;
    pointLayerRef.current = pointLayer;
    lineLayerRef.current = lineLayer;

    // Klick auf Karte → Stadt hinzufügen
    view.on("click", async (evt) => {
      const { latitude, longitude } = evt.mapPoint;
      const city = await getCityByCoords(latitude, longitude);

      if (!city) {
        showAlert("Keine Stadt in der Nähe gefunden!", "error");
        return;
      }

      setRoutePoints((prev) => {
        if (prev.some((p) => p.name === city.name)) {
          showAlert("Stadt ist bereits in der Route!", "warning");
          return prev;
        }

        const updated = [...prev, city];
        showAlert(`Stadt hinzugefügt: ${city.name}`, "success");
        return updated;
      });
    });

    return () => view.destroy();
  }, []);

  // Route jedes Mal neu zeichnen, wenn sich routePoints ändert
  useEffect(() => {
    if (!pointLayerRef.current || !lineLayerRef.current) return;
    const pointLayer = pointLayerRef.current;
    const lineLayer = lineLayerRef.current;

    pointLayer.removeAll();
    lineLayer.removeAll();

    // Punkte zeichnen
    routePoints.forEach((pt, idx) => {
      const marker = new Graphic({
        geometry: new Point({ longitude: pt.lng, latitude: pt.lat }),
        symbol: new SimpleMarkerSymbol({
          color: idx === 0 ? "green" : "blue",
          size: "10px",
          outline: { color: "white", width: 1 },
        }),
        popupTemplate: {
          title: idx === 0 ? "Startpunkt" : `Zwischenpunkt ${idx}`,
          content: `<b>${pt.name}</b><br/>Land: ${pt.country}<br/>Lat: ${pt.lat.toFixed(
            4
          )}, Lng: ${pt.lng.toFixed(4)}`,
        },
      });
      pointLayer.add(marker);
    });

    // Linie zwischen Punkten zeichnen
    if (routePoints.length > 1) {
      const polyline = new Polyline({
        paths: routePoints.map((pt) => [pt.lng, pt.lat]),
      });

      const line = new Graphic({
        geometry: polyline,
        symbol: new SimpleLineSymbol({
          color: [255, 0, 0, 0.9],
          width: 3,
        }),
      });

      lineLayer.add(line);
    }
  }, [routePoints]);

  return (
    <div className="relative w-full h-screen">
      <div ref={mapDiv} className="w-full h-full"></div>

      {/* Alert über der Karte */}
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
