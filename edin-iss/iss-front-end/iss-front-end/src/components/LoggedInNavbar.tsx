import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/navbar.css";
import "../styles/logged-in-navbar.css";

interface LoggedInNavbarProps {
  onMyRecipesClick: () => void;
  onFavoritesClick: () => void;
  onShareRecipeClick: () => void;
  onProfileClick: () => void; // Add profile click handler
}

const LoggedInNavbar: React.FC<LoggedInNavbarProps> = ({
  onMyRecipesClick,
  onFavoritesClick,
  onShareRecipeClick,
  onProfileClick, // Accept profile handler
}) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:3000/auth/signout",
        {},
        { withCredentials: true }
      );
      navigate("/");
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  };

  const handleLogoClick = () => {
    // Navigate to the dashboard and force a refresh
    navigate("/dashboard", { replace: true });
    navigate(0); // Forces the page to reload
  };

  return (
    <nav className="navbar logged-in-navbar">
      <div className="navbar-logo">
        {/* Use onClick to navigate and refresh */}
        <span className="logged-in-logo" onClick={handleLogoClick}>
          KitchenThings
        </span>
      </div>
      <div className="navbar-links logged-in-navbar-links">
        <button onClick={onShareRecipeClick}>Share recipe</button>
        <button onClick={onMyRecipesClick}>My recipes</button>
        <button onClick={onFavoritesClick}>Favorites</button>
        <button onClick={onProfileClick}>Profile</button>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
};

export default LoggedInNavbar;
