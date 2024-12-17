import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  AlertCircle,
  Book,
  Briefcase,
  Calendar,
  Music,
  Star,
} from "lucide-react";
import { useAuthContext } from "../hooks/useAuthContext";

const iconOptions = [
  { name: "Star", icon: Star },
  { name: "Book", icon: Book },
  { name: "Briefcase", icon: Briefcase },
  { name: "Calendar", icon: Calendar },
  { name: "Music", icon: Music },
  { name: "Alert", icon: AlertCircle },
];

const categories = ["Work", "Personal", "Study", "Health", "Finance", "Other"];

interface UserData {
  name: string;
  email: string;
  avatarUrl: string;
  username: string;
}

export const Dashboard: React.FC = () => {
  const { user } = useAuthContext();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categoryIcons, setCategoryIcons] = useState<Record<string, string>>(
    {}
  );
  const placeholderAvatar = "/images/user_placeholder.png";

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) {
        setError("User is not authenticated");
        setLoading(false);
        return;
      }

      if (!user.username) {
        setError("Username is not available");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get<UserData>(
          `${import.meta.env.VITE_API_BASE_URL}/api/user/${user.username}`
        );
        setUserData(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError("Failed to fetch user data. Please try again later.");
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  const handleIconChange = (category: string, iconName: string) => {
    setCategoryIcons((prev) => ({ ...prev, [category]: iconName }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        {error}
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="flex justify-center items-center h-screen">
        No user data available
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-gray-200">
        Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* User Profile Section */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
            {userData.name}'s Profile
          </h2>
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 rounded-full bg-gray-300 dark:bg-gray-600 mb-4 overflow-hidden">
              <img
                src={
                  userData.avatarUrl
                    ? `${
                        userData.avatarUrl
                      }`
                    : placeholderAvatar
                }
                alt="User Avatar"
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">
              {userData.name}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {userData.email}
            </p>
            <Link
              to="/profile/edit"
              className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors duration-300"
            >
              Edit Profile
            </Link>
          </div>
        </div>

        {/* Category Icons Section */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md md:col-span-2">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
            Category Icons
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {categories.map((category) => (
              <div key={category} className="flex items-center justify-between">
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  {category}
                </span>

                {/* Icon Rendering */}
                <div className="flex items-center space-x-4">
                  {categoryIcons[category] && (
                    <div className="w-8 h-8 text-gray-700 dark:text-gray-300">
                      {
                        // Safely finding the icon component
                        (() => {
                          const iconComponent = iconOptions.find(
                            (option) => option.name === categoryIcons[category]
                          )?.icon;
                          return iconComponent
                            ? React.createElement(iconComponent)
                            : null;
                        })()
                      }
                    </div>
                  )}
                  <select
                    value={categoryIcons[category] || ""}
                    onChange={(e) => handleIconChange(category, e.target.value)}
                    className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">Select an icon</option>
                    {iconOptions.map((option) => (
                      <option key={option.name} value={option.name}>
                        {option.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
