import LeafletMap from "../components/LeafletMap";
import TravelCityList from "../components/TravelCityList";
import { TravelProvider, useTravel } from "../contexts/TravelContext";

export default function TravelPlannerPage() {
  return (
    <TravelProvider>
      <div className="flex h-screen w-screen">
        {/* Karte */}
        <div className="flex-1">
          <LeafletMap />
        </div>

        {/* Städte-Liste */}
        <div className="w-80 bg-gray-800 overflow-y-auto p-4">
          <TravelCityList />
        </div>
      </div>
    </TravelProvider>
  );
}

