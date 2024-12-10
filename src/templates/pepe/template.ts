import { PreviewData, GeneratedTemplate } from '@/types';
import { generatePepeHTML } from './html';
import { generatePepeCSS } from './css';
import { generatePepeJS } from './js';

export const generatePepeTemplate = (data: PreviewData): GeneratedTemplate => {
  return {
    html: generatePepeHTML(data),
    css: generatePepeCSS(data),
    js: generatePepeJS()
  };
};
