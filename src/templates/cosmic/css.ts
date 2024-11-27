export const generateCosmicCSS = (data: any): string => {
    const { primaryColor = '#3B82F6', secondaryColor = '#1E40AF' } = data;
  
    return `
    :root {
      --primary-color: ${primaryColor};
      --secondary-color: ${secondaryColor};
      --background-color: #0A0A1F;
      --card-bg: rgba(255, 255, 255, 0.05);
      --text-color: #fff;
      --text-secondary: rgba(255, 255, 255, 0.7);
      --spacing-unit: 1rem;
    }

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      margin: 0;
      font-family: 'Space Grotesk', 'Roboto', sans-serif;
      background: var(--background-color);
      color: var(--text-color);
      line-height: 1.6;
      overflow-x: hidden;
      background-image: 
        radial-gradient(circle at 20% 30%, rgba(59, 130, 246, 0.2) 0%, transparent 50%),
        radial-gradient(circle at 80% 70%, rgba(30, 64, 175, 0.2) 0%, transparent 50%);
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 var(--spacing-unit);
    }
    
    .navbar {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
      backdrop-filter: blur(10px);
      background: rgba(10, 10, 31, 0.8);
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      padding: 1rem 0;
    }

    .navbar .container {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .navbar-logo img {
      height: 40px;
      width: auto;
    }

    .navbar-links {
      display: flex;
      gap: 2rem;
      list-style: none;
    }

    .navbar-links a {
      color: var(--text-color);
      text-decoration: none;
      font-weight: 500;
      transition: color 0.3s ease;
    }

    .navbar-links a:hover {
      color: var(--primary-color);
    }
    
    .hero {
      min-height: 100vh;
      display: flex;
      align-items: center;
      text-align: center;
      padding: 8rem 0 4rem;
      position: relative;
      overflow: hidden;
    }

    .hero::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: 
        linear-gradient(45deg, 
          rgba(59, 130, 246, 0.1) 0%, 
          rgba(30, 64, 175, 0.1) 100%);
      z-index: -1;
    }

    .hero h1 {
      font-size: 4rem;
      margin-bottom: 1.5rem;
    }

    .hero p {
      font-size: 1.25rem;
      color: var(--text-secondary);
      max-width: 600px;
      margin: 0 auto 2rem;
    }

    .hero-buttons {
      display: flex;
      gap: 1rem;
      justify-content: center;
    }

    .button {
      display: inline-flex;
      align-items: center;
      padding: 0.75rem 1.5rem;
      border-radius: 9999px;
      font-weight: 500;
      text-decoration: none;
      transition: all 0.3s ease;
    }

    .button.primary {
      background: var(--primary-color);
      color: white;
    }

    .button.primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 20px rgba(59, 130, 246, 0.4);
    }

    .button.secondary {
      background: transparent;
      color: var(--text-color);
      border: 1px solid var(--primary-color);
    }

    .button.secondary:hover {
      background: rgba(59, 130, 246, 0.1);
      transform: translateY(-2px);
    }

    .button.buy-now {
      background: var(--primary-color);
      color: white;
      padding: 0.5rem 1.25rem;
      border-radius: 9999px;
    }

    section {
      padding: 6rem 0;
    }

    section h2 {
      font-size: 2.5rem;
      text-align: center;
      margin-bottom: 3rem;
      background: linear-gradient(to right, var(--primary-color), var(--secondary-color));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    #roadmap {
      position: relative;
      padding: 4rem 0;
    }

    #roadmap ul {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: 2rem;
      width: 100%;
    }

    #roadmap li {
      background: var(--card-bg);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 1rem;
      padding: 2rem;
      transition: all 0.3s ease;
    }

    #roadmap li:hover {
      transform: translateY(-2px);
      box-shadow: 0 0 20px rgba(var(--primary-color-rgb), 0.2);
      border-color: var(--primary-color);
    }

    #roadmap h3 {
      color: var(--primary-color);
      margin-bottom: 1rem;
      font-size: 1.5rem;
    }

    #roadmap p {
      color: var(--text-secondary);
      line-height: 1.6;
      margin: 0;
    }

    .team-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 2rem;
      padding: 0 1rem;
    }

    .team-grid > div {
      text-align: center;
      padding: 2rem;
      background: var(--card-bg);
      border-radius: 1rem;
      border: 1px solid rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      transition: transform 0.3s ease;
    }

    .team-grid > div:hover {
      transform: translateY(-5px);
    }

    .team-grid img {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      margin-bottom: 1rem;
      border: 2px solid var(--primary-color);
    }

    .team-grid h3 {
      color: var(--primary-color);
      margin-bottom: 0.5rem;
    }

    .team-grid p {
      color: var(--text-secondary);
    }

    footer {
      text-align: center;
      padding: 2rem;
      background: rgba(10, 10, 31, 0.9);
      border-top: 1px solid rgba(255, 255, 255, 0.1);
    }

    footer a {
      color: var(--text-color);
      text-decoration: none;
      margin: 0 1rem;
      transition: color 0.3s ease;
    }

    footer a:hover {
      color: var(--primary-color);
    }

    .footer-logo {
      width: 40px;
      height: 40px;
      object-fit: contain;
    }

    .contract-address {
      margin-top: 2rem;
      background: var(--card-bg);
      padding: 1rem;
      border-radius: 0.5rem;
      border: 1px solid rgba(255, 255, 255, 0.1);
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 1rem;
      max-width: 600px;
      margin-left: auto;
      margin-right: auto;
    }

    .contract-address code {
      font-family: monospace;
      color: var(--primary-color);
      background: rgba(255, 255, 255, 0.05);
      padding: 0.5rem 1rem;
      border-radius: 0.25rem;
      flex: 1;
      text-align: center;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .contract-address code:hover {
      background: rgba(255, 255, 255, 0.1);
    }

    .copy-button {
      background: var(--primary-color);
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 0.25rem;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .copy-button:hover {
      background: var(--secondary-color);
    }

    .tokenomics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 2rem;
      padding: 2rem;
    }

    .tokenomics-card {
      background: var(--card-bg);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 1rem;
      padding: 2rem;
      text-align: center;
      backdrop-filter: blur(10px);
      transition: transform 0.3s ease;
    }

    .tokenomics-card:hover {
      transform: translateY(-5px);
    }

    .tokenomics-card h3 {
      color: var(--text-secondary);
      margin-bottom: 1rem;
      font-size: 1.1rem;
    }

    .tokenomics-card p {
      color: var(--primary-color);
      font-size: 1.5rem;
      font-weight: bold;
    }

    .faq-grid {
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: 1rem;
      width: 100%;
    }

    .faq-item {
      background: var(--card-bg);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 1rem;
      overflow: hidden;
      transition: all 0.3s ease;
    }

    .faq-item:hover {
      transform: translateY(-2px);
      box-shadow: 0 0 20px rgba(var(--primary-color-rgb), 0.2);
      border-color: var(--primary-color);
    }

    .faq-question {
      padding: 1.5rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .faq-question h3 {
      color: var(--text-color);
      font-size: 1.2rem;
      margin: 0;
      padding-right: 2rem;
      flex: 1;
    }

    .faq-toggle {
      color: var(--primary-color);
      font-size: 1.5rem;
      font-weight: bold;
      transition: transform 0.3s ease;
    }

    .faq-item.active .faq-toggle {
      transform: rotate(45deg);
    }

    .faq-answer {
      padding: 0 1.5rem;
      height: 0;
      opacity: 0;
      overflow: hidden;
      transition: all 0.3s ease;
    }

    .faq-item.active .faq-answer {
      padding: 0 1.5rem 1.5rem;
      height: auto;
      opacity: 1;
    }

    .faq-answer p {
      color: var(--text-secondary);
      line-height: 1.6;
      margin: 0;
    }

    .social-links {
      display: flex;
      justify-content: center;
      gap: 1rem;
      margin-top: 2rem;
    }

    @keyframes glow {
      from {
        text-shadow: 0 0 20px var(--primary-color);
      }
      to {
        text-shadow: 0 0 30px var(--primary-color), 0 0 40px var(--secondary-color);
      }
    }

    @media (max-width: 768px) {
      .navbar-links {
        display: none;
      }

      .hero h1 {
        font-size: 3rem;
      }

      .hero p {
        font-size: 1.1rem;
      }

      section {
        padding: 4rem 0;
      }

      .team-grid {
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      }
    }
    `;
  };