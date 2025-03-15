export const generateTemplate3HTML = ({
    coinName,
    tokenSymbol,
    description,
    logoUrl,
    buyLink,
    socialLinks = {},
    tokenomics,
    sections = {},
    roadmap,
    team,
    faq,
    contractAddress,
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
      <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
  </head>
<body class="space-theme">
    <div id="stars"></div>
    <div id="stars2"></div>
    <div id="stars3"></div>
    <nav class="nav">
        <div class="nav-container">
            <div class="nav-brand">
                <img src="${logoUrl}" alt="${coinName}" class="nav-logo glow">
                <span class="nav-title glow-text">$${tokenSymbol}</span>
            </div>
            <div class="nav-links">
                ${buyLink ? `
                    <a href="${buyLink}" target="_blank" class="nav-link buy-btn plasma-btn">
                        <span class="btn-content">Buy $${tokenSymbol}</span>
                    </a>
                ` : ''}
            </div>
        </div>
    </nav>

    <header class="hero">
        <div class="hero-container">
            <div class="hero-content">
                <h1 class="hero-title plasma-text">${coinName}</h1>
                <p class="hero-subtitle glow-text">$${tokenSymbol}</p>
                <div class="hero-description">${description}</div>
                
                ${contractAddress ? `
                <div class="contract-section">
                    <div class="contract-label glow-text">Contract Address</div>
                    <div class="contract-box">
                        <code>${contractAddress}</code>
                        <button class="copy-btn" onclick="copyToClipboard('${contractAddress}')">
                            <i class="fas fa-copy"></i>
                        </button>
                    </div>
                </div>
                ` : ''}

                <div class="hero-buttons">
                    ${buyLink ? `
                        <a href="${buyLink}" target="_blank" class="hero-btn plasma-btn">
                            <span class="btn-content">Buy Now</span>
                        </a>
                    ` : ''}
                    <div class="social-icons-small">
                        ${socialLinks.telegram ? `
                            <a href="${socialLinks.telegram}" target="_blank" class="social-icon-small">
                                <div class="icon-circle telegram-bg">
                                    <i class="fab fa-telegram"></i>
                                </div>
                            </a>
                        ` : ''}
                        ${socialLinks.twitter ? `
                            <a href="${socialLinks.twitter}" target="_blank" class="social-icon-small">
                                <div class="icon-circle twitter-bg">
                                    <i class="fab fa-twitter"></i>
                                </div>
                            </a>
                        ` : ''}
                        ${socialLinks.discord ? `
                            <a href="${socialLinks.discord}" target="_blank" class="social-icon-small">
                                <div class="icon-circle discord-bg">
                                    <i class="fab fa-discord"></i>
                                </div>
                            </a>
                        ` : ''}
                    </div>
                </div>
            </div>
            <div class="hero-image">
                <img src="${logoUrl}" alt="${coinName}" class="floating glow">
                <div class="orbit-circle"></div>
            </div>
        </div>
    </header>

    ${sections.tokenomics ? `
    <section class="tokenomics">
        <div class="section-container">
            <h2 class="section-title plasma-text">Tokenomics</h2>
            <div class="tokenomics-grid">
                <div class="tokenomics-card glow-card">
                    <div class="card-icon">💰</div>
                    <h3 class="descriptiontext">Total Supply</h3>
                    <p class="plasma-text">${tokenomics.totalSupply}</p>
                </div>
                <div class="tokenomics-card glow-card">
                    <div class="card-icon">📈</div>
                    <h3 class="descriptiontext">Buy Tax</h3>
                    <p class="plasma-text">${tokenomics.taxBuy}%</p>
                </div>
                <div class="tokenomics-card glow-card">
                    <div class="card-icon">📉</div>
                    <h3  class="descriptiontext">Sell Tax</h3>
                    <p class="plasma-text">${tokenomics.taxSell}%</p>
                </div>
                <div class="tokenomics-card glow-card">
                    <div class="card-icon">🔒</div>
                    <h3 class="descriptiontext">LP Lock</h3>
                    <p class="plasma-text">${tokenomics.lpLocked}</p>
                </div>
            </div>
        </div>
    </section>
    ` : ''}

    ${sections.roadmap && roadmap?.phases?.length ? `
    <section class="roadmap">
        <div class="section-container">
            <h2 class="section-title plasma-text">Mission Timeline</h2>
            <div class="roadmap-grid">
                ${roadmap.phases.map((phase: any, index: number) => `
                    <div class="roadmap-card glow-card">
                        <div class="phase-number">Phase ${index + 1}</div>
                        <h3 class="plasma-text">${phase.title}</h3>
                        <p class="plasma-text">${phase.description}</p>
                        <div class="date plasma-text">${phase.date}</div>
                    </div>
                `).join('')}
            </div>
        </div>
    </section>
    ` : ''}

    ${sections.team && team?.length ? `
    <section class="team">
        <div class="section-container">
            <h2 class="section-title plasma-text">Team</h2>
            <div class="team-grid">
                ${team.map((member: any) => `
                    <div class="team-card glow-card">
                        ${member.avatar ? `
                            <img src="${member.avatar}" alt="${member.name}" class="team-avatar">
                        ` : `
                            <div class="team-avatar-placeholder">
                                ${member.name.charAt(0).toUpperCase()}
                            </div>
                        `}
                        <h3 class="glow-text">${member.name}</h3>
                        <p class="descriptiontext">${member.role}</p>
                    </div>
                `).join('')}
            </div>
        </div>
    </section>
    ` : ''}

    ${sections.faq && faq?.length ? `
    <section class="faq">
        <div class="section-container">
            <h2 class="section-title plasma-text">FAQ</h2>
            <div class="faq-grid">
                ${faq.map((item: any) => `
                    <div class="faq-card glow-card">
                        <h3 class="descriptiontext">${item.question}</h3>
                        <p class="plasma-text">${item.answer}</p>
                    </div>
                `).join('')}
            </div>
        </div>
    </section>
    ` : ''}

    ${sections.community ? `
    <section class="community">
        <div class="section-container">
            <h2 class="section-title plasma-text">Join The Mission</h2>
            <div class="social-grid">
                ${socialLinks.telegram ? `
                    <a href="${socialLinks.telegram}" target="_blank" class="social-card telegram-card glow-card">
                        <div class="social-icon">
                            <i class="fab fa-telegram"></i>
                        </div>
                        <h3 class="glow-text">Telegram</h3>
                        <p>Join our active community</p>
                    </a>
                ` : ''}
                ${socialLinks.twitter ? `
                    <a href="${socialLinks.twitter}" target="_blank" class="social-card twitter-card glow-card">
                        <div class="social-icon">
                            <i class="fab fa-twitter"></i>
                        </div>
                        <h3 class="glow-text">Twitter</h3>
                        <p>Follow for updates</p>
                    </a>
                ` : ''}
                ${socialLinks.discord ? `
                    <a href="${socialLinks.discord}" target="_blank" class="social-card discord-card glow-card">
                        <div class="social-icon">
                            <i class="fab fa-discord"></i>
                        </div>
                        <h3 class="glow-text">Discord</h3>
                        <p>Join our server</p>
                    </a>
                ` : ''}
            </div>
        </div>
    </section>
    ` : ''}

    <footer class="footer">
        <div class="footer-container">
            <p class="copyright"> ${new Date().getFullYear()} &copy; ${coinName}</p>
            <div class="footer-links">
                ${buyLink ? `<a href="${buyLink}" target="_blank" class="footer-link">Buy $${tokenSymbol}</a>` : ''}
                ${socialLinks.twitter ? `<a href="${socialLinks.twitter}" target="_blank" class="footer-link">Twitter</a>` : ''}
                ${socialLinks.telegram ? `<a href="${socialLinks.telegram}" target="_blank" class="footer-link">Telegram</a>` : ''}
            </div>
        </div>
    </footer>

    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <script src="main.js"></script>
    <script src="https://kit.fontawesome.com/your-kit-code.js" crossorigin="anonymous"></script>
</body>
</html>`
};
