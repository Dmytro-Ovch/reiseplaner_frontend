import { createContext, useState, useContext } from "react";

const MapContext = createContext();

export const MapProvider = ({ children }) => {
  const [mapType, setMapType] = useState("leaflet"); // leaflet | arc

  const toggleMap = () => {
    setMapType((prev) => (prev === "leaflet" ? "arc" : "leaflet"));
  };

  return (
    <MapContext.Provider value={{ mapType, toggleMap }}>
      {children}
    </MapContext.Provider>
  );
};

export const useMap = () => useContext(MapContext);
