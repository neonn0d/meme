# Template Creation Guide for Meme Coin Website Generator

This guide explains how to create a new template for the Meme Coin Website Generator and integrate it into the project. Templates are modular and consist of three main components: HTML, CSS, and JavaScript.

## Template Structure

Each template follows a specific structure:

```
src/
└── templates/
    └── your-template-name/
        ├── template.ts  - Main export file
        ├── html.ts      - HTML generation logic
        ├── css.ts       - CSS styles
        └── js.ts        - JavaScript functionality
```

## Step 1: Create Template Files

### 1.1 Create the directory structure

Create a new directory for your template in the `src/templates/` folder with the name of your template (e.g., `src/templates/cosmic/`).

### 1.2 Create the template files

Create the following files in your template directory:
- `template.ts` - Main export file
- `html.ts` - HTML generation logic
- `css.ts` - CSS styles
- `js.ts` - JavaScript functionality

## Step 2: Implement Template Components

### 2.1 HTML Component (html.ts)

The HTML component generates the structure of your template. It receives the `PreviewData` object and returns a string of HTML.

```typescript
import { PreviewData } from '@/types';

export const generateYourTemplateHTML = ({ 
  coinName, 
  tokenSymbol,
  primaryColor,
  secondaryColor,
  socialLinks,
  tokenomics,
  roadmap,
  team,
  faq,
  sections
}: PreviewData): string => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${coinName} - ${tokenSymbol}</title>
    <!-- Required CDNs -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <!-- Tailwind CSS CDN - Required -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
      tailwind.config = {
        theme: {
          extend: {
            colors: {
              primary: '${primaryColor}',
              secondary: '${secondaryColor}'
            }
          }
        }
      }
    </script>
</head>
<body>
    <!-- Navigation -->
    <nav>
        <!-- Navigation content -->
    </nav>

    <!-- Hero Section -->
    ${sections.hero ? `
    <section id="hero">
        <!-- Hero content -->
    </section>
    ` : ''}

    <!-- Tokenomics Section -->
    ${sections.tokenomics ? `
    <section id="tokenomics">
        <!-- Tokenomics content -->
    </section>
    ` : ''}

    <!-- Additional sections (roadmap, team, faq, community) -->
    
    <!-- Footer -->
    <footer>
        <!-- Footer content -->
    </footer>
</body>
</html>`;
};
```

### 2.2 CSS Component (css.ts)

The CSS component defines the styles for your template. It also receives the `PreviewData` object to use custom colors.

```typescript
import { PreviewData } from '@/types';

export const generateYourTemplateCSS = ({ primaryColor = '#3B82F6', secondaryColor = '#c0bfbc' }: PreviewData): string => {
  return `/* Your template styles */
body {
  font-family: 'Inter', sans-serif;
  background-color: #0f172a;
  color: white;
}

:root {
  --primary-color: ${primaryColor};
  --secondary-color: ${secondaryColor};
}

/* Add more styles for your template */
`;
};
```

### 2.3 JavaScript Component (js.ts)

The JavaScript component adds interactivity to your template.

```typescript
export const generateYourTemplateJS = (): string => {
  return `// Your template JavaScript
document.addEventListener('DOMContentLoaded', function() {
  // Initialize animations
  const revealElements = document.querySelectorAll('.reveal');
  
  function checkReveal() {
    revealElements.forEach(element => {
      const elementTop = element.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;
      if (elementTop < windowHeight - 100) {
        element.classList.add('active');
      }
    });
  }
  
  // Check on load
  checkReveal();
  
  // Check on scroll
  window.addEventListener('scroll', checkReveal);
});
`;
};
```

### 2.4 Main Template File (template.ts)

The main template file exports a function that combines HTML, CSS, and JS components.

```typescript
import { PreviewData, GeneratedTemplate } from '@/types';
import { generateYourTemplateHTML } from './html';
import { generateYourTemplateCSS } from './css';
import { generateYourTemplateJS } from './js';

export const generateYourTemplate = (data: PreviewData): GeneratedTemplate => {
  return {
    html: generateYourTemplateHTML(data),
    css: generateYourTemplateCSS(data),
    js: generateYourTemplateJS()
  };
};
```

## Step 3: Integrate Your Template

### 3.1 Update the PreviewComponent.tsx

Open `src/components/PreviewComponent.tsx` and add your template to the switch statement:

```typescript
// Import your template
import { generateYourTemplate } from '@/templates/your-template-name/template';

