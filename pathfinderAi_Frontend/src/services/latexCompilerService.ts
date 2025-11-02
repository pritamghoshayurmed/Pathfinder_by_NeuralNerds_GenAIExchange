/**
 * Client-side LaTeX to PDF Compilation Service
 * Uses jsPDF with html2canvas for reliable client-side PDF generation
 * No external WebAssembly dependencies - pure JavaScript solution
 */

/**
 * Initialize LaTeX compiler - no longer needed with new approach
 * Kept for compatibility but is a no-op
 */
export const initializeLatexCompiler = async () => {
  try {
    console.log("LaTeX compiler ready (using jsPDF)");
    return Promise.resolve(true);
  } catch (error) {
    console.error("Error initializing LaTeX compiler:", error);
    throw error;
  }
};

/**
 * Compile LaTeX code to PDF using jsPDF
 * Can handle both LaTeX and HTML content
 */
export const compileLatexToPdf = async (content: string): Promise<Blob> => {
  try {
    console.log("Starting PDF compilation...");
    
    // Check if content is HTML or LaTeX
    const isHtml = content.includes("<") && content.includes(">");
    
    let htmlContent = content;
    if (!isHtml) {
      // Parse LaTeX to HTML if needed
      htmlContent = parseLatexToHtml(content);
    }
    
    console.log("Content is", isHtml ? "HTML" : "LaTeX (parsed to HTML)");
    console.log("HTML content length:", htmlContent.length);
    
    // Generate PDF from HTML
    const pdfBlob = await generatePdfFromHtml(htmlContent);
    
    console.log("PDF compiled successfully, size:", pdfBlob.size, "bytes");
    if (pdfBlob.size === 0) {
      throw new Error("Generated PDF is empty (0 bytes)");
    }
    return pdfBlob;
  } catch (error) {
    console.error("Error compiling to PDF:", error);
    throw new Error(`Failed to compile to PDF: ${error}`);
  }
};

/**
 * Generate PDF from HTML content using jsPDF and html2canvas
 */
const generatePdfFromHtml = async (htmlContent: string): Promise<Blob> => {
  try {
    const { jsPDF } = await import("jspdf");
    const html2canvas = (await import("html2canvas")).default;

    // Create a temporary container for rendering
    const container = document.createElement("div");
    container.style.position = "absolute";
    container.style.left = "-9999px";
    container.style.top = "-9999px";
    container.style.width = "210mm"; // A4 width
    container.style.minHeight = "297mm"; // A4 height
    container.style.padding = "20px";
    container.style.backgroundColor = "white";
    container.style.fontSize = "11px";
    container.style.fontFamily = "'Times New Roman', 'Calibri', serif";
    container.style.lineHeight = "1.6";
    container.style.color = "#000";
    
    // Set content
    container.innerHTML = htmlContent;
    
    // Append to body temporarily
    document.body.appendChild(container);

    // Wait a bit for rendering
    await new Promise(resolve => setTimeout(resolve, 100));

    // Convert to canvas
    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff",
      windowHeight: container.scrollHeight,
      windowWidth: container.scrollWidth,
    });

    // Remove container
    document.body.removeChild(container);

    // Calculate dimensions
    const imgData = canvas.toDataURL("image/png");
    const imgWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    let imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    // Create PDF
    const pdf = new jsPDF("p", "mm", "a4");
    let pageCount = 0;

    while (heightLeft >= 0) {
      const sourceY = position * canvas.height / imgHeight;
      
      if (pageCount > 0) {
        pdf.addPage();
      }

      pdf.addImage(imgData, "PNG", 0, position === 0 ? 0 : -position, imgWidth, imgHeight);

      heightLeft -= pageHeight;
      position += pageHeight;
      pageCount++;
    }

    return pdf.output("blob");
  } catch (error) {
    throw new Error(`PDF generation failed: ${error}`);
  }
};

/**
 * Parse LaTeX code to HTML for PDF rendering
 * Uses a recursive parsing approach to handle nested LaTeX commands
 */
