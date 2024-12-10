import { PreviewData } from '@/types';

export interface TeamMember {
    name: string;
    role: string;
    avatar?: string;
}

export interface FAQ {
    question: string;
    answer: string;
}

export interface Tokenomics {
    totalSupply: string;
    taxBuy: number;
    taxSell: number;
    lpLocked: string;
}

export interface RoadmapPhase {
    title: string;
    description: string;
    date?: string;
}

export interface Roadmap {
    phases: RoadmapPhase[];
}

export interface SocialLinks {
    telegram?: string;
    twitter?: string;
    discord?: string;
}

export interface SEO {
    title: string;
    description: string;
    keywords: string;
    ogImage: string;
}

export const generateMinimalHTML = (data: PreviewData): string => {
    const {
        coinName,
        tokenSymbol,
        description,
        logoUrl,
        contractAddress,
        buyLink,
        socialLinks = {
            telegram: '',
            twitter: '',
            discord: ''
        },
        tokenomics,
        roadmap,
        team,
        faq = [],
        seo = {
            title: `${coinName} (${tokenSymbol})`,
            description: description,
            keywords: `${coinName}, ${tokenSymbol}, cryptocurrency, token`,
            ogImage: logoUrl || ''
        }
    } = data;

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${seo.title}</title>
    
    <!-- Primary Meta Tags -->
    <meta name="title" content="${seo.title}">
    <meta name="description" content="${seo.description}">
    <meta name="keywords" content="${seo.keywords}">
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website">
    <meta property="og:title" content="${seo.title}">
    <meta property="og:description" content="${seo.description}">
    <meta property="og:image" content="${seo.ogImage}">
    
    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image">
    <meta property="twitter:title" content="${seo.title}">
    <meta property="twitter:description" content="${seo.description}">
    <meta property="twitter:image" content="${seo.ogImage}">
    
    <!-- Favicon -->
    ${logoUrl ? `<link rel="icon" type="image/png" href="${logoUrl}">` : ''}
    
    <!-- Styles -->
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <!-- Navigation -->
    <nav class="nav">
        <div class="container">
            <div class="nav-content">
                <a href="#" class="nav-brand">
                    ${logoUrl ? `<img src="${logoUrl}" alt="${coinName} logo">` : ''}
                    <span class="nav-symbol">${tokenSymbol}</span>
                </a>
                <button class="mobile-menu-button" aria-label="Toggle menu">
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
                <div class="nav-links">
                    ${tokenomics ? '<a href="#tokenomics">Tokenomics</a>' : ''}
                    ${roadmap ? '<a href="#roadmap">Roadmap</a>' : ''}
                    ${team ? '<a href="#team">Team</a>' : ''}
                    ${faq.length > 0 ? '<a href="#faq">FAQ</a>' : ''}
                    ${(socialLinks.telegram || socialLinks.twitter || socialLinks.discord) ? '<a href="#socials">Join Community</a>' : ''}
                    ${buyLink ? `<a href="${buyLink}" target="_blank" rel="noopener" class="button primary">Buy ${tokenSymbol}</a>` : ''}
                </div>
            </div>
        </div>
    </nav>

    <!-- Mobile Navigation Overlay -->
    <div class="mobile-nav">
        <div class="mobile-nav-content">
            ${tokenomics ? '<a href="#tokenomics">Tokenomics</a>' : ''}
            ${roadmap ? '<a href="#roadmap">Roadmap</a>' : ''}
            ${team ? '<a href="#team">Team</a>' : ''}
            ${faq.length > 0 ? '<a href="#faq">FAQ</a>' : ''}
            ${(socialLinks.telegram || socialLinks.twitter || socialLinks.discord) ? '<a href="#socials">Join Community</a>' : ''}
            ${buyLink ? `<a href="${buyLink}" target="_blank" rel="noopener" class="button primary mobile-buy">Buy ${tokenSymbol}</a>` : ''}
        </div>
    </div>

    <!-- Hero -->
    <section class="hero">
        <div class="container">
            <img src="${logoUrl}" class="hero-logo" alt="${coinName} logo">
            <h1>${coinName}</h1>
            <p class="hero-description">${description}</p>
            <div class="hero-actions">
                ${buyLink ? `
                <a href="${buyLink}" target="_blank" rel="noopener" class="button primary">Buy ${tokenSymbol}</a>
                ` : ''}
                ${(socialLinks.telegram || socialLinks.twitter || socialLinks.discord) ? `
                <a href="#socials" class="button secondary">
                    Join Community
                </a>
                ` : ''}
            </div>
            ${contractAddress ? `
            <div class="contract-address">
                <p>Contract:</p>
                <code>${contractAddress}</code>
                <button class="copy-button" onclick="copyToClipboard('${contractAddress}')">Copy</button>
            </div>
            ` : ''}
        </div>
    </section>

    <!-- Tokenomics -->
    ${tokenomics ? `
    <section id="tokenomics" class="section">
        <div class="container">
            <h2>Tokenomics</h2>
            <div class="tokenomics-grid">
                <div class="tokenomics-item">
                    <h3>Total Supply</h3>
                    <div class="tokenomics-value">${tokenomics.totalSupply}</div>
                </div>
                <div class="tokenomics-item">
                    <h3>Buy Tax</h3>
                    <div class="tokenomics-value">${tokenomics.taxBuy}%</div>
                </div>
                <div class="tokenomics-item">
                    <h3>Sell Tax</h3>
                    <div class="tokenomics-value">${tokenomics.taxSell}%</div>
                </div>
                <div class="tokenomics-item">
                    <h3>LP Locked</h3>
                    <div class="tokenomics-value">${tokenomics.lpLocked}</div>
                </div>
            </div>
        </div>
    </section>
    ` : ''}

    <!-- Roadmap -->
    ${roadmap?.phases?.length ? `
    <section id="roadmap" class="section">
        <div class="container">
            <h2>Roadmap</h2>
            <div class="roadmap-grid">
                ${roadmap.phases.map((phase, index) => `
                <div class="roadmap-item">
                    <div class="phase-marker">Phase ${index + 1}</div>
                    <h3>${phase.title}</h3>
                    <p>${phase.description}</p>
                    ${phase.date ? `<div class="phase-date">${phase.date}</div>` : ''}
                </div>
                `).join('')}
            </div>
        </div>
    </section>
    ` : ''}

    <!-- Team -->
    ${team?.length ? `
    <section id="team" class="section">
        <div class="container">
            <div class="team-grid">
                ${team.map(member => `
                <div class="team-member">
                    ${member.avatar ? `
                    <div class="member-avatar">
                        <img src="${member.avatar}" alt="${member.name}">
                    </div>
                    ` : ''}
                    <h3>${member.name}</h3>
                    <p>${member.role}</p>
                </div>
                `).join('')}
            </div>
        </div>
    </section>
    ` : ''}

    <!-- FAQ -->
    ${faq.length ? `
    <section id="faq" class="section">
        <div class="container">
            <h2>FAQ</h2>
            <div class="faq-grid">
                ${faq.map(item => `
                <div class="faq-item">
                    <h3>${item.question}</h3>
                    <p>${item.answer}</p>
                </div>
                `).join('')}
            </div>
        </div>
    </section>
    ` : ''}

    <!-- Socials -->
    ${(socialLinks.telegram || socialLinks.twitter || socialLinks.discord) ? `
    <section id="socials" class="section">
        <div class="container">
            <h2>Join Our Community</h2>
            <div class="socials-grid">
                ${socialLinks.telegram ? `
                <a href="${socialLinks.telegram}" target="_blank" rel="noopener" class="social-item">
                    <div class="social-icon telegram"></div>
                    <h3>Telegram</h3>
                    <p>Join our Telegram community</p>
                </a>
                ` : ''}
                ${socialLinks.twitter ? `
                <a href="${socialLinks.twitter}" target="_blank" rel="noopener" class="social-item">
                    <div class="social-icon twitter"></div>
                    <h3>Twitter</h3>
                    <p>Follow us on Twitter</p>
                </a>
                ` : ''}
                ${socialLinks.discord ? `
                <a href="${socialLinks.discord}" target="_blank" rel="noopener" class="social-item">
                    <div class="social-icon discord"></div>
                    <h3>Discord</h3>
                    <p>Join our Discord server</p>
                </a>
                ` : ''}
            </div>
        </div>
    </section>
    ` : ''}

    <!-- Footer -->
    <footer class="footer">
        <div class="container">
            <div class="footer-content">
                <div class="footer-brand">
                    ${logoUrl ? `<img src="${logoUrl}" alt="${coinName} logo">` : ''}
                    <span class="footer-symbol">${tokenSymbol}</span>
                </div>
                <div class="footer-links">
                    ${socialLinks.telegram ? `<a href="${socialLinks.telegram}" target="_blank" rel="noopener">Telegram</a>` : ''}
                    ${socialLinks.twitter ? `<a href="${socialLinks.twitter}" target="_blank" rel="noopener">Twitter</a>` : ''}
                    ${socialLinks.discord ? `<a href="${socialLinks.discord}" target="_blank" rel="noopener">Discord</a>` : ''}
                </div>
            </div>
        </div>
    </footer>

    <script>
        // Copy to clipboard function
        function copyToClipboard(text) {
            navigator.clipboard.writeText(text).then(() => {
                const button = document.querySelector('.copy-button');
                button.textContent = 'Copied!';
                setTimeout(() => {
                    button.textContent = 'Copy';
                }, 2000);
            });
        }

        // Mobile menu functionality
        document.addEventListener('DOMContentLoaded', function() {
            const menuButton = document.querySelector('.mobile-menu-button');
            const mobileNav = document.querySelector('.mobile-nav');
            const body = document.body;
            let isOpen = false;

            menuButton?.addEventListener('click', () => {
                isOpen = !isOpen;
                menuButton.classList.toggle('is-active', isOpen);
                mobileNav?.classList.toggle('is-active', isOpen);
                body.style.overflow = isOpen ? 'hidden' : '';
            });

            // Close mobile menu when clicking on links
            const mobileLinks = document.querySelectorAll('.mobile-nav a');
            mobileLinks.forEach(link => {
                link.addEventListener('click', () => {
                    isOpen = false;
                    menuButton?.classList.remove('is-active');
                    mobileNav?.classList.remove('is-active');
                    body.style.overflow = '';
                });
            });
        });
    </script>
</body>
</html>`;
};
