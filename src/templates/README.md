# Templates Guide

This document provides guidance on how to create new templates for the meme coin website generator.

## Template Structure

Each template should be organized in its own directory under the `src/templates` folder. For example, if you're creating a new template called "awesome", you would create a directory structure like this:

```
src/templates/
└── awesome/
    ├── template.ts
    ├── html.ts
    ├── css.ts
    └── js.ts
```

## Required Files

Each template must include the following files:

### 1. template.ts

This is the main entry point for your template. It should export a function that takes a `PreviewData` object and returns a `GeneratedTemplate` object.

```typescript
import { PreviewData, GeneratedTemplate } from '@/types';
import { generateAwesomeHTML } from './html';
import { generateAwesomeCSS } from './css';
import { generateAwesomeJS } from './js';

export const generateAwesomeTemplate = (data: PreviewData): GeneratedTemplate => {
  return {
    html: generateAwesomeHTML(data),
    css: generateAwesomeCSS(data),
    js: generateAwesomeJS()
  };
};
```

### 2. html.ts

This file should export a function that generates the HTML structure for your template based on the provided data.

```typescript
import { PreviewData } from '@/types';

export const generateAwesomeHTML = (data: PreviewData): string => {
  const { coinName, tokenSymbol, description, logoUrl, sections, /* other properties */ } = data;
  
  return `
    <div class="container">
      <header class="header">
        <div class="logo">
          <img src="${logoUrl}" alt="${coinName} Logo">
        </div>
        <h1>${coinName} (${tokenSymbol})</h1>
        <p class="description">${description}</p>
      </header>
      
      <!-- Conditionally render sections based on data.sections -->
      ${sections.hero ? `
        <section class="hero">
          <!-- Hero section content -->
        </section>
      ` : ''}
      
      ${sections.tokenomics ? `
        <section class="tokenomics">
          <!-- Tokenomics section content -->
        </section>
      ` : ''}
      
      <!-- Add other sections as needed -->
    </div>
  `;
};
```

### 3. css.ts

This file should export a function that generates the CSS styles for your template. You can use the provided data to customize colors and other style properties.

```typescript
import { PreviewData } from '@/types';

export const generateAwesomeCSS = (data: PreviewData): string => {
  const { primaryColor, secondaryColor } = data;
  
  return `
    :root {
      --primary-color: ${primaryColor};
      --secondary-color: ${secondaryColor};
      --text-color: #ffffff;
      --background-color: #121212;
    }
    
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Arial', sans-serif;
      background-color: var(--background-color);
      color: var(--text-color);
      line-height: 1.6;
    }
    
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }
    
    .header {
      text-align: center;
      margin-bottom: 3rem;
    }
    
    /* Add more styles as needed */
  `;
};
```

### 4. js.ts

This file should export a function that generates the JavaScript code for your template. This can include animations, interactions, or any other dynamic functionality.

```typescript
export const generateAwesomeJS = (): string => {
  return `
    document.addEventListener('DOMContentLoaded', function() {
      // Initialize animations
      const header = document.querySelector('.header');
      if (header) {
        header.classList.add('animate');
      }
      
      // Add event listeners
      const buttons = document.querySelectorAll('.button');
      buttons.forEach(button => {
        button.addEventListener('click', function() {
          // Handle button clicks
        });
      });
      
      // Add more JavaScript functionality as needed
    });
  `;
};
```

## PreviewData Interface

The `PreviewData` interface provides all the information needed to generate your template. Here's an overview of the available properties:

```typescript
interface PreviewData {
  templateId: string;
  coinName: string;
  tokenSymbol: string;
  description: string;
  primaryColor: string;
  secondaryColor: string;
  logoUrl: string;
  contractAddress: string;
  buyLink: string;
  sections: {
    hero: boolean;
    tokenomics: boolean;
    roadmap: boolean;
    team: boolean;
    faq: boolean;
    community: boolean;
  };
  socialLinks: {
    telegram: string;
    twitter: string;
    discord: string;
  };
  tokenomics: {
    totalSupply: string;
    taxBuy: string;
    taxSell: string;
    lpLocked: string;
  };
  roadmap?: {
    phases: RoadmapPhase[];
  };
  team?: TeamMember[];
  faq?: FaqItem[];
  seo: {
    title: string;
    description: string;
    keywords: string;
    ogImage: string;
  };
}
```

## Integration Steps

After creating your template, you need to integrate it into the application:

1. **Import your template generator** in the following files:
   - `src/components/PreviewComponent.tsx`
   - `src/components/PreviewFrame.tsx`
   - `src/app/api/generate/route.ts`

2. **Add your template to the switch statements** in each of these files to make it available for selection.

3. **Update any template selection UI** to include your new template as an option.

## Best Practices

1. **Responsive Design**: Ensure your template looks good on all device sizes.
2. **Conditional Rendering**: Use the `sections` object to conditionally render different parts of the website.
3. **Semantic HTML**: Use proper HTML5 semantic elements for better accessibility and SEO.
4. **Performance**: Minimize the use of heavy JavaScript libraries or large CSS frameworks.
5. **Customization**: Make good use of the `primaryColor` and `secondaryColor` properties to allow for customization.
6. **Error Handling**: Include fallbacks for missing data (e.g., if `logoUrl` is empty).

## Example

For reference, look at the existing templates in the `src/templates` directory, such as `modern`, `rocket`, or `pepe`. These provide good examples of how to structure your template code.

Happy templating!
