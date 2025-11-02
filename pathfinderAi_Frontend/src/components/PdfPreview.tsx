import React, { useEffect, useRef, useState } from "react";
import * as pdfjs from "pdfjs-dist";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Download, AlertCircle } from "lucide-react";

// Set up PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

interface PdfPreviewProps {
  pdfBlob: Blob | null;
  isLoading?: boolean;
  error?: string | null;
  onDownload?: () => void;
}

const PdfPreview: React.FC<PdfPreviewProps> = ({
  pdfBlob,
  isLoading = false,
  error = null,
  onDownload,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [scale, setScale] = useState(1.5);
  const [pdfDocument, setPdfDocument] = useState<any | null>(null);

  // Load PDF document
  useEffect(() => {
    if (!pdfBlob) return;

    const loadPdf = async () => {
      try {
        const arrayBuffer = await pdfBlob.arrayBuffer();
        const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
        setPdfDocument(pdf);
        setTotalPages(pdf.numPages);
        setCurrentPage(1);
      } catch (err) {
        console.error("Error loading PDF:", err);
      }
    };

    loadPdf();
  }, [pdfBlob]);

  // Render PDF page
  useEffect(() => {
    if (!pdfDocument || !canvasRef.current) return;

    const renderPage = async () => {
      try {
        const page = await pdfDocument.getPage(currentPage);
        const viewport = page.getViewport({ scale });

        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");
        if (!context) return;

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({
          canvasContext: context,
          viewport: viewport,
        }).promise;
      } catch (err) {
        console.error("Error rendering page:", err);
      }
    };

    renderPage();
  }, [pdfDocument, currentPage, scale]);

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev + 0.2, 3));
  };

  const handleZoomOut = () => {
    setScale((prev) => Math.max(prev - 0.2, 0.8));
  };

  const handleResetZoom = () => {
    setScale(1.5);
  };

  if (error) {
    return (
      <div className="p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-xl border border-red-500/30 flex items-center gap-4 justify-center min-h-96">
        <AlertCircle className="w-8 h-8 text-red-400 flex-shrink-0" />
        <div>
          <h3 className="font-semibold text-red-300">Error Loading Preview</h3>
          <p className="text-sm text-red-400 mt-1">{error}</p>
        </div>
      </div>
    );
  }

  if (!pdfBlob) {
    return (
      <div className="p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-xl border border-slate-700/50 flex items-center justify-center min-h-96">
        <div className="text-center space-y-3">
          <div className="text-4xl">📄</div>
          <p className="text-slate-400">No PDF to preview. Compile your LaTeX code to generate a PDF.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-800/50 to-slate-900/50 rounded-xl border border-slate-700/50">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-slate-400">PDF Preview</span>
          {totalPages > 0 && (
            <span className="text-xs text-slate-500">
              Page {currentPage} of {totalPages}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Navigation */}
          <Button
            size="sm"
            variant="outline"
            onClick={handlePrevPage}
            disabled={currentPage <= 1 || isLoading}
            className="border-slate-600 text-slate-300 hover:bg-slate-700/50 text-xs"
          >
            <ChevronLeft className="w-3 h-3" />
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={handleNextPage}
            disabled={currentPage >= totalPages || isLoading}
            className="border-slate-600 text-slate-300 hover:bg-slate-700/50 text-xs"
          >
            <ChevronRight className="w-3 h-3" />
          </Button>

          {/* Zoom Controls */}
          <div className="border-l border-slate-600 pl-2 ml-2 flex items-center gap-1">
            <Button
              size="sm"
              variant="outline"
              onClick={handleZoomOut}
              disabled={scale <= 0.8 || isLoading}
              className="border-slate-600 text-slate-300 hover:bg-slate-700/50 text-xs"
            >
              <ZoomOut className="w-3 h-3" />
            </Button>

            <span className="text-xs text-slate-500 min-w-[40px] text-center">{Math.round(scale * 100)}%</span>

            <Button
              size="sm"
              variant="outline"
              onClick={handleZoomIn}
              disabled={scale >= 3 || isLoading}
              className="border-slate-600 text-slate-300 hover:bg-slate-700/50 text-xs"
            >
              <ZoomIn className="w-3 h-3" />
            </Button>

            <Button
              size="sm"
              variant="outline"
              onClick={handleResetZoom}
              disabled={isLoading}
              className="border-slate-600 text-slate-300 hover:bg-slate-700/50 text-xs"
            >
              Reset
            </Button>
          </div>

          {/* Download Button */}
          {onDownload && (
            <Button
              size="sm"
              onClick={onDownload}
              disabled={isLoading}
              className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white border-0 text-xs"
            >
              <Download className="w-3 h-3 mr-1" />
              Download
            </Button>
          )}
        </div>
      </div>

      {/* PDF Canvas Container */}
      <div
        ref={containerRef}
        className="flex justify-center p-6 bg-gradient-to-br from-slate-800/30 to-slate-900/30 rounded-xl border border-slate-700/50 overflow-auto max-h-[600px]"
      >
        {isLoading ? (
          <div className="flex items-center justify-center min-h-96">
            <div className="space-y-3 text-center">
              <div className="animate-spin">
                <div className="w-8 h-8 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full"></div>
              </div>
              <p className="text-sm text-slate-400">Compiling LaTeX to PDF...</p>
            </div>
          </div>
        ) : (
          <canvas
            ref={canvasRef}
            className="shadow-lg border border-slate-700/50 rounded"
            style={{ maxWidth: "100%" }}
          />
        )}
      </div>

      {/* Page Info */}
      <div className="text-xs text-slate-500 text-center">
        {pdfBlob && `PDF Size: ${(pdfBlob.size / 1024).toFixed(2)} KB`}
      </div>
    </div>
  );
};

export default PdfPreview;
