import React, { useState, useRef } from "react";
import "../styles/share-recipe-modal.css";

interface ShareRecipeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShare: (
    title: string,
    description: string,
    steps: string,
    cookingTime: number,
    imgUrl: string | null
  ) => void;
}

const ShareRecipeModal: React.FC<ShareRecipeModalProps> = ({
  isOpen,
  onClose,
  onShare,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [steps, setSteps] = useState("");
  const [cookingTime, setCookingTime] = useState<number | string>("");
  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async () => {
    if (title && description && steps && cookingTime) {
      try {
        await onShare(title, description, steps, Number(cookingTime), imgUrl);

        // Reset form fields after successful share
        setTitle("");
        setDescription("");
        setSteps("");
        setCookingTime("");
        setImgUrl(null);

        // Optionally close the modal after resetting fields
        onClose();
      } catch (error) {
        console.error("Error sharing the recipe:", error);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const fileName = file.name; // Just use the file name
      setImgUrl(fileName); // Set imgUrl as the image file name (e.g., 'imagename.png')
    }
  };

  const handleAddImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleDeleteImageClick = () => {
    setImgUrl(null); // Remove image URL
  };

  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Share a Recipe</h2>

        {/* Image Upload Section */}
        <div className="modal-img-box-wrapper">
          {imgUrl ? (
            <div
              className="modal-img-box img-background-style"
              style={{
                backgroundImage: `url(img/${imgUrl})`,
              }}
            >
              <button
                className="delete-image-icon"
                onClick={handleDeleteImageClick}
              >
                Delete image
              </button>
            </div>
          ) : null}
        </div>

        {!imgUrl && (
          <div className="modal-add-image-box">
            <button className="add-image-button" onClick={handleAddImageClick}>
              Add image
            </button>
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
          </div>
        )}

        {/* Recipe Form */}
        <div className="form-group">
          <label className="share-recipe-title">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter the recipe title"
          />
        </div>
        <div className="form-group">
          <label className="share-recipe-title">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter the recipe description"
          />
        </div>
        <div className="form-group">
          <label className="share-recipe-title">Steps</label>
          <textarea
            value={steps}
            onChange={(e) => setSteps(e.target.value)}
            placeholder="Enter the steps for the recipe"
          />
        </div>
        <div className="form-group">
          <label className="share-recipe-title">
            Cooking Time (in minutes)
          </label>
          <input
            type="number"
            value={cookingTime}
            onChange={(e) => setCookingTime(e.target.value)}
            placeholder="Enter cooking time"
          />
        </div>
        <div className="modal-buttons">
          <button onClick={handleSubmit}>Share</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default ShareRecipeModal;
