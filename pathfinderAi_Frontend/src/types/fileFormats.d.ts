/**
 * Type declarations for file parsing libraries
 */

declare module 'pdfjs-dist' {
  export const version: string;
  export const GlobalWorkerOptions: {
    workerSrc: string;
  };
  
  export function getDocument(source: {
    data: ArrayBuffer;
    [key: string]: any;
  }): {
    promise: Promise<PDFDocument>;
  };

  export interface PDFDocument {
    numPages: number;
    getPage(pageNumber: number): Promise<PDFPage>;
  }

  export interface PDFPage {
    getTextContent(): Promise<TextContent>;
  }

  export interface TextContent {
    items: TextItem[];
  }

  export interface TextItem {
    str: string;
    [key: string]: any;
  }
}

declare module 'mammoth' {
  export function extractRawText(options: {
    arrayBuffer: ArrayBuffer;
  }): Promise<{
    value: string;
    messages: Array<{ message: string }>;
  }>;

  export default {
    extractRawText,
  };
}
