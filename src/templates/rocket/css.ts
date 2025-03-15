export const generateTemplate3CSS = (data: any) => {
  const { primaryColor = '#FF6B00', secondaryColor = '#FFB700' } = data;

  return `
/* Base Styles */
:root {
  --primary: ${primaryColor};
  --secondary: ${secondaryColor};
  --space-black: #0A0A0A;
  --space-dark: #141414;
  --text: #ffffff;
  --card-bg: rgba(255, 255, 255, 0.05);
  --nav-bg: rgba(10, 10, 10, 0.95);
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Orbitron', sans-serif;
}

body {
  background: var(--space-black);
  color: var(--text);
  line-height: 1.6;
  overflow-x: hidden;
  min-height: 100vh;
}

/* Space Background */
.space-theme {
  position: relative;
  min-height: 100vh;
  background: radial-gradient(ellipse at bottom, #1B2735 0%, #090A0F 100%);
}

#stars, #stars2, #stars3 {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  display: block;
  z-index: 0;
  pointer-events: none;
}

/* Navbar */
.nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: var(--nav-bg);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  padding: 0.75rem 1.5rem;
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.nav-logo {
  height: 32px;
  width: auto;
  transition: transform 0.3s ease;
  filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.5));
}

.nav-logo:hover {
  transform: scale(1.05);
}

.nav-title {
  font-size: 1.25rem;
  font-weight: 700;
  background: linear-gradient(45deg, var(--primary), var(--secondary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 10px 30px color-mix(in srgb, var(--secondary) 10%, transparent);
}

.nav-links {
  display: flex;
  gap: 0.75rem;
  align-items: center;
}

.nav-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  color: var(--text);
  text-decoration: none;
  font-weight: 600;
  font-size: 0.875rem;
  letter-spacing: 0.5px;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
  white-space: nowrap;
}

.nav-link:hover {
  background: rgba(255, 107, 0, 0.15);
  border-color: var(--primary);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(255, 107, 0, 0.2);
}

.telegram-btn {
  background: #0088cc !important;
}

.social-icons-small {
  display: flex;
  align-items: center;
  margin-left: 1rem;
}

.social-icon-small {
  margin: 0 0.5rem;
  transition: transform 0.3s ease;
  text-decoration: none;
}

.social-icon-small:hover {
  transform: translateY(-2px);
}

.icon-circle {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1rem;
}

.telegram-bg {
  background-color: #0088cc;
}

.twitter-bg {
  background-color: #1DA1F2;
}

.discord-bg {
  background-color: #7289DA;
}

@media (max-width: 768px) {
  .nav {
    padding: 0.5rem 1rem;
  }

  .nav-links {
    display: none;
  }
}

@media (max-width: 480px) {
  .nav {
    padding: 0.5rem 0.75rem;
  }

  .nav-brand {
    gap: 0.5rem;
  }

  .nav-title {
    font-size: 1.125rem;
  }

  .nav-logo {
    height: 28px;
  }
}

/* Hero Section */
.hero {
  min-height: 100vh;
  padding: 120px 1.5rem 80px;
  display: flex;
  align-items: center;
  position: relative;
  overflow: hidden;
}

.hero-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
  position: relative;
  z-index: 1;
}

.hero-content {
  animation: fadeInUp 1s ease;
}

.hero-title {
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 900;
  margin-bottom: 1rem;
  line-height: 1.1;
  background: linear-gradient(45deg, var(--primary), var(--secondary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 10px 30px color-mix(in srgb, var(--secondary) 10%, transparent);
}

.descriptiontext {
  color: var(--secondary);
}

.hero-subtitle {
  font-size: clamp(1.25rem, 2.5vw, 1.75rem);
  margin-bottom: 1.5rem;
  color: var(--secondary);
  opacity: 0.9;
}

.hero-description {
  font-size: 1.1rem;
  margin-bottom: 2rem;
  opacity: 0.8;
  line-height: 1.8;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
}

.contract-section {
  margin: 1.5rem 0;
}

.contract-label {
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
  opacity: 0.8;
}

.contract-box {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: rgba(0, 0, 0, 0.3);
  padding: 0.75rem;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  color: white;
}

.contract-box code {
  flex: 1;
  font-family: monospace;
  color: var(--primary);
  word-break: break-all;
  font-size: 0.875rem;
  color: white;
}

.copy-btn {
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: white;
  width: 32px;
  height: 32px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.copy-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-1px);
}

.copy-btn.copied {
  background: var(--primary);
  color: white;
}

.copy-btn i {
  font-size: 0.875rem;
}

.hero-buttons {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.hero-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 2rem;
  font-size: 1rem;
  font-weight: 600;
  text-decoration: none;
  color: var(--text);
  background: linear-gradient(45deg, var(--primary), var(--secondary));
  border: none;
  border-radius: 8px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.hero-btn::before {
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

.hero-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px color-mix(in srgb, var(--secondary) 10%, transparent);
}

.hero-btn:hover::before {
  left: 100%;
}

.hero-image {
  position: relative;
  animation: fadeInRight 1s ease;
  display: flex;
  justify-content: center;
  align-items: center;
}

.hero-image img {
  width: 100%;
  max-width: 400px;
  height: auto;
  animation: float 6s ease-in-out infinite;
  filter: drop-shadow(0 0 20px color-mix(in srgb, var(--primary) 30%, transparent));
  z-index: 1;
}

.orbit-circle {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 120%;
  height: 120%;
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  animation: rotate 20s linear infinite;
}

.orbit-circle::before {
  content: '';
  position: absolute;
  top: -5px;
  left: 50%;
  width: 10px;
  height: 10px;
  background: var(--primary);
  border-radius: 50%;
  box-shadow: 0 0 20px var(--primary);
}

/* Tokenomics Section */
.tokenomics {
  padding: 100px 1.5rem;
  position: relative;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(10px);
}

.section-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

.section-title {
  text-align: center;
  font-size: clamp(2rem, 4vw, 3rem);
  margin-bottom: 3rem;
  background: linear-gradient(45deg, var(--primary), var(--secondary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 10px 30px color-mix(in srgb, var(--secondary) 10%, transparent);
}

.tokenomics-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
  margin: 0 auto;
}

.tokenomics-card {
  padding: 2rem;
  text-align: center;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.tokenomics-card:hover {
  transform: translateY(-10px);
  border-color: var(--primary);
  box-shadow: 0 10px 30px color-mix(in srgb, var(--secondary) 10%, transparent);
}

.card-icon {
  font-size: 2.5rem;
  margin-bottom: 1.5rem;
}

.tokenomics-card h3 {
  font-size: 1.25rem;
  margin-bottom: 1rem;
  color: var(--primary);
}

.tokenomics-card p {
  font-size: 2rem;
  font-weight: 700;
  background: linear-gradient(45deg, var(--primary), var(--secondary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* Roadmap Section */
.roadmap {
  padding: 100px 1.5rem;
  position: relative;
  background: var(--space-dark);
}

.roadmap-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  position: relative;
}

.roadmap-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 2rem;
  position: relative;
  transition: all 0.3s ease;
}

.roadmap-card:hover {
  transform: translateY(-5px);
  border-color: var(--primary);
  box-shadow: 0 10px 30px color-mix(in srgb, var(--secondary) 10%, transparent);
}

.phase-number {
  display: inline-block;
  background: linear-gradient(45deg, var(--primary), var(--secondary));
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
}

.roadmap-card h3 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  background: linear-gradient(45deg, #fff, rgba(255, 255, 255, 0.8));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.roadmap-card p {
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 1.5rem;
  line-height: 1.6;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
}

.roadmap-card .date {
  font-size: 0.9rem;
  font-weight: 600;
  letter-spacing: 1px;
  opacity: 0.8;
}

/* Team Section */
.team {
  padding: 100px 1.5rem;
  background: var(--space-black);
  position: relative;
}

.team-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.team-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 2rem;
  text-align: center;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.team-card:hover {
  transform: translateY(-5px);
  border-color: var(--primary);
  box-shadow: 0 10px 30px color-mix(in srgb, var(--secondary) 10%, transparent);
}

.team-avatar, .team-avatar-placeholder {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  margin: 0 auto 1.5rem;
  background: linear-gradient(45deg, var(--primary), var(--secondary));
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  font-weight: 700;
  color: white;
  border: 3px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

.team-avatar {
  object-fit: cover;
}

.team-card h3 {
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
  background: linear-gradient(45deg, #fff, rgba(255, 255, 255, 0.8));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.team-card p {
  color: var(--primary);
  font-size: 0.9rem;
  font-weight: 500;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

/* FAQ Section */
.faq {
  padding: 100px 1.5rem;
  background: var(--space-dark);
  position: relative;
}

.faq-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 2rem;
}

.faq-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 2rem;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.faq-card:hover {
  transform: translateY(-5px);
  border-color: var(--primary);
  box-shadow: 0 10px 30px color-mix(in srgb, var(--secondary) 10%, transparent);
}

.faq-card h3 {
  font-size: 1.25rem;
  margin-bottom: 1rem;
  color: var(--primary);
}

.faq-card p {
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
}

/* Community Section */
.community {
  padding: 100px 1.5rem;
  background: var(--space-black);
  position: relative;
}

.social-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
}

.social-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 2.5rem 2rem;
  text-align: center;
  text-decoration: none;
  color: var(--text);
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.social-card:hover {
  transform: translateY(-5px);
  border-color: var(--primary);
  box-shadow: 0 10px 30px color-mix(in srgb, var(--secondary) 10%, transparent);
}

.social-icon {
  font-size: 3rem;
  margin-bottom: 1.5rem;
  background: linear-gradient(45deg, var(--primary), var(--secondary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.social-card h3 {
  font-size: 1.5rem;
  margin-bottom: 0.75rem;
  background: linear-gradient(45deg, #fff, rgba(255, 255, 255, 0.8));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.social-card p {
  color: rgba(255, 255, 255, 0.8);
  font-size: 1rem;
}

.telegram-card .social-icon {
  background: linear-gradient(45deg, #0088cc, #00a2ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.twitter-card .social-icon {
  background: linear-gradient(45deg, #1DA1F2, #00c2ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.discord-card .social-icon {
  background: linear-gradient(45deg, #7289DA, #9ea8e9);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* Footer */
.footer {
  background: var(--space-dark);
  padding: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
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
  color: rgba(255, 255, 255, 0.6);
  text-decoration: none;
  transition: color 0.3s ease;
  font-size: 0.875rem;
}

.footer-link:hover {
  color: var(--primary);
}

.copyright {
  color: rgba(255, 255, 255, 0.6);
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

/* Animations */
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
}

@keyframes rotate {
  from { transform: translate(-50%, -50%) rotate(0deg); }
  to { transform: translate(-50%, -50%) rotate(360deg); }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInRight {
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Responsive Design */
@media (max-width: 1200px) {
  .tokenomics-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .hero {
    padding: 100px 1.5rem 60px;
  }

  .hero-container {
    grid-template-columns: 1fr;
    text-align: center;
    gap: 3rem;
  }

  .tokenomics-grid {
    grid-template-columns: 1fr;
  }

  .nav-container {
    flex-direction: column;
    gap: 1rem;
    padding: 1rem 1.5rem;
  }

  .nav-links {
    width: 100%;
    justify-content: center;
    flex-wrap: wrap;
  }

  .nav-link {
    width: 100%;
    justify-content: center;
  }

  .contract-section {
    margin: 1.25rem 0;
  }

  .contract-box {
    padding: 0.625rem;
    gap: 0.75rem;
  }

  .contract-box code {
    font-size: 0.75rem;
  }

  .copy-btn {
    width: 28px;
    height: 28px;
  }

  .copy-btn i {
    font-size: 0.75rem;
  }

  .roadmap-grid::before {
    display: none;
  }
  
  .faq-grid {
    grid-template-columns: 1fr;
  }
  
  .team-avatar, .team-avatar-placeholder {
    width: 100px;
    height: 100px;
    font-size: 2.5rem;
  }
  
  .social-card {
    padding: 2rem;
  }
}

@media (max-width: 480px) {
  .hero-title {
    font-size: 2rem;
  }

  .hero-subtitle {
    font-size: 1.25rem;
  }

  .hero-buttons {
    flex-direction: column;
  }

  .hero-btn {
    width: 100%;
    justify-content: center;
  }

  .tokenomics-card {
    padding: 1.5rem;
  }

  .roadmap-card,
  .team-card,
  .faq-card,
  .social-card {
    padding: 1.5rem;
  }
  
  .social-icon {
    font-size: 2.5rem;
  }
  
  .social-card h3 {
    font-size: 1.25rem;
  }

  .contract-section {
    margin: 1rem 0;
  }

  .contract-label {
    font-size: 0.75rem;
  }

  .contract-box {
    padding: 0.5rem;
    gap: 0.5rem;
  }

  .contract-box code {
    font-size: 0.6875rem;
    letter-spacing: -0.2px;
    color:white;
  }

  .copy-btn {
    width: 24px;
    height: 24px;
  }
}

/* Custom Scrollbar */
::-webkit-scrollbar {
  width: 10px;
}

::-webkit-scrollbar-track {
  background: var(--space-dark);
}

::-webkit-scrollbar-thumb {
  background: var(--primary);
  border-radius: 5px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--secondary);
}
`;
};
