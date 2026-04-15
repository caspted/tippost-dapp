# TipPost dApp

A decentralized, pay-to-like social media platform where users can post images with captions, and others can tip the creator with real ETH on the Sepolia testnet. This project showcases full-stack blockchain integration, real-time event handling, and secure smart contract logic.

## 🔗 Deployed Links

* **Sepolia Contract Address:** `0x06E6aA2331b967924E38814811Ca659098c70946`
* **Live Frontend URL:** [https://tippost-dapp.vercel.app/](https://tippost-dapp.vercel.app/) 

---

## 🛠️ Tech Stack

### Smart Contracts
* **Language:** Solidity ^0.8.20 
* **Framework:** Hardhat + TypeScript 
* **Deployment:** Sepolia Testnet 
* **Verification:** Verified on Sepolia Etherscan 

### Frontend
* **Framework:** React + Vite + TypeScript
* **Interaction:** Ethers.js v6 
* **Hosting:** Vercel
* **Wallet:** MetaMask

---

## 📂 Folder Structure

The project is organized into a clean monorepo structure:

* `hardhat/`: Contains the Hardhat project, Solidity smart contracts, and blockchain tests.
* `frontend/`: The React-based user interface, hooks for blockchain interaction, and ABI definitions.

---

## 🚀 Local Setup

### Prerequisites
* Node.js and npm installed.
* MetaMask extension installed in your browser with the Sepolia network enabled.

### 1. Smart Contract Setup (Hardhat)
1.  Navigate to the `hardhat/` directory.
2.  Install dependencies: `npm install`.
3.  Create a `.env` file and fill in your `SEPOLIA_RPC_URL`, `PRIVATE_KEY`, and `ETHERSCAN_API_KEY`.
4.  Compile the contract: `npx hardhat compile`.
5.  Run local tests: `npx hardhat test`.
    * *Note: Tests cover post creation, successful tipping, and rejection of double-likes/self-likes.*

### 2. Frontend Setup (React + Vite)
1.  Navigate to the `frontend/` directory.
2.  Install dependencies: `npm install`.
3.  Create a `.env` file and add: `VITE_CONTRACT_ADDRESS`.
4.  Run the application locally: `npm run dev`.

---

## 💎 Features Implemented

* **Functional Smart Contract:** Secure `TipPost.sol` handling post storage and direct ETH transfers.
* **Network Guard:** Prompts the user to switch networks if they are not on the Sepolia Testnet.
* **Real-time Event Listeners:** Feed refreshes instantly using `PostCreated` and `PostLiked` event listeners.
* **Like Logic (0.0001 ETH):** Sends tips directly to the creator's wallet via the `.call` method.
* **Earnings Dashboard:** Personalized display showing total ETH tips earned by the connected address].
* **Transaction Status:** Clear UI feedback for loading, success, and error states.

---

## 🚰 How to Get Sepolia ETH

To interact with this dApp, you need testnet ETH from a faucet:
* [Google Cloud Sepolia Faucet](https://cloud.google.com/application/web3/faucet/ethereum/sepolia)
* [Alchemy Sepolia Faucet](https://sepoliafaucet.com)
* [Infura Sepolia Faucet](https://www.infura.io/faucet/sepolia)

---

## ✅ Submission Checklist

* [x] GitHub repository link (public)
* [x] Live frontend URL (Vercel)
* [x] Deployed contract address on Sepolia
* [x] README with local setup instructions
* [x] All Hardhat tests passing (4+ tests)

## 📸 Submission Screenshots

* All Solidity and Typescript test passed
<img width="805" height="448" alt="Screenshot 2026-04-15 at 9 40 38 PM" src="https://github.com/user-attachments/assets/3b236a12-a53a-4039-8797-825a07ed9b4d" />

* Verified Deployment
<img width="753" height="88" alt="Screenshot 2026-04-15 at 9 42 30 PM" src="https://github.com/user-attachments/assets/21857e63-e633-42a1-9e87-a1357486e538" />

* Live connection to MetaMask
<img width="842" height="344" alt="Screenshot 2026-04-15 at 10 52 37 PM" src="https://github.com/user-attachments/assets/8c94263e-b183-4dd6-8d71-9e3248e90c17" />

* Real time posting
<img width="381" height="563" alt="Screenshot 2026-04-15 at 10 55 17 PM" src="https://github.com/user-attachments/assets/436873bd-1cb3-4675-9e78-b7a422ccacaa" />

* Active like function and token trasfer 
<img width="391" height="563" alt="Screenshot 2026-04-15 at 10 55 56 PM" src="https://github.com/user-attachments/assets/5b65ba7d-28d3-477f-ac77-5937f5561bfb" />


