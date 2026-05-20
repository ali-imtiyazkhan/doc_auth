// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title DocAuth
 * @notice Blockchain-based document authentication system.
 *         Institutions issue documents by storing SHA-256 hashes on-chain.
 *         Anyone can verify a document's authenticity by comparing hashes.
 */
contract DocAuth is Ownable {
    // ──────────────────────────────────────────────
    //  Types
    // ──────────────────────────────────────────────

    struct Document {
        bytes32 fileHash;       // SHA-256 hash of the original file
        string  metadata;       // JSON: { name, rollNo, dateOfIssue, docType, institution }
        address issuer;         // Wallet address of the issuing institution
        uint256 issuedAt;       // Block timestamp when issued
        bool    revoked;        // True if the institution revoked this document
        bool    exists;         // True if this entry has been created
    }

    // ──────────────────────────────────────────────
    //  State
    // ──────────────────────────────────────────────

    /// @notice fileHash => Document record
    mapping(bytes32 => Document) public documents;

    /// @notice Authorized institution wallets
    mapping(address => bool) public authorizedIssuers;

    /// @notice All file hashes issued (for enumeration)
    bytes32[] public allDocumentHashes;

    /// @notice File hashes issued by a specific address
    mapping(address => bytes32[]) public issuerDocuments;

    // ──────────────────────────────────────────────
    //  Events
    // ──────────────────────────────────────────────

    event DocumentIssued(
        bytes32 indexed fileHash,
        address indexed issuer,
        string  metadata,
        uint256 issuedAt
    );

    event DocumentRevoked(
        bytes32 indexed fileHash,
        address indexed revokedBy,
        uint256 revokedAt
    );

    event IssuerAdded(address indexed issuer);
    event IssuerRemoved(address indexed issuer);

    // ──────────────────────────────────────────────
    //  Modifiers
    // ──────────────────────────────────────────────

    modifier onlyAuthorized() {
        require(authorizedIssuers[msg.sender], "DocAuth: caller is not an authorized issuer");
        _;
    }

    modifier onlyDocumentIssuer(bytes32 _fileHash) {
        require(documents[_fileHash].exists, "DocAuth: document does not exist");
        require(documents[_fileHash].issuer == msg.sender, "DocAuth: caller is not the document issuer");
        _;
    }

    // ──────────────────────────────────────────────
    //  Constructor
    // ──────────────────────────────────────────────

    constructor() Ownable(msg.sender) {
        // The deployer is automatically the owner (via Ownable)
        // and also the first authorized issuer
        authorizedIssuers[msg.sender] = true;
        emit IssuerAdded(msg.sender);
    }

    // ──────────────────────────────────────────────
    //  Core Functions
    // ──────────────────────────────────────────────

    /**
     * @notice Issue a new document by storing its hash on-chain.
     * @param _fileHash  SHA-256 hash of the document file (as bytes32)
     * @param _metadata  JSON string containing document metadata
     */
    function issueDocument(bytes32 _fileHash, string calldata _metadata) external onlyAuthorized {
        require(_fileHash != bytes32(0), "DocAuth: file hash cannot be zero");
        require(!documents[_fileHash].exists, "DocAuth: document already exists");
        require(bytes(_metadata).length > 0, "DocAuth: metadata cannot be empty");

        documents[_fileHash] = Document({
            fileHash: _fileHash,
            metadata: _metadata,
            issuer:   msg.sender,
            issuedAt: block.timestamp,
            revoked:  false,
            exists:   true
        });

        allDocumentHashes.push(_fileHash);
        issuerDocuments[msg.sender].push(_fileHash);

        emit DocumentIssued(_fileHash, msg.sender, _metadata, block.timestamp);
    }

    /**
     * @notice Verify a document by its file hash.
     * @param _fileHash  SHA-256 hash to look up
     * @return doc  The full Document struct
     */
    function verifyDocument(bytes32 _fileHash) external view returns (Document memory doc) {
        return documents[_fileHash];
    }

    /**
     * @notice Revoke a previously issued document. Only the original issuer can revoke.
     * @param _fileHash  SHA-256 hash of the document to revoke
     */
    function revokeDocument(bytes32 _fileHash) external onlyDocumentIssuer(_fileHash) {
        require(!documents[_fileHash].revoked, "DocAuth: document already revoked");
        documents[_fileHash].revoked = true;
        emit DocumentRevoked(_fileHash, msg.sender, block.timestamp);
    }

    // ──────────────────────────────────────────────
    //  Access Control
    // ──────────────────────────────────────────────

    /**
     * @notice Add an institution wallet to the authorized issuers list.
     * @param _issuer  Wallet address to authorize
     */
    function addIssuer(address _issuer) external onlyOwner {
        require(_issuer != address(0), "DocAuth: zero address");
        require(!authorizedIssuers[_issuer], "DocAuth: already authorized");
        authorizedIssuers[_issuer] = true;
        emit IssuerAdded(_issuer);
    }

    /**
     * @notice Remove an institution wallet from the authorized issuers list.
     * @param _issuer  Wallet address to deauthorize
     */
    function removeIssuer(address _issuer) external onlyOwner {
        require(authorizedIssuers[_issuer], "DocAuth: not currently authorized");
        authorizedIssuers[_issuer] = false;
        emit IssuerRemoved(_issuer);
    }

    // ──────────────────────────────────────────────
    //  View Helpers
    // ──────────────────────────────────────────────

    /**
     * @notice Get total number of documents issued on this contract.
     */
    function getTotalDocuments() external view returns (uint256) {
        return allDocumentHashes.length;
    }

    /**
     * @notice Get all document hashes issued by a specific address.
     * @param _issuer  The issuer address to query
     */
    function getIssuerDocumentHashes(address _issuer) external view returns (bytes32[] memory) {
        return issuerDocuments[_issuer];
    }
}
