import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { useAuthContext } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { HomePage } from "./pages/HomePage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { Navbar } from "./components/Navbar";
import { Dashboard } from "./pages/Dashboard";
import { ProfileEdit } from "./pages/ProfileEdit";
import Footer from "./components/Footer";

const App: React.FC = () => {
  const { user } = useAuthContext();

  return (
    <ThemeProvider>
      <Router>
        <div className="flex flex-col min-h-screen transition-colors duration-200 bg-gradient-to-br from-gray-100 via-blue-200 to-blue-400 dark:from-gray-900 dark:via-purple-900 dark:to-violet-600">
          <Navbar />
          <div className="flex-grow">
            <Routes>
              <Route
                path="/"
                element={user ? <HomePage /> : <Navigate to="/login" />}
              />
              <Route
                path="/login"
                element={!user ? <Login /> : <Navigate to="/" />}
              />
              <Route
                path="/register"
                element={!user ? <Register /> : <Navigate to="/" />}
              />
              <Route
                path="/dashboard"
                element={user ? <Dashboard /> : <Navigate to="/login" />}
              />
              <Route
                path="/profile/edit"
                element={user ? <ProfileEdit /> : <Navigate to="/login" />}
              />
            </Routes>
          </div>
          <Footer />
        </div>
      </Router>
    </ThemeProvider>
  );
};

export default App;
