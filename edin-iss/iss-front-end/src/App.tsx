// src/App.tsx
import React from "react";
import {
  Route,
  BrowserRouter as Router,
  Routes,
  useLocation,
} from "react-router-dom";
import "./App.css";
import NavBar from "./components/navBar";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import LoggedInNavbar from "./components/LoggedInNavbar";

const App: React.FC = () => {
  // const location = useLocation();
  // const isLoggedIn = location.pathname.startsWith("/dashboard");

  return (
    <div className="App">
      {/* Conditionally render NavBar based on login state */}
      {/* {isLoggedIn ? (
        <LoggedInNavbar />
      ) : (
        location.pathname !== "/auth/signin" &&
        location.pathname !== "/auth/signup" && <NavBar />
      )} */}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth/signin" element={<LoginPage />} />
        <Route path="/auth/signup" element={<RegisterPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        {/* Add your routes here */}
      </Routes>
    </div>
  );
};

export default App;
