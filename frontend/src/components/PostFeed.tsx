import { type Post } from "../hooks/useTipPost";
import { PostCard } from "./PostCard";
import "./PostFeed.css";

interface PostFeedProps {
  posts: Post[];
  account: string | null;
  likePost: (postId: bigint) => Promise<void>;
  checkLiked: (postId: bigint) => Promise<boolean>;
  isLoading: boolean;
}

export function PostFeed({
  posts,
  account,
  likePost,
  checkLiked,
  isLoading,
}: PostFeedProps) {
  if (!posts || posts.length === 0) {
    return (
      <div className="empty-feed">
        <div className="empty-icon">📭</div>
        <h3>No posts yet</h3>
        <p>Be the first to create a tip post!</p>
      </div>
    );
  }

  return (
    <div className="post-feed">
      {posts.map((post) => (
        <PostCard
          key={post.id.toString()}
          post={post}
          account={account}
          likePost={likePost}
          checkLiked={checkLiked}
          isLoading={isLoading}
        />
      ))}
    </div>
  );
}
