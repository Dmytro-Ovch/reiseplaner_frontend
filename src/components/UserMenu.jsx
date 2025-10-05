import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

const UserMenu = () => {
  const { user, logout } = useContext(AuthContext);

  // Dynamischer Gruß
  const hour = new Date().getHours();
  let greeting = "Hallo";
  if (hour < 12) {
    greeting = "Guten Morgen";
  } else if (hour < 18) {
    greeting = "Guten Tag";
  } else {
    greeting = "Guten Abend";
  }

  return (
    <div className="flex items-center gap-6 px-4">
      
      {/* Links direkt in einer Reihe */}
      <nav className="flex gap-4">
        <Link to="/travelstepperpage" className="btn btn-ghost btn-sm text-lg">
          Eine Reise erstellen
        </Link>

        <Link to="/travelstable" className="btn btn-ghost btn-sm text-lg">
          Geplante Reisen
        </Link>

        <Link to="/generalphotogallery" className="btn btn-ghost btn-sm text-lg">
          Fotogalerie
        </Link>

        {user.role === "admin" && (
          <Link to="/dashboard" className="btn btn-ghost btn-sm text-lg">
            Dashboard
          </Link>
        )}

        <button onClick={logout} className="btn btn-neutral btn-sm text-lg">
          Logout
        </button>
      </nav>
      <span className="hidden md:block">
        {greeting}, {user.username}
      </span>

    </div>
  );
};

export default UserMenu;
