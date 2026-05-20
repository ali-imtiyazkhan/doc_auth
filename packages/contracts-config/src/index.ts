export const DOCAUTH_ABI = [
  "constructor()",
  "error OwnableInvalidOwner(address owner)",
  "error OwnableUnauthorizedAccount(address account)",
  "event DocumentIssued(bytes32 indexed fileHash, address indexed issuer, string metadata, uint256 issuedAt)",
  "event DocumentRevoked(bytes32 indexed fileHash, address indexed revokedBy, uint256 revokedAt)",
  "event IssuerAdded(address indexed issuer)",
  "event IssuerRemoved(address indexed issuer)",
  "event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)",
  "function addIssuer(address _issuer) external",
  "function allDocumentHashes(uint256) external view returns (bytes32)",
  "function authorizedIssuers(address) external view returns (bool)",
  "function documents(bytes32) external view returns (bytes32 fileHash, string metadata, address issuer, uint256 issuedAt, bool revoked, bool exists)",
  "function getIssuerDocumentHashes(address _issuer) external view returns (bytes32[])",
  "function getTotalDocuments() external view returns (uint256)",
  "function issueDocument(bytes32 _fileHash, string _metadata) external",
  "function issuerDocuments(address, uint256) external view returns (bytes32)",
  "function owner() external view returns (address)",
  "function removeIssuer(address _issuer) external",
  "function renounceOwnership() external",
  "function revokeDocument(bytes32 _fileHash) external",
  "function transferOwnership(address newOwner) external",
  "function verifyDocument(bytes32 _fileHash) external view returns (tuple(bytes32 fileHash, string metadata, address issuer, uint256 issuedAt, bool revoked, bool exists))"
];

// Fallback address for development. Update with Sepolia deployment details when needed.
export const DEFAULT_CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
