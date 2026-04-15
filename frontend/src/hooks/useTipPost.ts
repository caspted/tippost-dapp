import { useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";
import TipPostABI from "../abi/TipPost.json";

const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS as string;
const SEPOLIA_CHAIN_ID = "0xaa36a7";

export interface Post {
  id: bigint;
  creator: string;
  imageUrl: string;
  caption: string;
  likes: bigint;
  totalEarned: bigint;
  timestamp: bigint;
}

interface EthereumProvider {
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
  on: (event: string, handler: (...args: unknown[]) => void) => void;
  removeListener: (event: string, handler: (...args: unknown[]) => void) => void;
}

declare global {
  interface Window {
    ethereum?: EthereumProvider;
  }
}

export function useTipPost() {
  const [account, setAccount] = useState<string | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [totalEarned, setTotalEarned] = useState<string>("0");
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = useCallback((message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 4000);
  }, []);

  const clearError = useCallback(() => setError(null), []);

  // Initialize contract
  const getContract = useCallback(async (needsSigner = false) => {
    if (!window.ethereum) throw new Error("MetaMask is not installed");

    const provider = new ethers.BrowserProvider(window.ethereum);

    if (needsSigner) {
      const signer = await provider.getSigner();
      return new ethers.Contract(CONTRACT_ADDRESS, TipPostABI, signer);
    }

    return new ethers.Contract(CONTRACT_ADDRESS, TipPostABI, provider);
  }, []);

  // Check network
  const checkNetwork = useCallback(async () => {
    if (!window.ethereum) return false;
    const chainId = (await window.ethereum.request({ method: "eth_chainId" })) as string;
    if (chainId !== SEPOLIA_CHAIN_ID) {
      showToast("⚠️ Please switch to the Sepolia test network in MetaMask.");
      return false;
    }
    return true;
  }, [showToast]);

  // Connect wallet
  const connectWallet = useCallback(async () => {
    try {
      if (!window.ethereum) {
        showToast("🦊 Please install MetaMask to use TipPost.");
        return;
      }

      const networkOk = await checkNetwork();
      if (!networkOk) return;

      const accounts = (await window.ethereum.request({
        method: "eth_requestAccounts",
      })) as string[];

      if (accounts.length > 0) {
        setAccount(accounts[0]);
        const c = await getContract(true);
        setContract(c);
      }
    } catch (err: unknown) {
      const error = err as { code?: number; message?: string };
      if (error.code === 4001) {
        showToast("❌ Connection request was rejected.");
      } else {
        showToast("❌ Failed to connect wallet.");
      }
    }
  }, [checkNetwork, getContract, showToast]);

  // Fetch all posts
  const fetchAllPosts = useCallback(async () => {
    try {
      const c = await getContract();
      const rawPosts = await c.getAllPosts();
      const formatted: Post[] = rawPosts.map((p: Post) => ({
        id: p.id,
        creator: p.creator,
        imageUrl: p.imageUrl,
        caption: p.caption,
        likes: p.likes,
        totalEarned: p.totalEarned,
        timestamp: p.timestamp,
      }));
      setPosts(formatted.reverse());
    } catch {
      console.error("Error fetching posts");
    }
  }, [getContract]);

  // Fetch earnings
  const fetchEarnings = useCallback(async () => {
    if (!account) return;
    try {
      const c = await getContract();
      const earned = await c.totalEarnedByUser(account);
      setTotalEarned(ethers.formatEther(earned));
    } catch {
      console.error("Error fetching earnings");
    }
  }, [account, getContract]);

  // Create post
  const createPost = useCallback(
    async (imageUrl: string, caption: string) => {
      try {
        setIsLoading(true);
        setError(null);

        const networkOk = await checkNetwork();
        if (!networkOk) return;

        const c = contract || (await getContract(true));
        const tx = await c.createPost(imageUrl, caption);
        await tx.wait();
        showToast("✅ Post created successfully!");
        await fetchAllPosts();
        await fetchEarnings();
      } catch (err: unknown) {
        const error = err as { code?: number; message?: string };
        if (error.code === 4001) {
          showToast("❌ Transaction was rejected by user.");
        } else {
          setError("Failed to create post. Please try again.");
          showToast("❌ Transaction failed.");
        }
      } finally {
        setIsLoading(false);
      }
    },
    [contract, checkNetwork, getContract, showToast, fetchAllPosts, fetchEarnings]
  );

  // Like post
  const likePost = useCallback(
    async (postId: bigint) => {
      try {
        setIsLoading(true);
        setError(null);

        const networkOk = await checkNetwork();
        if (!networkOk) return;

        const c = contract || (await getContract(true));
        const tx = await c.likePost(postId, {
          value: ethers.parseEther("0.0001"),
        });
        await tx.wait();
        showToast("✅ Post liked! 0.0001 ETH sent to creator.");
        await fetchAllPosts();
        await fetchEarnings();
      } catch (err: unknown) {
        const error = err as { code?: number; message?: string };
        if (error.code === 4001) {
          showToast("❌ Transaction was rejected by user.");
        } else if (error.message?.includes("Already liked")) {
          showToast("❤️ You've already liked this post.");
        } else if (error.message?.includes("Cannot like your own")) {
          showToast("🚫 You can't like your own post.");
        } else if (error.message?.includes("insufficient")) {
          showToast("💸 Insufficient ETH balance.");
        } else {
          showToast("❌ Like transaction failed.");
        }
      } finally {
        setIsLoading(false);
      }
    },
    [contract, checkNetwork, getContract, showToast, fetchAllPosts, fetchEarnings]
  );

  // Check if user liked a post
  const checkLiked = useCallback(
    async (postId: bigint): Promise<boolean> => {
      if (!account) return false;
      try {
        const c = await getContract();
        return await c.checkLiked(postId, account);
      } catch {
        return false;
      }
    },
    [account, getContract]
  );

  // Event listeners
  useEffect(() => {
    if (!contract) return;

    const onPostCreated = () => {
      fetchAllPosts();
      fetchEarnings();
    };
    const onPostLiked = () => {
      fetchAllPosts();
      fetchEarnings();
    };

    contract.on("PostCreated", onPostCreated);
    contract.on("PostLiked", onPostLiked);

    return () => {
      contract.off("PostCreated", onPostCreated);
      contract.off("PostLiked", onPostLiked);
    };
  }, [contract, fetchAllPosts, fetchEarnings]);

  // Account change listener
  useEffect(() => {
    if (!window.ethereum) return;

    const handleAccountsChanged = (...args: unknown[]) => {
      const accounts = args[0] as string[];
      if (accounts.length === 0) {
        setAccount(null);
        setContract(null);
      } else {
        setAccount(accounts[0]);
        getContract(true).then(setContract);
      }
    };

    const handleChainChanged = () => {
      window.location.reload();
    };

    window.ethereum.on("accountsChanged", handleAccountsChanged);
    window.ethereum.on("chainChanged", handleChainChanged);

    return () => {
      window.ethereum?.removeListener("accountsChanged", handleAccountsChanged);
      window.ethereum?.removeListener("chainChanged", handleChainChanged);
    };
  }, [getContract]);

  // Initial fetch
  useEffect(() => {
    fetchAllPosts();
  }, [fetchAllPosts]);

  useEffect(() => {
    if (account) fetchEarnings();
  }, [account, fetchEarnings]);

  return {
    account,
    posts,
    totalEarned,
    isLoading,
    error,
    toastMessage,
    connectWallet,
    createPost,
    likePost,
    checkLiked,
    clearError,
    fetchAllPosts,
  };
}
