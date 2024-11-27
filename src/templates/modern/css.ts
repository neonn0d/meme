export const generateModernCSS = (data: any) => {
  const { primaryColor = '#FF6B00', secondaryColor = '#FFB700' } = data;

  return `
:root {
  --primary: ${primaryColor};
  --secondary: ${secondaryColor};
  --background: #000;
  --text: #fff;
  --card-bg: rgba(255, 255, 255, 0.05);
  --nav-bg: rgba(0, 0, 0, 0.8);
  --bg: #000;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Space Grotesk', sans-serif;
}

body {
  background-color: var(--background);
  color: var(--text);
  line-height: 1.6;
  overflow-x: hidden;
}

/* Space Theme */
.space-theme {
  position: relative;
  min-height: 100vh;
  background: #000;
  overflow-x: hidden;
}

/* Glow Effects */
.glow {
  filter: drop-shadow(0 0 10px var(--primary));
}

.glow-text {
  text-shadow: 0 0 10px var(--primary);
}

.glow-btn {
  box-shadow: 0 0 15px var(--primary);
  transition: all 0.3s ease;
}

.glow-btn:hover {
  box-shadow: 0 0 25px var(--primary);
  transform: translateY(-2px);
}

.glow-card {
  box-shadow: 0 0 15px rgba(255, 107, 0, 0.2);
  transition: all 0.3s ease;
}

.glow-card:hover {
  box-shadow: 0 0 25px rgba(255, 107, 0, 0.4);
  transform: translateY(-5px);
}

/* Enhanced Animations */
@keyframes floatAnimation {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-15px); }
  100% { transform: translateY(0px); }
}

@keyframes glowPulse {
  0% { filter: drop-shadow(0 0 10px var(--primary)); }
  50% { filter: drop-shadow(0 0 20px var(--primary)); }
  100% { filter: drop-shadow(0 0 10px var(--primary)); }
}

.animate-float {
  animation: floatAnimation 3s ease-in-out infinite;
}

.animate-glow {
  animation: glowPulse 2s ease-in-out infinite;
}

/* Enhanced Card Styles */
.card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 24px;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.card:hover {
  transform: translateY(-5px) scale(1.02);
  border-color: var(--primary);
  box-shadow: 0 8px 30px rgba(var(--primary-rgb), 0.2);
}

/* Enhanced Button Styles */
.button {
  position: relative;
  overflow: hidden;
  background: linear-gradient(45deg, var(--primary), var(--secondary));
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  color: white;
  font-weight: 600;
  letter-spacing: 0.5px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.2),
    transparent
  );
  transition: 0.5s;
}

.button:hover::before {
  left: 100%;
}

.button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(var(--primary-rgb), 0.3);
}

/* Enhanced Section Transitions */
.section {
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.section.visible {
  opacity: 1;
  transform: translateY(0);
}

/* Navigation */
.nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  padding: 20px 0;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  z-index: 1000;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.nav-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
}

.nav-logo {
  display: flex;
  align-items: center;
  gap: 15px;
}

.nav-logo img {
  height: 40px;
  width: auto;
  object-fit: contain;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 15px;
}

.nav-link {
  color: #fff;
  text-decoration: none;
  padding: 8px 16px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.nav-link:hover {
  background: rgba(255, 255, 255, 0.1);
}

.nav-btn {
  display: inline-flex;
  align-items: center;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--text);
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
  text-decoration: none;
}

.nav-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}

.glow-btn {
  position: relative;
  overflow: hidden;
}

.glow-btn::after {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(
    45deg,
    transparent,
    rgba(255, 255, 255, 0.1),
    transparent
  );
  transform: rotate(45deg);
  animation: glow 3s infinite;
}

@keyframes glow {
  0% {
    transform: rotate(45deg) translateX(-100%);
  }
  100% {
    transform: rotate(45deg) translateX(100%);
  }
}

@media (max-width: 768px) {
  .nav {
    padding: 15px 0;
  }

  .nav-content {
    flex-direction: column;
    gap: 15px;
  }

  .nav-links {
    width: 100%;
    justify-content: center;
    flex-wrap: wrap;
  }

  .nav-btn {
    padding: 6px 12px;
    font-size: 0.8rem;
  }
}

/* Hero Section */
.hero {
  padding: 220px 0;
  position: relative;
  overflow: hidden;
}

.hero-grid {
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: 40px;
  align-items: center;
}

@media (max-width: 768px) {
  .hero {
    padding: 40px 0;
  }

  .hero-grid {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 32px;
  }

  .hero-left {
    text-align: center;
    order: 2;
    width: 100%;
    max-width: 600px;
  }

  .hero-right {
    order: 1;
    width: 100%;
    max-width: 200px;
  }

  .hero-logo-wrapper {
    max-width: 200px;
    margin: 0 auto;
  }

  .hero-buttons {
    flex-direction: column;
    gap: 10px;
  }

  .hero-button {
    width: 100%;
  }

  .contract-box {
    flex-direction: column;
    gap: 10px;
  }

  .contract-box code {
    font-size: 12px;
    word-break: break-all;
  }
}

.hero-left {
  position: relative;
  z-index: 1;
}

.hero-title {
  font-size: 48px;
  font-weight: 700;
  margin-bottom: 16px;
  background: linear-gradient(45deg, #fff, #ccc);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.hero-description {
  font-size: 18px;
  color: #ccc;
  margin-bottom: 32px;
  line-height: 1.6;
}

.hero-buttons {
  display: flex;
  gap: 16px;
  margin-top: 8px;
}

.hero-button {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 14px 28px;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
  border: none;
}

.hero-button.primary {
  background: linear-gradient(45deg, var(--primary), var(--secondary));
  color: var(--text);
  box-shadow: 0 4px 20px rgba(var(--primary-rgb), 0.3);
}

.hero-button.primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(var(--primary-rgb), 0.4);
}

.hero-button.secondary {
  background: rgba(255, 255, 255, 0.1);
  color: var(--text);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.hero-button.secondary:hover {
  background: rgba(255, 255, 255, 0.15);
  border-color: var(--primary);
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .hero-buttons {
    flex-direction: column;
    gap: 12px;
  }

  .hero-button {
    width: 100%;
    justify-content: center;
    padding: 12px 24px;
  }
}

.contract-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 48px;
}

.contract-label {
  font-size: 14px;
  color: #ccc;
}

.contract-box {
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 16px;
  max-width: 500px;
  margin-bottom: 10px;

}

.contract-box code {
  flex: 1;
  font-family: 'Space Mono', monospace;
  font-size: 14px;
  color: #fff;
}

.copy-address {
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 8px 12px;
  color: var(--text);
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.3s ease;
  min-width: 40px;
  height: 40px;
}

.copy-address:hover {
  background: rgba(255, 255, 255, 0.15);
  border-color: var(--primary);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.copy-address:active {
  transform: translateY(0);
}

/* Responsive container */
.container {
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  padding-left: 1rem;
  padding-right: 1rem;
}

@media (min-width: 640px) {
  .container {
    max-width: 640px;
  }
}

@media (min-width: 768px) {
  .container {
    max-width: 768px;
  }
}

@media (min-width: 1024px) {
  .container {
    max-width: 1024px;
  }
}

@media (min-width: 1280px) {
  .container {
    max-width: 1280px;
  }
}

/* Main Content */
.main-content {
  position: relative;
  width: 100%;
  z-index: 2;
}

/* Sections */
.tokenomics,
.roadmap,
.team,
.faq,
.community {
  position: relative;
  padding: 100px 20px;
  display: flex;
  align-items: center;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  z-index: 2;
}

/* Tokenomics Section */
.tokenomics {
  padding: 100px 20px;
  background: rgba(0, 0, 0, 0.5);
  position: relative;
  z-index: 10;
}

h2 {
  text-align: center;
  margin-bottom: 3rem;
  font-size: 2.5rem;
}

.tokenomics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.tokenomics-card {
  background: var(--card-bg);
  padding: 2rem;
  border-radius: 16px;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.tokenomics-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 0 30px rgba(255, 107, 0, 0.2);
  border-color: var(--primary);
}

.card-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.tokenomics-card h3 {
  margin-bottom: 0.5rem;
  color: var(--primary);
}

.tokenomics-card p {
  font-size: 1.25rem;
  opacity: 0.9;
}

/* Roadmap Section */
.roadmap {
  padding: 100px 20px;
  position: relative;
}

.roadmap-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
}

.roadmap-card {
  background: var(--card-bg);
  padding: 2rem;
  border-radius: 16px;
  position: relative;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.roadmap-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 0 30px rgba(255, 107, 0, 0.2);
  border-color: var(--primary);
}

.phase-number {
  position: absolute;
  top: -15px;
  left: 50%;
  transform: translateX(-50%);
  background: var(--primary);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: bold;
}

.roadmap-card h3 {
  margin: 1.5rem 0 1rem;
  color: var(--primary);
}

.date {
  margin-top: 1rem;
  opacity: 0.7;
  font-size: 0.9rem;
}

/* Team Section */
.team {
  padding: 100px 0;
  background: rgba(0, 0, 0, 0.5);
  position: relative;
}

.team-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
}

.team-card {
  background: var(--card-bg);
  padding: 2rem;
  border-radius: 16px;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.team-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 0 30px rgba(255, 107, 0, 0.2);
  border-color: var(--primary);
}

.team-avatar, .team-avatar-placeholder {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  margin: 0 auto 1.5rem;
  object-fit: cover;
  border: 2px solid var(--primary);
}

.team-avatar-placeholder {
  background: linear-gradient(45deg, var(--primary), var(--secondary));
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
}

.team-card h3 {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  background: linear-gradient(45deg, var(--primary), var(--secondary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.team-card p {
  color: rgba(255, 255, 255, 0.8);
  font-size: 1rem;
}

/* FAQ Section */
.faq {
  padding: 100px 20px;
  position: relative;
}

.faq-grid {
  display: grid;
  gap: 2rem;
  margin-top: 3rem;
}

.faq-card {
  background: var(--card-bg);
  border-radius: 16px;
  padding: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.faq-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 0 30px rgba(255, 107, 0, 0.2);
  border-color: var(--primary);
}

.faq-card h3 {
  color: var(--primary);
  margin-bottom: 1rem;
}

/* Community Section */
.community {
  padding: 100px 20px;
  position: relative;
}

.social-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
}

.social-card {
  background: var(--card-bg);
  padding: 2rem;
  border-radius: 16px;
  text-align: center;
  text-decoration: none;
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.social-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 0 30px rgba(255, 107, 0, 0.2);
  border-color: var(--primary);
}

.social-icon {
  color: #fff;
  text-decoration: none;
  padding: 8px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.social-icon svg {
  width: 50px;
  height: 50px;
}

/* Footer */
.footer {
  background: var(--background);
  padding: 1rem;
  border-top: 1px solid var(--border);
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.footer-links {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.footer-link {
  color: var(--text-secondary);
  text-decoration: none;
  transition: color 0.3s ease;
  font-size: 0.875rem;
}

.footer-link:hover {
  color: var(--accent);
}

.copyright {
  color: var(--text-secondary);
  font-size: 0.875rem;
  margin: 0;
}

@media (max-width: 768px) {
  .footer-container {
    flex-direction: column;
    gap: 0.75rem;
    text-align: center;
  }

  .footer-links {
    gap: 1rem;
    justify-content: center;
  }

  .footer-link {
    font-size: 0.75rem;
  }

  .copyright {
    font-size: 0.75rem;
  }
}

/* Responsive Design */
@media (max-width: 768px) {
  .hero-content {
    flex-direction: column;
    text-align: center;
  }

  .hero-logo-container {
    margin: 0 auto 2rem;
  }

  .hero-buttons {
    justify-content: center;
  }

  .hero-title {
    font-size: 3rem;
  }

  .team-grid {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}

.bg-primary {
  background-color: var(--primary-color);
}

.hover\:bg-primary-dark:hover {
  background-color: color-mix(in srgb, var(--primary-color) 80%, black);
}

.border-primary {
  border-color: var(--primary-color);
}

.hover\:bg-primary\/10:hover {
  background-color: color-mix(in srgb, var(--primary-color) 10%, transparent);
}

.hero-logo-wrapper {
  position: relative;
  width: 400px;
  padding-bottom: 400px;
  margin: 0 auto;
}

.hero-logo {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.hero-logo img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  padding: 20px;
}

@media (max-width: 768px) {
  .hero-logo-wrapper {
    width: 200px;
    padding-bottom: 200px;
  }
}
`;
};
