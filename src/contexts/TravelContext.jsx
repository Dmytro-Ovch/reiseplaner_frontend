import { createContext, useState, useEffect, useContext } from "react";

export const TravelContext = createContext();

export const TravelProvider = ({ children }) => {
  // Punkte aus LocalStorage
  const [routePoints, setRoutePoints] = useState(() => {
    const stored = localStorage.getItem("travelRoute");
    return stored ? JSON.parse(stored) : [];
  });

  // Vom User gewählte Fotos
  const [photos, setPhotos] = useState(() => {
    const stored = localStorage.getItem("travelPhotos");
    return stored ? JSON.parse(stored) : {};
  });

  // Unsplash-Suchergebnisse (nicht automatisch ausgewählt!)
  const [unsplash, setUnsplash] = useState(() => {
    const stored = localStorage.getItem("unsplashCache");
    return stored ? JSON.parse(stored) : {};
  });

  // LocalStorage Sync
  useEffect(() => {
    localStorage.setItem("travelRoute", JSON.stringify(routePoints));
  }, [routePoints]);

  useEffect(() => {
    localStorage.setItem("travelPhotos", JSON.stringify(photos));
  }, [photos]);

  useEffect(() => {
    localStorage.setItem("unsplashCache", JSON.stringify(unsplash));
  }, [unsplash]);

  return (
    <TravelContext.Provider
      value={{
        routePoints,
        setRoutePoints,
        photos,
        setPhotos,
        unsplash,
        setUnsplash,
      }}
    >
      {children}
    </TravelContext.Provider>
  );
};

// Custom Hook
export function useTravel() {
  return useContext(TravelContext);
}
