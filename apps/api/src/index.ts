import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import documentsRouter from "./routes/documents.js";
import blockchainRouter from "./routes/blockchain.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ─── CORS ──────────────────────────────────────
app.use(
  cors({
    origin: [
      "http://localhost:3000",  // Institution portal (web)
      "http://localhost:3001",  // Verifier portal (docs)
      "http://127.0.0.1:3000",
      "http://127.0.0.1:3001",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json({ limit: "10mb" }));

// ─── Logger ────────────────────────────────────
app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// ─── Health Check ──────────────────────────────
app.get("/health", (_req, res) => {
  res.json({
    status: "healthy",
    service: "DocAuth API",
    timestamp: new Date().toISOString(),
    blockchain: {
      contractAddress: process.env.CONTRACT_ADDRESS || "not configured",
      network: process.env.SEPOLIA_RPC_URL ? "sepolia" : "localhost",
    },
  });
});

// ─── Routes ────────────────────────────────────
app.use("/api/v1/documents", documentsRouter);
app.use("/api/v1/blockchain", blockchainRouter);

// ─── 404 Handler ───────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// ─── Start ─────────────────────────────────────
app.listen(PORT, () => {
  console.log(`=================================================`);
  console.log(`🚀 DocAuth API listening on port ${PORT}`);
  console.log(`   Health:     http://localhost:${PORT}/health`);
  console.log(`   Documents:  http://localhost:${PORT}/api/v1/documents/`);
  console.log(`   Blockchain: http://localhost:${PORT}/api/v1/blockchain/`);
  console.log(`=================================================`);
});
