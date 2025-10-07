import React, { useContext } from "react";
import HomeArcGIS from "./HomeArcGIS";
import HomeLeaflet from "./HomeLeaflet";
import { useMap } from "../contexts/MapContext";

export default function Home() {
  const { mapType } = useMap(); // "leaflet" oder "arcgis"

  // Gemeinsamer Punkt für beide Karten
  const centerPoint = { latitude: 52.45714, longitude: 13.54008 };

  return (
    <div className="w-full h-full">
      {mapType === "leaflet" ? (
        <HomeLeaflet initialPoint={centerPoint} />
      ) : (
        <HomeArcGIS centerPoint={centerPoint} />
      )}
    </div>
  );
}
