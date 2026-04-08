import React, { useEffect, useState } from "react";
import LoggedInNavbar from "../components/LoggedInNavbar";
import RecipeModal from "../components/RecipeModal";
import ShareRecipeModal from "../components/ShareRecipeModal";
import ProfileModal from "../components/ProfileModal";
import { Recipe } from "../interfaces/Recipe";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock } from "@fortawesome/free-solid-svg-icons";
import "../styles/dashboard-page.css";

const DashboardPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [currentRecipe, setCurrentRecipe] = useState<Recipe | null>(null);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [error, setError] = useState<string>("");
  const [myRecipesView, setMyRecipesView] = useState(false);
  const [favoritesView, setFavoritesView] = useState(false);

  const fetchRecipes = async () => {
    try {
      let response;
      if (myRecipesView) {
        response = await axios.get(`http://localhost:3000/recipes/my-recipes`, {
          withCredentials: true,
        });
      } else if (favoritesView) {
        response = await axios.get(`http://localhost:3000/favorites`, {
          withCredentials: true,
        });
        const favoriteRecipes = response.data.map((fav: any) => fav.recipe);
        response.data = favoriteRecipes;
      } else {
        response = await axios.get("http://localhost:3000/recipes");
      }

      if (response.status === 200 && response.data.length > 0) {
        const reversedRecipes = response.data.reverse();
        setRecipes(reversedRecipes);
        setError("");
      } else {
        setRecipes([]);
      }
    } catch (err: any) {
      if (err.response && err.response.status === 404) {
        setRecipes([]);
      } else {
        setError("Failed to fetch recipes. Please try again later.");
      }
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, [myRecipesView, favoritesView]);

  const openModal = (recipe: Recipe) => {
    setCurrentRecipe(recipe);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentRecipe(null);
  };

  const handleMyRecipesClick = () => {
    setMyRecipesView(true);
    setFavoritesView(false);
  };

  const handleFavoritesClick = () => {
    setFavoritesView(true);
    setMyRecipesView(false);
  };

  const handleShareRecipeClick = () => {
    setIsShareModalOpen(true);
  };

  const handleProfileClick = () => {
    setIsProfileModalOpen(true);
  };

  const handleShareRecipe = async (
    title: string,
    description: string,
    steps: string,
    cookingTime: number,
    imgUrl: string | null
  ) => {
    try {
      const newRecipeData = {
        title,
        description,
        steps,
        cookingTime,
        imgUrl,
      };

      const response = await axios.post(
        "http://localhost:3000/me/recipes",
        newRecipeData,
        { withCredentials: true }
      );

      if (response.status === 201) {
        setIsShareModalOpen(false);
        fetchRecipes();
      }
    } catch (error: any) {
      console.error("Failed to share recipe:", error);
    }
  };

  const handleEditRecipe = (e: React.MouseEvent, recipe: Recipe) => {
    e.stopPropagation();
    setCurrentRecipe(recipe);
    setIsModalOpen(true); // Open the modal for editing
  };

  const handleDeleteRecipe = async (e: React.MouseEvent, recipeId: string) => {
    e.stopPropagation();
    try {
      const response = await axios.delete(
        `http://localhost:3000/recipes/my-recipes/${recipeId}`, // Updated URL
        { withCredentials: true }
      );

      if (response.status === 200) {
        // Remove the deleted recipe from the state
        setRecipes(recipes.filter((recipe) => recipe.id !== recipeId));
      }
    } catch (error) {
      console.error("Failed to delete recipe:", error);
      setError("Failed to delete the recipe. Please try again later.");
    }
  };

  return (
    <>
      <div className="dashboard-page">
        <header className="dashboard-header">
          <LoggedInNavbar
            onMyRecipesClick={handleMyRecipesClick}
            onFavoritesClick={handleFavoritesClick}
            onShareRecipeClick={handleShareRecipeClick}
            onProfileClick={handleProfileClick}
          />
          <h1>Welcome to Your Recipe Dashboard!</h1>
        </header>

        <section className="dashboard-content">
          <div className="recipe-feed">
            <h2>
              {myRecipesView
                ? "My Recipes"
                : favoritesView
                ? "Favorite Recipes"
                : "Recent Recipes"}
            </h2>

            {recipes.length > 0 ? (
              recipes.map((recipe) => (
                <div
                  key={recipe.id}
                  className="recipe-card"
                  onClick={() => openModal(recipe)}
                >
                  <img
                    src={`img/${recipe.imgUrl}`}
                    alt={recipe.title}
                    className="recipe-image"
                  />
                  <div className="recipe-details">
                    <h3>{recipe.title}</h3>
                    <p>{recipe.description}</p>
                  </div>
                  <p className="recipe-time">
                    <FontAwesomeIcon icon={faClock} /> {recipe.cookingTime} mins
                  </p>

                  {myRecipesView && (
                    <div className="recipe-actions">
                      <button
                        className="delete-button"
                        onClick={(e) => handleDeleteRecipe(e, recipe.id)}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <h1 className="no-my-recipe-message">
                {favoritesView
                  ? "You haven't added any favorite recipes!"
                  : "You haven't shared any recipe!"}
              </h1>
            )}
          </div>
        </section>
      </div>

      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />

      <ShareRecipeModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        onShare={handleShareRecipe}
      />

      {currentRecipe && (
        <RecipeModal
          recipe={currentRecipe}
          isOpen={isModalOpen}
          onClose={closeModal}
        />
      )}
    </>
  );
};

export default DashboardPage;
