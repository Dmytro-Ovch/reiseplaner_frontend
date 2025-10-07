import LeafletMap from "../components/LeafletMap";
import ArcMap from "../components/ArcMap";
import TravelStepperForm from "../components/TravelStepperForm";
import { TravelProvider } from "../contexts/TravelContext";
import { useMap } from "../contexts/MapContext";

function TravelStepperPage() {
  const { mapType } = useMap();

  return (
    <TravelProvider>
      <div className="flex h-screen w-screen">
        {/* Karte links: 7/9 der Breite */}
        <div className="relative flex-[7]">
          {mapType === "leaflet" ? <LeafletMap /> : <ArcMap />}
        </div>

        {/* Formular rechts: 2/9 der Breite */}
        <div className="flex-[2] bg-gray-800 text-white overflow-y-auto border-l border-gray-700 p-4">
          <TravelStepperForm />
        </div>
      </div>
    </TravelProvider>
  );
}

export default TravelStepperPage;