const parseLatexToHtml = (latexCode: string): string => {
  try {
    // Extract content between \begin{document} and \end{document}
    const docMatch = latexCode.match(/\\begin\{document\}([\s\S]*?)\\end\{document\}/);
    let content = docMatch ? docMatch[1] : latexCode;

    // Clean up preamble
    content = content.replace(/^[\s\S]*?\\begin\{document\}/m, "");
    content = content.replace(/\\end\{document\}[\s\S]*?$/m, "");

    // Strip complex LaTeX commands we can't render
    content = stripComplexLatexCommands(content);

    // Replace text formatting (handle nested braces properly)
    content = replaceLatexCommand(content, /\\textbf\s*\{([^}]*(?:\{[^}]*\}[^}]*)*)\}/g, "<strong>$1</strong>");
    content = replaceLatexCommand(content, /\\textit\s*\{([^}]*(?:\{[^}]*\}[^}]*)*)\}/g, "<em>$1</em>");
    content = replaceLatexCommand(content, /\\underline\s*\{([^}]*(?:\{[^}]*\}[^}]*)*)\}/g, "<u>$1</u>");
    content = replaceLatexCommand(content, /\\texttt\s*\{([^}]*(?:\{[^}]*\}[^}]*)*)\}/g, "<code style='font-family: monospace; background-color: #f0f0f0; padding: 2px 4px;'>$1</code>");
    
    // Color and box commands - extract just the text
    content = content.replace(/\\textcolor\s*\{[^}]*\}\s*\{([^}]*)\}/g, "$1");
    content = content.replace(/\\colorbox\s*\{[^}]*\}\s*\{([^}]*)\}/g, "$1");

    // Section headers
    content = content.replace(/\\section\*?\s*\{([^}]*)\}/g, "<h2 style='font-size: 16px; font-weight: bold; margin-top: 15px; margin-bottom: 8px; border-bottom: 2px solid #333; padding-bottom: 5px;'>$1</h2>");
    content = content.replace(/\\subsection\*?\s*\{([^}]*)\}/g, "<h3 style='font-size: 13px; font-weight: bold; margin-top: 10px; margin-bottom: 6px;'>$1</h3>");
    content = content.replace(/\\subsubsection\*?\s*\{([^}]*)\}/g, "<h4 style='font-size: 12px; font-weight: bold; margin-top: 8px; margin-bottom: 4px;'>$1</h4>");

    // Handle itemize lists
    content = content.replace(/\\begin\{itemize\}([\s\S]*?)\\end\{itemize\}/g, (match, items) => {
      return convertListItems(items, "ul");
    });

    // Handle enumerate lists
    content = content.replace(/\\begin\{enumerate\}([\s\S]*?)\\end\{enumerate\}/g, (match, items) => {
      return convertListItems(items, "ol");
    });

    // Standalone items
    content = content.replace(/\\item\s+/g, "• ");

    // Line breaks
    content = content.replace(/\\\\\s*\n/g, "<br />");
    content = content.replace(/\\\\/g, "<br />");
    content = content.replace(/\\newline/g, "<br />");
    content = content.replace(/\n\n+/g, "</p><p>");

    // Special characters
    content = content.replace(/\\textbullet/g, "•");
    content = content.replace(/\\cdot/g, "•");
    content = content.replace(/\\times/g, "×");
    content = content.replace(/~([a-zA-Z])/g, "&nbsp;$1"); // Non-breaking space
    content = content.replace(/\\&/g, "&");
    content = content.replace(/\\\$/g, "$");
    content = content.replace(/\\\%/g, "%");
    content = content.replace(/\\\#/g, "#");
    content = content.replace(/\\_/g, "_");

    // Remove remaining escape sequences and braces
    content = content.replace(/\\\s+/g, " ");
    content = stripRemainingBraces(content);

    // Remove any remaining LaTeX commands that weren't caught
    content = content.replace(/\\[a-zA-Z]+(\s+|\{[^}]*\})?/g, "");

    // Clean up extra whitespace
    content = content.replace(/\s+/g, " ").trim();

    // Wrap content in paragraph tags if needed
    if (!content.includes("<h") && !content.includes("<ul") && !content.includes("<ol")) {
      content = content.split("\n").map(line => line.trim()).filter(l => l).map(line => `<p>${line}</p>`).join("");
    }

    const html = `
      <div style="
        font-family: 'Segoe UI', 'Calibri', 'Arial', sans-serif;
        line-height: 1.5;
        color: #333;
        padding: 15px;
        font-size: 10px;
      ">
        ${content || "<p>Resume content</p>"}
      </div>
    `;

    console.log("Parsed HTML content length:", html.length);
    return html;
  } catch (error) {
    console.error("Error parsing LaTeX to HTML:", error);
    // Fallback: return escaped LaTeX to prevent rendering broken commands
    return `<div style="font-family: serif; line-height: 1.5; padding: 15px; font-size: 10px; color: #333;">${latexCode.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n/g, "<br />")}</div>`;
  }
};

