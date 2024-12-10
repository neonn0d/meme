import { PreviewData, GeneratedTemplate } from '@/types';
import { generateChristmasHTML } from './html';
import { generateChristmasCSS } from './css';
import { generateChristmasJS } from './js';

export const generateChristmasTemplate = (data: PreviewData): GeneratedTemplate => {
  return {
    html: generateChristmasHTML(data),
    css: generateChristmasCSS(data),
    js: generateChristmasJS()
  };
};