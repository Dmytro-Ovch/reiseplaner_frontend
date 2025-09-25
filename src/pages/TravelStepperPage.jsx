import LeafletMap from "../components/LeafletMap";
import TravelStepperForm from "../components/TravelStepperForm";
import { TravelProvider } from "../contexts/TravelContext";

function TravelStepperPage() {
  return (
    <TravelProvider>
      {/* Container füllt nur den Outlet-Bereich, nicht den ganzen Screen */}
      <div className="flex h-full">
        {/* Karte */}
        <div className="flex-1">
          <LeafletMap />
        </div>        
        
        {/* Formular */}
        <div className="w-80 bg-gray-800 overflow-y-auto p-4">
          <TravelStepperForm />
        </div>
      </div>
    </TravelProvider>
  );
}

export default TravelStepperPage;