/**
 * Helper: Remove complex LaTeX commands that can't be rendered
 */
const stripComplexLatexCommands = (content: string): string => {
  // Remove \raggedright, \raggedleft, etc.
  content = content.replace(/\\ragged(right|left|center)/g, "");
  // Remove font size commands
  content = content.replace(/\\(tiny|small|normalsize|large|Large|LARGE|huge|Huge)/g, "");
  // Remove color definitions
  content = content.replace(/\\definecolor\{[^}]*\}\{[^}]*\}/g, "");
  // Remove minipage environments
  content = content.replace(/\\begin\{minipage\}[^}]*\}([\s\S]*?)\\end\{minipage\}/g, "$1");
  // Remove vspace, hspace
  content = content.replace(/\\[vh]space\{[^}]*\}/g, "");
  // Remove vfill
  content = content.replace(/\\vfill/g, "");
  return content;
};

/**
 * Helper: Replace LaTeX commands recursively handling nested braces
 */
const replaceLatexCommand = (content: string, regex: RegExp, replacement: string): string => {
  return content.replace(regex, (match, capture) => {
    // Clean the captured content
    const cleaned = stripRemainingBraces(capture);
    return replacement.replace("$1", cleaned);
  });
};

/**
 * Helper: Strip remaining braces while preserving content
 */
const stripRemainingBraces = (content: string): string => {
  let result = content;
  let iterations = 0;
  // Iteratively remove innermost braces
  while (result.includes("{") && iterations < 10) {
    result = result.replace(/\{([^{}]*)\}/g, "$1");
    iterations++;
  }
  // Remove any orphaned braces
  result = result.replace(/[{}]/g, "");
  return result;
};

/**
 * Helper: Convert LaTeX list items to HTML
 */
const convertListItems = (itemsText: string, listType: "ul" | "ol"): string => {
  const items = itemsText.split(/\\item\s+/).filter(item => item.trim());
  const htmlItems = items.map(item => {
    const text = stripRemainingBraces(item.trim()).replace(/^\s*-\s*/, "");
    return `<li style='margin-bottom: 4px;'>${text}</li>`;
  }).join("");
  
  const tag = listType === "ul" ? "ul" : "ol";
  return `<${tag} style='margin: 8px 0; margin-left: 20px;'>${htmlItems}</${tag}>`;
};

/**
 * Validate LaTeX code for basic syntax errors
 */
