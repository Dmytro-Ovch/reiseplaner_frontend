import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import VisitorMenu from "./VisitorMenu";
import UserMenu from "./UserMenu";
import { Map, Globe2 } from "lucide-react";
import { useMap } from "../contexts/MapContext";

const Navbar = () => {
  const { user } = useContext(AuthContext);
  const { mapType, toggleMap } = useMap();

  return (
    <header className="navbar bg-base-100 shadow-sm px-4 py-2 min-h-[48px]">
  <div className="flex-1 flex items-center gap-2">
    {/* Link Reiseplaner */}
    <Link to="/" className="btn btn-ghost text-xl">
      Reiseplaner
    </Link>

    {/* Map-Umschaltbutton direkt daneben */}
    <button
      className="btn btn-sm btn-primary flex items-center gap-2"
      onClick={toggleMap}
    >
      {mapType === "leaflet" ? (
        <>
          <Globe2 size={16} /> ArcGISMap
        </>
      ) : (
        <>
          <Map size={16} /> Leaflet
        </>
      )}
    </button>
  </div>

  {/* Rechts: User- oder Visitor-Menu */}
  <div className="flex gap-2 items-center">
    {user ? <UserMenu /> : <VisitorMenu />}
  </div>
</header>
  );
};

export default Navbar;
