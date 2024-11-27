import { PreviewData, GeneratedTemplate } from '@/types';
import { generateCosmicHTML } from './html';
import { generateCosmicCSS } from './css';
import { generateCosmicJS } from './js';

export const generateCosmicTemplate = (data: PreviewData): GeneratedTemplate => {
  return {
    html: generateCosmicHTML(data),
    css: generateCosmicCSS(data),
    js: generateCosmicJS()
  };
};
