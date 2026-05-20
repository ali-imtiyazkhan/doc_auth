import type { Metadata, Viewport } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  title: "DocAuth Security Certification Prep Portal",
  description: "A premium full-stack training system designed to prepare you for enterprise security certifications with 3D flashcards, micro-quizzes, timed exams, and robust analytics.",
  keywords: ["Security Certification", "CISSP", "Security+", "IAM", "Network Security", "Risk Management", "Practice Exams"],
  authors: [{ name: "Antigravity DevTeam" }],
};

export const viewport: Viewport = {
  themeColor: "#4f46e5",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>{children}</body>
    </html>
  );
}
