import LeafletMap from "../components/LeafletMap";
import TravelsTable from "../components/TravelsTable";
import { TravelProvider, useTravel } from "../contexts/TravelContext";

export default function TravelTablePage() {
  return (
    <TravelProvider>
      <div className="flex h-screen w-screen">
        {/* Karte */}
        <div className="basis-1/3">
          <LeafletMap />
        </div>

        {/* Städte-Liste */}
        <div className="basis-2/3 bg-gray-800 overflow-y-auto p-4">
          <TravelsTable />
        </div>
      </div>
    </TravelProvider>
  );
}

