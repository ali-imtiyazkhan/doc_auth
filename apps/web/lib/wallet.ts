import { BrowserProvider, Contract, ethers } from "ethers";
import { DOCAUTH_ABI, DEFAULT_CONTRACT_ADDRESS } from "@repo/contracts-config";

// Get the contract address from environment variable or use the default local address
export const getContractAddress = (): string => {
  return process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || DEFAULT_CONTRACT_ADDRESS;
};

/**
 * Gets a BrowserProvider instance using window.ethereum.
 */
export const getBrowserProvider = (): BrowserProvider | null => {
  if (typeof window !== "undefined" && (window as any).ethereum) {
    return new BrowserProvider((window as any).ethereum);
  }
  return null;
};

/**
 * Request MetaMask wallet connection and return the signer and address.
 */
export const connectWallet = async (): Promise<{ address: string; provider: BrowserProvider } | null> => {
  const provider = getBrowserProvider();
  if (!provider) {
    throw new Error("No Web3 provider found. Please install MetaMask.");
  }

  // Request accounts
  await provider.send("eth_requestAccounts", []);
  const signer = await provider.getSigner();
  const address = await signer.getAddress();

  return { address, provider };
};

/**
 * Gets the DocAuth contract instance connected to a signer or provider.
 */
export const getDocAuthContract = (signerOrProvider: any): Contract => {
  const contractAddress = getContractAddress();
  return new Contract(contractAddress, DOCAUTH_ABI, signerOrProvider);
};

/**
 * Checks if the given address is authorized as an issuer.
 */
export const checkIfAuthorizedIssuer = async (address: string): Promise<boolean> => {
  try {
    const provider = getBrowserProvider();
    if (!provider) return false;

    const contract = getDocAuthContract(provider);
    const isAuthorized = await contract.authorizedIssuers(address);
    return isAuthorized;
  } catch (error) {
    console.error("Error checking issuer authorization:", error);
    return false;
  }
};

/**
 * Issue a document on-chain.
 * @param fileHash 32-byte hex string (with 0x prefix)
 * @param metadata JSON string metadata
 */
export const issueDocumentOnChain = async (
  fileHash: string,
  metadata: string
): Promise<string> => {
  const provider = getBrowserProvider();
  if (!provider) throw new Error("Wallet not connected");

  const signer = await provider.getSigner();
  const contract = getDocAuthContract(signer);

  console.log(`[Blockchain] Calling issueDocument with hash: ${fileHash}`);
  const tx = await contract.issueDocument(fileHash, metadata);
  console.log(`[Blockchain] Tx submitted: ${tx.hash}`);

  // Wait for 1 confirmation
  const receipt = await tx.wait();
  console.log(`[Blockchain] Tx confirmed in block ${receipt.blockNumber}`);
  return tx.hash;
};

/**
 * Revoke a document on-chain.
 * @param fileHash 32-byte hex string (with 0x prefix)
 */
export const revokeDocumentOnChain = async (fileHash: string): Promise<string> => {
  const provider = getBrowserProvider();
  if (!provider) throw new Error("Wallet not connected");

  const signer = await provider.getSigner();
  const contract = getDocAuthContract(signer);

  console.log(`[Blockchain] Calling revokeDocument with hash: ${fileHash}`);
  const tx = await contract.revokeDocument(fileHash);
  console.log(`[Blockchain] Tx submitted: ${tx.hash}`);

  const receipt = await tx.wait();
  console.log(`[Blockchain] Tx confirmed in block ${receipt.blockNumber}`);
  return tx.hash;
};
