import Tesseract from "tesseract.js";

/**
 * Metadata extracted from a document via OCR + regex parsing.
 */
export interface ParsedMetadata {
  name: string | null;
  rollNo: string | null;
  dateOfIssue: string | null;
  docType: string | null;
  institution: string | null;
  rawText: string;
  confidence: number;
}

/**
 * Extract raw text from an image or scanned PDF page using Tesseract.js OCR.
 */
export async function extractText(filePath: string): Promise<{ text: string; confidence: number }> {
  const result = await Tesseract.recognize(filePath, "eng", {
    logger: (info) => {
      if (info.status === "recognizing text") {
        // Progress can be logged if needed
      }
    },
  });

  return {
    text: result.data.text,
    confidence: result.data.confidence,
  };
}

/**
 * Parse structured metadata from raw OCR text using regex patterns.
 * Designed for common Indian academic documents (degree certificates, marksheets, ID cards).
 */
export function parseMetadata(rawText: string): ParsedMetadata {
  const text = rawText.replace(/\r\n/g, "\n");

  return {
    name: extractName(text),
    rollNo: extractRollNo(text),
    dateOfIssue: extractDate(text),
    docType: detectDocType(text),
    institution: extractInstitution(text),
    rawText: text,
    confidence: 0, // Will be set by caller
  };
}

/**
 * Full OCR pipeline: extract text → parse metadata.
 */
export async function processDocument(filePath: string): Promise<ParsedMetadata> {
  const { text, confidence } = await extractText(filePath);
  const metadata = parseMetadata(text);
  metadata.confidence = confidence;
  return metadata;
}

// ──────────────────────────────────────────────
//  Regex Extraction Helpers
// ──────────────────────────────────────────────

function extractName(text: string): string | null {
  // Common patterns: "Name: John Doe", "This is to certify that Mr./Ms. John Doe"
  const patterns = [
    /(?:name\s*[:\-]\s*)([A-Z][a-zA-Z\s.]{2,40})/i,
    /(?:certif(?:y|ied)\s+that\s+(?:Mr\.|Ms\.|Mrs\.|Dr\.|Shri|Smt\.?)\s*)([A-Z][a-zA-Z\s.]{2,40})/i,
    /(?:awarded\s+to\s+)([A-Z][a-zA-Z\s.]{2,40})/i,
    /(?:student\s+name\s*[:\-]\s*)([A-Z][a-zA-Z\s.]{2,40})/i,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      return match[1].trim();
    }
  }
  return null;
}

function extractRollNo(text: string): string | null {
  const patterns = [
    /(?:roll\s*(?:no|number|#)\s*[:\-]\s*)([A-Z0-9\-\/]{3,20})/i,
    /(?:reg(?:istration)?\s*(?:no|number|#)\s*[:\-]\s*)([A-Z0-9\-\/]{3,20})/i,
    /(?:enrollment\s*(?:no|number|#)\s*[:\-]\s*)([A-Z0-9\-\/]{3,20})/i,
    /(?:ID\s*(?:no|number|#)\s*[:\-]\s*)([A-Z0-9\-\/]{3,20})/i,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      return match[1].trim();
    }
  }
  return null;
}

function extractDate(text: string): string | null {
  const patterns = [
    // "Date of Issue: 15/06/2024" or "Date: June 15, 2024"
    /(?:date\s*(?:of\s*issue)?\s*[:\-]\s*)(\d{1,2}[\/-]\d{1,2}[\/-]\d{2,4})/i,
    /(?:date\s*[:\-]\s*)([A-Z][a-z]+\s+\d{1,2},?\s+\d{4})/i,
    /(?:issued\s+on\s*[:\-]?\s*)(\d{1,2}[\/-]\d{1,2}[\/-]\d{2,4})/i,
    /(?:dated?\s*[:\-]\s*)(\d{1,2}\s+[A-Z][a-z]+\s+\d{4})/i,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      return match[1].trim();
    }
  }
  return null;
}

function detectDocType(text: string): string | null {
  const lower = text.toLowerCase();

  if (lower.includes("degree") || lower.includes("bachelor") || lower.includes("master")) {
    return "Degree Certificate";
  }
  if (lower.includes("marksheet") || lower.includes("mark sheet") || lower.includes("transcript")) {
    return "Marksheet";
  }
  if (lower.includes("diploma")) {
    return "Diploma";
  }
  if (lower.includes("identity") || lower.includes("id card")) {
    return "ID Card";
  }
  if (lower.includes("certificate") || lower.includes("completion")) {
    return "Certificate";
  }
  if (lower.includes("provisional")) {
    return "Provisional Certificate";
  }
  return null;
}

function extractInstitution(text: string): string | null {
  const patterns = [
    /(?:university\s*(?:of|:)\s*)([A-Z][a-zA-Z\s,]{3,60})/i,
    /(?:institute\s*(?:of|:)\s*)([A-Z][a-zA-Z\s,]{3,60})/i,
    /(?:college\s*(?:of|:)\s*)([A-Z][a-zA-Z\s,]{3,60})/i,
    // Match standalone university/institute/college names
    /((?:[A-Z][a-zA-Z]+\s+)*(?:University|Institute|College|School|Academy)(?:\s+of\s+[A-Za-z\s,]+)?)/,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      return match[1].trim().replace(/\n/g, " ");
    }
  }
  return null;
}
