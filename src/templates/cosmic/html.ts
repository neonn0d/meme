export const generateCosmicHTML = ({
  coinName,
  tokenSymbol,
  description,
  logoUrl,
  contractAddress,
  buyLink,
  roadmap,
  team,
  socialLinks = {},
  tokenomics = {},
  faq = [],
  seo = {},
  sections = {},
}: any): string => {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${seo.title || `${coinName} - The Future of Memecoins`}</title>
      
      <!-- SEO Meta Tags -->
      <meta name="description" content="${seo.description || description}">
      <meta name="keywords" content="${seo.keywords}">
      
      <!-- Open Graph Meta Tags -->
      <meta property="og:title" content="${
        seo.title || `${coinName} - The Future of Memecoins`
      }">
      <meta property="og:description" content="${
        seo.description || description
      }">
      <meta property="og:image" content="${seo.ogImage || logoUrl}">
      <meta property="og:type" content="website">
      
      <link rel="icon" href="${logoUrl}">
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
      <link rel="stylesheet" href="styles.css">
  </head>
  <body>
      <nav class="navbar">
          <div class="container">
              <div class="navbar-logo">
                  <a href="#"><img src="${logoUrl}" alt="${coinName} Logo"></a>
              </div>
              <ul class="navbar-links">
                  ${
                    sections.tokenomics
                      ? '<li><a href="#tokenomics">Tokenomics</a></li>'
                      : ""
                  }
                  ${
                    sections.roadmap
                      ? '<li><a href="#roadmap">Roadmap</a></li>'
                      : ""
                  }
                  ${sections.team ? '<li><a href="#team">Team</a></li>' : ""}
                  ${sections.faq ? '<li><a href="#faq">FAQ</a></li>' : ""}
                  ${
                    sections.community
                      ? '<li><a href="#community">Community</a></li>'
                      : ""
                  }
              </ul>
              <a href="${buyLink}" class="button buy-now" target="_blank">Buy ${tokenSymbol}</a>
          </div>
      </nav>
  
      ${
        sections.hero
          ? `
      <header class="hero">
          <div class="container">
               
          <img  class="hero-logo" src="${logoUrl}" alt="${coinName} logo">
              <h1>${coinName}</h1>
              <p>${description}</p>
              <div class="hero-buttons">
                  <a href="${buyLink}" class="button primary" target="_blank">Buy Now</a>
                  <a href="${socialLinks.discord}" class="button secondary">Join Community</a>
              </div>
              <div class="contract-address">
                  <code id="contract-address">${contractAddress}</code>
                  <button class="copy-button" onclick="copyContractAddress()">Copy</button>
              </div>
          </div>
      </header>
      `
          : ""
      }
  
      <main>
          ${
            sections.tokenomics
              ? `
          <section id="tokenomics">
              <div class="container">
                  <h2>Tokenomics</h2>
                  <div class="tokenomics-grid">
                      <div class="tokenomics-card">
                          <h3>Total Supply</h3>
                          <p>${Number(
                            tokenomics.totalSupply
                          ).toLocaleString()}</p>
                      </div>
                      <div class="tokenomics-card">
                          <h3>Buy Tax</h3>
                          <p>${tokenomics.taxBuy}%</p>
                      </div>
                      <div class="tokenomics-card">
                          <h3>Sell Tax</h3>
                          <p>${tokenomics.taxSell}%</p>
                      </div>
                      <div class="tokenomics-card">
                          <h3>LP Locked</h3>
                          <p>${tokenomics.lpLocked}</p>
                      </div>
                  </div>
              </div>
          </section>
          `
              : ""
          }

          ${
            sections.roadmap
              ? `
          <section id="roadmap">
              <div class="container">
                  <h2>Roadmap</h2>
                  <ul>
                      ${roadmap.phases
                        .map(
                          (phase: any, index: number) => `
                        <li>
                            <h3>${phase.title}</h3>
                            <p>${phase.description}</p>
                        </li>
                      `
                        )
                        .join("")}
                  </ul>
              </div>
          </section>
          `
              : ""
          }

          ${
            sections.team
              ? `
          <section id="team">
              <div class="container">
                  <h2>Meet Our Team</h2>
                  <div class="team-grid">
                      ${team
                        .map(
                          (member: any) => `
                        <div>
                            <img src="${member.avatar}" alt="${member.name}">
                            <h3>${member.name}</h3>
                            <p>${member.role}</p>
                        </div>
                      `
                        )
                        .join("")}
                  </div>
              </div>
          </section>
          `
              : ""
          }

          ${
            sections.faq
              ? `
          <section id="faq">
              <div class="container">
                  <h2>Frequently Asked Questions</h2>
                  <div class="faq-grid">
                      ${faq
                        .map(
                          (item: any, index: number) => `
                        <div class="faq-item" id="faq-${index}">
                            <div class="faq-question">
                                <h3>${item.question}</h3>
                                <span class="faq-toggle">+</span>
                            </div>
                            <div class="faq-answer">
                                <p>${item.answer}</p>
                            </div>
                        </div>
                      `
                        )
                        .join("")}
                  </div>
              </div>
          </section>
          `
              : ""
          }

          ${
            sections.community
              ? `
          <section id="community">
              <div class="container">
                  <h2>Join Our Community</h2>
                  <div class="social-links">
                      ${
                        socialLinks.telegram
                          ? `<a href="${socialLinks.telegram}" class="button primary" target="_blank">Telegram</a>`
                          : ""
                      }
                      ${
                        socialLinks.twitter
                          ? `<a href="${socialLinks.twitter}" class="button primary" target="_blank">Twitter</a>`
                          : ""
                      }
                      ${
                        socialLinks.discord
                          ? `<a href="${socialLinks.discord}" class="button primary" target="_blank">Discord</a>`
                          : ""
                      }
                  </div>
              </div>
          </section>
          `
              : ""
          }
      </main>
  
      <footer>
          <div class="container">
              <div class="footer-content">
                  <div class="footer-links">
                      <a href="${
                        socialLinks.telegram
                      }" target="_blank">Telegram</a>
                      <a href="${
                        socialLinks.twitter
                      }" target="_blank">Twitter</a>
                      <a href="${
                        socialLinks.discord
                      }" target="_blank">Discord</a>
                  </div>
                  <p class="copyright">&copy; ${new Date().getFullYear()} ${coinName}. All rights reserved.</p>
              </div>
          </div>
      </footer>
  
      <script>
      function copyContractAddress() {
          const contractAddress = document.getElementById('contract-address');
          navigator.clipboard.writeText(contractAddress.textContent).then(() => {
              const button = document.querySelector('.copy-button');
              button.textContent = 'Copied!';
              setTimeout(() => {
                  button.textContent = 'Copy';
              }, 2000);
          });
      }

      // FAQ Accordion
      document.querySelectorAll('.faq-item').forEach(item => {
          item.addEventListener('click', () => {
              const wasActive = item.classList.contains('active');
              
              // Close all FAQ items
              document.querySelectorAll('.faq-item').forEach(otherItem => {
                  otherItem.classList.remove('active');
              });

              // Toggle current item
              if (!wasActive) {
                  item.classList.add('active');
              }
          });
      });
      </script>
  </body>
  </html>`;
};
