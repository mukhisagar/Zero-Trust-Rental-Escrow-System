import { ethers } from "ethers";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "./contractABI.js";

let provider = null;
let signer = null;
let contract = null;

export const initProvider = async () => {
  if (typeof window.ethereum !== "undefined") {
    provider = new ethers.BrowserProvider(window.ethereum);
    signer = await provider.getSigner();
    if (CONTRACT_ADDRESS === "0xf8e81D47203A594245E36C48e151709F0C19fBe8") {
      throw new Error(
        "Update CONTRACT_ADDRESS with your deployed contract address from Remix Sepolia",
      );
    }
    contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
    return { provider, signer, contract };
  }
  throw new Error("MetaMask not found");
};

export const getContract = () => contract;
export const getSignerAddress = async () => {
  if (signer) return await signer.getAddress();
  return null;
};

// Helper to wait for tx
export const waitForTx = (tx) => tx.wait();
