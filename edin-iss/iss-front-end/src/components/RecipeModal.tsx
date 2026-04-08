import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faHeart } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { Recipe } from "../interfaces/Recipe";
import "../styles/recipe-modal.css"; // Optional: Separate CSS for modal styling

interface RecipeModalProps {
  recipe: Recipe;
  isOpen: boolean;
  onClose: () => void;
}

interface Comment {
  id: string;
  content: string;
  user: { firstName: string; lastName: string };
}

const RecipeModal: React.FC<RecipeModalProps> = ({
  recipe,
  isOpen,
  onClose,
}) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState<string>("");
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  // Fetch comments and check if the recipe is a favorite when the modal opens
  useEffect(() => {
    if (isOpen) {
      const fetchComments = async () => {
        try {
          const response = await axios.get(
            `http://localhost:3000/comments/recipe/${recipe.id}`
          );

          if (response.status === 200) {
            setComments(response.data); // Set the comments
            setError(""); // Clear any previous error message
          } else {
            setError("Failed to fetch comments. Please try again later.");
          }
        } catch (err) {
          console.error("Error fetching comments:", err);
          setError("Failed to fetch comments. Please try again later.");
        }
      };

      // Check if the recipe is in the list of favorites
      const checkFavorite = async () => {
        try {
          const response = await axios.get(`http://localhost:3000/favorites`, {
            withCredentials: true,
          });
          // Assuming response.data is an array of favorite recipes
          const favoriteRecipes = response.data;
          const isRecipeFavorite = favoriteRecipes.some(
            (favRecipe: { recipeId: string }) =>
              favRecipe.recipeId === recipe.id
          );
          setIsFavorite(isRecipeFavorite); // Set favorite status based on whether the recipe is in favorites
        } catch (err) {
          console.error("Error checking favorite status:", err);
        }
      };

      fetchComments();
      checkFavorite(); // Check if the recipe is in favorites when modal opens
    }
  }, [isOpen, recipe.id]);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      const response = await axios.post(
        `http://localhost:3000/comments/recipe/${recipe.id}`,
        { content: newComment },
        { withCredentials: true }
      );
      setComments([...comments, response.data]); // Add new comment to list
      setNewComment(""); // Clear input field
    } catch (err) {
      console.error("Error adding comment:", err);
      setError("Failed to add comment. Please try again later.");
    }
  };

  const handleToggleFavorite = async () => {
    try {
      if (isFavorite) {
        // If the recipe is already a favorite, remove it from favorites
        await axios.delete(`http://localhost:3000/favorites/${recipe.id}`, {
          withCredentials: true,
        });
        setIsFavorite(false);
      } else {
        // Otherwise, add it to favorites
        await axios.post(
          `http://localhost:3000/favorites/${recipe.id}`,
          {},
          { withCredentials: true }
        );
        setIsFavorite(true);
      }
    } catch (err) {
      console.error("Error toggling favorite:", err);
    }
  };

  if (!isOpen) return null; // Don't render anything if the modal is not open

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>
          &times;
        </span>
        <h2 className="recipe-title">
          {recipe.title}{" "}
          <button className="favorite-btn" onClick={handleToggleFavorite}>
            <FontAwesomeIcon
              icon={faHeart}
              color={isFavorite ? "red" : "grey"} // Set heart icon color based on favorite status
            />
          </button>
        </h2>
        <p className="recipe-description">{recipe.description}</p>

        <p className="recipe-modal-time">
          <FontAwesomeIcon icon={faClock} /> {recipe.cookingTime} mins
        </p>

        <h3>Steps:</h3>
        {/* Apply white-space: pre-wrap to preserve line breaks */}
        <p className="recipe-steps" style={{ whiteSpace: "pre-wrap" }}>
          {recipe.steps}
        </p>

        {/* Add a new comment */}
        <div className="add-comment">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
          />
          <button onClick={handleAddComment}>Comment</button>
        </div>

        {error && <p className="error-message">{error}</p>}

        <h3 className="comments-title">Comments</h3>
        {comments.length === 0 ? (
          <p>No comments yet.</p>
        ) : (
          <ul className="comments-list">
            {comments.map((comment) => (
              <li key={comment.id} className="comment-item">
                <strong>
                  {comment.user
                    ? `${comment.user.firstName} ${comment.user.lastName}`
                    : "Unknown User"}
                  :
                </strong>
                <p>{comment.content}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default RecipeModal;
