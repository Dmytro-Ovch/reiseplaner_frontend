import LeafletMap from "../components/LeafletMap";
import TravelStepperForm from "../components/TravelStepperForm";
import { TravelProvider } from "../contexts/TravelContext";

function TravelStepperPage() {
  return (
    <TravelProvider>
      {/* Container füllt nur den Outlet-Bereich, nicht den ganzen Screen */}
      <div className="flex h-full">
        {/* Karte 7/9 */}
        <div className="flex-[7]">
          <LeafletMap />
        </div>        
        
        {/* Formular 2/9 */}
        <div className="flex-[2] bg-gray-800 overflow-y-auto p-4">
          <TravelStepperForm />
        </div>
      </div>
    </TravelProvider>
  );
}

export default TravelStepperPage;
