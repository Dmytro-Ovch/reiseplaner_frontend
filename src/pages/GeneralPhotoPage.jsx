import { useTravel } from "../contexts/TravelContext";
import { useState, useEffect } from "react";
import GeneralPhotoGallery from "../components/GeneralPhotoGallery";

function GeneralPhotoPage() {
  const { routePoints } = useTravel(); // Aktuelle Punkte aus TravelContext

  const [formData, setFormData] = useState({
    points: [],
    photos: {},
  });

  // Synchronisiere formData, wenn sich routePoints ändern
  useEffect(() => {
    const currentCities = routePoints.map((pt) => pt.name);

    setFormData((prev) => {
      // Entferne Fotos, die zu gelöschten Städten gehören
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
  }, [routePoints]);

  return (
    <GeneralPhotoGallery
      points={formData.points}
      formData={formData}
      setFormData={setFormData}
    />
  );
}

export default GeneralPhotoPage;
