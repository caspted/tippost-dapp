import "./Navbar.css";

interface NavbarProps {
  account: string | null;
  totalEarned: string;
  connectWallet: () => void;
}

export function Navbar({ account, totalEarned, connectWallet }: NavbarProps) {
  const shortenAddress = (addr: string) =>
    `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  return (
    <nav className="navbar" id="navbar">
      <div className="navbar-inner">
        <div className="navbar-brand" id="navbar-brand">
          <span className="brand-icon">💸</span>
          <span className="brand-text">TipPost</span>
          <span className="brand-badge">Sepolia</span>
        </div>

        <div className="navbar-right">
          {account && (
            <div className="earnings-display" id="earnings-display">
              <span className="earnings-icon">⚡</span>
              <span className="earnings-label">Earned</span>
              <span className="earnings-value">
                {parseFloat(totalEarned).toFixed(4)} ETH
              </span>
            </div>
          )}

          <button
            className={`connect-btn ${account ? "connected" : ""}`}
            onClick={connectWallet}
            id="connect-wallet-btn"
          >
            {account ? (
              <>
                <span className="wallet-dot"></span>
                {shortenAddress(account)}
              </>
            ) : (
              <>
                <span className="wallet-icon">🦊</span>
                Connect Wallet
              </>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
}
