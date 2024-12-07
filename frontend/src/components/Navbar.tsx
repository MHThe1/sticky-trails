import React, { useState } from "react";
import { Link } from "react-router-dom";
import { UserCircle, Search, X, Grid, List } from "lucide-react";
import { useLogout } from "../hooks/useLogout";
import { useAuthContext } from "../hooks/useAuthContext";

interface NavbarProps {
  isGridView: boolean;
  setIsGridView: (isGrid: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  isGridView,
  setIsGridView,
}) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const { logout } = useLogout();
  const { user } = useAuthContext();

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="bg-gray-900 text-white p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-violet-400">
          Sticky Trail
        </Link>
        <div className="flex items-center space-x-4">
          {isSearchOpen ? (
            <div className="relative">
              <input
                type="text"
                placeholder="Search notes..."
                className="bg-gray-800 text-white px-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-violet-400 w-64"
              />
              <button
                onClick={() => setIsSearchOpen(false)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsSearchOpen(true)}
              className="text-gray-300 hover:text-white transition-colors"
            >
              <Search size={20} />
            </button>
          )}

          {user ? (
            <>
              <Link
                to="/profile"
                className="hover:text-violet-400 transition-colors"
              >
                <UserCircle className="w-6 h-6" />
              </Link>

              <button
                onClick={handleLogout}
                className="hover:text-violet-400 transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="hover:text-violet-400 transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="hover:text-violet-400 transition-colors"
              >
                Register
              </Link>
            </>
          )}
          <div className="flex space-x-2">
            <button
              onClick={() => setIsGridView(true)}
              className={`p-2 rounded ${
                isGridView
                  ? "bg-violet-500 text-white"
                  : "bg-gray-700 text-gray-300"
              }`}
            >
              <Grid size={20} />
            </button>
            <button
              onClick={() => setIsGridView(false)}
              className={`p-2 rounded ${
                !isGridView
                  ? "bg-violet-500 text-white"
                  : "bg-gray-700 text-gray-300"
              }`}
            >
              <List size={20} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
