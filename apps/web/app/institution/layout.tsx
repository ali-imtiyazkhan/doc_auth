"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Shield, FilePlus, LayoutDashboard, Wallet, LogOut } from "lucide-react";
import { connectWallet, checkIfAuthorizedIssuer } from "../../lib/wallet";

export default function InstitutionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // Check if wallet is already connected
    const checkConnection = async () => {
      try {
        if (typeof window !== "undefined" && (window as any).ethereum) {
          const accounts = await (window as any).ethereum.request({ method: "eth_accounts" });
          if (accounts.length > 0) {
            const address = accounts[0];
            setWalletAddress(address);
            const auth = await checkIfAuthorizedIssuer(address);
            setIsAuthorized(auth);
          }
        }
      } catch (err) {
        console.error("Failed to check wallet connection:", err);
      } finally {
        setLoading(false);
      }
    };

    checkConnection();

    // Listen for account changes
    if (typeof window !== "undefined" && (window as any).ethereum) {
      const handleAccountsChanged = async (accounts: string[]) => {
        if (accounts.length > 0) {
          const address = accounts[0];
          setWalletAddress(address);
          setLoading(true);
          const auth = await checkIfAuthorizedIssuer(address);
          setIsAuthorized(auth);
          setLoading(false);
        } else {
          setWalletAddress(null);
          setIsAuthorized(false);
        }
      };

      (window as any).ethereum.on("accountsChanged", handleAccountsChanged);
      return () => {
        (window as any).ethereum.removeListener("accountsChanged", handleAccountsChanged);
      };
    }
  }, []);

  const handleConnect = async () => {
    try {
      setLoading(true);
      const connection = await connectWallet();
      if (connection) {
        setWalletAddress(connection.address);
        const auth = await checkIfAuthorizedIssuer(connection.address);
        setIsAuthorized(auth);
      }
    } catch (err: any) {
      alert(err.message || "Failed to connect wallet");
    } finally {
      setLoading(false);
    }
  };

  const isActive = (path: string) => pathname === path;

  return (
    <div className="dashboard-grid">
      {/* Sidebar */}
      <aside className="dashboard-sidebar">
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "40px" }}>
          <Shield size={28} color="var(--color-primary)" />
          <span style={{ fontFamily: "var(--font-title)", fontWeight: 700, fontSize: "1.25rem", letterSpacing: "-0.02em" }}>
            DocAuth <span style={{ color: "var(--color-primary)", fontSize: "0.8rem" }}>Portal</span>
          </span>
        </div>

        <nav style={{ display: "flex", flexDirection: "column", gap: "8px", flex: 1 }}>
          <Link
            href="/institution"
            className="btn"
            style={{
              justifyContent: "flex-start",
              background: isActive("/institution") ? "rgba(99, 102, 241, 0.1)" : "transparent",
              color: isActive("/institution") ? "var(--text-primary)" : "var(--text-secondary)",
              borderColor: isActive("/institution") ? "rgba(99, 102, 241, 0.2)" : "transparent",
            }}
          >
            <LayoutDashboard size={18} />
            Dashboard
          </Link>

          <Link
            href="/institution/issue"
            className="btn"
            style={{
              justifyContent: "flex-start",
              background: isActive("/institution/issue") ? "rgba(99, 102, 241, 0.1)" : "transparent",
              color: isActive("/institution/issue") ? "var(--text-primary)" : "var(--text-secondary)",
              borderColor: isActive("/institution/issue") ? "rgba(99, 102, 241, 0.2)" : "transparent",
            }}
          >
            <FilePlus size={18} />
            Issue Document
          </Link>
        </nav>

        <div style={{ paddingTop: "20px", borderTop: "1px solid var(--border-color)" }}>
          {walletAddress ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                <Wallet size={14} />
                <span>
                  {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                </span>
              </div>
              {isAuthorized ? (
                <span className="badge badge-success" style={{ width: "fit-content", fontSize: "0.65rem" }}>
                  Authorized
                </span>
              ) : (
                <span className="badge badge-error" style={{ width: "fit-content", fontSize: "0.65rem" }}>
                  Not Authorized
                </span>
              )}
            </div>
          ) : (
            <button className="btn btn-primary" style={{ width: "100%" }} onClick={handleConnect} disabled={loading}>
              Connect Wallet
            </button>
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="dashboard-content animate-fade-in">
        {loading ? (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60vh", flexDirection: "column", gap: "16px" }}>
            <div className="spinner"></div>
            <p style={{ color: "var(--text-secondary)", fontFamily: "var(--font-title)", fontSize: "0.9rem" }}>Loading wallet state...</p>
          </div>
        ) : !walletAddress ? (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60vh", flexDirection: "column", textAlign: "center", maxWidth: "480px", margin: "0 auto" }}>
            <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "rgba(99, 102, 241, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "24px" }}>
              <Shield size={32} color="var(--color-primary)" />
            </div>
            <h2 style={{ fontFamily: "var(--font-title)", fontWeight: 700, fontSize: "1.75rem", marginBottom: "12px" }}>Institution Access Required</h2>
            <p style={{ color: "var(--text-secondary)", marginBottom: "24px", lineHeight: 1.6 }}>
              Please connect your institution's Web3 wallet to manage and issue verified academic credentials.
            </p>
            <button className="btn btn-primary" onClick={handleConnect}>
              Connect MetaMask Wallet
            </button>
          </div>
        ) : !isAuthorized ? (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60vh", flexDirection: "column", textAlign: "center", maxWidth: "480px", margin: "0 auto" }}>
            <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "rgba(239, 68, 68, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "24px" }}>
              <Shield size={32} color="var(--color-error)" />
            </div>
            <h2 style={{ fontFamily: "var(--font-title)", fontWeight: 700, fontSize: "1.75rem", marginBottom: "12px" }}>Unauthorized Wallet</h2>
            <p style={{ color: "var(--text-secondary)", marginBottom: "24px", lineHeight: 1.6 }}>
              Your connected wallet (<strong>{walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}</strong>) is not registered as an authorized issuer in the DocAuth smart contract.
            </p>
            <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginBottom: "24px" }}>
              Please switch to an authorized institution account in MetaMask or contact the contract administrator.
            </p>
          </div>
        ) : (
          children
        )}
      </main>
    </div>
  );
}
