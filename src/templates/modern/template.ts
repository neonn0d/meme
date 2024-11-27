import { PreviewData, GeneratedTemplate } from '@/types';
import { generateModernHTML } from './html';
import { generateModernCSS } from './css';
import { generateModernJS } from './js';

export const generateModernTemplate = (data: PreviewData): GeneratedTemplate => {
  return {
    html: generateModernHTML(data),
    css: generateModernCSS(data),
    js: generateModernJS()
  };
};