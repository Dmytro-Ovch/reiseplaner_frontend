import { useTravel } from "../contexts/TravelContext";
import { useState } from "react";
import PhotoLibrary from "../components/PhotoLibrary";
import CityChatBot from "../components/CityChatBot";
import CityInfo from "../components/CityInfo";

function PhotoLibraryPage() {
  const { routePoints } = useTravel();      // Punkte aus TravelContext
  const [formData, setFormData] = useState({
    points: routePoints.map(pt => ({ city: pt.name, country: pt.country })),
    photos: {}
  });

  const [selectedCity, setSelectedCity] = useState(null);

return (
    <div className="flex flex-col gap-8 p-6 bg-gray-900 text-white min-h-screen">
      
      {/* Photo Library */}
        <div className="bg-gray-800 p-4 rounded-2xl shadow-lg">
        <PhotoLibrary
        points={routePoints.map(pt => ({ city: pt.name, country: pt.country }))}
        formData={formData}
        setFormData={setFormData}
        onCitySelect={setSelectedCity}
      />
      </div>

      {/* CityInfo */}
      {selectedCity && (
        <div className="bg-gray-800 p-4 rounded-2xl shadow-lg">
        <CityInfo city={selectedCity} />
        </div>
      )}

      {/* Chatbot für jede Stadt */}
      {selectedCity && (
        <div className="bg-gray-800 p-4 rounded-2xl shadow-lg">
          <CityChatBot city={selectedCity} />
          </div>
      )}
    </div>
  );
}

export default PhotoLibraryPage;
