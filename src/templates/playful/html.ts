import { PreviewData } from '@/types';

export const generatePlayfulHTML = (data: PreviewData): string => {
  const { 
    coinName, 
    tokenSymbol, 
    description, 
    logoUrl, 
    sections, 
    socialLinks, 
    roadmap, 
    team, 
    faq,
    buyLink = '#' 
  } = data;

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${coinName} (${tokenSymbol})</title>
    
    <!-- Primary Meta Tags -->
    <meta name="title" content="${coinName} (${tokenSymbol})">
    <meta name="description" content="${description}">
    <meta name="keywords" content="${coinName}, ${tokenSymbol}, cryptocurrency, token">
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website">
    <meta property="og:title" content="${coinName} (${tokenSymbol})">
    <meta property="og:description" content="${description}">
    ${logoUrl ? `<meta property="og:image" content="${logoUrl}">` : ''}
    
    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image">
    <meta property="twitter:title" content="${coinName} (${tokenSymbol})">
    <meta property="twitter:description" content="${description}">
    ${logoUrl ? `<meta property="twitter:image" content="${logoUrl}">` : ''}
    
    <!-- Favicon -->
    ${logoUrl ? `<link rel="icon" type="image/png" href="${logoUrl}">` : ''}
    
    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    
    <!-- Styles -->
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="playful-template">
      <!-- Navigation Bar -->
      <nav class="navbar">
        <div class="container nav-container">
          <div class="nav-logo">
            <img src="${logoUrl || 'https://placehold.co/100x100'}" alt="${coinName} Logo" class="logo-img">
            <span class="nav-title">${coinName}</span>
          </div>
          <div class="nav-menu">
            <ul class="nav-links">
              <li><a href="#about">About</a></li>
              ${sections.roadmap ? '<li><a href="#roadmap">Roadmap</a></li>' : ''}
              ${sections.team ? '<li><a href="#team">Team</a></li>' : ''}
              ${sections.faq ? '<li><a href="#faq">FAQ</a></li>' : ''}
              ${sections.community ? '<li><a href="#community">Community</a></li>' : ''}
            </ul>
            ${buyLink ? `<a href="${buyLink}" target="_blank" rel="noopener" class="nav-button">Buy ${tokenSymbol}</a>` : ''}
          </div>
        </div>
      </nav>

      <!-- Hero Section (Purple) -->
      ${sections.hero ? `
      <section class="hero-section purple-section">
        <div class="container">
          <div class="hero-content">
            <div class="hero-text">
              <h1 class="hero-title">${coinName} <span class="highlight">${tokenSymbol}</span></h1>
              <p class="hero-description">${description}</p>
              <div class="hero-buttons">
                ${buyLink ? `<a href="${buyLink}" target="_blank" rel="noopener" class="primary-button">Buy ${tokenSymbol}</a>` : ''}
                <a href="#about" class="secondary-button">Learn More</a>
              </div>
            </div>
            <div class="hero-image">
              <img src="${logoUrl || 'https://placehold.co/400x400'}" alt="${coinName} Character" class="character-img">
            </div>
          </div>
        </div>
      </section>
      ` : ''}

      <!-- About Section (Yellow) -->
      <section id="about" class="about-section yellow-section">
        <div class="container">
          <div class="section-header">
            <div class="character-small right">
              <img src="${logoUrl || 'https://placehold.co/150x150'}" alt="${coinName} Character" class="character-img-small">
            </div>
            <h2 class="section-title">About ${coinName}</h2>
            <p class="section-description">${description}</p>
          </div>
          
          <div class="features-grid">
            <div class="feature-card">
              <div class="feature-icon">🚀</div>
              <h3 class="feature-title">Fast & Secure</h3>
              <p class="feature-description">Lightning-fast transactions with top-tier security protocols.</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon">🌍</div>
              <h3 class="feature-title">Community Driven</h3>
              <p class="feature-description">Built by the community, for the community.</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon">💰</div>
              <h3 class="feature-title">Rewarding</h3>
              <p class="feature-description">Innovative tokenomics designed to reward holders.</p>
            </div>
          </div>

          <div class="stats-container">
            <div class="stat-item">
              <span class="stat-value">$${Math.floor(Math.random() * 10000)}K</span>
              <span class="stat-label">Market Cap</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">${Math.floor(Math.random() * 10000)}</span>
              <span class="stat-label">Holders</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">${Math.floor(Math.random() * 100)}K+</span>
              <span class="stat-label">Community</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">${Math.floor(Math.random() * 100)}+</span>
              <span class="stat-label">Countries</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Roadmap Section (White with accents) -->
      ${sections.roadmap && roadmap && roadmap.phases && roadmap.phases.length > 0 ? `
      <section id="roadmap" class="roadmap-section white-section">
        <div class="container">
          <div class="section-header">
            <div class="character-small left">
              <img src="${logoUrl || 'https://placehold.co/150x150'}" alt="${coinName} Character" class="character-img-small">
            </div>
            <h2 class="section-title roadmap-main-title">Roadmap</h2>
            <p class="section-description">Our journey to the moon and beyond.</p>
          </div>

          <div class="roadmap-timeline">
            ${roadmap.phases.map((phase, index) => `
              <div class="roadmap-item ${index % 2 === 0 ? 'left' : 'right'}">
                <div class="roadmap-content">
                  <div class="roadmap-date">${phase.date}</div>
                  <h3 class="roadmap-title">${phase.title}</h3>
                  <p class="roadmap-description">${phase.description}</p>
                </div>
                <div class="roadmap-dot">
                  <div class="roadmap-dot-inner"></div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </section>
      ` : ''}

      <!-- FAQ Section (Purple) -->
      ${sections.faq && faq && faq.length > 0 ? `
      <section id="faq" class="faq-section purple-section">
        <div class="container">
          <div class="section-header">
            <h2 class="section-title">Frequently Asked Questions</h2>
            <p class="section-description">Everything you need to know about ${coinName}.</p>
          </div>

          <div class="faq-container">
            ${faq.map((item, index) => `
              <div class="faq-item">
                <div class="faq-question" data-faq="${index}">
                  <h3>${item.question}</h3>
                  <span class="faq-icon">+</span>
                </div>
                <div class="faq-answer" id="faq-answer-${index}">
                  <p>${item.answer}</p>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </section>
      ` : ''}

      <!-- Team Section (Yellow) -->
      ${sections.team && team && team.length > 0 ? `
      <section id="team" class="team-section yellow-section">
        <div class="container">
          <div class="section-header">
            <h2 class="section-title">Meet Our Team</h2>
            <p class="section-description">The brilliant minds behind ${coinName}.</p>
          </div>

          <div class="team-grid">
            ${team.map(member => `
              <div class="team-card">
                <div class="team-avatar">
                  <img src="${member.avatar || 'https://placehold.co/150x150'}" alt="${member.name}" class="team-img">
                </div>
                <h3 class="team-name">${member.name}</h3>
                <p class="team-role">${member.role}</p>
              </div>
            `).join('')}
          </div>
        </div>
      </section>
      ` : ''}

      <!-- Community Section (Purple) -->
      ${sections.community ? `
      <section id="community" class="community-section purple-section">
        <div class="container">
          <div class="section-header">
            <h2 class="section-title">Join Our Community</h2>
            <p class="section-description">Be part of the ${coinName} family.</p>
          </div>

          <div class="social-links">
            ${socialLinks.telegram ? `<a href="${socialLinks.telegram}" class="social-link telegram"><i class="fab fa-telegram"></i></a>` : ''}
            ${socialLinks.twitter ? `<a href="${socialLinks.twitter}" class="social-link twitter"><i class="fab fa-twitter"></i></a>` : ''}
            ${socialLinks.discord ? `<a href="${socialLinks.discord}" class="social-link discord"><i class="fab fa-discord"></i></a>` : ''}
          </div>
        </div>
      </section>
      ` : ''}

      <!-- Footer -->
      <footer class="footer">
        <div class="container">
          <div class="footer-content">
            <div class="footer-logo">
              <img src="${logoUrl || 'https://placehold.co/100x100'}" alt="${coinName} Logo" class="footer-logo-img">
              <span class="footer-title">${coinName}</span>
            </div>
            <div class="footer-links">
              <div class="footer-links-column">
                <h3 class="footer-links-title">Quick Links</h3>
                <ul>
                  ${buyLink ? `<li><a href="${buyLink}" target="_blank" rel="noopener">Buy ${tokenSymbol}</a></li>` : ''}
                  <li><a href="#about">About</a></li>
                  ${sections.roadmap ? '<li><a href="#roadmap">Roadmap</a></li>' : ''}
                </ul>
              </div>
              <div class="footer-links-column">
                <h3 class="footer-links-title">Resources</h3>
                <ul>
                  ${sections.team ? '<li><a href="#team">Team</a></li>' : ''}
                  ${sections.faq ? '<li><a href="#faq">FAQ</a></li>' : ''}
                  ${sections.community ? '<li><a href="#community">Community</a></li>' : ''}
                </ul>
              </div>
            </div>
          </div>
          <div class="footer-bottom">
            <p class="copyright"> ${new Date().getFullYear()} ${coinName}. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
    
    <!-- JavaScript -->
    <script src="main.js"></script>
</body>
</html>`;
};
