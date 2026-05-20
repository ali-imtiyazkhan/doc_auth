import { Router, Request, Response } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { processDocument } from "../services/ocr.js";
import { hashFile } from "../services/hash.js";

const router = Router();

// ─── Multer config ─────────────────────────────
const uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e6)}`;
    const ext = path.extname(file.originalname);
    cb(null, `${unique}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB max
  fileFilter: (_req, file, cb) => {
    const allowed = [".pdf", ".png", ".jpg", ".jpeg", ".tiff", ".bmp"];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error(`File type ${ext} not supported. Allowed: ${allowed.join(", ")}`));
    }
  },
});

// ──────────────────────────────────────────────
//  POST /api/v1/documents/upload
//  Upload a document → run OCR → return extracted metadata
// ──────────────────────────────────────────────
router.post("/upload", upload.single("document"), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      res.status(400).json({ error: "No file uploaded" });
      return;
    }

    console.log(`[OCR] Processing file: ${req.file.originalname} (${req.file.size} bytes)`);

    // Run OCR pipeline
    const metadata = await processDocument(req.file.path);

    // Generate file hash
    const fileHash = await hashFile(req.file.path);

    res.json({
      success: true,
      fileHash,
      filePath: req.file.path,
      originalName: req.file.originalname,
      fileSize: req.file.size,
      extractedMetadata: {
        name: metadata.name,
        rollNo: metadata.rollNo,
        dateOfIssue: metadata.dateOfIssue,
        docType: metadata.docType,
        institution: metadata.institution,
      },
      ocrConfidence: metadata.confidence,
      rawText: metadata.rawText,
    });
  } catch (error: any) {
    console.error("[OCR] Error:", error.message);
    res.status(500).json({ error: "OCR processing failed", details: error.message });
  }
});

// ──────────────────────────────────────────────
//  POST /api/v1/documents/hash
//  Hash a previously uploaded file (by path)
// ──────────────────────────────────────────────
router.post("/hash", async (req: Request, res: Response) => {
  try {
    const { filePath } = req.body;

    if (!filePath || !fs.existsSync(filePath)) {
      res.status(400).json({ error: "Invalid or missing filePath" });
      return;
    }

    const fileHash = await hashFile(filePath);
    res.json({ success: true, fileHash });
  } catch (error: any) {
    console.error("[Hash] Error:", error.message);
    res.status(500).json({ error: "Hashing failed", details: error.message });
  }
});

// ──────────────────────────────────────────────
//  GET /api/v1/documents/uploads
//  List all uploaded files (for dev/debug)
// ──────────────────────────────────────────────
router.get("/uploads", (_req: Request, res: Response) => {
  try {
    const files = fs.readdirSync(uploadsDir).map((name) => {
      const stats = fs.statSync(path.join(uploadsDir, name));
      return {
        name,
        size: stats.size,
        uploadedAt: stats.mtime.toISOString(),
      };
    });
    res.json({ files });
  } catch (error: any) {
    res.status(500).json({ error: "Failed to list uploads", details: error.message });
  }
});

export default router;
