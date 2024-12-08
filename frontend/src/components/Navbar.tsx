import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserCircle, Search, X, Sun, Moon, Laptop, Menu } from 'lucide-react';
import { useLogout } from "../hooks/useLogout";
import { useAuthContext } from "../hooks/useAuthContext";
import { useTheme } from "../context/ThemeContext";

export const Navbar: React.FC = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isThemeDropdownOpen, setIsThemeDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { logout } = useLogout();
  const { user } = useAuthContext();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const themeDropdownRef = useRef<HTMLDivElement>(null);

  const themeOptions = [
    { name: 'Light', icon: Sun, value: 'light' },
    { name: 'Dark', icon: Moon, value: 'dark' },
    { name: 'System', icon: Laptop, value: 'system' },
  ];

  const currentTheme = themeOptions.find(option => option.value === theme);

  const handleRefresh = () => {
    navigate("/");
    window.location.reload();
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (themeDropdownRef.current && !themeDropdownRef.current.contains(event.target as Node)) {
        setIsThemeDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  return (
    <nav className="bg-white dark:bg-gray-900 text-gray-800 dark:text-white p-4 shadow-lg transition-colors duration-200">
      <div className="container mx-auto">
        <div className="flex justify-between items-center">
          <button
            onClick={handleRefresh}
            className="text-2xl font-bold text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
          >
            Sticky Trail
          </button>

          <div className="hidden md:flex items-center space-x-4">
            <SearchComponent
              isSearchOpen={isSearchOpen}
              setIsSearchOpen={setIsSearchOpen}
              searchInputRef={searchInputRef}
            />
            <ThemeToggle
              currentTheme={currentTheme}
              isThemeDropdownOpen={isThemeDropdownOpen}
              setIsThemeDropdownOpen={setIsThemeDropdownOpen}
              themeOptions={themeOptions}
              setTheme={setTheme}
              theme={theme}
              themeDropdownRef={themeDropdownRef}
            />
            <UserActions user={user} logout={logout} />
          </div>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {isMobileMenuOpen && (
          <MobileMenu
            isSearchOpen={isSearchOpen}
            setIsSearchOpen={setIsSearchOpen}
            searchInputRef={searchInputRef}
            currentTheme={currentTheme}
            isThemeDropdownOpen={isThemeDropdownOpen}
            setIsThemeDropdownOpen={setIsThemeDropdownOpen}
            themeOptions={themeOptions}
            setTheme={setTheme}
            theme={theme}
            themeDropdownRef={themeDropdownRef}
            user={user}
            logout={logout}
          />
        )}
      </div>
    </nav>
  );
};

const SearchComponent: React.FC<{
  isSearchOpen: boolean;
  setIsSearchOpen: (isOpen: boolean) => void;
  searchInputRef: React.RefObject<HTMLInputElement>;
}> = ({ isSearchOpen, setIsSearchOpen, searchInputRef }) => (
  <div className="relative">
    {isSearchOpen ? (
      <div className="relative">
        <input
          ref={searchInputRef}
          type="text"
          placeholder="Search notes..."
          className="w-64 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white px-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <button
          onClick={() => setIsSearchOpen(false)}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white"
        >
          <X size={18} />
        </button>
      </div>
    ) : (
      <button
        onClick={() => setIsSearchOpen(true)}
        className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white transition-colors"
      >
        <Search size={20} />
      </button>
    )}
  </div>
);

const ThemeToggle: React.FC<{
  currentTheme: { icon: React.ElementType } | undefined;
  isThemeDropdownOpen: boolean;
  setIsThemeDropdownOpen: (isOpen: boolean) => void;
  themeOptions: { name: string; icon: React.ElementType; value: string }[];
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  theme: string;
  themeDropdownRef: React.RefObject<HTMLDivElement>;
}> = ({ currentTheme, isThemeDropdownOpen, setIsThemeDropdownOpen, themeOptions, setTheme, theme, themeDropdownRef }) => (
  <div className="relative" ref={themeDropdownRef}>
    <button
      onClick={() => setIsThemeDropdownOpen(!isThemeDropdownOpen)}
      className="flex items-center space-x-1 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white transition-colors"
    >
      {currentTheme && <currentTheme.icon size={20} />}
    </button>
    {isThemeDropdownOpen && (
      <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-10">
        {themeOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => {
              setTheme(option.value as 'light' | 'dark' | 'system');
              setIsThemeDropdownOpen(false);
            }}
            className={`flex items-center w-full px-4 py-2 text-left ${
              theme === option.value
                ? 'bg-purple-100 dark:bg-purple-400 text-purple-600 dark:text-purple-900'
                : 'text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            <option.icon size={16} className="mr-2" />
            {option.name}
          </button>
        ))}
      </div>
    )}
  </div>
);

const UserActions: React.FC<{
  user: any;
  logout: () => void;
}> = ({ user, logout }) => (
  <>
    {user ? (
      <>
        <Link
          to="/dashboard"
          className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white transition-colors"
        >
          <UserCircle className="w-6 h-6" />
        </Link>
        <button
          onClick={logout}
          className="bg-purple-600 text-white px-4 py-2 rounded-full hover:bg-purple-700 transition-colors"
        >
          Logout
        </button>
      </>
    ) : (
      <>
        <Link
          to="/login"
          className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white transition-colors"
        >
          Login
        </Link>
        <Link
          to="/register"
          className="bg-purple-600 text-white px-4 py-2 rounded-full hover:bg-purple-700 transition-colors"
        >
          Register
        </Link>
      </>
    )}
  </>
);

const MobileMenu: React.FC<{
  isSearchOpen: boolean;
  setIsSearchOpen: (isOpen: boolean) => void;
  searchInputRef: React.RefObject<HTMLInputElement>;
  currentTheme: { icon: React.ElementType } | undefined;
  isThemeDropdownOpen: boolean;
  setIsThemeDropdownOpen: (isOpen: boolean) => void;
  themeOptions: { name: string; icon: React.ElementType; value: string }[];
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  theme: string;
  themeDropdownRef: React.RefObject<HTMLDivElement>;
  user: any;
  logout: () => void;
}> = ({ isSearchOpen, setIsSearchOpen, searchInputRef, currentTheme, isThemeDropdownOpen, setIsThemeDropdownOpen, themeOptions, setTheme, theme, themeDropdownRef, user, logout }) => (
  <div className="mt-4 flex flex-col space-y-4">
    <SearchComponent
      isSearchOpen={isSearchOpen}
      setIsSearchOpen={setIsSearchOpen}
      searchInputRef={searchInputRef}
    />
    <ThemeToggle
      currentTheme={currentTheme}
      isThemeDropdownOpen={isThemeDropdownOpen}
      setIsThemeDropdownOpen={setIsThemeDropdownOpen}
      themeOptions={themeOptions}
      setTheme={setTheme}
      theme={theme}
      themeDropdownRef={themeDropdownRef}
    />
    <UserActions user={user} logout={logout} />
  </div>
);

