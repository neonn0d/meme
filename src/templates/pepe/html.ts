import { PreviewData } from '@/types';
import { generatePepeJS } from './js';

export const generatePepeHTML = ({
    coinName,
    tokenSymbol,
    description,
    logoUrl,
    contractAddress,
    buyLink,
    roadmap = { phases: [] },
    team = [],
    socialLinks = {},
    tokenomics = {},
    faq = [],
    seo = {},
    sections = {}
}: any): string => {
    return `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${seo.title || `${coinName} - The Rarest Pepe Token`}</title>
        <meta name="description" content="${seo.description || description}">
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap" rel="stylesheet">
        <link href="https://fonts.googleapis.com/css2?family=Comic+Neue:wght@400;700&display=swap" rel="stylesheet">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
        <link rel="stylesheet" href="styles.css">
    </head>
    <body>
        <nav class="navbar">
            <div class="container">
                <div class="nav-content">
                    <a href="#" class="nav-logo">
                        <img src="${logoUrl}" alt="${tokenSymbol} Logo" class="nav-logo-img">
                        <span class="nav-logo-text">${tokenSymbol}</span>
                    </a>
                    <input type="checkbox" id="nav-toggle" class="nav-toggle">
                    <label for="nav-toggle" class="nav-toggle-label">
                        <span></span>
                        <span></span>
                        <span></span>
                    </label>
                    <div class="nav-menu">
                        <div class="nav-links">
                            <a href="#tokenomics">Tokenomics</a>
                            <a href="#roadmap">Roadmap</a>
                            <a href="#team">Team</a>
                            <a href="#faq">FAQ</a>
                            <a href="#community">Community</a>
                        </div>
                        <a href="${buyLink}" class="nav-button">Buy $${tokenSymbol}</a>
                    </div>
                </div>
            </div>
        </nav>

        <section class="hero">
            <div class="container">
                <div class="hero-content">
                    <div class="hero-left">
                        <div class="hero-logo-wrapper">
                            <img src="${logoUrl}" alt="${coinName} Logo" class="hero-logo animate-bounce">
                            <div class="hero-sparkles"></div>
                        </div>
                        <h1 class="hero-title">${coinName}</h1>
                        <p class="hero-description">${description}</p>
                        <div class="hero-buttons">
                            <a href="${buyLink}" target="_blank" class="button">Buy $${tokenSymbol} 🚀</a>
                            <a href="#" class="button outline contract-link" data-contract="${contractAddress}">
                                <span class="contract-text">${contractAddress}</span>
                            </a>
                        </div>
                    </div>
                    <div class="hero-right">
                        <div class="pepe-animation-container">
                            <div class="floating-pepes">
                                <div class="pepe pepe-1">🐸</div>
                                <div class="pepe pepe-2">🚀</div>
                                <div class="pepe pepe-3">💎</div>
                                <div class="pepe pepe-4">🌙</div>
                            </div>
                            <div class="hero-circles">
                                <div class="circle circle-1"></div>
                                <div class="circle circle-2"></div>
                                <div class="circle circle-3"></div>
                            </div>
                            <div class="hero-grid">
                                <div class="grid-line horizontal"></div>
                                <div class="grid-line horizontal"></div>
                                <div class="grid-line vertical"></div>
                                <div class="grid-line vertical"></div>
                            </div>
                            <div class="floating-elements">
                                <div class="element element-1">⭐️</div>
                                <div class="element element-2">✨</div>
                                <div class="element element-3">💫</div>
                                <div class="element element-4">⚡️</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="hero-background"></div>
        </section>

        ${sections.tokenomics ? `
        <section id="tokenomics" class="tokenomics-section">
            <div class="container">
                <div class="section-header">
                    <h2>Tokenomics</h2>
                    <p class="section-subtitle">Our token metrics and distribution 🐸</p>
                </div>
                <div class="tokenomics-cards">
                    <div class="tokenomics-card supply">
                        <div class="card-icon">
                            <span>🚀</span>
                        </div>
                        <div class="card-content">
                            <h3>Total Supply</h3>
                            <div class="card-value">${Number(tokenomics.totalSupply).toLocaleString()}</div>
                        </div>
                    </div>
                    <div class="tokenomics-card buy">
                        <div class="card-icon">
                            <span>💰</span>
                        </div>
                        <div class="card-content">
                            <h3>Buy Tax</h3>
                            <div class="card-value">${tokenomics.taxBuy}%</div>
                        </div>
                    </div>
                    <div class="tokenomics-card sell">
                        <div class="card-icon">
                            <span>💎</span>
                        </div>
                        <div class="card-content">
                            <h3>Sell Tax</h3>
                            <div class="card-value">${tokenomics.taxSell}%</div>
                        </div>
                    </div>
                    <div class="tokenomics-card lock">
                        <div class="card-icon">
                            <span>🔒</span>
                        </div>
                        <div class="card-content">
                            <h3>LP Lock Time</h3>
                            <div class="card-value">${tokenomics.lpLocked}</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        ` : ''}

        ${sections.roadmap ? `
        <section id="roadmap">
            <div class="container">
                <h2>Roadmap 🗺️</h2>
                <div class="roadmap-list">
                    ${roadmap.phases.map((phase: any, index: number) => `
                        <div class="roadmap-item">
                            <div class="phase-number">Phase ${index + 1}</div>
                            <h3>${phase.title}</h3>
                            <p>${phase.description}</p>
                        </div>
                    `).join('')}
                </div>
            </div>
        </section>
        ` : ''}

        ${sections.team ? `
        <section id="team">
            <div class="container">
                <h2>Meet the ${tokenSymbol} Team 👥</h2>
                <div class="team-grid">
                    ${team.map((member: any) => `
                        <div class="team-card">
                            <img src="${member.avatar}" alt="${member.name}">
                            <h3>${member.name}</h3>
                            <p>${member.role}</p>
                            ${member.social ? `
                                <div class="social-links">
                                    ${member.social.twitter ? `<a href="${member.social.twitter}" target="_blank"><i class="fab fa-twitter"></i></a>` : ''}
                                    ${member.social.telegram ? `<a href="${member.social.telegram}" target="_blank"><i class="fab fa-telegram"></i></a>` : ''}
                                </div>
                            ` : ''}
                        </div>
                    `).join('')}
                </div>
            </div>
        </section>
        ` : ''}

        ${sections.faq ? `
        <section id="faq">
            <div class="container">
                <h2>Frequently Asked Questions ❓</h2>
                <div class="faq-grid">
                    ${faq.map((item: any, index: number) => `
                        <div class="faq-item active">
                            <div class="faq-question">
                                <h3>${item.question}</h3>
                            </div>
                            <div class="faq-answer">
                                <p>${item.answer}</p>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </section>
        ` : ''}

        <section id="community" class="section community-section">
            <div class="container">
                <div class="section-header">
                    <h2>Join Our Community</h2>
                    <p>Be part of the ${tokenSymbol} revolution!</p>
                </div>
                <div class="community-buttons">
                    ${socialLinks.telegram ? `
                    <a href="${socialLinks.telegram}" target="_blank" class="community-button telegram">
                        <span class="button-icon">
                            <i class="fab fa-telegram-plane"></i>
                        </span>
                        <span class="button-text">Join Telegram</span>
                    </a>` : ''}
                    ${socialLinks.twitter ? `
                    <a href="${socialLinks.twitter}" target="_blank" class="community-button twitter">
                        <span class="button-icon">
                            <i class="fab fa-twitter"></i>
                        </span>
                        <span class="button-text">Follow Twitter</span>
                    </a>` : ''}
                    ${socialLinks.discord ? `
                    <a href="${socialLinks.discord}" target="_blank" class="community-button discord">
                        <span class="button-icon">
                            <i class="fab fa-discord"></i>
                        </span>
                        <span class="button-text">Join Discord</span>
                    </a>` : ''}
                </div>
            </div>
        </section>

        <footer class="footer">
            <div class="container">
                <div class="footer-content">
                    <span>${coinName}</span>
                    ${buyLink ? `<a href="${buyLink}" target="_blank">Buy ${tokenSymbol}</a>` : ''}
                </div>
            </div>
        </footer>

        <script>
            ${generatePepeJS()}
        </script>
    </body>
    </html>`;
}