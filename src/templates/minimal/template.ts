import { PreviewData, GeneratedTemplate } from '@/types';
import { generateMinimalHTML } from './html';
import { generateMinimalCSS } from './css';
import { generateMinimalJS } from './js';

export const generateMinimalTemplate = (data: PreviewData): GeneratedTemplate => {
  return {
    html: generateMinimalHTML(data),
    css: generateMinimalCSS(data),
    js: generateMinimalJS()
  };
};
