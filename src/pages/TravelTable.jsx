import LeafletMap from "../components/LeafletMap";
import TravelsTable from "../components/TravelsTable";
import { TravelProvider, useTravel } from "../contexts/TravelContext";
import { useMap } from "../contexts/MapContext";
import ArcMap from "../components/ArcMap";

export default function TravelTablePage() {
    const { mapType } = useMap();

  return (
    <TravelProvider>
      <div className="flex h-screen w-screen">
        {/* Karte */}
        <div className="basis-1/3">
          {mapType === "leaflet" ? <LeafletMap /> : <ArcMap />}
        </div>

        {/* Städte-Liste */}
        <div className="basis-2/3 bg-gray-800 overflow-y-auto p-4">
          <TravelsTable />
        </div>
      </div>
    </TravelProvider>
  );
}

