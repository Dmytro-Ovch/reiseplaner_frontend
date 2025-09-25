import React, { useState } from "react";
import { useTravel } from "../contexts/TravelContext";
import { searchCities } from "../api"; // Geoapify Autocomplete

export default function TravelCityList() {
  const { routePoints, setRoutePoints } = useTravel();
  const [newCity, setNewCity] = useState("");
  const [newCountry, setNewCountry] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  // Eingabe -> Autocomplete
  const handleCityChange = async (value) => {
    setNewCity(value);

    if (value.length < 2) {
      setSuggestions([]);
      return;
    }

    try {
      const results = await searchCities(value);
      setSuggestions(results);
    } catch (err) {
      console.error("Fehler bei City-Suche:", err);
      setSuggestions([]);
    }
  };

  // Auswahl aus Vorschlägen -> direkt in Route
  const handleSelectSuggestion = (s) => {
    setNewCity(s.city || s.address_line1 || s.formatted);
    setNewCountry(s.country || "");
    setSuggestions([]);

    if (s.lat && s.lon) {
      const cityObj = {
        name: s.city || s.address_line1 || s.formatted,
        country: s.country || "",
        lat: s.lat,
        lng: s.lon,
      };

      const exists = routePoints.some(
        (pt) => pt.name === cityObj.name && pt.country === cityObj.country
      );
      if (!exists) {
        setRoutePoints([...routePoints, cityObj]);
      }
    }
  };

  // Stadt löschen
  const handleDelete = (idx) => {
    setRoutePoints(routePoints.filter((_, i) => i !== idx));
  };

  // Undo / Reset
  const undoLastPoint = () => setRoutePoints((prev) => prev.slice(0, -1));
  const resetRoute = () => setRoutePoints([]);

  // Reihenfolge ändern
  const moveCity = (idx, direction) => {
    const newOrder = [...routePoints];
    const targetIdx = idx + direction;
    if (targetIdx < 0 || targetIdx >= newOrder.length) return;

    [newOrder[idx], newOrder[targetIdx]] = [newOrder[targetIdx], newOrder[idx]];
    setRoutePoints(newOrder);
  };

  return (
    //<div className="p-4 bg-base-200 rounded-box shadow-md w-96">
    <div className="p-3 max-w-xl mx-auto">
      <h2 className="text-lg font-bold mb-4">Reiseroute (Städte)</h2>

      {/* Suchfeld */}
      <div className="mb-4 flex flex-col gap-2 relative">
        <input
          type="text"
          placeholder="Stadt suchen..."
          value={newCity}
          onChange={(e) => handleCityChange(e.target.value)}
          className="input input-bordered w-full"
        />

        {suggestions.length > 0 && (
          <ul className="menu bg-base-100 shadow rounded-box absolute top-12 w-full z-10">
            {suggestions.map((s, i) => (
              <li key={i}>
                <a onClick={() => handleSelectSuggestion(s)}>
                  {s.city || s.address_line1 || s.formatted},{" "}
                  <span className="opacity-70">{s.country}</span>
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Undo/Reset */}
      <div className="flex gap-2 mb-4">
        <button
          //className="btn btn-secondary btn-sm flex-1"
          className="btn btn-sm flex-1 bg-blue-500 hover:bg-blue-600 text-white"
          onClick={undoLastPoint}
          disabled={routePoints.length === 0}
        >
          Rückgängig
        </button>
        <button
          className="btn btn-warning btn-sm flex-1"
          onClick={resetRoute}
          disabled={routePoints.length === 0}
        >
          Zurücksetzen
        </button>
      </div>

      {/* Step-Liste */}
      {routePoints.length === 0 && (
        <p className="text-sm opacity-70">Keine Städte ausgewählt.</p>
      )}

      <ul className="steps steps-vertical">
        {routePoints.map((city, idx) => (
          <li
            key={idx}
            className="step step-primary relative flex flex-col items-start"
          >
            <div className="flex items-center justify-between w-full">
              <span>
                <span className="font-semibold">{city.name}</span>{" "}
                <span className="text-sm opacity-70">({city.country})</span>
              </span>
              <div className="flex gap-1">
                <button
                  className="btn btn-xs"
                  onClick={() => moveCity(idx, -1)}
                  disabled={idx === 0}
                >
                  ↑
                </button>
                <button
                  className="btn btn-xs"
                  onClick={() => moveCity(idx, +1)}
                  disabled={idx === routePoints.length - 1}
                >
                  ↓
                </button>
                <button
                  className="btn btn-xs btn-error"
                  onClick={() => handleDelete(idx)}
                >
                  ✕
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
