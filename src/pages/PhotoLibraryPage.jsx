import { useTravel } from "../contexts/TravelContext";
import { useState } from "react";
import TravelStepperForm from "../components/TravelStepperForm";
import PhotoLibrary from "../components/PhotoLibrary";

function PhotoLibraryPage() {
  const { routePoints } = useTravel();      // Punkte aus TravelContext
  const [formData, setFormData] = useState({
    points: routePoints.map(pt => ({ city: pt.name, country: pt.country })),
    photos: {}
  });

  return (
    <PhotoLibrary
      points={routePoints.map(pt => ({ city: pt.name, country: pt.country }))}
      formData={formData}
      setFormData={setFormData}
    />
  );
}

export default PhotoLibraryPage;
