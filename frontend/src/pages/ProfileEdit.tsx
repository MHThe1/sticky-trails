import React, { useState, useEffect } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const ProfileEdit: React.FC = () => {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState({ name: "", avatarUrl: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const placeholderAvatar = "/images/user_placeholder.png";

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!user) {
        setError("user is not available");
        setLoading(false);
        return;
      }
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/user/${user.username}`
        );
        setProfileData({
          name: response.data.name || "",
          avatarUrl: response.data.avatarUrl || "",
        });
      } catch (err) {
        setError("Failed to fetch profile data.");
        console.error(err);
      }
    };

    fetchProfileData();
  }, [user]);

  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setProfileData({
        ...profileData,
        avatarUrl: URL.createObjectURL(e.target.files[0]),
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("name", profileData.name);
    if (file) {
      formData.append("avatar", file); // Append image file
    }

    try {
      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/user/${user?.username}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      navigate("/dashboard");
    } catch (err) {
      setError("Failed to update profile.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto bg-white dark:bg-gray-900 p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-200">
          Edit Profile
        </h1>
        {error && <div className="text-red-600 mb-4">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-center mb-6">
            <div className="w-32 h-32 rounded-full bg-gray-300 dark:bg-gray-600 overflow-hidden">
              <img
                src={
                  file
                    ? profileData.avatarUrl // Preview newly selected image
                    : profileData.avatarUrl
                    ? `${import.meta.env.VITE_API_BASE_URL}${
                        profileData.avatarUrl
                      }` // Existing image from backend
                    : placeholderAvatar // Default placeholder
                }
                alt="User Avatar"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Name
            </label>
            <input
              id="name"
              type="text"
              value={profileData.name}
              onChange={(e) =>
                setProfileData({ ...profileData, name: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              required
            />
          </div>
          <div>
            <label
              htmlFor="avatar"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Avatar
            </label>
            <input
              id="avatar"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
            />
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
