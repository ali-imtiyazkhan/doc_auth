import { Router, Request, Response } from "express";
import { ethers } from "ethers";
import { stampPDF } from "../services/pdfStamp.js";
import fs from "fs";

const router = Router();

// ─── Contract ABI (minimal interface for read operations) ───
const DOCAUTH_ABI = [
  "function verifyDocument(bytes32 _fileHash) external view returns (tuple(bytes32 fileHash, string metadata, address issuer, uint256 issuedAt, bool revoked, bool exists))",
  "function getTotalDocuments() external view returns (uint256)",
  "function getIssuerDocumentHashes(address _issuer) external view returns (bytes32[])",
  "function authorizedIssuers(address) external view returns (bool)",
];

// These will be loaded from environment
const RPC_URL = process.env.SEPOLIA_RPC_URL || "http://127.0.0.1:8545";
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS || "";

function getContract(): ethers.Contract | null {
  if (!CONTRACT_ADDRESS) {
    console.warn("[Blockchain] CONTRACT_ADDRESS not set");
    return null;
  }
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  return new ethers.Contract(CONTRACT_ADDRESS, DOCAUTH_ABI, provider);
}

// ──────────────────────────────────────────────
//  GET /api/v1/blockchain/verify/:hash
//  Verify a document by its file hash
// ──────────────────────────────────────────────
router.get("/verify/:hash", async (req: Request, res: Response) => {
  try {
    const contract = getContract();
    if (!contract) {
      res.status(503).json({ error: "Blockchain not configured. Set CONTRACT_ADDRESS env var." });
      return;
    }

    const fileHash = req.params.hash;

    // Validate hash format
    if (!fileHash || !fileHash.startsWith("0x") || fileHash.length !== 66) {
      res.status(400).json({ error: "Invalid hash format. Expected 0x-prefixed 32-byte hex string." });
      return;
    }

    const doc = await contract.verifyDocument(fileHash);

    if (!doc.exists) {
      res.json({
        status: "not_found",
        message: "No document found with this hash on the blockchain.",
      });
      return;
    }

    let parsedMetadata = {};
    try {
      parsedMetadata = JSON.parse(doc.metadata);
    } catch {
      parsedMetadata = { raw: doc.metadata };
    }

    res.json({
      status: doc.revoked ? "revoked" : "authentic",
      fileHash: doc.fileHash,
      metadata: parsedMetadata,
      issuer: doc.issuer,
      issuedAt: new Date(Number(doc.issuedAt) * 1000).toISOString(),
      revoked: doc.revoked,
    });
  } catch (error: any) {
    console.error("[Blockchain] Verify error:", error.message);
    res.status(500).json({ error: "Blockchain query failed", details: error.message });
  }
});

// ──────────────────────────────────────────────
//  GET /api/v1/blockchain/issuer/:address/documents
//  List all documents issued by an address
// ──────────────────────────────────────────────
router.get("/issuer/:address/documents", async (req: Request, res: Response) => {
  try {
    const contract = getContract();
    if (!contract) {
      res.status(503).json({ error: "Blockchain not configured." });
      return;
    }

    const address = req.params.address;

    if (!ethers.isAddress(address)) {
      res.status(400).json({ error: "Invalid Ethereum address." });
      return;
    }

    const hashes: string[] = await contract.getIssuerDocumentHashes(address);

    // Fetch full details for each document
    const documents = await Promise.all(
      hashes.map(async (hash: string) => {
        const doc = await contract.verifyDocument(hash);
        let parsedMetadata = {};
        try {
          parsedMetadata = JSON.parse(doc.metadata);
        } catch {
          parsedMetadata = { raw: doc.metadata };
        }
        return {
          fileHash: doc.fileHash,
          metadata: parsedMetadata,
          issuedAt: new Date(Number(doc.issuedAt) * 1000).toISOString(),
          revoked: doc.revoked,
        };
      })
    );

    res.json({
      issuer: address,
      isAuthorized: await contract.authorizedIssuers(address),
      totalDocuments: documents.length,
      documents,
    });
  } catch (error: any) {
    console.error("[Blockchain] Issuer documents error:", error.message);
    res.status(500).json({ error: "Failed to fetch issuer documents", details: error.message });
  }
});

// ──────────────────────────────────────────────
//  GET /api/v1/blockchain/stats
//  Get contract statistics
// ──────────────────────────────────────────────
router.get("/stats", async (_req: Request, res: Response) => {
  try {
    const contract = getContract();
    if (!contract) {
      res.status(503).json({ error: "Blockchain not configured." });
      return;
    }

    const total = await contract.getTotalDocuments();
    res.json({
      totalDocuments: Number(total),
      contractAddress: CONTRACT_ADDRESS,
      network: RPC_URL.includes("sepolia") ? "sepolia" : "localhost",
    });
  } catch (error: any) {
    console.error("[Blockchain] Stats error:", error.message);
    res.status(500).json({ error: "Failed to fetch stats", details: error.message });
  }
});

// ──────────────────────────────────────────────
//  POST /api/v1/blockchain/stamp-pdf
//  Generate a stamped PDF with QR code overlay
// ──────────────────────────────────────────────
router.post("/stamp-pdf", async (req: Request, res: Response) => {
  try {
    const { filePath, txHash, contractAddress: ca } = req.body;

    if (!filePath || !txHash) {
      res.status(400).json({ error: "Missing filePath or txHash" });
      return;
    }

    if (!fs.existsSync(filePath)) {
      res.status(400).json({ error: "File not found at specified path" });
      return;
    }

    const verifierBaseUrl = process.env.VERIFIER_BASE_URL || "http://localhost:3001";
    const stampedPdf = await stampPDF(filePath, txHash, ca || CONTRACT_ADDRESS, verifierBaseUrl);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="stamped-${Date.now()}.pdf"`);
    res.send(stampedPdf);
  } catch (error: any) {
    console.error("[PDF Stamp] Error:", error.message);
    res.status(500).json({ error: "PDF stamping failed", details: error.message });
  }
});

export default router;
