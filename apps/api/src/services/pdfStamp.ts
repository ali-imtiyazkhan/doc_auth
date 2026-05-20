import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { readFile } from "fs/promises";
import QRCode from "qrcode";

/**
 * Generate a QR code as a PNG buffer.
 */
export async function generateQRCode(data: string, size: number = 200): Promise<Buffer> {
  const buffer = await QRCode.toBuffer(data, {
    width: size,
    margin: 1,
    color: {
      dark: "#1a1a2e",
      light: "#ffffff",
    },
  });
  return buffer;
}

/**
 * Stamp a PDF with a QR code and verification info overlay.
 * Adds a verification footer on the first page.
 */
export async function stampPDF(
  originalPdfPath: string,
  txHash: string,
  contractAddress: string,
  verifierBaseUrl: string = "http://localhost:3001"
): Promise<Buffer> {
  // Read original PDF
  const pdfBytes = await readFile(originalPdfPath);
  const pdfDoc = await PDFDocument.load(pdfBytes);

  // Generate QR code with verification URL
  const verificationUrl = `${verifierBaseUrl}/verify?tx=${txHash}`;
  const qrBuffer = await generateQRCode(verificationUrl, 120);
  const qrImage = await pdfDoc.embedPng(qrBuffer);

  // Get first page
  const page = pdfDoc.getPages()[0];
  if (!page) throw new Error("PDF has no pages");

  const { width, height } = page.getSize();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  // ─── Draw verification footer ───
  const footerHeight = 80;
  const footerY = 10;
  const padding = 15;

  // Semi-transparent background bar
  page.drawRectangle({
    x: padding,
    y: footerY,
    width: width - padding * 2,
    height: footerHeight,
    color: rgb(0.96, 0.96, 0.98),
    borderColor: rgb(0.31, 0.27, 0.9),
    borderWidth: 1.5,
    opacity: 0.95,
  });

  // QR code on the left
  const qrSize = 60;
  page.drawImage(qrImage, {
    x: padding + 10,
    y: footerY + 10,
    width: qrSize,
    height: qrSize,
  });

  // Text next to QR
  const textX = padding + qrSize + 20;

  page.drawText("✓ Blockchain Verified Document", {
    x: textX,
    y: footerY + footerHeight - 22,
    size: 10,
    font: boldFont,
    color: rgb(0.1, 0.6, 0.3),
  });

  page.drawText(`TX: ${txHash.slice(0, 20)}...${txHash.slice(-8)}`, {
    x: textX,
    y: footerY + footerHeight - 38,
    size: 7,
    font: font,
    color: rgb(0.3, 0.3, 0.3),
  });

  page.drawText(`Scan QR or visit: ${verificationUrl}`, {
    x: textX,
    y: footerY + footerHeight - 52,
    size: 7,
    font: font,
    color: rgb(0.3, 0.3, 0.4),
  });

  page.drawText("Powered by DocAuth • Ethereum Sepolia", {
    x: textX,
    y: footerY + footerHeight - 66,
    size: 6,
    font: font,
    color: rgb(0.5, 0.5, 0.6),
  });

  // Save
  const stampedBytes = await pdfDoc.save();
  return Buffer.from(stampedBytes);
}
