import LeafletMap from "../components/LeafletMap";
import TravelCityList from "../components/TravelCityList";
import { TravelProvider, useTravel } from "../contexts/TravelContext";
import { useMap } from "../contexts/MapContext";
import ArcMap from "../components/ArcMap";


export default function TravelPlannerPage() {
    const { mapType } = useMap();

  return (
    <TravelProvider>
      <div className="flex h-screen w-screen">
        {/* Karte */}
        <div className="relative flex-1">
          {mapType === "leaflet" ? <LeafletMap /> : <ArcMap />}
        </div>

        {/* Städte-Liste */}
        <div className="w-80 bg-gray-800 overflow-y-auto p-4">
          <TravelCityList />
        </div>
      </div>
    </TravelProvider>
  );
}

