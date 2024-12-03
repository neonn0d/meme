'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { PreviewData } from '@/types';
import { generateModernTemplate } from '@/templates/modern/template';
import { generateRocketTemplate } from '@/templates/rocket/template';
import { generateCosmicTemplate } from '@/templates/cosmic/template';
import { generateMinimalTemplate } from '@/templates/minimal/template';

export function PreviewComponent() {
  const searchParams = useSearchParams();
  const [previewHtml, setPreviewHtml] = useState<string>('');
  const [error, setError] = useState<string>('');
  const isMobile = searchParams.get('view') === 'mobile';

  useEffect(() => {
    const generatePreview = () => {
      try {
        // Extract data from URL parameters
        const previewData: PreviewData = {
          templateId: searchParams.get('template') || 'modern',
          coinName: decodeURIComponent(searchParams.get('coinName') || 'Your Coin'),
          sections: JSON.parse(decodeURIComponent(searchParams.get('sections') || '{}')),
          primaryColor: searchParams.get('primaryColor') || '#000000',
          secondaryColor: searchParams.get('secondaryColor') || '#ffffff',
          tokenSymbol: decodeURIComponent(searchParams.get('tokenSymbol') || 'COIN'),
          description: decodeURIComponent(searchParams.get('description') || ''),
          logoUrl: decodeURIComponent(searchParams.get('logoUrl') || ''),
          contractAddress: decodeURIComponent(searchParams.get('contractAddress') || ''),
          socialLinks: JSON.parse(decodeURIComponent(searchParams.get('socialLinks') || '{}')),
          buyLink: decodeURIComponent(searchParams.get('buyLink') || ''),
          tokenomics: JSON.parse(decodeURIComponent(searchParams.get('tokenomics') || '{}')),
          seo: JSON.parse(decodeURIComponent(searchParams.get('seo') || '{}')),
          roadmap: JSON.parse(decodeURIComponent(searchParams.get('roadmap') || '{"phases":[]}')),
          team: JSON.parse(decodeURIComponent(searchParams.get('team') || '[]')),
          faq: JSON.parse(decodeURIComponent(searchParams.get('faq') || '[]'))
        };

        // Select template based on `templateId`
        let generatedTemplate;
        switch (previewData.templateId) {
          case 'modern':
            generatedTemplate = generateModernTemplate(previewData);
            break;
          case 'rocket':
            generatedTemplate = generateRocketTemplate(previewData);
            break;
          case 'cosmic':
            generatedTemplate = generateCosmicTemplate(previewData);
            break;
          case 'minimal':
            generatedTemplate = generateMinimalTemplate(previewData);
            break;
          default:
            generatedTemplate = generateModernTemplate(previewData);
        }

        // Construct the preview content
        const previewContent = `
          <!DOCTYPE html>
          <html>
            <head>
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <style>${generatedTemplate.css}</style>
            </head>
            <body>
              ${generatedTemplate.html}
              <script>${generatedTemplate.js}</script>
            </body>
          </html>
        `;

        setPreviewHtml(previewContent);
      } catch (err) {
        console.error('Preview generation error:', err);
        setError('Failed to generate preview');
      }
    };

    generatePreview();
  }, [searchParams]);

  if (error) {
    return (
      <div className="min-h-[calc(100vh-12rem)] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Preview Error</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-[calc(100vh-12rem)] h-screen">
      <div className="flex-1">
        <div className={`mx-auto h-full ${isMobile ? 'w-[375px]' : 'w-full'}`}>
          <iframe
            srcDoc={previewHtml}
            className="w-full h-full border-0"
            title="Website Preview"
            sandbox="allow-scripts allow-same-origin"
          />
        </div>
      </div>
    </div>
  );
}
