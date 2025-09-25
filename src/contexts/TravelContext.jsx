import { createContext, useState, useEffect, useContext } from "react";

export const TravelContext = createContext();

export const TravelProvider = ({ children }) => {
  // Initialisiere direkt aus LocalStorage
  const [routePoints, setRoutePoints] = useState(() => {
    const stored = localStorage.getItem("travelRoute");
    return stored ? JSON.parse(stored) : [];
  });

  // Immer speichern, wenn sich routePoints ändern
  useEffect(() => {
    localStorage.setItem("travelRoute", JSON.stringify(routePoints));
  }, [routePoints]);

  return (
    <TravelContext.Provider value={{ routePoints, setRoutePoints }}>
      {children}
    </TravelContext.Provider>
  );
};

// Custom Hook
export function useTravel() {
  return useContext(TravelContext);
}
