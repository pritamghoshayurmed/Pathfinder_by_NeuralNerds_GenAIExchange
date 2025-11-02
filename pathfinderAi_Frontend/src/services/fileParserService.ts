/**
 * File Parser Service
 * Handles parsing of different file formats (PDF, DOCX, TXT) to plain text
 */

// Dynamic imports for libraries to reduce bundle size
let pdfjsLib: any = null;
let mammoth: any = null;

/**
 * Initialize PDF.js library
 */
async function initPdfJs() {
  if (pdfjsLib) return pdfjsLib;

  try {
    // Dynamically import PDF.js
    pdfjsLib = await import('pdfjs-dist');
    
    // Use local worker instead of CDN to avoid CORS issues
    const pdfjsWorker = await import('pdfjs-dist/build/pdf.worker.mjs?url');
    pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker.default || pdfjsWorker;
    
    return pdfjsLib;
  } catch (error) {
    console.error('Failed to load PDF.js:', error);
    return null;
  }
}

/**
 * Initialize Mammoth library for DOCX parsing
 */
async function initMammoth() {
  if (mammoth) return mammoth;

  try {
    // Dynamically import Mammoth
    mammoth = await import('mammoth');
    return mammoth;
  } catch (error) {
    console.error('Failed to load Mammoth:', error);
    return null;
  }
}

/**
 * Extract text from PDF using PDF.js
 */
export async function parsePDF(file: File): Promise<string> {
  try {
    const pdfjsModule = await initPdfJs();
    if (!pdfjsModule) {
      throw new Error('PDF.js library could not be loaded');
    }

    const pdfjs = pdfjsModule.default || pdfjsModule;
    const arrayBuffer = await file.arrayBuffer();

    try {
      const loadingTask = pdfjs.getDocument({ 
        data: arrayBuffer,
        useWorkerFetch: false,
        isEvalSupported: false,
        useSystemFonts: true,
      });
      
      const pdf = await loadingTask.promise;
      let fullText = '';

      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        try {
          const page = await pdf.getPage(pageNum);
          const textContent = await page.getTextContent();

          // Extract text from text items
          const pageText = textContent.items
            .map((item: any) => {
              if (typeof item.str === 'string') {
                return item.str;
              }
              return '';
            })
            .join(' ');

          fullText += pageText + '\n';
        } catch (pageError) {
          console.warn(`Error extracting page ${pageNum}:`, pageError);
          continue;
        }
      }

      if (!fullText.trim()) {
        throw new Error('No text content found in PDF. The PDF may be image-based or protected.');
      }

      return cleanExtractedText(fullText);
    } catch (pdfError) {
      console.error('PDF processing error:', pdfError);
      throw new Error('Failed to process PDF file. The file may be corrupted, protected, or image-based.');
    }
  } catch (error) {
    console.error('PDF parsing error:', error);
    throw error instanceof Error ? error : new Error('Failed to parse PDF file');
  }
}

/**
 * Extract text from DOCX using Mammoth
 */
export async function parseDOCX(file: File): Promise<string> {
  try {
    const mammothModule = await initMammoth();
    if (!mammothModule) {
      throw new Error('Mammoth library could not be loaded');
    }

    const mammothLib = mammothModule.default || mammothModule;
    const arrayBuffer = await file.arrayBuffer();

    try {
      const result = await mammothLib.extractRawText({ arrayBuffer });

      if (!result.value || !result.value.trim()) {
        throw new Error('No text content found in DOCX');
      }

      if (result.messages && result.messages.length > 0) {
        console.warn('DOCX parsing warnings:', result.messages);
      }

      return cleanExtractedText(result.value);
    } catch (docxError) {
      console.error('DOCX processing error:', docxError);
      throw new Error('Failed to process DOCX file. The file may be corrupted or protected.');
    }
  } catch (error) {
    console.error('DOCX parsing error:', error);
    throw error instanceof Error ? error : new Error('Failed to parse DOCX file');
  }
}

/**
 * Extract text from TXT file
 */
export async function parseTXT(file: File): Promise<string> {
  try {
    const text = await file.text();

    if (!text.trim()) {
      throw new Error('Text file is empty');
    }

    return cleanExtractedText(text);
  } catch (error) {
    console.error('TXT parsing error:', error);
    throw error instanceof Error ? error : new Error('Failed to parse TXT file');
  }
}

/**
 * Clean and normalize extracted text
 */
function cleanExtractedText(text: string): string {
  try {
    let cleaned = text
      // Remove null bytes and control characters (except newlines and tabs)
      .replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F]/g, '')
      // Normalize newlines
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n')
      // Remove excessive whitespace but preserve structure
      .replace(/\n\s*\n\s*\n+/g, '\n\n')
      // Remove leading/trailing whitespace on lines
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .join('\n')
      // Fix encoding artifacts
      .replace(/[\uFFFD]/g, '')
      .replace(/[""]/g, '"')
      .replace(/[']/g, "'")
      .trim();

    return cleaned;
  } catch (error) {
    console.error('Error cleaning text:', error);
    return text.trim();
  }
}

/**
 * Parse any file based on its type
 */
export async function parseFile(file: File): Promise<string> {
  // Validate file
  if (!file) {
    throw new Error('No file provided');
  }

  if (file.size === 0) {
    throw new Error('File is empty');
  }

  if (file.size > 50 * 1024 * 1024) {
    // 50MB limit
    throw new Error('File size exceeds 50MB limit');
  }

  const fileName = file.name.toLowerCase();
  const mimeType = file.type.toLowerCase();

  try {
    // Determine file type
    if (fileName.endsWith('.pdf') || mimeType === 'application/pdf') {
      return await parsePDF(file);
    } else if (
      fileName.endsWith('.docx') ||
      mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) {
      return await parseDOCX(file);
    } else if (
      fileName.endsWith('.txt') ||
      mimeType === 'text/plain' ||
      mimeType.startsWith('text/')
    ) {
      return await parseTXT(file);
    } else {
      // Try as text file first, then PDF, then DOCX
      try {
        return await parseTXT(file);
      } catch {
        try {
          return await parsePDF(file);
        } catch {
          return await parseDOCX(file);
        }
      }
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Failed to parse file: ${errorMessage}`);
  }
}

/**
 * Get supported file extensions
 */
export function getSupportedFormats(): string[] {
  return ['.pdf', '.docx', '.txt'];
}

/**
 * Validate if file format is supported
 */
export function isSupportedFormat(fileName: string): boolean {
  const supported = getSupportedFormats();
  const ext = fileName.substring(fileName.lastIndexOf('.')).toLowerCase();
  return supported.includes(ext);
}
