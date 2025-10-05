import { useTravel } from "../contexts/TravelContext";
import { useState } from "react";
import PhotoLibrary from "../components/PhotoLibrary";
import GeneralPhotoGallery from "../components/GeneralPhotoGallery";

function GeneralPhotoPage() {
  const { routePoints } = useTravel();      // Punkte aus TravelContext
  const [formData, setFormData] = useState({
    points: routePoints.map(pt => ({ city: pt.name, country: pt.country })),
    photos: {}
  });

  return (
    <GeneralPhotoGallery
      points={routePoints.map(pt => ({ city: pt.name, country: pt.country }))}
      formData={formData}
      setFormData={setFormData}
    />
  );
}

export default GeneralPhotoPage;
