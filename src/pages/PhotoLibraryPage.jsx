import { useTravel } from "../contexts/TravelContext";
import { useState, useEffect } from "react";
import PhotoLibrary from "../components/PhotoLibrary";
import CityChatBot from "../components/CityChatBot";
import CityInfo from "../components/CityInfo";

function PhotoLibraryPage() {
  const { routePoints } = useTravel(); // Aktuelle Punkte aus TravelContext
  const [selectedCity, setSelectedCity] = useState(null);

  const [formData, setFormData] = useState({
    points: [],
    photos: {},
  });

  // Synchronisiere formData mit den aktuellen routePoints
  useEffect(() => {
    // Liste aktueller Städte im Reiseplan
    const currentCities = routePoints.map((pt) => pt.name);

    // Entferne Fotos, die zu nicht mehr vorhandenen Städten gehören
    setFormData((prev) => {
      const cleanedPhotos = Object.fromEntries(
        Object.entries(prev.photos).filter(([city]) =>
          currentCities.includes(city)
        )
      );

      return {
        points: routePoints.map((pt) => ({ city: pt.name, country: pt.country })),
        photos: cleanedPhotos,
      };
    });

    // Wenn ausgewählte Stadt gelöscht wurde — Auswahl entfernen
    if (selectedCity && !currentCities.includes(selectedCity.city)) {
      setSelectedCity(null);
    }
  }, [routePoints]);

  return (
    <div className="flex flex-col gap-8 p-6 bg-gray-900 text-white min-h-screen">
      {/* Foto-Bibliothek */}
      <div className="bg-gray-800 p-4 rounded-2xl shadow-lg">
        <PhotoLibrary
          points={formData.points}
          formData={formData}
          setFormData={setFormData}
          onCitySelect={setSelectedCity}
        />
      </div>

      {/* Stadtinformationen */}
      {selectedCity && (
        <div className="bg-gray-800 p-4 rounded-2xl shadow-lg">
          <CityInfo city={selectedCity} />
        </div>
      )}

      {/* Stadt-Chatbot */}
      {selectedCity && (
        <div className="bg-gray-800 p-4 rounded-2xl shadow-lg">
          <CityChatBot city={selectedCity} />
        </div>
      )}
    </div>
  );
}

export default PhotoLibraryPage;