// In the generatePreview function, add your template to the switch statement
switch (templateId) {
  case 'modern':
    generatedTemplate = generateModernTemplate(previewData);
    break;
  case 'playful':
    generatedTemplate = generatePlayfulTemplate(previewData);
    break;
  case 'your-template-name':
    generatedTemplate = generateYourTemplate(previewData);
    break;
  default:
    generatedTemplate = generateModernTemplate(previewData);
}
```

### 3.2 Add Your Template to the Template Grid

Update the template grid component to include your new template:

1. Add a preview image for your template in the `public/templates/` directory
2. Update the template grid component to include your template

## Template Data Structure

Your template will receive a `PreviewData` object with the following properties:

```typescript
interface PreviewData {
  templateId: string;
  coinName: string;
  tokenSymbol: string;
  primaryColor: string;
  secondaryColor: string;
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
  roadmap: RoadmapPhase[];
  team: TeamMember[];
  faq: FaqItem[];
  seo: {
    title: string;
    description: string;
    keywords: string;
    ogImage: string;
  };
}
```

## Best Practices for Template Creation

1. **Responsive Design**: Ensure your template works well on all screen sizes
2. **Conditional Sections**: Use the `sections` object to conditionally render sections
3. **Color Variables**: Use CSS variables for primary and secondary colors
4. **Accessibility**: Ensure your template is accessible (proper contrast, semantic HTML)
5. **Performance**: Optimize images and minimize JavaScript
6. **Animations**: Add subtle animations for a better user experience
7. **Consistent Styling**: Maintain consistent spacing, typography, and color usage

## Required CDNs and External Resources

All templates must include the following CDNs in the HTML head section:

```html
<!-- Required Fonts -->
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">

<!-- Required Icons -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">

<!-- Required Tailwind CSS -->
<script src="https://cdn.tailwindcss.com"></script>
<script>
  tailwind.config = {
    theme: {
      extend: {
        colors: {
          primary: '${primaryColor}',
          secondary: '${secondaryColor}'
        }
      }
    }
  }
</script>
```

These resources are essential for:
1. **Tailwind CSS**: Used for all styling in the templates
2. **Inter Font**: The standard font for all templates
3. **Font Awesome**: Used for all icons in the templates

Do not use any other CSS frameworks or icon libraries to maintain consistency across templates.

## External Development and Import

If you want to develop templates outside the project and import them later:

### External Development

1. Create a new repository with the same file structure:
```
your-template-repo/
├── template.ts
├── html.ts
├── css.ts
└── js.ts
```

2. Use the same interfaces and type definitions:
```typescript
// types.ts
export interface PreviewData {
  // Copy the interface from the main project
}

export interface GeneratedTemplate {
  html: string;
  css: string;
  js: string;
}
```

### Importing External Templates

To import an external template:

1. Copy the template directory into the `src/templates/` folder
2. Update imports to use the project's type definitions
3. Update the PreviewComponent as described in Step 3.1
4. Add the template to the template grid

## Example: Creating a Minimal Template

Here's a minimal example of a template:

```typescript
// html.ts
export const generateMinimalHTML = (data) => `
<!DOCTYPE html>
<html>
<head><title>${data.coinName}</title></head>
<body>
  <h1>${data.coinName} (${data.tokenSymbol})</h1>
</body>
</html>
`;

// css.ts
export const generateMinimalCSS = (data) => `
body { color: ${data.primaryColor}; }
`;

// js.ts
export const generateMinimalJS = () => `
console.log('Minimal template loaded');
`;

// template.ts
import { generateMinimalHTML } from './html';
import { generateMinimalCSS } from './css';
import { generateMinimalJS } from './js';

export const generateMinimalTemplate = (data) => ({
  html: generateMinimalHTML(data),
  css: generateMinimalCSS(data),
  js: generateMinimalJS()
});
```

## Troubleshooting

- **Template not showing up**: Ensure you've updated the PreviewComponent.tsx file
- **Styling issues**: Check for CSS conflicts or missing styles
- **JavaScript errors**: Check the browser console for errors
- **Missing data**: Ensure you're handling all properties from the PreviewData object

---

By following this guide, you should be able to create and integrate new templates into the Meme Coin Website Generator project. Happy templating!
