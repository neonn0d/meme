export const generateChristmasCSS = () => `
:root {
  --primary: #D42426;
  --secondary: #165B33;
  --text: #ffffff;
  --background: #0a0f17;
  --card-bg: rgba(255, 255, 255, 0.05);
  --card-border: rgba(255, 255, 255, 0.1);
  --gold: #FFD700;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Poppins', sans-serif;
  background: var(--background);
  color: var(--text);
  line-height: 1.6;
}

.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* Snow Container */
#snow-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  pointer-events: none;
  z-index: 1;
  overflow: hidden;
}

/* Navigation */
nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: rgba(10, 15, 23, 0.95);
  backdrop-filter: blur(10px);
  padding: 1rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.nav-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-logo {
  display: flex;
  align-items: center;
  gap: 1rem;
  text-decoration: none;
  z-index: 10;
}

.logo-glow {
  height: 40px;
  width: auto;
}

.christmas-text {
  color: var(--text);
  font-size: 1.5rem;
  font-weight: 600;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.nav-link {
  color: var(--text);
  text-decoration: none;
  font-weight: 500;
  opacity: 0.8;
  transition: opacity 0.3s ease;
}

.nav-link:hover {
  opacity: 1;
}

/* Hamburger Menu */
.hamburger {
  display: none;
  flex-direction: column;
  justify-content: space-around;
  width: 30px;
  height: 25px;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  z-index: 10;
  position: relative;
}

.hamburger .bar {
  width: 30px;
  height: 3px;
  background-color: var(--text);
  border-radius: 10px;
  transition: all 0.3s ease;
}

.hamburger.active .bar:nth-child(1) {
  transform: translateY(11px) rotate(45deg);
}

.hamburger.active .bar:nth-child(2) {
  opacity: 0;
}

.hamburger.active .bar:nth-child(3) {
  transform: translateY(-11px) rotate(-45deg);
}

/* Hero Section */
.hero {
  padding: 140px 0 80px;
  text-align: center;
}

.hero-logo {
  width: 120px;
  height: auto;
  margin: 0 auto 2rem;
}

.hero h1 {
  font-family: 'Mountains of Christmas', cursive;
  font-size: clamp(2.5rem, 8vw, 4rem);
  margin-bottom: 1.5rem;
}

.hero-description {
  font-size: 1.1rem;
  max-width: 700px;
  margin: 0 auto 3rem;
  opacity: 0.8;
}

.hero-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 3rem;
}

/* Contract Box */
.contract-box {
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: 12px;
  padding: 1.5rem;
  max-width: 700px;
  margin: 0 auto;
}

.contract-content {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: rgba(0, 0, 0, 0.3);
  padding: 1rem;
  border-radius: 8px;
  margin-top: 1rem;
}

.contract-content code {
  flex: 1;
  font-family: monospace;
  overflow-x: auto;
  white-space: nowrap;
  color: var(--gold);
}

/* Buttons */
.christmas-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
}

.glow-btn {
  background: var(--primary);
  color: var(--text);
}

.glow-btn:hover {
  background: #b51d1f;
  transform: translateY(-2px);
}

.secondary {
  background: var(--secondary);
  color: var(--text);
}

.secondary:hover {
  background: #0d3720;
  transform: translateY(-2px);
}

.copy-btn {
  background: var(--secondary);
  color: var(--text);
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.copy-btn:hover {
  background: #0d3720;
}

/* Sections */
section {
  padding: 80px 0;
}

section h2 {
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 3rem;
  color: var(--text);
}

/* Grids */
.tokenomics-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
}

.roadmap-grid,
.team-grid,
.faq-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

/* Team Section */
.team-grid {
  max-width: 900px;
  margin: 0 auto;
}

.team-card {
  text-align: center;
}

/* Community Section */
.community-section {
  text-align: center;
}

.social-links {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  margin-top: 2rem;
}

.social-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text);
  text-decoration: none;
  font-weight: 500;
  opacity: 0.8;
  transition: all 0.3s ease;
}

.social-link:hover {
  opacity: 1;
  transform: translateY(-2px);
}

/* Cards */
.tokenomics-card,
.roadmap-card,
.team-card,
.faq-card {
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: 12px;
  padding: 1.5rem;
  transition: transform 0.3s ease;
}

.tokenomics-card:hover,
.roadmap-card:hover,
.team-card:hover,
.faq-card:hover {
  transform: translateY(-5px);
}

.tokenomics-card h3,
.roadmap-card h3,
.team-card h3,
.faq-card h3 {
  color: var(--gold);
  margin-bottom: 1rem;
  font-size: 1.2rem;
}

.team-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  margin-bottom: 1rem;
}

/* Footer */
footer {
  background: rgba(0, 0, 0, 0.3);
  padding: 2rem 0;
  margin-top: 4rem;
  border-top: 1px solid var(--card-border);
}

.footer-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.footer-logo {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.footer-logo img {
  height: 30px;
  width: auto;
}

.footer-links {
  display: flex;
  gap: 2rem;
}

.footer-link {
  color: var(--text);
  text-decoration: none;
  opacity: 0.8;
  transition: opacity 0.3s ease;
}

.footer-link:hover {
  opacity: 1;
}

.footer-bottom {
  text-align: center;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid var(--card-border);
  opacity: 0.6;
  font-size: 0.9rem;
}

/* Media Queries */
@media (max-width: 1024px) {
  .tokenomics-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .nav-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .nav-logo {
    z-index: 10;
  }

  .hamburger {
    display: flex;
    position: relative;
    z-index: 10;
  }

  .nav-links {
    position: fixed;
    top: 0;
    left: 100%;
    width: 100%;
    height: 100vh;
    background: rgba(10, 15, 23, 0.98);
    backdrop-filter: blur(10px);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 2rem;
    padding: 5rem 2rem 2rem;
    transition: all 0.3s ease-in-out;
  }

  .nav-links.active {
    left: 0;
  }

  .nav-link {
    font-size: 1.2rem;
  }

  .christmas-btn {
    margin-top: 1rem;
  }

  .hero-buttons {
    flex-direction: column;
    padding: 0 1rem;
  }

  .contract-content {
    flex-direction: column;
    text-align: center;
  }

  .contract-content code {
    padding: 0.5rem;
    text-align: center;
  }

  .footer-content {
    flex-direction: column;
    gap: 2rem;
    text-align: center;
  }

  .footer-links {
    flex-direction: column;
    gap: 1rem;
  }
}

@media (max-width: 480px) {
  .container {
    padding: 0 1rem;
  }

  section {
    padding: 60px 0;
  }

  .hero {
    padding: 120px 0 60px;
  }

  .tokenomics-grid {
    grid-template-columns: 1fr;
  }
}
`
