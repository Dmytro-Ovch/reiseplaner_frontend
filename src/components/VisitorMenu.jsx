import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

const VisitorMenu = () => {
  const { login } = useContext(AuthContext);

  return (
    <div className="flex items-center gap-6 px-4">
      {/* Haupt-Links mittig */}
        <Link to="/travelplannerpage" className="btn btn-ghost btn-sm text-lg">
          Eine Reise planen
        </Link>
        
      <nav className="flex gap-4">
        <Link to="/signup" className="btn btn-ghost btn-sm text-lg">
          Sign Up
        </Link>

        <Link to="/login" className="btn btn-ghost btn-sm text-lg">
          Login
        </Link>
      </nav>
    </div>
  );
};

export default VisitorMenu;
