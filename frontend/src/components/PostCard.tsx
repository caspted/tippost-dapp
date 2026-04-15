import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { type Post } from "../hooks/useTipPost";
import "./PostCard.css";

interface PostCardProps {
  post: Post;
  account: string | null;
  likePost: (postId: bigint) => Promise<void>;
  checkLiked: (postId: bigint) => Promise<boolean>;
  isLoading: boolean;
}

export function PostCard({
  post,
  account,
  likePost,
  checkLiked,
  isLoading,
}: PostCardProps) {
  const [hasLiked, setHasLiked] = useState<boolean>(false);
  const [isLiking, setIsLiking] = useState(false);

  useEffect(() => {
    if (account) {
      checkLiked(post.id).then(setHasLiked);
    }
  }, [account, post.id, checkLiked, post.likes]);

  const handleLike = async () => {
    try {
      setIsLiking(true);
      await likePost(post.id);
      setHasLiked(true);
    } finally {
      setIsLiking(false);
    }
  };

  const isOwner =
    account && account.toLowerCase() === post.creator.toLowerCase();

  return (
    <div className="post-card">
      <div className="post-header">
        <div className="post-creator">
          <span className="creator-avatar">👤</span>
          <span className="creator-address">
            {post.creator.slice(0, 6)}...{post.creator.slice(-4)}
          </span>
        </div>
        <div className="post-time">
          {new Date(Number(post.timestamp) * 1000).toLocaleString()}
        </div>
      </div>

      <div className="post-image-container">
        <img
          src={post.imageUrl}
          alt={post.caption}
          className="post-image"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "https://via.placeholder.com/600x400?text=Image+Not+Found";
          }}
        />
      </div>

      <div className="post-content">
        <p className="post-caption">{post.caption}</p>
        
        <div className="post-stats">
          <span className="stat-badge likes">
            ❤️ {post.likes.toString()} Likes
          </span>
          <span className="stat-badge earned">
            💎 {ethers.formatEther(post.totalEarned)} ETH
          </span>
        </div>
      </div>

      <div className="post-actions">
        <button
          className={`like-btn ${hasLiked ? "liked" : ""} ${
            isOwner ? "disabled" : ""
          }`}
          onClick={handleLike}
          disabled={isOwner || hasLiked || isLoading || isLiking}
        >
          {isLiking ? (
            <span className="spinner"></span>
          ) : hasLiked ? (
            "❤️ Liked"
          ) : isOwner ? (
            "Your Post"
          ) : (
            "👍 Like (0.0001 ETH)"
          )}
        </button>
      </div>
    </div>
  );
}
