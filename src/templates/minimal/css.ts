import { PreviewData } from '@/types';

export const generateMinimalCSS = (_data: PreviewData): string => {
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
    --color-primary: #000000;
    --color-secondary: #f5f5f5;
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

/* Layout */
.container {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 var(--spacing-base);
}

.section {
    padding: var(--spacing-3xl) 0;
}

/* Navigation */
.nav {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 80px;
    background: rgba(255, 255, 255, 0.8);
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
}

.nav-links {
    display: flex;
    align-items: center;
    gap: var(--spacing-lg);
}

.nav-links a {
    font-size: var(--font-size-sm);
    font-weight: 500;
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
    color: var(--color-text-secondary);
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

.hero h1 {
    font-size: var(--font-size-4xl);
    font-weight: 700;
    margin-bottom: var(--spacing-base);
    letter-spacing: -0.02em;
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
    color: var(--color-background);
}

.button.primary:hover {
    opacity: 0.9;
}

.button.secondary {
    background-color: var(--color-secondary);
    color: var(--color-text);
}

.button.secondary:hover {
    background-color: var(--color-hover);
}

/* Contract Address */
.contract-address {
    display: inline-flex;
    align-items: center;
    gap: var(--spacing-sm);
    padding: var(--spacing-sm) var(--spacing-lg);
    background-color: var(--color-secondary);
    border-radius: var(--border-radius-base);
    font-size: var(--font-size-sm);
}

.contract-address code {
    font-family: monospace;
    color: var(--color-text-secondary);
}

.copy-button {
    background: none;
    border: none;
    cursor: pointer;
    color: var(--color-text-secondary);
    font-size: var(--font-size-sm);
    padding: var(--spacing-xs);
    transition: color 0.2s ease;
}

.copy-button:hover {
    color: var(--color-text);
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
}

.tokenomics-item:hover {
    transform: translateY(-4px);
}

.tokenomics-item h3 {
    font-size: var(--font-size-sm);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: var(--spacing-sm);
    color: var(--color-text-secondary);
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
    background-color: var(--color-secondary);
    border-radius: var(--border-radius-lg);
    position: relative;
}

.phase-marker {
    display: inline-block;
    padding: var(--spacing-xs) var(--spacing-sm);
    background-color: var(--color-background);
    border-radius: var(--border-radius-sm);
    font-size: var(--font-size-xs);
    font-weight: 600;
    margin-bottom: var(--spacing-base);
}

.phase-date {
    margin-top: var(--spacing-base);
    font-size: var(--font-size-sm);
    color: var(--color-text-secondary);
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
}

.member-avatar {
    width: 120px;
    height: 120px;
    margin: 0 auto var(--spacing-base);
    border-radius: 50%;
    overflow: hidden;
}

.member-avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.team-member h3 {
    font-size: var(--font-size-lg);
    margin-bottom: var(--spacing-xs);
}

.team-member p {
    color: var(--color-text-secondary);
    font-size: var(--font-size-sm);
}

/* FAQ */
.faq-grid {
    display: grid;
    gap: var(--spacing-lg);
    margin-top: var(--spacing-2xl);
    max-width: 800px;
    margin-left: auto;
    margin-right: auto;
}

.faq-item {
    padding: var(--spacing-xl);
    background-color: var(--color-secondary);
    border-radius: var(--border-radius-lg);
}

.faq-item h3 {
    margin-bottom: var(--spacing-base);
    font-size: var(--font-size-lg);
}

.faq-item p {
    color: var(--color-text-secondary);
}

/* Footer */
.footer {
    padding: var(--spacing-2xl) 0;
    border-top: 1px solid var(--color-border);
    margin-top: var(--spacing-3xl);
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
    color: var(--color-text);
}

/* Section Headers */
h2 {
    font-size: var(--font-size-3xl);
    font-weight: 700;
    text-align: center;
    margin-bottom: var(--spacing-xl);
    letter-spacing: -0.02em;
}

/* Socials Section */
.socials-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: var(--spacing-xl);
    margin-top: var(--spacing-2xl);
}

.social-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: var(--spacing-xl);
    border-radius: var(--border-radius-lg);
    background: var(--color-secondary);
    transition: transform 0.2s ease, background-color 0.2s ease;
    text-decoration: none;
    color: var(--color-text);
}

.social-item:hover {
    transform: translateY(-4px);
    background: var(--color-hover);
}

.social-icon {
    width: 64px;
    height: 64px;
    margin-bottom: var(--spacing-base);
    background-size: contain;
    background-position: center;
    background-repeat: no-repeat;
    transition: transform 0.2s ease;
}

.social-item:hover .social-icon {
    transform: scale(1.1);
}

.social-icon.telegram {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%231a1a1a' d='M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18 1.897-.962 6.502-1.359 8.627-.168.9-.5 1.201-.82 1.23-.697.064-1.226-.461-1.901-.903-1.056-.692-1.653-1.123-2.678-1.799-1.185-.781-.417-1.21.258-1.911.177-.184 3.247-2.977 3.307-3.23.007-.032.015-.15-.056-.212s-.174-.041-.248-.024c-.106.024-1.793 1.139-5.062 3.345-.479.329-.913.489-1.302.481-.428-.009-1.252-.242-1.865-.442-.751-.244-1.349-.374-1.297-.789.027-.216.324-.437.892-.663 3.498-1.524 5.831-2.529 6.998-3.015 3.333-1.386 4.025-1.627 4.477-1.635.099-.002.321.023.465.141.119.098.152.228.166.331.016.122.033.391.019.603z'/%3E%3C/svg%3E");
}

.social-icon.twitter {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%231a1a1a' d='M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z'/%3E%3C/svg%3E");
}

.social-icon.discord {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%231a1a1a' d='M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z'/%3E%3C/svg%3E");
}

.social-item h3 {
    font-size: var(--font-size-lg);
    margin-bottom: var(--spacing-xs);
}

.social-item p {
    font-size: var(--font-size-sm);
    color: var(--color-text-secondary);
}

/* Responsive Design */
@media (max-width: 768px) {
    :root {
        --font-size-4xl: 2rem;
        --font-size-3xl: 1.75rem;
        --font-size-2xl: 1.25rem;
        --spacing-3xl: 3rem;
        --spacing-2xl: 2rem;
    }
    
    .mobile-menu-button {
        display: block;
    }

    .nav-links {
        display: none;
    }

    .mobile-nav {
        display: block;
    }

    .hero-actions {
        flex-direction: column;
        width: 100%;
    }
    
    .button {
        width: 100%;
    }
    
    .footer-content {
        flex-direction: column;
        gap: var(--spacing-xl);
        text-align: center;
    }
    
    .socials-grid {
        grid-template-columns: 1fr;
        gap: var(--spacing-lg);
        padding: 0 var(--spacing-base);
    }
    
    .social-item {
        padding: var(--spacing-lg);
    }
}

@media (max-width: 480px) {
    .contract-address {
        flex-direction: column;
        text-align: center;
        width: 100%;
    }
    
    .tokenomics-grid,
    .roadmap-grid,
    .team-grid {
        grid-template-columns: 1fr;
    }
}
`;
};
