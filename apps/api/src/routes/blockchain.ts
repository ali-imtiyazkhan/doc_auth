import { Router, Request, Response } from "express";
import { ethers } from "ethers";
import { stampPDF } from "../services/pdfStamp.js";
import fs from "fs";
import path from "path";
import { prisma } from "@repo/db";

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

    // Log verification to database
    try {
      await prisma.verificationLog.create({
        data: {
          fileHash,
          status: doc.exists ? (doc.revoked ? "revoked" : "authentic") : "not_found",
          ipAddress: req.ip,
          userAgent: req.headers["user-agent"],
        },
      });
    } catch (logErr: any) {
      console.warn("[Prisma] Failed to write verification log:", logErr.message);
    }

    if (!doc.exists) {
      res.json({
        status: "not_found",
        message: "No document found with this hash on the blockchain.",
      });
      return;
    }

    let parsedMetadata: any = {};
    try {
      parsedMetadata = JSON.parse(doc.metadata);
    } catch {
      parsedMetadata = { raw: doc.metadata };
    }

    // Cache document finding in database
    try {
      await prisma.document.upsert({
        where: { fileHash },
        update: {
          revoked: doc.revoked,
          issuerAddress: doc.issuer,
        },
        create: {
          fileHash,
          name: parsedMetadata.name || "",
          rollNo: parsedMetadata.rollNo || "",
          dateOfIssue: parsedMetadata.dateOfIssue || "",
          docType: parsedMetadata.docType || "Certificate",
          institution: parsedMetadata.institution || "",
          issuerAddress: doc.issuer,
          revoked: doc.revoked,
        },
      });
    } catch (dbErr: any) {
      console.warn("[Prisma] Failed to sync document to DB:", dbErr.message);
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
//  POST /api/v1/blockchain/register
//  Register an issued document in the database
// ──────────────────────────────────────────────
router.post("/register", async (req: Request, res: Response) => {
  try {
    const {
      fileHash,
      txHash,
      name,
      rollNo,
      dateOfIssue,
      docType,
      institution,
      issuerAddress,
      filePath,
    } = req.body;

    if (!fileHash || !issuerAddress) {
      res.status(400).json({ error: "Missing fileHash or issuerAddress" });
      return;
    }

    const doc = await prisma.document.upsert({
      where: { fileHash },
      update: {
        txHash,
        name,
        rollNo,
        dateOfIssue,
        docType,
        institution,
        issuerAddress,
        filePath,
        revoked: false,
      },
      create: {
        fileHash,
        txHash,
        name,
        rollNo,
        dateOfIssue,
        docType,
        institution,
        issuerAddress,
        filePath,
        revoked: false,
      },
    });

    res.json({ success: true, document: doc });
  } catch (error: any) {
    console.error("[DB Register] Error:", error.message);
    res.status(500).json({ error: "Database registration failed", details: error.message });
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

    // Update txHash in DB if the document is tracked
    try {
      const relativePath = filePath.replace(process.cwd() + path.sep, "");
      const found = await prisma.document.findFirst({
        where: {
          OR: [
            { filePath: filePath },
            { filePath: relativePath }
          ]
        }
      });
      if (found) {
        await prisma.document.update({
          where: { id: found.id },
          data: { txHash }
        });
      }
    } catch (dbErr: any) {
      console.warn("[Prisma] Failed to update txHash during stamp:", dbErr.message);
    }

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="stamped-${Date.now()}.pdf"`);
    res.send(stampedPdf);
  } catch (error: any) {
    console.error("[PDF Stamp] Error:", error.message);
    res.status(500).json({ error: "PDF stamping failed", details: error.message });
  }
});

export default router;
