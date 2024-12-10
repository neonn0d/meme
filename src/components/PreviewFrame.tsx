'use client';

import { useEffect, useState } from 'react';
import { PreviewData } from '@/types';
import { generateModernTemplate } from '@/templates/modern/template';
import { generateRocketTemplate } from '@/templates/rocket/template';
import { generateCosmicTemplate } from '@/templates/cosmic/template';
import { generateMinimalTemplate } from '@/templates/minimal/template';
import { generatePepeTemplate } from '@/templates/pepe/template';
import { generateChristmasTemplate } from '@/templates/christmas/template';

interface PreviewFrameProps {
  previewData: PreviewData;
  className?: string;
}

export function PreviewFrame({ previewData, className = '' }: PreviewFrameProps) {
  const [previewHtml, setPreviewHtml] = useState<string>('');

  useEffect(() => {
    const generatePreview = () => {
      try {
        // Generate template based on template ID
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
          case 'pepe':
            generatedTemplate = generatePepeTemplate(previewData);
            break;
          case 'christmas':
            generatedTemplate = generateChristmasTemplate(previewData);
            break;
          default:
            generatedTemplate = generateModernTemplate(previewData);
        }

        // Combine HTML, CSS, and JS into a single preview
        const previewContent = `
          <!DOCTYPE html>
          <html>
            <head>
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
      }
    };

    generatePreview();
  }, [previewData]);

  return (
    <iframe
      srcDoc={previewHtml}
      className={`w-full h-full border-0 ${className}`}
      title="Website Preview"
      sandbox="allow-scripts allow-same-origin"
    />
  );
}
