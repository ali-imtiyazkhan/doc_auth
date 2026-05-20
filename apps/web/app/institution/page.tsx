"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FileText, PlusCircle, CheckCircle, AlertTriangle, HelpCircle, RefreshCw } from "lucide-react";
import { getBrowserProvider, revokeDocumentOnChain } from "../../lib/wallet";

interface IssuedDocument {
  fileHash: string;
  metadata: {
    name?: string;
    rollNo?: string;
    dateOfIssue?: string;
    docType?: string;
    institution?: string;
  };
  issuedAt: string;
  revoked: boolean;
}

export default function InstitutionDashboard() {
  const [docs, setDocs] = useState<IssuedDocument[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [revokingHash, setRevokingHash] = useState<string | null>(null);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  const fetchDocuments = async (address: string) => {
    try {
      setLoading(true);
      const res = await fetch(`http://localhost:5000/api/v1/blockchain/issuer/${address}/documents`);
      if (res.ok) {
        const data = await res.json();
        setDocs(data.documents || []);
      }
    } catch (err) {
      console.error("Failed to fetch documents:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      const provider = getBrowserProvider();
      if (provider) {
        const accounts = await (window as any).ethereum.request({ method: "eth_accounts" });
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
          await fetchDocuments(accounts[0]);
        }
      }
    };
    init();
  }, []);

  const handleRevoke = async (fileHash: string) => {
    if (!confirm("Are you sure you want to revoke this document? This action is irreversible on the blockchain.")) {
      return;
    }

    try {
      setRevokingHash(fileHash);
      await revokeDocumentOnChain(fileHash);
      alert("Document successfully revoked!");
      if (walletAddress) {
        await fetchDocuments(walletAddress);
      }
    } catch (err: any) {
      alert(err.message || "Revocation failed");
    } finally {
      setRevokingHash(null);
    }
  };

  const activeCount = docs.filter((d) => !d.revoked).length;
  const revokedCount = docs.filter((d) => d.revoked).length;

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
        <div>
          <h1 style={{ fontFamily: "var(--font-title)", fontWeight: 700, fontSize: "2rem", marginBottom: "6px" }}>Dashboard</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>
            Overview of certificates and credentials issued by your institution.
          </p>
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          <button
            className="btn btn-secondary"
            onClick={() => walletAddress && fetchDocuments(walletAddress)}
            disabled={loading}
            style={{ padding: "10px" }}
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          </button>
          <Link href="/institution/issue" className="btn btn-primary">
            <PlusCircle size={18} />
            Issue Certificate
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: "rgba(99, 102, 241, 0.15)", color: "var(--color-primary)" }}>
            <FileText size={24} />
          </div>
          <div>
            <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", textTransform: "uppercase" }}>Total Issued</div>
            <div style={{ fontSize: "1.75rem", fontWeight: 700, fontFamily: "var(--font-title)" }}>{docs.length}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: "rgba(16, 185, 129, 0.15)", color: "var(--color-success)" }}>
            <CheckCircle size={24} />
          </div>
          <div>
            <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", textTransform: "uppercase" }}>Active</div>
            <div style={{ fontSize: "1.75rem", fontWeight: 700, fontFamily: "var(--font-title)" }}>{activeCount}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: "rgba(239, 68, 68, 0.15)", color: "var(--color-error)" }}>
            <AlertTriangle size={24} />
          </div>
          <div>
            <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", textTransform: "uppercase" }}>Revoked</div>
            <div style={{ fontSize: "1.75rem", fontWeight: 700, fontFamily: "var(--font-title)" }}>{revokedCount}</div>
          </div>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="glass-card" style={{ padding: "0", overflow: "hidden" }}>
        <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--border-color)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 style={{ fontFamily: "var(--font-title)", fontWeight: 600 }}>Recent Issuances</h3>
          <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Showing {docs.length} entries</span>
        </div>

        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "60px", flexDirection: "column", gap: "12px" }}>
            <div className="spinner"></div>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>Loading documents from blockchain...</p>
          </div>
        ) : docs.length === 0 ? (
          <div style={{ padding: "60px 24px", textAlign: "center" }}>
            <FileText size={48} style={{ color: "var(--text-muted)", marginBottom: "16px", margin: "0 auto 16px" }} />
            <h4 style={{ fontFamily: "var(--font-title)", fontSize: "1.1rem", marginBottom: "6px" }}>No documents issued yet</h4>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginBottom: "20px" }}>
              Get started by uploading and registering your first certificate.
            </p>
            <Link href="/institution/issue" className="btn btn-primary">
              Issue Certificate
            </Link>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
              <thead>
                <tr style={{ background: "rgba(255,255,255,0.02)", borderBottom: "1px solid var(--border-color)" }}>
                  <th style={{ padding: "14px 24px", color: "var(--text-secondary)", fontSize: "0.8rem", fontWeight: 600, textTransform: "uppercase" }}>Recipient / Info</th>
                  <th style={{ padding: "14px 24px", color: "var(--text-secondary)", fontSize: "0.8rem", fontWeight: 600, textTransform: "uppercase" }}>Doc Type</th>
                  <th style={{ padding: "14px 24px", color: "var(--text-secondary)", fontSize: "0.8rem", fontWeight: 600, textTransform: "uppercase" }}>File Hash</th>
                  <th style={{ padding: "14px 24px", color: "var(--text-secondary)", fontSize: "0.8rem", fontWeight: 600, textTransform: "uppercase" }}>Issued At</th>
                  <th style={{ padding: "14px 24px", color: "var(--text-secondary)", fontSize: "0.8rem", fontWeight: 600, textTransform: "uppercase" }}>Status</th>
                  <th style={{ padding: "14px 24px", color: "var(--text-secondary)", fontSize: "0.8rem", fontWeight: 600, textTransform: "uppercase" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {docs.map((doc, idx) => (
                  <tr
                    key={doc.fileHash}
                    style={{
                      borderBottom: idx === docs.length - 1 ? "none" : "1px solid var(--border-color)",
                      background: idx % 2 === 0 ? "transparent" : "rgba(255,255,255,0.01)",
                      transition: "background 0.2s",
                    }}
                  >
                    {/* Recipient / Info */}
                    <td style={{ padding: "16px 24px" }}>
                      <div style={{ fontWeight: 600, fontSize: "0.95rem" }}>{doc.metadata.name || "N/A"}</div>
                      <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                        Roll No: {doc.metadata.rollNo || "N/A"}
                      </div>
                    </td>

                    {/* Doc Type */}
                    <td style={{ padding: "16px 24px" }}>
                      <span
                        style={{
                          fontSize: "0.85rem",
                          background: "rgba(255,255,255,0.05)",
                          padding: "2px 8px",
                          borderRadius: "4px",
                          border: "1px solid var(--border-color)",
                        }}
                      >
                        {doc.metadata.docType || "Certificate"}
                      </span>
                    </td>

                    {/* File Hash */}
                    <td style={{ padding: "16px 24px", fontFamily: "monospace", fontSize: "0.8rem", color: "var(--text-muted)" }}>
                      {doc.fileHash.slice(0, 10)}...{doc.fileHash.slice(-8)}
                    </td>

                    {/* Issued At */}
                    <td style={{ padding: "16px 24px", fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                      {new Date(doc.issuedAt).toLocaleDateString()}
                    </td>

                    {/* Status */}
                    <td style={{ padding: "16px 24px" }}>
                      {doc.revoked ? (
                        <span className="badge badge-error">Revoked</span>
                      ) : (
                        <span className="badge badge-success">Active</span>
                      )}
                    </td>

                    {/* Action */}
                    <td style={{ padding: "16px 24px" }}>
                      {!doc.revoked && (
                        <button
                          className="btn btn-danger"
                          style={{ padding: "6px 12px", fontSize: "0.75rem" }}
                          onClick={() => handleRevoke(doc.fileHash)}
                          disabled={revokingHash === doc.fileHash}
                        >
                          {revokingHash === doc.fileHash ? "Revoking..." : "Revoke"}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
