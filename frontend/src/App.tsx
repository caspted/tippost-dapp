import { useTipPost } from "./hooks/useTipPost";
import { Navbar } from "./components/Navbar";
import { CreatePostForm } from "./components/CreatePostForm";
import { PostFeed } from "./components/PostFeed";
import "./App.css";

function App() {
  const {
    account,
    posts,
    totalEarned,
    isLoading,
    toastMessage,
    connectWallet,
    createPost,
    likePost,
    checkLiked,
  } = useTipPost();

  return (
    <div className="app-container">
      {toastMessage && (
        <div className="toast-notification">
          {toastMessage}
        </div>
      )}

      <Navbar 
        account={account} 
        totalEarned={totalEarned} 
        connectWallet={connectWallet} 
      />

      <main className="main-content">
        {!account ? (
          <div className="hero-section">
            <h1 className="hero-title">Welcome to <span className="highlight">TipPost</span></h1>
            <p className="hero-subtitle">
              The pay-to-like decentralized social network. Share your moments, earn ETH for every like.
            </p>
            <button className="hero-connect-btn" onClick={connectWallet}>
              Connect Wallet to Start
            </button>
          </div>
        ) : (
          <>
            <CreatePostForm 
              account={account} 
              isLoading={isLoading} 
              createPost={createPost} 
            />
            
            <PostFeed 
              posts={posts} 
              account={account} 
              likePost={likePost} 
              checkLiked={checkLiked} 
              isLoading={isLoading} 
            />
          </>
        )}
      </main>
    </div>
  );
}

export default App;
