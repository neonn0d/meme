import { PreviewData } from "@/types";

export const generateMinimalCSS = (data: PreviewData): string => {
  const { primaryColor, secondaryColor } = data;
  
  return `
/* Reset & Base Styles */
*, *::before, *::after {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

:root {
    /* Colors */
    --color-background: #ffffff;
    --color-text: #1a1a1a;
    --color-text-secondary: #666666;
    --color-border: #e5e5e5;
    --color-primary: ${primaryColor || '#000000'};
    --color-secondary: ${secondaryColor || '#f5f5f5'};
    --color-hover: #f8f8f8;
    
    /* Typography */
    --font-primary: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
    --font-size-xs: 0.75rem;
    --font-size-sm: 0.875rem;
    --font-size-base: 1rem;
    --font-size-lg: 1.125rem;
    --font-size-xl: 1.25rem;
    --font-size-2xl: 1.5rem;
    --font-size-3xl: 2rem;
    --font-size-4xl: 2.5rem;
    
    /* Spacing */
    --spacing-xs: 0.5rem;
    --spacing-sm: 0.75rem;
    --spacing-base: 1rem;
    --spacing-lg: 1.5rem;
    --spacing-xl: 2rem;
    --spacing-2xl: 3rem;
    --spacing-3xl: 4rem;
    
    /* Borders */
    --border-radius-sm: 0.25rem;
    --border-radius-base: 0.5rem;
    --border-radius-lg: 0.75rem;
    --border-radius-xl: 1rem;
}

html {
    font-family: var(--font-primary);
    font-size: 16px;
    line-height: 1.5;
    color: var(--color-text);
    background-color: var(--color-background);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    scroll-behavior: smooth;
}

body {
    min-height: 100vh;
}

img {
    max-width: 100%;
    height: auto;
}

a {
    color: inherit;
    text-decoration: none;
    transition: color 0.2s ease;
}

h2 {
    font-size: var(--font-size-3xl);
    font-weight: 700;
    margin-bottom: var(--spacing-2xl);
    text-align: center;
    color: var(--color-text);
}

/* Layout */
.container {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 var(--spacing-base);
}

.section {
    padding: var(--spacing-3xl) 0;
    background-color: var(--color-background);
}

/* Navigation */
.nav {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 80px;
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border-bottom: 1px solid var(--color-border);
    z-index: 1000;
}

.nav-content {
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.nav-brand {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
}

.nav-brand img {
    height: 40px;
    width: auto;
}

.nav-symbol {
    font-weight: 600;
    font-size: var(--font-size-lg);
    color: var(--color-text);
}

.nav-links {
    display: flex;
    align-items: center;
    gap: var(--spacing-lg);
}

.nav-links a {
    font-size: var(--font-size-sm);
    font-weight: 500;
    color: var(--color-text);
}

.nav-links a:hover {
    color: var(--color-primary);
}

/* Mobile Navigation */
.mobile-menu-button {
    display: none;
    background: none;
    border: none;
    cursor: pointer;
    padding: var(--spacing-xs);
    z-index: 1000;
}

.mobile-menu-button span {
    display: block;
    width: 24px;
    height: 2px;
    background: var(--color-text);
    margin: 5px 0;
    transition: 0.4s;
}

.mobile-menu-button.is-active span:nth-child(1) {
    transform: rotate(-45deg) translate(-5px, 6px);
}

.mobile-menu-button.is-active span:nth-child(2) {
    opacity: 0;
}

.mobile-menu-button.is-active span:nth-child(3) {
    transform: rotate(45deg) translate(-5px, -6px);
}

.mobile-nav {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    background: var(--color-background);
    z-index: 999;
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.3s ease, visibility 0.3s ease;
}

.mobile-nav.is-active {
    opacity: 1;
    visibility: visible;
}

.mobile-nav-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    padding: var(--spacing-2xl) var(--spacing-base);
    gap: var(--spacing-xl);
}

.mobile-nav-content a {
    font-size: var(--font-size-xl);
    text-decoration: none;
    color: var(--color-text);
    transition: color 0.2s ease;
}

.mobile-nav-content a:hover {
    color: var(--color-primary);
}

.mobile-nav-content .mobile-buy {
    margin-top: var(--spacing-lg);
    font-size: var(--font-size-lg);
    padding: var(--spacing-base) var(--spacing-xl);
}

/* Hero Section */
.hero {
    padding: calc(80px + var(--spacing-3xl)) 0 var(--spacing-3xl);
    text-align: center;
}

@media (max-width: 768px) {
    .hero {
        padding: calc(80px + var(--spacing-xl)) 0 var(--spacing-2xl);
    }
    
    .hero h1 {
        font-size: var(--font-size-3xl);
        padding: 0 var(--spacing-base);
    }
    
    .hero-description {
        font-size: var(--font-size-lg);
        padding: 0 var(--spacing-lg);
        margin-bottom: var(--spacing-xl);
    }
}
.hero-logo {
    max-height: 350px;
    width: auto;
    margin-bottom: var(--spacing-2xl);
    filter: drop-shadow(0 0 10px rgba(0, 0, 0, 0.1));
}

.hero h1 {
    font-size: var(--font-size-4xl);
    font-weight: 700;
    margin-bottom: var(--spacing-base);
    letter-spacing: -0.02em;
    color: var(--color-text);
}

.hero-description {
    font-size: var(--font-size-xl);
    color: var(--color-text-secondary);
    max-width: 600px;
    margin: 0 auto var(--spacing-2xl);
}

.hero-actions {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-base);
    margin-bottom: var(--spacing-2xl);
}

/* Buttons */
.button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: var(--spacing-sm) var(--spacing-lg);
    border-radius: var(--border-radius-base);
    font-weight: 500;
    transition: all 0.2s ease;
    border: 1px solid transparent;
}

.button.primary {
    background-color: var(--color-primary);
    color: white;
}

.button.primary:hover {
    opacity: 0.9;
}

.button.secondary {
    background-color: var(--color-secondary);
    color: white;
    border: 1px solid var(--color-border);
}

.button.secondary:hover {
    opacity: 0.9;
}

/* Contract Address */
.contract-address {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-base);
    padding: var(--spacing-base);
    background-color: var(--color-primary);
    font-size: var(--font-size-sm);
    max-width: 500px;
    margin: var(--spacing-xl) auto;
    border-radius: var(--border-radius-lg);
}

.contract-address p {
    color: white;
    font-size: var(--font-size-sm);
    margin: 0;
    white-space: nowrap;
}

.contract-address code {
    font-family: monospace;
    color: white;
    font-size: var(--font-size-sm);
    background: rgba(255, 255, 255, 0.1);
    padding: var(--spacing-sm);
    border-radius: var(--border-radius-base);
    text-align: center;
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.copy-button {
    background: var(--color-secondary);
    border: none;
    cursor: pointer;
    color: white;
    font-size: var(--font-size-sm);
    padding: var(--spacing-xs) var(--spacing-lg);
    border-radius: var(--border-radius-base);
    transition: opacity 0.2s ease;
    white-space: nowrap;
}

.copy-button:hover {
    opacity: 0.9;
}

@media (max-width: 768px) {
    .contract-address {
        flex-direction: column;
        padding: var(--spacing-lg) var(--spacing-base);
        max-width: 100%;
        margin: var(--spacing-lg) 0;
    }
    
    .contract-address code {
        font-size: var(--font-size-xs);
        padding: var(--spacing-sm);
        width: 100%;
        white-space: normal;
        word-break: break-all;
    }
}

/* Tokenomics */
.tokenomics-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: var(--spacing-lg);
    margin-top: var(--spacing-2xl);
}

.tokenomics-item {
    padding: var(--spacing-xl);
    background-color: var(--color-secondary);
    border-radius: var(--border-radius-lg);
    text-align: center;
    transition: transform 0.2s ease;
    color: white;
}

.tokenomics-item:hover {
    transform: translateY(-4px);
}

.tokenomics-item h3 {
    font-size: var(--font-size-sm);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: var(--spacing-sm);
    color: rgba(255, 255, 255, 0.9);
}

.tokenomics-value {
    font-size: var(--font-size-2xl);
    font-weight: 700;
}

/* Roadmap */
.roadmap-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: var(--spacing-lg);
    margin-top: var(--spacing-2xl);
}

.roadmap-item {
    padding: var(--spacing-xl);
    background-color: var(--color-primary);
    border-radius: var(--border-radius-lg);
    position: relative;
    color: white;
}

.roadmap-item h3 {
    font-size: var(--font-size-xl);
    margin-bottom: var(--spacing-base);
    color: white;
}

.roadmap-item p {
    color: rgba(255, 255, 255, 0.9);
    line-height: 1.6;
}

.phase-date {
    margin-top: var(--spacing-base);
    font-size: var(--font-size-sm);
    color: rgba(255, 255, 255, 0.7);
}

/* Team */
.team-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: var(--spacing-xl);
    margin-top: var(--spacing-2xl);
}

.team-member {
    text-align: center;
    padding: var(--spacing-lg);
    background-color: var(--color-secondary);
    border-radius: var(--border-radius-lg);
    color: white;
}

.member-avatar {
    width: 120px;
    height: 120px;
    margin: 0 auto var(--spacing-base);
    border-radius: 50%;
    overflow: hidden;
    border: 3px solid white;
}

.member-avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.team-member h3 {
    font-size: var(--font-size-lg);
    margin-bottom: var(--spacing-xs);
    color: white;
}

.team-member p {
    color: rgba(255, 255, 255, 0.9);
    font-size: var(--font-size-sm);
}

/* FAQ */
.faq-grid {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-lg);
    margin-top: var(--spacing-2xl);
    width: 100%;
    padding: 0;
}

.faq-item {
    width: 100%;
    padding: var(--spacing-xl) var(--spacing-2xl);
    background-color: var(--color-secondary);
    border-radius: var(--border-radius-lg);
    color: white;
}

.faq-item h3 {
    font-size: var(--font-size-xl);
    font-weight: 600;
    margin-bottom: var(--spacing-lg);
    color: white;
}

.faq-item p {
    color: rgba(255, 255, 255, 0.9);
    font-size: var(--font-size-base);
    line-height: 1.6;
}

@media (max-width: 768px) {
    .faq-grid {
        padding: 0 var(--spacing-base);
    }
    
    .faq-item {
        padding: var(--spacing-lg);
    }
    
    .faq-item h3 {
        font-size: var(--font-size-lg);
        margin-bottom: var(--spacing-base);
    }
}

/* Social Links */
.social-grid {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: var(--spacing-xl);
    margin-top: var(--spacing-2xl);
}

.social-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--spacing-base);
    padding: var(--spacing-xl);
    background-color: var(--color-primary);
    border-radius: var(--border-radius-lg);
    width: 200px;
    transition: transform 0.2s ease;
    color: white;
}

.social-item:hover {
    transform: translateY(-4px);
}

.social-icon {
    font-size: 2rem;
    color: white;
}

.social-name {
    font-weight: 600;
    color: white;
}

/* Footer */
.footer {
    padding: var(--spacing-2xl) 0;
    border-top: 1px solid var(--color-border);
    margin-top: var(--spacing-3xl);
    background-color: var(--color-background);
    color: var(--color-text);
}

.footer-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.footer-brand {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
}

.footer-brand img {
    height: 32px;
    width: auto;
}

.footer-symbol {
    font-weight: 600;
    color: var(--color-text);
}

.footer-links {
    display: flex;
    gap: var(--spacing-lg);
}

.footer-links a {
    color: var(--color-text-secondary);
    font-size: var(--font-size-sm);
}

.footer-links a:hover {
    color: var(--color-primary);
}

@media (max-width: 768px) {
    .nav-links {
        display: none;
    }
    
    .mobile-menu-button {
        display: block;
    }
    
    .mobile-nav {
        display: block;
    }
    
    .footer-content {
        flex-direction: column;
        gap: var(--spacing-lg);
        text-align: center;
    }
    
    .footer-links {
        flex-wrap: wrap;
        justify-content: center;
    }
    
    .hero-actions {
        flex-direction: column;
        gap: var(--spacing-base);
    }
    
    .button {
        width: 100%;
    }
}

/* Copied Alert */
.copied-alert {
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    background-color: var(--color-primary);
    color: white;
    padding: var(--spacing-base) var(--spacing-xl);
    border-radius: var(--border-radius-base);
    font-size: var(--font-size-sm);
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.3s ease, visibility 0.3s ease;
    z-index: 9999;
}

.copied-alert.is-active {
    opacity: 1;
    visibility: visible;
}
`
}
