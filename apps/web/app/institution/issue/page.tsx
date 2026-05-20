"use client";

import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud, File, FileText, CheckCircle, Wallet, ArrowRight, Download, RefreshCw } from "lucide-react";
import { issueDocumentOnChain } from "../../../lib/wallet";
import { QRCodeSVG } from "qrcode.react";

export default function IssueDocument() {
  // Wizard steps: 'upload' | 'ocr' | 'confirm' | 'signing' | 'success'
  const [step, setStep] = useState<"upload" | "ocr" | "confirm" | "signing" | "success">("upload");
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  // Extracted/parsed metadata fields
  const [name, setName] = useState<string>("");
  const [rollNo, setRollNo] = useState<string>("");
  const [dateOfIssue, setDateOfIssue] = useState<string>("");
  const [docType, setDocType] = useState<string>("Degree Certificate");
  const [institution, setInstitution] = useState<string>("");
  const [fileHash, setFileHash] = useState<string>("");
  const [serverFilePath, setServerFilePath] = useState<string>("");

  // Result state
  const [txHash, setTxHash] = useState<string>("");
  const [stamping, setStamping] = useState<boolean>(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]!);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "image/*": [".png", ".jpg", ".jpeg", ".tiff"],
    },
    multiple: false,
  });

  const handleUploadAndOCR = async () => {
    if (!file) return;

    try {
      setIsUploading(true);
      setStep("ocr");

      const formData = new FormData();
      formData.append("document", file);

      const res = await fetch("http://localhost:5000/api/v1/documents/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("OCR Server returned an error.");
      }

      const data = await res.json();
      setFileHash(data.fileHash);
      setServerFilePath(data.filePath);

      // Populate extracted fields with fallbacks
      setName(data.extractedMetadata.name || "");
      setRollNo(data.extractedMetadata.rollNo || "");
      setDateOfIssue(data.extractedMetadata.dateOfIssue || "");
      setDocType(data.extractedMetadata.docType || "Degree Certificate");
      setInstitution(data.extractedMetadata.institution || "");

      setStep("confirm");
    } catch (err: any) {
      alert(`OCR Pipeline failed: ${err.message}`);
      setStep("upload");
    } finally {
      setIsUploading(false);
    }
  };

  const handleRegisterOnChain = async () => {
    try {
      setStep("signing");

      const metadataObj = {
        name,
        rollNo,
        dateOfIssue,
        docType,
        institution,
      };

      const metadataStr = JSON.stringify(metadataObj);

      // Trigger MetaMask transaction
      const hash = await issueDocumentOnChain(fileHash, metadataStr);
      setTxHash(hash);

      // Register in local Postgres database
      try {
        const accounts = await (window as any).ethereum.request({ method: "eth_accounts" });
        const issuerAddress = accounts[0] || "";

        await fetch("http://localhost:5000/api/v1/blockchain/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fileHash,
            txHash: hash,
            name,
            rollNo,
            dateOfIssue,
            docType,
            institution,
            issuerAddress,
            filePath: serverFilePath,
          }),
        });
      } catch (regErr) {
        console.error("Failed to register document in DB:", regErr);
      }

      setStep("success");
    } catch (err: any) {
      alert(`Blockchain registration failed: ${err.message}`);
      setStep("confirm");
    }
  };

  const handleDownloadStampedPDF = async () => {
    try {
      setStamping(true);
      const res = await fetch("http://localhost:5000/api/v1/blockchain/stamp-pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          filePath: serverFilePath,
          txHash,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to stamp PDF");
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `stamped-${file?.name || "document.pdf"}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      alert(`PDF Stamping failed: ${err.message}`);
    } finally {
      setStamping(false);
    }
  };

  // Re-verify URL link
  const verificationUrl = `http://localhost:3001/verify?tx=${txHash}`;

  return (
    <div style={{ maxWidth: "680px", margin: "0 auto" }}>
      {/* Page Header */}
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontFamily: "var(--font-title)", fontWeight: 700, fontSize: "2rem", marginBottom: "6px" }}>Issue Certificate</h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>
          Securely upload a certificate, extract metadata, and seal it on the blockchain.
        </p>
      </div>

      {/* Progress Wizard */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "32px", justifyContent: "space-between" }}>
        {["1. Upload", "2. OCR", "3. Confirm", "4. Issue"].map((label, index) => {
          const activeIndex =
            step === "upload"
              ? 0
              : step === "ocr"
                ? 1
                : step === "confirm"
                  ? 2
                  : 3;
          const isDone = index < activeIndex || step === "success";
          const isActive = index === activeIndex;

          return (
            <div
              key={label}
              style={{
                flex: 1,
                padding: "8px",
                borderBottom: `3px solid ${isDone ? "var(--color-success)" : isActive ? "var(--color-primary)" : "var(--border-color)"}`,
                color: isDone ? "var(--color-success)" : isActive ? "var(--text-primary)" : "var(--text-muted)",
                fontFamily: "var(--font-title)",
                fontSize: "0.85rem",
                fontWeight: 600,
                transition: "all 0.3s",
              }}
            >
              {label}
            </div>
          );
        })}
      </div>

      {/* Wizard Steps */}

      {/* Step 1: Upload */}
      {step === "upload" && (
        <div className="glass-card animate-slide-up">
          <div {...getRootProps()} className={`dropzone ${isDragActive ? "dropzone-active" : ""}`}>
            <input {...getInputProps()} />
            <UploadCloud size={48} style={{ color: "var(--color-primary)", marginBottom: "16px" }} />
            <h3 style={{ fontFamily: "var(--font-title)", marginBottom: "8px" }}>
              {isDragActive ? "Drop the file here..." : "Drag & drop file here"}
            </h3>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", marginBottom: "20px" }}>
              Supports PDF, PNG, JPG, JPEG (Max 10MB)
            </p>
            <button className="btn btn-secondary">Browse Files</button>
          </div>

          {file && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                marginTop: "20px",
                padding: "12px",
                background: "rgba(255,255,255,0.02)",
                borderRadius: "8px",
                border: "1px solid var(--border-color)",
              }}
            >
              <File size={24} style={{ color: "var(--color-primary)" }} />
              <div style={{ flex: 1, overflow: "hidden" }}>
                <div style={{ fontWeight: 600, fontSize: "0.9rem", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>
                  {file.name}
                </div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </div>
              </div>
            </div>
          )}

          <div style={{ marginTop: "24px", display: "flex", justifyContent: "flex-end" }}>
            <button className="btn btn-primary" onClick={handleUploadAndOCR} disabled={!file}>
              Upload & Run OCR
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Step 2: OCR Loading */}
      {step === "ocr" && (
        <div className="glass-card animate-slide-up" style={{ textAlign: "center", padding: "48px 24px" }}>
          <div className="spinner" style={{ margin: "0 auto 24px", width: "36px", height: "36px" }}></div>
          <h3 style={{ fontFamily: "var(--font-title)", marginBottom: "8px" }}>Extracting Metadata</h3>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", maxWidth: "320px", margin: "0 auto", lineHeight: 1.6 }}>
            Processing document via Tesseract OCR engine. This parses names, serials, and dates. Please wait...
          </p>
        </div>
      )}

      {/* Step 3: Confirm & Edit */}
      {step === "confirm" && (
        <div className="glass-card animate-slide-up">
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px", paddingBottom: "16px", borderBottom: "1px solid var(--border-color)" }}>
            <FileText size={20} color="var(--color-primary)" />
            <h3 style={{ fontFamily: "var(--font-title)", fontWeight: 600 }}>Confirm Extracted Data</h3>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <label className="label">Document Type</label>
              <select
                value={docType}
                onChange={(e) => setDocType(e.target.value)}
                className="input-text"
                style={{ background: "rgba(255,255,255,0.03)" }}
              >
                <option value="Degree Certificate">Degree Certificate</option>
                <option value="Marksheet">Marksheet</option>
                <option value="Diploma">Diploma</option>
                <option value="ID Card">ID Card</option>
                <option value="Certificate">Certificate</option>
              </select>
            </div>

            <div>
              <label className="label">Recipient Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-text"
                placeholder="e.g. John Doe"
              />
            </div>

            <div>
              <label className="label">Roll / Registration Number</label>
              <input
                type="text"
                value={rollNo}
                onChange={(e) => setRollNo(e.target.value)}
                className="input-text"
                placeholder="e.g. CS2024001"
              />
            </div>

            <div>
              <label className="label">Date of Issue</label>
              <input
                type="text"
                value={dateOfIssue}
                onChange={(e) => setDateOfIssue(e.target.value)}
                className="input-text"
                placeholder="e.g. DD/MM/YYYY or YYYY-MM-DD"
              />
            </div>

            <div>
              <label className="label">Issuing Institution</label>
              <input
                type="text"
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
                className="input-text"
                placeholder="e.g. Stanford University"
              />
            </div>

            <div style={{ padding: "12px", background: "rgba(255,255,255,0.02)", borderRadius: "8px", border: "1px solid var(--border-color)", marginTop: "8px" }}>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 600, marginBottom: "4px" }}>
                Computed File Hash (SHA-256)
              </div>
              <div style={{ fontFamily: "monospace", fontSize: "0.8rem", color: "var(--text-primary)", wordBreak: "break-all" }}>
                {fileHash}
              </div>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "32px" }}>
            <button className="btn btn-secondary" onClick={() => setStep("upload")}>
              Back
            </button>
            <button className="btn btn-primary" onClick={handleRegisterOnChain}>
              Register On Blockchain
              <Wallet size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Signing Transaction */}
      {step === "signing" && (
        <div className="glass-card animate-slide-up" style={{ textAlign: "center", padding: "48px 24px" }}>
          <div className="spinner" style={{ margin: "0 auto 24px", width: "36px", height: "36px" }}></div>
          <h3 style={{ fontFamily: "var(--font-title)", marginBottom: "8px" }}>MetaMask Signature Required</h3>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", maxWidth: "340px", margin: "0 auto", lineHeight: 1.6 }}>
            Please confirm the transaction in your MetaMask wallet. This writes the document hash permanently to the blockchain.
          </p>
        </div>
      )}

      {/* Step 5: Success & Download Stamp */}
      {step === "success" && (
        <div className="glass-card animate-slide-up" style={{ textAlign: "center" }}>
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "50%",
              background: "rgba(16, 185, 129, 0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 20px",
            }}
          >
            <CheckCircle size={32} color="var(--color-success)" />
          </div>

          <h2 style={{ fontFamily: "var(--font-title)", fontWeight: 700, fontSize: "1.75rem", marginBottom: "8px" }}>
            Certificate Issued!
          </h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginBottom: "24px" }}>
            Hash is stored on the Ethereum blockchain. Stamped verification PDF ready.
          </p>

          {/* QR and TX details */}
          <div
            style={{
              background: "rgba(255,255,255,0.01)",
              border: "1px solid var(--border-color)",
              borderRadius: "12px",
              padding: "24px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "16px",
              marginBottom: "24px",
            }}
          >
            <div style={{ background: "#ffffff", padding: "12px", borderRadius: "8px" }}>
              <QRCodeSVG value={verificationUrl} size={130} />
            </div>

            <div style={{ width: "100%", textAlign: "left" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", borderBottom: "1px solid var(--border-color)", paddingBottom: "8px", marginBottom: "8px" }}>
                <span style={{ color: "var(--text-muted)" }}>Transaction Hash</span>
                <span style={{ fontFamily: "monospace", color: "var(--text-primary)" }}>
                  {txHash.slice(0, 14)}...{txHash.slice(-8)}
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", borderBottom: "1px solid var(--border-color)", paddingBottom: "8px", marginBottom: "8px" }}>
                <span style={{ color: "var(--text-muted)" }}>Recipient</span>
                <span style={{ fontWeight: 600 }}>{name}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem" }}>
                <span style={{ color: "var(--text-muted)" }}>Registration</span>
                <span style={{ fontWeight: 600 }}>{rollNo}</span>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: "12px" }}>
            <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setStep("upload")}>
              Issue Another
            </button>
            <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleDownloadStampedPDF} disabled={stamping}>
              {stamping ? (
                <>
                  <RefreshCw className="animate-spin" size={16} />
                  Stamping PDF...
                </>
              ) : (
                <>
                  <Download size={16} />
                  Download Stamp
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
