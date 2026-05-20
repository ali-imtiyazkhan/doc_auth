"use client";

import React, { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useDropzone } from "react-dropzone";
import { Shield, FileSearch, UploadCloud, Search, CheckCircle2, AlertOctagon, HelpCircle, FileText } from "lucide-react";

interface VerificationResult {
  status: "authentic" | "revoked" | "not_found";
  fileHash?: string;
  metadata?: {
    name?: string;
    rollNo?: string;
    dateOfIssue?: string;
    docType?: string;
    institution?: string;
  };
  issuer?: string;
  issuedAt?: string;
  message?: string;
}

function VerifierContent() {
  const searchParams = useSearchParams();
  const [tab, setTab] = useState<"file" | "hash">("file");
  const [inputHash, setInputHash] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<VerificationResult | null>(null);

  const verifyHash = async (hash: string) => {
    try {
      setLoading(true);
      setResult(null);

      // Call Express blockchain verification endpoint
      const res = await fetch(`http://localhost:5000/api/v1/blockchain/verify/${hash}`);
      if (!res.ok) {
        throw new Error("Failed to fetch blockchain data");
      }

      const data = await res.json();
      setResult(data);
    } catch (err: any) {
      setResult({
        status: "not_found",
        message: err.message || "Verification failed.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Run automatically if TX/hash query parameter exists
  useEffect(() => {
    const tx = searchParams.get("tx") || searchParams.get("hash");
    if (tx) {
      setInputHash(tx);
      setTab("hash");
      verifyHash(tx);
    }
  }, [searchParams]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]!);
      setResult(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "image/*": [".png", ".jpg", ".jpeg"],
    },
    multiple: false,
  });

  const handleFileVerification = async () => {
    if (!file) return;

    try {
      setLoading(true);
      setResult(null);

      const formData = new FormData();
      formData.append("document", file);

      // Upload to API to generate local SHA-256 hash
      const uploadRes = await fetch("http://localhost:5000/api/v1/documents/upload", {
        method: "POST",
        body: formData,
      });

      if (!uploadRes.ok) {
        throw new Error("File processing failed.");
      }

      const uploadData = await uploadRes.json();
      const generatedHash = uploadData.fileHash;

      // Verify the generated hash on blockchain
      await verifyHash(generatedHash);
    } catch (err: any) {
      setResult({
        status: "not_found",
        message: err.message || "File parsing failed.",
      });
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", position: "relative", padding: "40px 20px" }}>
      {/* Decorative Blur Backgrounds */}
      <div className="glow-spot" />
      <div className="glow-spot-secondary" />

      {/* Main Container */}
      <div style={{ maxWidth: "600px", margin: "0 auto", position: "relative", zIndex: 1 }}>
        
        {/* Brand Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", marginBottom: "40px" }}>
          <Shield size={36} color="var(--color-primary)" />
          <h1 style={{ fontFamily: "var(--font-title)", fontWeight: 800, fontSize: "1.75rem", tracking: "-0.03em" }}>
            DocAuth <span style={{ color: "var(--color-primary)", fontWeight: 500 }}>Verifier</span>
          </h1>
        </div>

        {/* Tab Selection */}
        <div style={{ display: "flex", gap: "10px", marginBottom: "24px" }}>
          <button
            className="btn"
            style={{
              flex: 1,
              background: tab === "file" ? "rgba(99, 102, 241, 0.15)" : "rgba(255,255,255,0.01)",
              borderColor: tab === "file" ? "var(--color-primary)" : "var(--border-color)",
              color: tab === "file" ? "var(--text-primary)" : "var(--text-secondary)",
            }}
            onClick={() => {
              setTab("file");
              setResult(null);
            }}
          >
            <UploadCloud size={16} />
            Verify Document File
          </button>
          <button
            className="btn"
            style={{
              flex: 1,
              background: tab === "hash" ? "rgba(99, 102, 241, 0.15)" : "rgba(255,255,255,0.01)",
              borderColor: tab === "hash" ? "var(--color-primary)" : "var(--border-color)",
              color: tab === "hash" ? "var(--text-primary)" : "var(--text-secondary)",
            }}
            onClick={() => {
              setTab("hash");
              setResult(null);
            }}
          >
            <Search size={16} />
            Verify by Hash / TX
          </button>
        </div>

        {/* Input Forms */}
        <div className="glass-card animate-slide-up" style={{ marginBottom: "32px" }}>
          {tab === "file" ? (
            <div>
              <div {...getRootProps()} className={`dropzone ${isDragActive ? "dropzone-active" : ""}`}>
                <input {...getInputProps()} />
                <FileSearch size={40} style={{ color: "var(--color-primary)", marginBottom: "12px" }} />
                <h4 style={{ fontFamily: "var(--font-title)", marginBottom: "6px" }}>
                  {isDragActive ? "Drop document here" : "Upload document to verify"}
                </h4>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.8rem" }}>
                  Drag & drop your certificate PDF or image here
                </p>
              </div>

              {file && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    marginTop: "16px",
                    padding: "10px",
                    background: "rgba(255,255,255,0.02)",
                    borderRadius: "8px",
                    border: "1px solid var(--border-color)",
                  }}
                >
                  <FileText size={20} color="var(--color-primary)" />
                  <span style={{ fontSize: "0.85rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {file.name}
                  </span>
                </div>
              )}

              <button
                className="btn btn-primary"
                style={{ width: "100%", marginTop: "20px" }}
                onClick={handleFileVerification}
                disabled={!file || loading}
              >
                {loading ? "Verifying..." : "Verify Authenticity"}
              </button>
            </div>
          ) : (
            <div>
              <label className="label">Document Hash / Transaction ID</label>
              <div style={{ display: "flex", gap: "10px" }}>
                <input
                  type="text"
                  value={inputHash}
                  onChange={(e) => setInputHash(e.target.value)}
                  className="input-text"
                  placeholder="Enter 0x... hex hash or Sepolia TX ID"
                />
                <button
                  className="btn btn-primary"
                  onClick={() => verifyHash(inputHash)}
                  disabled={!inputHash || loading}
                >
                  {loading ? "Checking..." : "Verify"}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Verification Loader */}
        {loading && (
          <div className="glass-card animate-fade-in" style={{ textAlign: "center", padding: "40px" }}>
            <div className="spinner" style={{ margin: "0 auto 16px" }}></div>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>Querying Ethereum ledger...</p>
          </div>
        )}

        {/* Verification Results */}
        {result && !loading && (
          <div className="animate-slide-up">
            
            {/* Authentic State */}
            {result.status === "authentic" && (
              <div className="glass-card" style={{ border: "1px solid var(--color-success)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
                  <CheckCircle2 size={32} color="var(--color-success)" />
                  <div>
                    <h3 style={{ fontFamily: "var(--font-title)", fontWeight: 700, color: "var(--color-success)" }}>
                      Document Verified
                    </h3>
                    <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                      Status: Authentic & Registered
                    </p>
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <div style={{ borderBottom: "1px solid var(--border-color)", paddingBottom: "8px" }}>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>RECIPIENT NAME</div>
                    <div style={{ fontWeight: 600 }}>{result.metadata?.name || "N/A"}</div>
                  </div>
                  <div style={{ borderBottom: "1px solid var(--border-color)", paddingBottom: "8px" }}>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>REGISTRATION NUMBER</div>
                    <div style={{ fontWeight: 600 }}>{result.metadata?.rollNo || "N/A"}</div>
                  </div>
                  <div style={{ borderBottom: "1px solid var(--border-color)", paddingBottom: "8px" }}>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>ISSUING INSTITUTION</div>
                    <div style={{ fontWeight: 600 }}>{result.metadata?.institution || "N/A"}</div>
                  </div>
                  <div style={{ borderBottom: "1px solid var(--border-color)", paddingBottom: "8px" }}>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>ISSUED ON</div>
                    <div>{result.metadata?.dateOfIssue || "N/A"}</div>
                  </div>
                  <div style={{ borderBottom: "1px solid var(--border-color)", paddingBottom: "8px" }}>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>ISSUER WALLET</div>
                    <div style={{ fontFamily: "monospace", fontSize: "0.8rem" }}>{result.issuer}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>FILE SHA-256 HASH</div>
                    <div style={{ fontFamily: "monospace", fontSize: "0.8rem", wordBreak: "break-all" }}>{result.fileHash}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Revoked State */}
            {result.status === "revoked" && (
              <div className="glass-card" style={{ border: "1px solid var(--color-warning)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
                  <AlertOctagon size={32} color="var(--color-warning)" />
                  <div>
                    <h3 style={{ fontFamily: "var(--font-title)", fontWeight: 700, color: "var(--color-warning)" }}>
                      Document Revoked
                    </h3>
                    <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                      This credential has been marked invalid by the issuer.
                    </p>
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <div style={{ borderBottom: "1px solid var(--border-color)", paddingBottom: "8px" }}>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>RECIPIENT NAME</div>
                    <div style={{ fontWeight: 600 }}>{result.metadata?.name || "N/A"}</div>
                  </div>
                  <div style={{ borderBottom: "1px solid var(--border-color)", paddingBottom: "8px" }}>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>ISSUING INSTITUTION</div>
                    <div style={{ fontWeight: 600 }}>{result.metadata?.institution || "N/A"}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>FILE SHA-256 HASH</div>
                    <div style={{ fontFamily: "monospace", fontSize: "0.8rem", wordBreak: "break-all" }}>{result.fileHash}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Not Found State */}
            {result.status === "not_found" && (
              <div className="glass-card" style={{ border: "1px solid var(--color-error)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                  <AlertOctagon size={32} color="var(--color-error)" />
                  <h3 style={{ fontFamily: "var(--font-title)", fontWeight: 700, color: "var(--color-error)" }}>
                    Verification Failed
                  </h3>
                </div>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", lineHeight: 1.6 }}>
                  No registry match found for this hash on the blockchain. The document may have been altered, tampered with, or was never officially registered.
                </p>
              </div>
            )}

          </div>
        )}
      </div>
    </div>
  );
}

export default function PublicVerifier() {
  return (
    <Suspense fallback={
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh" }}>
        <div className="spinner" />
      </div>
    }>
      <VerifierContent />
    </Suspense>
  );
}
