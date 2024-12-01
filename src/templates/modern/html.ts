export const generateModernHTML = ({
  coinName,
  tokenSymbol,
  logoUrl,
  buyLink,
  socialLinks = {},
  tokenomics,
  sections = {},
  roadmap,
  team,
  faq,
  contractAddress,
  description,
  seo,
}: any) => {
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
    <link rel="icon" type="image/png" href="${logoUrl}">
    
    <!-- Styles -->
    <link rel="stylesheet" href="styles.css">
    <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet">
</head>
<body class="space-theme">
    <nav class="nav">
        <div class="container">
            <div class="nav-content">
                ${logoUrl ? `
                <div class="nav-logo">
                    <img src="${logoUrl}" alt="${coinName} logo">
                </div>
                ` : ''}
                ${sections.community ? `
                <div class="nav-links">
                    ${socialLinks.telegram ? `<a href="${socialLinks.telegram}" target="_blank" class="nav-btn">Telegram</a>` : ''}
                    ${socialLinks.twitter ? `<a href="${socialLinks.twitter}" target="_blank" class="nav-btn">Twitter</a>` : ''}
                    ${socialLinks.discord ? `<a href="${socialLinks.discord}" target="_blank" class="nav-btn">Discord</a>` : ''}
                </div>
                ` : ''}
            </div>
        </div>
    </nav>

    <section class="hero">
        <div class="container">
            <div class="hero-grid">
                <div class="hero-left">
                    <h1 class="hero-title">${coinName}</h1>
                    <div class="hero-subtitle">${tokenSymbol}</div>
                    <p class="hero-description">
                        ${description || `Experience the future of decentralized finance with ${coinName}. Join our growing community and be part of the next generation of crypto.`}
                    </p>
                    
                    ${contractAddress ? `
                    <div class="contract-section">
                        <div class="contract-label">Contract Address</div>
                        <div class="contract-box">
                            <code>${contractAddress}</code>
                            <button class="copy-address" onclick="copyToClipboard('${contractAddress}')">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M16 12.9V17.1C16 20.6 14.6 22 11.1 22H6.9C3.4 22 2 20.6 2 17.1V12.9C2 9.4 3.4 8 6.9 8H11.1C14.6 8 16 9.4 16 12.9Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                    <path d="M22 6.9V11.1C22 14.6 20.6 16 17.1 16H16V12.9C16 9.4 14.6 8 11.1 8H8V6.9C8 3.4 9.4 2 12.9 2H17.1C20.6 2 22 3.4 22 6.9Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                    ` : ''}
                    
                    <div class="hero-buttons">
                        <a href="${buyLink || '#'}" target="_blank" rel="noopener noreferrer" class="hero-button primary">
                            Buy ${tokenSymbol}
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M14.4301 5.92993L20.5001 11.9999L14.4301 18.0699" stroke="currentColor" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M3.5 12H20.33" stroke="currentColor" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </a>
                        ${socialLinks?.telegram ? `
                        <a href="${socialLinks.telegram}" target="_blank" rel="noopener noreferrer" class="hero-button secondary">
                            Join Community
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M18.7 7.2C18.3 3.9 15.7 2 12 2C8.3 2 5.7 3.9 5.3 7.2C2.7 7.9 1 9.7 1 12C1 14.3 2.7 16.1 5.3 16.8C5.7 20.1 8.3 22 12 22C15.7 22 18.3 20.1 18.7 16.8C21.3 16.1 23 14.3 23 12C23 9.7 21.3 7.9 18.7 7.2Z" stroke="currentColor" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M12 15.5C14.21 15.5 16 13.71 16 11.5C16 9.29 14.21 7.5 12 7.5C9.79 7.5 8 9.29 8 11.5C8 13.71 9.79 15.5 12 15.5Z" stroke="currentColor" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </a>
                        ` : ''}
                    </div>
                </div>
                
                <div class="hero-right">
                    ${logoUrl ? `
                    <div class="hero-logo-wrapper">
                        <div class="hero-logo">
                            <img src="${logoUrl}" alt="${coinName} logo">
                        </div>
                        <div class="logo-glow"></div>
                    </div>
                    ` : ''}
                </div>
            </div>
        </div>
    </section>

    <main class="main-content">
        ${sections.tokenomics && tokenomics ? `
        <section class="tokenomics">
            <div class="container">
                <h2 class="section-title gradient-text">Tokenomics</h2>
                <div class="tokenomics-grid">
                    <div class="tokenomics-card">
                        <div class="card-icon">🚀</div>
                        <h3>Total Supply</h3>
                        <p>${tokenomics.totalSupply}</p>
                    </div>
                    <div class="tokenomics-card">
                        <div class="card-icon">💫</div>
                        <h3>Buy Tax</h3>
                        <p>${tokenomics.taxBuy}%</p>
                    </div>
                    <div class="tokenomics-card">
                        <div class="card-icon">🌟</div>
                        <h3>Sell Tax</h3>
                        <p>${tokenomics.taxSell}%</p>
                    </div>
                    <div class="tokenomics-card">
                        <div class="card-icon">🔒</div>
                        <h3>LP Lock</h3>
                        <p>${tokenomics.lpLocked}</p>
                    </div>
                </div>
            </div>
        </section>
        ` : ''}

        ${sections.roadmap && roadmap?.phases?.length ? `
        <section class="roadmap">
            <div class="container">
                <h2 class="section-title gradient-text">Roadmap</h2>
                <div class="roadmap-grid">
                    ${roadmap.phases.map((phase: any, index: number) => `
                        <div class="roadmap-card">
                            <h3>${phase.title}</h3>
                            <p>${phase.description}</p>
                            <div class="date">${phase.date}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </section>
        ` : ''}

        ${sections.team && team?.length ? `
        <section class="team">
          <div class="container">
            <h2 class="section-title gradient-text">Our Team</h2>
            <div class="team-grid">
              ${team.map((member: any) => `
                <div class="team-card">
                  ${member.avatar ? `
                    <img src="${member.avatar}" alt="${member.name}" class="team-avatar">
                  ` : `
                    <div class="team-avatar-placeholder">
                      ${member.name.charAt(0).toUpperCase()}
                    </div>
                  `}
                  <h3>${member.name}</h3>
                  <p>${member.role}</p>
                </div>
              `).join('')}
            </div>
          </div>
        </section>
        ` : ''}

        ${sections.faq && faq?.length ? `
        <section class="faq">
            <div class="container">
                <h2 class="section-title gradient-text">FAQ</h2>
                <div class="faq-grid">
                    ${faq.map((item: any) => `
                        <div class="faq-card">
                            <h3>${item.question}</h3>
                            <p>${item.answer}</p>
                        </div>
                    `).join('')}
                </div>
            </div>
        </section>
        ` : ''}

        ${sections.community && (socialLinks.telegram || socialLinks.twitter || socialLinks.discord) ? `
        <section class="community">
            <div class="container">
                <h2 class="section-title gradient-text">Join Our Community</h2>
                <div class="social-grid">
                    ${socialLinks.telegram ? `
                    <a href="${socialLinks.telegram}" class="social-card" target="_blank">
                        <div class="social-icon">
                            <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
                            </svg>
                        </div>
                        <span>Join Telegram</span>
                    </a>
                    ` : ''}
                    ${socialLinks.twitter ? `
                    <a href="${socialLinks.twitter}" class="social-card" target="_blank">
                        <div class="social-icon">
                            <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                            </svg>
                        </div>
                        <span>Follow Twitter</span>
                    </a>
                    ` : ''}
                    ${socialLinks.discord ? `
                    <a href="${socialLinks.discord}" class="social-card" target="_blank">
                        <div class="social-icon">
                            <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                            </svg>
                        </div>
                        <span>Join Discord</span>
                    </a>
                    ` : ''}
                </div>
            </div>
        </section>
        ` : ''}
    </main>


    <footer class="footer">
        <div class="footer-container">
            <p class="copyright"> ${new Date().getFullYear()} ${tokenSymbol}</p>
            <div class="footer-links">
                ${buyLink ? `<a href="${buyLink}" target="_blank" class="footer-link">Buy</a>` : ''}
                ${socialLinks.twitter ? `<a href="${socialLinks.twitter}" target="_blank" class="footer-link">Twitter</a>` : ''}
                ${socialLinks.telegram ? `<a href="${socialLinks.telegram}" target="_blank" class="footer-link">Telegram</a>` : ''}
            </div>
        </div>
    </footer>

    <script>
        function copyToClipboard(text) {
            navigator.clipboard.writeText(text).then(() => {
                alert('Contract address copied to clipboard!');
            }).catch(err => {
                console.error('Failed to copy text: ', err);
            });
        }
    </script>
    <script src="https://kit.fontawesome.com/your-kit-code.js" crossorigin="anonymous"></script>
    <script src="main.js"></script>
</body>
</html>
`};
