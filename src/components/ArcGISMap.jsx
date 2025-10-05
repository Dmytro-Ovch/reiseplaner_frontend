import { useEffect, useRef } from "react";
import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import Graphic from "@arcgis/core/Graphic";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";

export default function ArcMap() {
  const mapDiv = useRef(null);

  useEffect(() => {
    const map = new Map({
      // Basemap verwenden
      basemap: {
        portalItem: {
          id: "f56c2695190f4f4da032f79b2d51aaa9"
        }
      }
    });

    const view = new MapView({
      container: mapDiv.current,
      map: map,
      center: [13.4050, 52.5200], // Berlin
      zoom: 6,
    });

    const graphicsLayer = new GraphicsLayer();
    map.add(graphicsLayer);

    // Städte (Beispiel: Berlin und München)
    const cities = [
      { name: "Berlin", coords: [13.4050, 52.5200] },
      { name: "München", coords: [11.5820, 48.1351] },
    ];

    // Punkte für die Städte
    cities.forEach((city) => {
      const pointGraphic = new Graphic({
        geometry: {
          type: "point",
          longitude: city.coords[0],
          latitude: city.coords[1],
        },
        symbol: {
          type: "simple-marker",
          color: "red",
          size: "12px",
        },
        attributes: city,
        popupTemplate: { title: `Stadt: {name}` }, // Popup auf Deutsch
      });
      graphicsLayer.add(pointGraphic);
    });

    // Linie für die Route
    const line = new Graphic({
      geometry: {
        type: "polyline",
        paths: cities.map((c) => c.coords),
      },
      symbol: {
        type: "simple-line",
        color: [0, 0, 255],
        width: 2,
        marker: {
          style: "arrow",
          placement: "end",
          color: [0, 0, 255],
        },
      },
      popupTemplate: { title: "Route zwischen Städten" }, 
    });

    graphicsLayer.add(line);

    return () => {
      view.destroy();
    };
  }, []);

  return <div className="w-full h-full" ref={mapDiv}></div>;
}
