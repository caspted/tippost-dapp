import { useState, type FormEvent } from "react";
import "./CreatePostForm.css";

interface CreatePostFormProps {
  isLoading: boolean;
  account: string | null;
  createPost: (imageUrl: string, caption: string) => Promise<void>;
}

export function CreatePostForm({
  isLoading,
  account,
  createPost,
}: CreatePostFormProps) {
  const [imageUrl, setImageUrl] = useState("");
  const [caption, setCaption] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!imageUrl.trim() || !caption.trim()) return;
    await createPost(imageUrl, caption);
    setImageUrl("");
    setCaption("");
    setIsExpanded(false);
  };

  if (!account) return null;

  return (
    <div className="create-post-section" id="create-post-section">
      {!isExpanded ? (
        <button
          className="create-post-trigger"
          onClick={() => setIsExpanded(true)}
          id="create-post-trigger"
        >
          <span className="trigger-icon">✨</span>
          <span>Create a new post...</span>
        </button>
      ) : (
        <form
          className="create-post-form"
          onSubmit={handleSubmit}
          id="create-post-form"
        >
          <div className="form-header">
            <h3>
              <span className="form-header-icon">🖼️</span> New Post
            </h3>
            <button
              type="button"
              className="form-close-btn"
              onClick={() => setIsExpanded(false)}
              id="close-form-btn"
            >
              ✕
            </button>
          </div>

          <div className="form-field">
            <label htmlFor="image-url-input">Image URL</label>
            <input
              id="image-url-input"
              type="text"
              placeholder="https://example.com/image.png"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <div className="form-field">
            <label htmlFor="caption-input">Caption</label>
            <input
              id="caption-input"
              type="text"
              placeholder="What's on your mind?"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          {imageUrl && (
            <div className="image-preview" id="image-preview">
              <img
                src={imageUrl}
                alt="Preview"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            </div>
          )}

          <button
            type="submit"
            className="submit-btn"
            disabled={isLoading || !imageUrl.trim() || !caption.trim()}
            id="submit-post-btn"
          >
            {isLoading ? (
              <span className="spinner-wrap">
                <span className="spinner"></span>
                Posting...
              </span>
            ) : (
              <>
                <span>🚀</span> Publish Post
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}