export const validateLatexCode = (latexCode: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  // Check for document begin/end
  if (!latexCode.includes("\\documentclass")) {
    errors.push("Missing \\documentclass declaration");
  }

  if (!latexCode.includes("\\begin{document}")) {
    errors.push("Missing \\begin{document}");
  }

  if (!latexCode.includes("\\end{document}")) {
    errors.push("Missing \\end{document}");
  }

  // Check for balanced braces
  let braceCount = 0;
  for (const char of latexCode) {
    if (char === "{") braceCount++;
    if (char === "}") braceCount--;
    if (braceCount < 0) {
      errors.push("Unbalanced braces detected");
      break;
    }
  }

  if (braceCount !== 0) {
    errors.push("Unbalanced braces - mismatch in opening/closing braces");
  }

  // Check for common syntax patterns
  const suspiciousPatterns = [
    { pattern: /\{[^}]*\{[^}]*\{[^}]*\{/g, message: "Deeply nested braces (may cause issues)" },
  ];

  for (const { pattern, message } of suspiciousPatterns) {
    if (pattern.test(latexCode)) {
      errors.push(message);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Get LaTeX syntax suggestions for Monaco Editor
 */
export const getLatexCompletions = () => {
  return [
    // Text formatting
    { label: "\\textbf", kind: 5, insertText: "\\textbf{$1}" },
    { label: "\\textit", kind: 5, insertText: "\\textit{$1}" },
    { label: "\\underline", kind: 5, insertText: "\\underline{$1}" },
    { label: "\\texttt", kind: 5, insertText: "\\texttt{$1}" },

    // Sections
    { label: "\\section", kind: 5, insertText: "\\section{$1}" },
    { label: "\\subsection", kind: 5, insertText: "\\subsection{$1}" },
    { label: "\\subsubsection", kind: 5, insertText: "\\subsubsection{$1}" },

    // Lists
    { label: "\\begin{itemize}", kind: 5, insertText: "\\begin{itemize}\n\\item $1\n\\end{itemize}" },
    { label: "\\begin{enumerate}", kind: 5, insertText: "\\begin{enumerate}\n\\item $1\n\\end{enumerate}" },

    // Tables
    { label: "\\begin{tabular}", kind: 5, insertText: "\\begin{tabular}{$1}\n$2\n\\end{tabular}" },

    // Special characters
    { label: "\\bullet", kind: 5, insertText: "\\bullet" },
    { label: "\\cdot", kind: 5, insertText: "\\cdot" },
    { label: "\\times", kind: 5, insertText: "\\times" },

    // Colors
    { label: "\\color", kind: 5, insertText: "\\color{$1}" },
    { label: "\\textcolor", kind: 5, insertText: "\\textcolor{$1}{$2}" },

    // Spacing
    { label: "\\vspace", kind: 5, insertText: "\\vspace{$1}" },
    { label: "\\hspace", kind: 5, insertText: "\\hspace{$1}" },
    { label: "\\\\\\\\", kind: 5, insertText: "\\\\\\\\" },
    { label: "\\par", kind: 5, insertText: "\\par" },

    // Alignment
    { label: "\\center", kind: 5, insertText: "\\center{$1}" },
    { label: "\\raggedleft", kind: 5, insertText: "\\raggedleft{$1}" },
    { label: "\\raggedright", kind: 5, insertText: "\\raggedright{$1}" },

    // Document structure
    { label: "\\documentclass", kind: 5, insertText: "\\documentclass{article}" },
    { label: "\\usepackage", kind: 5, insertText: "\\usepackage{$1}" },
    { label: "\\begin{document}", kind: 5, insertText: "\\begin{document}\n$1\n\\end{document}" },
  ];
};

/**
 * LaTeX syntax highlighting rules for Monaco Editor
 */
export const getLatexSyntaxTheme = () => {
  return {
    base: "vs-dark",
    inherit: true,
    rules: [
      { token: "keyword", foreground: "569CD6" }, // \commands
      { token: "string", foreground: "CE9178" }, // {content}
      { token: "comment", foreground: "6A9955" }, // % comments
      { token: "number", foreground: "B5CEA8" }, // numbers
      { token: "variable", foreground: "9CDCFE" }, // variables
    ],
    colors: {
      "editor.background": "#1e1e1e",
      "editor.foreground": "#d4d4d4",
      "editorLineNumber.foreground": "#858585",
      "editorCursor.foreground": "#aeafad",
    },
  };
};

/**
 * Get LaTeX language configuration for Monaco Editor
 */
export const getLatexLanguageConfig = () => {
  return {
    comments: {
      lineComment: "%",
    },
    brackets: [
      ["{", "}"],
      ["[", "]"],
      ["(", ")"],
    ],
    autoClosingPairs: [
      { open: "{", close: "}", notIn: ["string"] },
      { open: "[", close: "]", notIn: ["string"] },
      { open: "(", close: ")", notIn: ["string"] },
    ],
    surroundingPairs: [
      { open: "{", close: "}" },
      { open: "[", close: "]" },
      { open: "(", close: ")" },
    ],
  };
};
