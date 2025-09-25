import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import VisitorMenu from "./VisitorMenu";
import UserMenu from "./UserMenu";

const Navbar = () => {
  const { user } = useContext(AuthContext);

  return (
    <header className="navbar bg-base-100 shadow-sm px-4 py-2 min-h-[48px]">
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost text-xl">
          Reiseplaner
        </Link>
      </div>
      <div className="flex gap-2">
        {user ? <UserMenu /> : <VisitorMenu />}
      </div>
    </header>
  );
};

export default Navbar;
