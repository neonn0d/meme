import { PreviewData } from '@/types';

export const generatePlayfulCSS = (data: PreviewData): string => {
  const { primaryColor = '#6A3DE8', secondaryColor = '#FFD100' } = data;
  
  return `
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
    @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css');
    
    :root {
      --primary-color: ${primaryColor};
      --secondary-color: ${secondaryColor};
      --text-light: #FFFFFF;
      --text-dark: #333333;
      --purple-bg: ${primaryColor};
      --yellow-bg: ${secondaryColor};
      --transition: all 0.3s ease;
    }
    
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Poppins', sans-serif;
      line-height: 1.6;
      color: var(--text-dark);
      overflow-x: hidden;
    }
    
    .container {
      width: 100%;
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 20px;
    }
    
    /* Navigation */
    .navbar {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      background-color: var(--purple-bg);
      padding: 15px 0;
      z-index: 1000;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }
    
    .nav-container {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .nav-logo {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    
    .logo-img {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      object-fit: cover;
    }
    
    .nav-title {
      color: var(--text-light);
      font-size: 1.5rem;
      font-weight: 700;
    }
    
    .nav-menu {
      display: flex;
      align-items: center;
      gap: 30px;
    }
    
    .nav-links {
      display: flex;
      list-style: none;
      gap: 20px;
    }
    
    .nav-links a {
      color: var(--text-light);
      text-decoration: none;
      font-weight: 500;
      transition: var(--transition);
    }
    
    .nav-links a:hover {
      color: var(--secondary-color);
    }
    
    .nav-button {
      background-color: var(--secondary-color);
      color: white;
      padding: 10px 20px;
      border-radius: 30px;
      text-decoration: none;
      font-weight: 600;
      transition: var(--transition);
    }
    
    .nav-button:hover {
      transform: translateY(-3px);
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    }
    
    /* Section Styles */
    section {
      padding: 100px 0;
    }
    
    .purple-section {
      background-color: var(--purple-bg);
      color: var(--text-light);
    }
    
    .yellow-section {
      background-color: var(--yellow-bg);
      color: var(--text-dark);
    }
    
    .white-section {
      background-color: #ffffff;
      color: var(--text-dark);
      position: relative;
      overflow: hidden;
    }
    
    .white-section::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 10px;
      background: linear-gradient(to right, var(--purple-bg), var(--yellow-bg));
    }
    
    .white-section::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 10px;
      background: linear-gradient(to right, var(--yellow-bg), var(--purple-bg));
    }
    
    .section-header {
      text-align: center;
      margin-bottom: 60px;
      position: relative;
    }
    
    .section-title {
      font-size: 2.5rem;
      font-weight: 700;
      margin-bottom: 15px;
    }
    
    .section-description {
      font-size: 1.1rem;
      max-width: 700px;
      margin: 0 auto;
      opacity: 0.9;
    }
    
    /* Hero Section */
    .hero-section {
      padding: 150px 0 100px;
    }
    
    .hero-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 40px;
    }
    
    .hero-text {
      flex: 1;
    }
    
    .hero-title {
      font-size: 3.5rem;
      font-weight: 800;
      line-height: 1.2;
      margin-bottom: 20px;
    }
    
    .highlight {
      color: var(--secondary-color);
    }
    
    .hero-description {
      font-size: 1.2rem;
      margin-bottom: 30px;
      opacity: 0.9;
    }
    
    .hero-buttons {
      display: flex;
      gap: 15px;
    }
    
    .primary-button {
      background-color: var(--secondary-color);
      color: white;
      padding: 12px 30px;
      border-radius: 30px;
      text-decoration: none;
      font-weight: 600;
      transition: var(--transition);
    }
    
    .secondary-button {
      background-color: transparent;
      color: var(--text-light);
      padding: 12px 30px;
      border-radius: 30px;
      text-decoration: none;
      font-weight: 600;
      border: 2px solid var(--text-light);
      transition: var(--transition);
    }
    
    .primary-button:hover, .secondary-button:hover {
      transform: translateY(-3px);
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    }
    
    .hero-image {
      flex: 1;
      display: flex;
      justify-content: center;
    }
    
    .character-img {
      max-width: 100%;
      height: auto;
      animation: float 3s ease-in-out infinite;
    }
    
    /* About Section */
    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 30px;
      margin-bottom: 60px;
    }
    
    .feature-card {
      background-color: white;
      padding: 30px;
      border-radius: 20px;
      text-align: center;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
      transition: var(--transition);
    }
    
    .feature-card:hover {
      transform: translateY(-10px);
    }
    
    .feature-icon {
      font-size: 2.5rem;
      margin-bottom: 20px;
    }
    
    .feature-title {
      font-size: 1.3rem;
      font-weight: 600;
      margin-bottom: 15px;
    }
    
    .stats-container {
      display: flex;
      justify-content: space-around;
      flex-wrap: wrap;
      gap: 20px;
    }
    
    .stat-item {
      text-align: center;
    }
    
    .stat-value {
      display: block;
      font-size: 2.5rem;
      font-weight: 700;
      color: var(--purple-bg);
    }
    
    .stat-label {
      font-size: 1rem;
      opacity: 0.8;
    }
    
    /* Tokenomics Section */
    .tokenomics-container {
      display: flex;
      align-items: center;
      gap: 40px;
    }
    
    .tokenomics-image {
      flex: 1;
      display: flex;
      justify-content: center;
    }
    
    .character-img-medium {
      max-width: 100%;
      height: auto;
      animation: float 3s ease-in-out infinite;
    }
    
    .tokenomics-details {
      flex: 1;
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
    }
    
    .tokenomics-card {
      background-color: rgba(255, 255, 255, 0.1);
      padding: 20px;
      border-radius: 15px;
      text-align: center;
    }
    
    .tokenomics-card-title {
      font-size: 1.1rem;
      margin-bottom: 10px;
      opacity: 0.9;
    }
    
    .tokenomics-card-value {
      font-size: 1.8rem;
      font-weight: 700;
    }
    
    /* Roadmap Section */
    .roadmap-section {
      position: relative;
    }
    
    .roadmap-main-title {
      color: var(--purple-bg);
      position: relative;
      display: inline-block;
    }
    
    .roadmap-main-title::after {
      content: '';
      position: absolute;
      bottom: -10px;
      left: 50%;
      transform: translateX(-50%);
      width: 80px;
      height: 4px;
      background: linear-gradient(to right, var(--purple-bg), var(--yellow-bg));
      border-radius: 2px;
    }
    
    .character-small.left {
      position: absolute;
      left: 10%;
      top: -20px;
      transform: rotate(-15deg);
      z-index: 1;
    }
    
    .roadmap-timeline {
      position: relative;
      max-width: 1000px;
      margin: 0 auto;
    }
    
    .roadmap-timeline::after {
      content: '';
      position: absolute;
      width: 6px;
      background-color: var(--purple-bg);
      top: 0;
      bottom: 0;
      left: 50%;
      margin-left: -3px;
      border-radius: 10px;
    }
    
    .roadmap-item {
      padding: 10px 40px;
      position: relative;
      width: 50%;
      box-sizing: border-box;
    }
    
    .roadmap-item.left {
      left: 0;
    }
    
    .roadmap-item.right {
      left: 50%;
    }
    
    .roadmap-content {
      padding: 20px;
      background-color: white;
      border-radius: 15px;
      box-shadow: 0 5px 25px rgba(0, 0, 0, 0.05);
    }
    
    .roadmap-date {
      color: var(--purple-bg);
      font-weight: 600;
      margin-bottom: 10px;
    }
    
    .roadmap-title {
      font-size: 1.3rem;
      margin-bottom: 10px;
    }
    
    .roadmap-dot {
      position: absolute;
      width: 25px;
      height: 25px;
      background-color: white;
      border-radius: 50%;
      top: 30px;
      z-index: 1;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .roadmap-item.left .roadmap-dot {
      right: -12.5px;
    }
    
    .roadmap-item.right .roadmap-dot {
      left: -12.5px;
    }
    
    .roadmap-dot-inner {
      width: 15px;
      height: 15px;
      background-color: var(--purple-bg);
      border-radius: 50%;
    }
    
    /* FAQ Section */
    .faq-container {
      max-width: 800px;
      margin: 0 auto;
    }
    
    .faq-item {
      margin-bottom: 15px;
      border-radius: 10px;
      overflow: hidden;
    }
    
    .faq-question {
      background-color: rgba(255, 255, 255, 0.1);
      padding: 20px;
      cursor: pointer;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .faq-question h3 {
      font-size: 1.1rem;
      font-weight: 500;
    }
    
    .faq-icon {
      font-size: 1.5rem;
      transition: var(--transition);
    }
    
    .faq-answer {
      background-color: rgba(255, 255, 255, 0.05);
      padding: 0 20px;
      max-height: 0;
      overflow: hidden;
      transition: var(--transition);
    }
    
    .faq-answer.active {
      padding: 20px;
      max-height: 500px;
    }
    
    /* Team Section */
    .team-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 30px;
    }
    
    .team-card {
      background-color: white;
      padding: 30px;
      border-radius: 20px;
      text-align: center;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
      transition: var(--transition);
    }
    
    .team-card:hover {
      transform: translateY(-10px);
    }
    
    .team-avatar {
      width: 120px;
      height: 120px;
      margin: 0 auto 20px;
      border-radius: 50%;
      overflow: hidden;
      border: 5px solid var(--purple-bg);
    }
    
    .team-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    .team-name {
      font-size: 1.3rem;
      margin-bottom: 5px;
    }
    
    .team-role {
      color: var(--purple-bg);
      font-weight: 500;
    }
    
    /* Community Section */
    .social-links {
      display: flex;
      justify-content: center;
      gap: 20px;
      margin-top: 40px;
    }
    
    .social-link {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 60px;
      height: 60px;
      background-color: rgba(255, 255, 255, 0.1);
      color: var(--text-light);
      border-radius: 50%;
      text-decoration: none;
      transition: var(--transition);
      font-size: 1.5rem;
    }
    
    .social-link:hover {
      background-color: var(--secondary-color);
      color: white;
      transform: translateY(-5px);
    }
    
    /* Footer */
    .footer {
      background-color: #333;
      color: var(--text-light);
      padding: 60px 0 20px;
    }
    
    .footer-content {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 40px;
      margin-bottom: 40px;
    }
    
    .footer-logo {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    
    .footer-logo-img {
      width: 40px;
      height: 40px;
      border-radius: 50%;
    }
    
    .footer-title {
      font-size: 1.5rem;
      font-weight: 700;
    }
    
    .footer-links {
      display: flex;
      gap: 40px;
      flex-wrap: wrap;
    }
    
    .footer-links-title {
      font-size: 1.1rem;
      margin-bottom: 15px;
      color: var(--secondary-color);
    }
    
    .footer-links-column ul {
      list-style: none;
    }
    
    .footer-links-column ul li {
      margin-bottom: 10px;
    }
    
    .footer-links-column ul li a {
      color: var(--text-light);
      text-decoration: none;
      opacity: 0.8;
      transition: var(--transition);
    }
    
    .footer-links-column ul li a:hover {
      opacity: 1;
      color: var(--secondary-color);
    }
    
    .footer-bottom {
      text-align: center;
      padding-top: 20px;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .copyright {
      opacity: 0.7;
      font-size: 0.9rem;
    }
    
    /* Animations */
    @keyframes float {
      0% {
        transform: translateY(0px);
      }
      50% {
        transform: translateY(-20px);
      }
      100% {
        transform: translateY(0px);
      }
    }
    
    /* Character Positioning */
    .character-small {
      position: absolute;
      width: 100px;
      height: 100px;
    }
    
    .character-small.right {
      top: -50px;
      right: 50px;
    }
    
    .character-img-small {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 50%;
      animation: float 3s ease-in-out infinite;
    }
    
    /* Responsive Styles */
    @media (max-width: 992px) {
      .hero-content {
        flex-direction: column;
        text-align: center;
      }
      
      .hero-buttons {
        justify-content: center;
      }
      
      .tokenomics-container {
        flex-direction: column;
      }
      
      .roadmap-timeline::after {
        left: 31px;
      }
      
      .roadmap-item {
        width: 100%;
        padding-left: 70px;
        padding-right: 25px;
      }
      
      .roadmap-item.right {
        left: 0;
      }
      
      .roadmap-item.left .roadmap-dot,
      .roadmap-item.right .roadmap-dot {
        left: 18px;
      }
    }
    
    @media (max-width: 768px) {
      .nav-links {
        display: none;
      }
      
      .section-title {
        font-size: 2rem;
      }
      
      .hero-title {
        font-size: 2.5rem;
      }
      
      .footer-content {
        flex-direction: column;
        gap: 30px;
      }
    }
  `;
};
