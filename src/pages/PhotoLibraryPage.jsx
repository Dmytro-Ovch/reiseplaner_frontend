import { useTravel } from "../contexts/TravelContext";
import { useState } from "react";
import TravelStepperForm from "../components/TravelStepperForm";
import PhotoLibrary from "../components/PhotoLibrary";
import CityChatBot from "../components/CityChatBot";

function PhotoLibraryPage() {
  const { routePoints } = useTravel();      // Punkte aus TravelContext
  const [formData, setFormData] = useState({
    points: routePoints.map(pt => ({ city: pt.name, country: pt.country })),
    photos: {}
  });

//   return (
//     <PhotoLibrary
//       points={routePoints.map(pt => ({ city: pt.name, country: pt.country }))}
//       formData={formData}
//       setFormData={setFormData}
//     />
//   );
// }

// export default PhotoLibraryPage;
return (
    <div className="flex flex-col gap-8 p-6 bg-gray-900 text-white min-h-screen">
      <PhotoLibrary
        points={routePoints.map(pt => ({ city: pt.name, country: pt.country }))}
        formData={formData}
        setFormData={setFormData}
      />

      {/* Chatbot für jede Stadt */}
      {routePoints.map((pt, idx) => (
        <CityChatBot key={idx} city={pt.name} />
      ))}
    </div>
  );
}

export default PhotoLibraryPage;
