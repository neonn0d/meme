export interface PreviewData {
  templateId: string;
  coinName: string;
  sections: {
    [key: string]: boolean;
  };
  primaryColor: string;
  secondaryColor: string;
  // Add other necessary fields
}

export interface GeneratedTemplate {
  'index.html': string;
  'styles.css': string;
  'main.js': string;
}

export type TemplateFiles = GeneratedTemplate | string;

export interface GenerateRequestBody extends PreviewData {
  files: TemplateFiles;
}
