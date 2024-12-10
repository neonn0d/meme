import { PreviewData } from '@/types';

export const generateChristmasHTML = ({
  coinName,
  tokenSymbol,
  description,
  logoUrl,
  contractAddress,
  buyLink,
  socialLinks = {},
  tokenomics = {},
  roadmap = { phases: [] },
  team = [],
  faq = [],
  sections = {},
  seo = {},
}: any): string => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${seo.title || `${coinName} ($${tokenSymbol}) - The Most Festive Token of the Season!`}</title>
    
    <!-- Meta Tags -->
    <meta name="description" content="${seo.description || description}">
    <meta name="keywords" content="${seo.keywords}">
    
    <!-- Open Graph -->
    <meta property="og:title" content="${seo.title || `${coinName} ($${tokenSymbol})`}">
    <meta property="og:description" content="${seo.description || description}">
    <meta property="og:image" content="${seo.ogImage || logoUrl}">
    
    <!-- Favicon -->
    <link rel="icon" href="${logoUrl}" type="image/x-icon">
    
    <!-- Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Mountains+of+Christmas:wght@400;700&family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet">
    
    <!-- Styles -->
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div id="snow-container"></div>
    <div class="christmas-lights"></div>
    
    <!-- Navigation -->
    <nav>
        <div class="container nav-content">
            <a href="#" class="nav-logo">
                <img src="${logoUrl}" alt="${coinName} logo" class="logo-glow">
                <span class="christmas-text">${tokenSymbol}</span>
            </a>
            <button class="hamburger">
                <span class="bar"></span>
                <span class="bar"></span>
                <span class="bar"></span>
            </button>
            <div class="nav-links">
                ${sections.tokenomics ? '<a href="#tokenomics" class="nav-link"><span class="holly">🎄</span>Tokenomics</a>' : ''}
                ${sections.roadmap ? '<a href="#roadmap" class="nav-link"><span class="holly">🎄</span>Roadmap</a>' : ''}
                ${sections.team ? '<a href="#team" class="nav-link"><span class="holly">🎄</span>Team</a>' : ''}
                ${sections.faq ? '<a href="#faq" class="nav-link"><span class="holly">🎄</span>FAQ</a>' : ''}
                ${buyLink ? `<a href="${buyLink}" target="_blank" rel="noopener" class="christmas-btn glow-btn">Buy ${tokenSymbol}</a>` : ''}
            </div>
        </div>
    </nav>

    <!-- Hero Section -->
    ${sections.hero ? `
    <section class="hero">
        <div class="snow-overlay"></div>
        <div class="container">
            <div class="hero-content">
                <div class="christmas-decoration top"></div>
                <img src="${logoUrl}" alt="${coinName}" class="hero-logo animate-float logo-glow">
                <h1 class="christmas-title">${coinName}</h1>
                <p class="hero-description">${description}</p>
                <div class="hero-buttons">
                    ${buyLink ? `
                    <a href="${buyLink}" target="_blank" rel="noopener" class="christmas-btn glow-btn">
                        <span class="btn-icon">🎁</span>Buy ${tokenSymbol}
                    </a>
                    ` : ''}
                    ${socialLinks.telegram ? `
                    <a href="${socialLinks.telegram}" target="_blank" rel="noopener" class="christmas-btn secondary">
                        <span class="btn-icon">🎄</span>Join Community
                    </a>
                    ` : ''}
                </div>
                ${contractAddress ? `
                <div class="contract-box gift-box">
                    <div class="gift-top"></div>
                    <div class="gift-body">
                        <p>Contract Address:</p>
                        <div class="contract-content">
                            <code>${contractAddress}</code>
                            <button onclick="copyToClipboard('${contractAddress}')" class="copy-btn">
                                <span class="btn-icon">📋</span>Copy
                            </button>
                        </div>
                    </div>
                    <div class="gift-ribbon"></div>
                </div>
                ` : ''}
                <div class="christmas-decoration bottom"></div>
            </div>
        </div>
    </section>
    ` : ''}

    ${sections.tokenomics ? `
    <section id="tokenomics">
        <div class="container">
            <h2>
                <span class="christmas-icon">🎁</span>
                Tokenomics
                <span class="christmas-icon">🎁</span>
            </h2>
            <div class="tokenomics-grid">
                <div class="tokenomics-card gift-box">
                    <div class="gift-top"></div>
                    <div class="gift-body">
                        <h3>Total Supply</h3>
                        <p>${Number(tokenomics.totalSupply).toLocaleString()}</p>
                    </div>
                    <div class="gift-ribbon"></div>
                </div>
                <div class="tokenomics-card gift-box">
                    <div class="gift-top"></div>
                    <div class="gift-body">
                        <h3>Buy Tax</h3>
                        <p>${tokenomics.taxBuy}%</p>
                    </div>
                    <div class="gift-ribbon"></div>
                </div>
                <div class="tokenomics-card gift-box">
                    <div class="gift-top"></div>
                    <div class="gift-body">
                        <h3>Sell Tax</h3>
                        <p>${tokenomics.taxSell}%</p>
                    </div>
                    <div class="gift-ribbon"></div>
                </div>
                <div class="tokenomics-card gift-box">
                    <div class="gift-top"></div>
                    <div class="gift-body">
                        <h3>LP Locked</h3>
                        <p>${tokenomics.lpLocked}</p>
                    </div>
                    <div class="gift-ribbon"></div>
                </div>
            </div>
        </div>
    </section>
    ` : ''}

    ${sections.roadmap ? `
    <section id="roadmap">
        <div class="container">
            <h2>
                <span class="christmas-icon">🎄</span>
                Roadmap
                <span class="christmas-icon">🎄</span>
            </h2>
            <div class="roadmap-grid">
                ${roadmap.phases.map((phase: any, index: number) => `
                <div class="roadmap-card gift-box">
                    <div class="gift-top"></div>
                    <div class="gift-body">
                        <h3>${phase.title}</h3>
                        <p>${phase.description}</p>
                        <span class="date">${phase.date}</span>
                    </div>
                    <div class="gift-ribbon"></div>
                </div>
                `).join('')}
            </div>
        </div>
    </section>
    ` : ''}

    ${sections.team ? `
    <section id="team">
        <div class="container">
            <h2>
                <span class="christmas-icon">🎅</span>
                Team
                <span class="christmas-icon">🎅</span>
            </h2>
            <div class="team-grid">
                ${team.map((member: any) => `
                <div class="team-card gift-box">
                    <div class="gift-top"></div>
                    <div class="gift-body">
                        <img src="${member.avatar}" alt="${member.name}" class="team-avatar">
                        <h3>${member.name}</h3>
                        <p>${member.role}</p>
                    </div>
                    <div class="gift-ribbon"></div>
                </div>
                `).join('')}
            </div>
        </div>
    </section>
    ` : ''}

    ${sections.faq && faq.length > 0 ? `
    <section id="faq">
        <div class="container">
            <h2>
                <span class="christmas-icon">❄️</span>
                FAQ
                <span class="christmas-icon">❄️</span>
            </h2>
            <div class="faq-grid">
                ${faq.map((item: any) => `
                <div class="faq-card gift-box">
                    <div class="gift-top"></div>
                    <div class="gift-body">
                        <h3>${item.question}</h3>
                        <p>${item.answer}</p>
                    </div>
                    <div class="gift-ribbon"></div>
                </div>
                `).join('')}
            </div>
        </div>
    </section>
    ` : ''}

    ${sections.community ? `
    <section id="community">
        <div class="container community-section">
            <h2>Join Our Community</h2>
            <p>Be part of our growing community and stay updated with the latest news!</p>
            <div class="social-links">
                ${socialLinks.telegram ? `
                <a href="${socialLinks.telegram}" target="_blank" rel="noopener" class="social-link">
                    🎄 Telegram
                </a>
                ` : ''}
                ${socialLinks.twitter ? `
                <a href="${socialLinks.twitter}" target="_blank" rel="noopener" class="social-link">
                    🎄 Twitter
                </a>
                ` : ''}
                ${socialLinks.discord ? `
                <a href="${socialLinks.discord}" target="_blank" rel="noopener" class="social-link">
                    🎄 Discord
                </a>
                ` : ''}
            </div>
        </div>
    </section>
    ` : ''}

    <footer>
        <div class="container">
            <div class="footer-content">
                <div class="footer-logo">
                    <img src="${logoUrl}" alt="${coinName} logo">
                    <span class="christmas-text">${tokenSymbol}</span>
                </div>
                <div class="footer-links">
                    ${sections.tokenomics ? '<a href="#tokenomics" class="footer-link">Tokenomics</a>' : ''}
                    ${sections.roadmap ? '<a href="#roadmap" class="footer-link">Roadmap</a>' : ''}
                    ${sections.team ? '<a href="#team" class="footer-link">Team</a>' : ''}
                    ${sections.faq ? '<a href="#faq" class="footer-link">FAQ</a>' : ''}
                </div>
            </div>
            <div class="footer-bottom">
                <p>&copy; ${new Date().getFullYear()} ${coinName}. All rights reserved.</p>
            </div>
        </div>
    </footer>

    <script>
        function copyToClipboard(text) {
            navigator.clipboard.writeText(text).then(() => {
                alert('Contract address copied!');
            });
        }
    </script>
</body>
</html>`
};
