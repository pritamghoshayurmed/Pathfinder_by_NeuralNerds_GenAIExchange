import { PortfolioData } from '@/types/portfolio';
import { useEffect, useRef } from 'react';

interface PortfolioPreviewProps {
  data: PortfolioData;
  html: string;
}

export const PortfolioPreview = ({ data, html }: PortfolioPreviewProps) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (iframeRef.current) {
      const doc = iframeRef.current.contentDocument || iframeRef.current.contentWindow?.document;
      if (doc) {
        doc.open();
        doc.write(html);
        doc.close();
      }
    }
  }, [html]);

  return (
    <div className="w-full h-full bg-white rounded-lg overflow-hidden shadow-xl border border-slate-700">
      <iframe
        ref={iframeRef}
        title="Portfolio Preview"
        className="w-full h-full border-none"
        sandbox="allow-same-origin allow-popups allow-popups-to-escape-sandbox"
      />
    </div>
  );
};
