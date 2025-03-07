import { PreviewData, GeneratedTemplate } from '@/types';
import { generatePlayfulHTML } from './html';
import { generatePlayfulCSS } from './css';
import { generatePlayfulJS } from './js';

export const generatePlayfulTemplate = (data: PreviewData): GeneratedTemplate => {
  return {
    html: generatePlayfulHTML(data),
    css: generatePlayfulCSS(data),
    js: generatePlayfulJS()
  };
};
