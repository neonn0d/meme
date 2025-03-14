import { PreviewData, GeneratedTemplate } from '@/types';
import { generateStellarHTML } from './html';
import { generateStellarCSS } from './css';
import { generateStellarJS } from './js';

export const generateStellarTemplate = (data: PreviewData): GeneratedTemplate => {
  return {
    html: generateStellarHTML(data),
    css: generateStellarCSS(data),
    js: generateStellarJS()
  };
};
