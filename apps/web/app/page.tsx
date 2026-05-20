import Link from "next/link";
import { Shield, FileCheck, Landmark, ClipboardCheck, ArrowRight, Zap, Cpu, KeyRound } from "lucide-react";

export default function Home() {
  return (
    <div style={{ minHeight: "100vh", position: "relative", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
      {/* Glow Spots */}
      <div className="glow-spot" />
      <div className="glow-spot-secondary" />

      {/* Header / Nav */}
      <header style={{ padding: "24px 40px", borderBottom: "1px solid var(--border-color)", display: "flex", justifyContent: "space-between", alignItems: "center", position: "relative", zIndex: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Shield size={28} color="var(--color-primary)" />
          <span style={{ fontFamily: "var(--font-title)", fontWeight: 800, fontSize: "1.25rem", letterSpacing: "-0.02em" }}>
            DocAuth
          </span>
        </div>
        <div style={{ display: "flex", gap: "20px" }}>
          <Link href="/institution" className="btn btn-secondary" style={{ padding: "8px 16px", fontSize: "0.85rem" }}>
            Institution Portal
          </Link>
          <a href="http://localhost:3001" className="btn btn-primary" style={{ padding: "8px 16px", fontSize: "0.85rem" }}>
            Verifier Portal
          </a>
        </div>
      </header>

      {/* Main Hero Section */}
      <main style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "80px 20px", position: "relative", zIndex: 1, maxWidth: "1200px", margin: "0 auto" }}>
        
        <div className="animate-slide-up" style={{ textAlign: "center", maxWidth: "800px", marginBottom: "64px" }}>
          {/* Badge */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(99, 102, 241, 0.1)", border: "1px solid rgba(99, 102, 241, 0.2)", borderRadius: "9999px", padding: "6px 14px", marginBottom: "24px", color: "var(--color-primary)", fontWeight: 600, fontSize: "0.85rem" }}>
            <Zap size={14} />
            Ethereum Sepolia Testnet Active
          </div>

          <h1 style={{ fontFamily: "var(--font-title)", fontWeight: 800, fontSize: "3.5rem", lineHeight: 1.1, letterSpacing: "-0.03em", marginBottom: "20px" }}>
            Immutable Document <br />
            <span style={{ background: "linear-gradient(135deg, var(--color-primary) 0%, #a855f7 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Authentication System
            </span>
          </h1>

          <p style={{ color: "var(--text-secondary)", fontSize: "1.15rem", lineHeight: 1.6, marginBottom: "40px", maxWidth: "600px", margin: "0 auto 40px" }}>
            A premium full-stack document registry powered by smart contracts, Tesseract OCR parsing, and SHA-256 cryptographic hashes.
          </p>

          <div style={{ display: "flex", gap: "16px", justifyContent: "center" }}>
            <Link href="/institution" className="btn btn-primary" style={{ padding: "14px 28px", fontSize: "1.05rem" }}>
              Access Institution Portal
              <ArrowRight size={18} />
            </Link>
            <a href="http://localhost:3001" className="btn btn-secondary" style={{ padding: "14px 28px", fontSize: "1.05rem" }}>
              Verify a Document
            </a>
          </div>
        </div>

        {/* Feature Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px", width: "100%" }}>
          
          <div className="glass-card" style={{ padding: "32px 24px" }}>
            <div style={{ width: "48px", height: "48px", borderRadius: "10px", background: "rgba(99, 102, 241, 0.1)", display: "flex", alignItems: "center", justifyBox: "center", justifyContent: "center", marginBottom: "20px", color: "var(--color-primary)" }}>
              <Landmark size={24} />
            </div>
            <h3 style={{ fontFamily: "var(--font-title)", fontWeight: 700, fontSize: "1.25rem", marginBottom: "10px" }}>
              Whitelisted Institutions
            </h3>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", lineHeight: 1.5 }}>
              Only verified and contract-whitelisted institution wallet addresses can register official credentials.
            </p>
          </div>

          <div className="glass-card" style={{ padding: "32px 24px" }}>
            <div style={{ width: "48px", height: "48px", borderRadius: "10px", background: "rgba(168, 85, 247, 0.1)", display: "flex", alignItems: "center", justifyBox: "center", justifyContent: "center", marginBottom: "20px", color: "#a855f7" }}>
              <Cpu size={24} />
            </div>
            <h3 style={{ fontFamily: "var(--font-title)", fontWeight: 700, fontSize: "1.25rem", marginBottom: "10px" }}>
              AI-Powered OCR Parsing
            </h3>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", lineHeight: 1.5 }}>
              Automatic metadata extraction using Tesseract engine to pull names, serials, and dates from images and PDFs.
            </p>
          </div>

          <div className="glass-card" style={{ padding: "32px 24px" }}>
            <div style={{ width: "48px", height: "48px", borderRadius: "10px", background: "rgba(16, 185, 129, 0.1)", display: "flex", alignItems: "center", justifyBox: "center", justifyContent: "center", marginBottom: "20px", color: "var(--color-success)" }}>
              <KeyRound size={24} />
            </div>
            <h3 style={{ fontFamily: "var(--font-title)", fontWeight: 700, fontSize: "1.25rem", marginBottom: "10px" }}>
              Cryptographic Off-chain Hashing
            </h3>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", lineHeight: 1.5 }}>
              Only the document hash is stored on-chain. Privacy is fully respected; files are never leaked to the ledger.
            </p>
          </div>

        </div>

      </main>

      {/* Footer */}
      <footer style={{ padding: "32px 40px", borderTop: "1px solid var(--border-color)", textAlign: "center", color: "var(--text-muted)", fontSize: "0.85rem", position: "relative", zIndex: 10 }}>
        © 2026 DocAuth Inc. Powered by Ethereum Sepolia Testnet. All rights reserved.
      </footer>
    </div>
  );
}
