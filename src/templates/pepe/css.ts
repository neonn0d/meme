import { PreviewData } from '@/types';

export const generatePepeCSS = (data: PreviewData): string => {
  return `
    :root {
      --background-color: #222222;
      --card-background: #2C2F33;
      --text-primary: #FFFFFF;
      --text-secondary: #B9BBBE;
      --accent-color: #7289DA;
      --primary-color: #43B581;
      --secondary-color: #2D7A57;
    }

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
      font-family: 'Space Grotesk', sans-serif;
    }
    
    body {
      margin: 0;
      background: #222222;
      color: #FFFFFF;
      line-height: 1.6;
      overflow-x: hidden;
    }

    body.no-scroll {
        overflow: hidden;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 2rem;
    }
    
    .navbar {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 1000;
        background: #1a1a1a;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        padding: 0.75rem 0;
        height: 64px;
    }

    .nav-content {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 100%;
    }

    .nav-logo {
        display: flex;
        align-items: center;
        text-decoration: none;
        color: white;
        gap: 0.5rem;
    }

    .nav-logo-img {
        width: 32px;
        height: 32px;
        object-fit: contain;
    }

    .nav-logo-text {
        font-size: 1.125rem;
        font-weight: 600;
        color: #43B581;
    }

    .nav-menu {
        display: flex;
        align-items: center;
        height: 100%;
    }

    .nav-links {
        display: flex;
        align-items: center;
        gap: 1.5rem;
        height: 100%;
        margin-right: 1.5rem;
    }

    .nav-links a {
        color: #ffffff;
        text-decoration: none;
        font-size: 0.9375rem;
        font-weight: 500;
        transition: color 0.2s ease;
        display: flex;
        align-items: center;
        gap: 0.25rem;
        height: 100%;
        padding: 0 0.5rem;
    }

    .nav-links a:hover {
        color: #43B581;
    }

    .nav-button {
        padding: 0.5rem 1.25rem;
        background: #43B581;
        color: white;
        text-decoration: none;
        border-radius: 8px;
        font-size: 0.9375rem;
        font-weight: 500;
        transition: all 0.2s ease;
        border: none;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .nav-button:hover {
        background: #3aa374;
        transform: translateY(-1px);
    }

    .nav-toggle {
        display: none;
    }

    .nav-toggle-label {
        display: none;
        cursor: pointer;
        padding: 10px;
        z-index: 1001;
    }

    .nav-toggle-label span {
        display: block;
        width: 25px;
        height: 2px;
        background: #43B581;
        margin: 5px 0;
        transition: 0.3s;
    }

    @media (max-width: 768px) {
        .nav-toggle-label {
            display: block;
        }

        .nav-menu {
            position: fixed;
            top: 64px;
            right: -100%;
            width: 100%;
            height: calc(100vh - 64px);
            background: #1a1a1a;
            flex-direction: column;
            align-items: flex-start;
            padding: 2rem;
            transition: 0.3s;
        }

        .nav-toggle:checked ~ .nav-menu {
            right: 0;
        }

        .nav-toggle:checked ~ .nav-toggle-label span:nth-child(1) {
            transform: rotate(45deg) translate(5px, 5px);
        }

        .nav-toggle:checked ~ .nav-toggle-label span:nth-child(2) {
            opacity: 0;
        }

        .nav-toggle:checked ~ .nav-toggle-label span:nth-child(3) {
            transform: rotate(-45deg) translate(7px, -6px);
        }

        .nav-links {
            flex-direction: column;
            width: 100%;
            margin-bottom: 2rem;
        }

        .nav-links a {
            width: 100%;
            padding: 1rem 0;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .nav-button {
            width: 100%;
            justify-content: center;
            padding: 1rem;
        }
    }

    .hero {
        position: relative;
        min-height: 100vh;
        display: flex;
        align-items: center;
        overflow: hidden;
        padding: 2rem 0;
        background: #222222;
    }

    .hero-background {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: radial-gradient(circle at 30% 50%, rgba(67, 181, 129, 0.1) 0%, rgba(45, 122, 87, 0.05) 50%, rgba(34, 34, 34, 0) 100%);
        z-index: 0;
    }

    .hero-content {
        position: relative;
        z-index: 1;
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 4rem;
        align-items: center;
    }

    .hero-left {
        max-width: 600px;
    }

    .hero-logo-wrapper {
        position: relative;
        width: 150px;
        height: 150px;
        margin-bottom: 2rem;
    }

    .hero-logo {
        width: 100%;
        height: 100%;
        object-fit: contain;
        animation: float 6s ease-in-out infinite;
    }

    .hero-sparkles {
        position: absolute;
        top: -20px;
        right: -20px;
        width: 60px;
        height: 60px;
        background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0L35 25L60 30L35 35L30 60L25 35L0 30L25 25L30 0Z' fill='%2343B581'/%3E%3C/svg%3E") no-repeat center;
        animation: rotate 4s linear infinite;
    }

    .hero-title {
        font-size: 4.5rem;
        font-weight: 700;
        margin-bottom: 1rem;
        background: linear-gradient(45deg, #43B581, #2D7A57);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        letter-spacing: -0.02em;
    }

    .hero-description {
        font-size: 1.2rem;
        color: var(--text-secondary);
        margin-bottom: 2.5rem;
        line-height: 1.6;
        font-weight: 400;
    }

    .hero-buttons {
        display: flex;
        gap: 1rem;
        margin-top: 2rem;
    }

    .button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-width: 180px;
        padding: 0.875rem 1.5rem;
        font-size: 1rem;
        font-weight: 500;
        text-decoration: none;
        border-radius: 12px;
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;
        border: none;
        cursor: pointer;
        letter-spacing: 0.5px;
        background: linear-gradient(135deg, #43B581 0%, #2D7A57 100%);
        color: white;
        box-shadow: 0 4px 15px rgba(67, 181, 129, 0.2);
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
            transparent 0%,
            rgba(255, 255, 255, 0.2) 50%,
            transparent 100%
        );
        transition: left 0.5s ease;
    }

    .button:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(67, 181, 129, 0.3);
    }

    .button:hover::before {
        left: 100%;
    }

    .button.outline {
        background: transparent;
        border: 2px solid #43B581;
        color: #43B581;
        box-shadow: none;
    }

    .button.outline:hover {
        background: rgba(67, 181, 129, 0.1);
        box-shadow: 0 4px 15px rgba(67, 181, 129, 0.1);
    }

    .contract-link {
        position: relative;
        cursor: pointer;
    }

    .contract-text {
        display: inline-block;
        max-width: 150px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .contract-link::after {
        content: '📋';
        margin-left: 0.5rem;
        font-size: 0.9rem;
    }

    .contract-link:active {
        transform: scale(0.98);
    }

    .hero-right {
        position: relative;
        height: 100%;
    }

    .pepe-animation-container {
        position: relative;
        width: 100%;
        height: 500px;
        perspective: 1000px;
    }

    .hero-circles {
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
    }

    .circle {
        position: absolute;
        border-radius: 50%;
        border: 2px solid rgba(67, 181, 129, 0.3);
        animation: rotate 20s linear infinite;
    }

    .circle-1 {
        width: 300px;
        height: 300px;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }

    .circle-2 {
        width: 200px;
        height: 200px;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        animation-direction: reverse;
        animation-duration: 15s;
    }

    .circle-3 {
        width: 100px;
        height: 100px;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        animation-duration: 10s;
    }

    .hero-grid {
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        opacity: 0.1;
    }

    .grid-line {
        position: absolute;
        background: #43B581;
    }

    .grid-line.horizontal {
        width: 100%;
        height: 1px;
        animation: fadeInOut 3s ease-in-out infinite;
    }

    .grid-line.vertical {
        width: 1px;
        height: 100%;
        animation: fadeInOut 3s ease-in-out infinite;
    }

    .grid-line.horizontal:nth-child(1) { top: 33%; }
    .grid-line.horizontal:nth-child(2) { top: 66%; }
    .grid-line.vertical:nth-child(3) { left: 33%; }
    .grid-line.vertical:nth-child(4) { left: 66%; }

    .floating-pepes {
        position: absolute;
        width: 100%;
        height: 100%;
    }

    .pepe {
        position: absolute;
        font-size: 3rem;
        animation: float 3s ease-in-out infinite;
        filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
    }

    .floating-elements {
        position: absolute;
        width: 100%;
        height: 100%;
    }

    .element {
        position: absolute;
        font-size: 1.5rem;
        animation: sparkle 2s ease-in-out infinite;
    }

    .element-1 { top: 20%; left: 80%; animation-delay: 0s; }
    .element-2 { top: 70%; left: 20%; animation-delay: 0.5s; }
    .element-3 { top: 30%; left: 40%; animation-delay: 1s; }
    .element-4 { top: 80%; left: 60%; animation-delay: 1.5s; }

    .pepe-1 { top: 20%; left: 20%; animation-delay: 0s; transform: rotate(-15deg); }
    .pepe-2 { top: 40%; left: 60%; animation-delay: 0.5s; transform: rotate(15deg); }
    .pepe-3 { top: 60%; left: 30%; animation-delay: 1s; transform: rotate(-10deg); }
    .pepe-4 { top: 30%; left: 70%; animation-delay: 1.5s; transform: rotate(10deg); }

    @keyframes float {
        0%, 100% { transform: translateY(0) rotate(0); }
        50% { transform: translateY(-20px) rotate(5deg); }
    }

    @keyframes sparkle {
        0%, 100% { transform: scale(1) rotate(0); opacity: 1; }
        50% { transform: scale(1.2) rotate(15deg); opacity: 0.7; }
    }

    @keyframes rotate {
        from { transform: translate(-50%, -50%) rotate(0deg); }
        to { transform: translate(-50%, -50%) rotate(360deg); }
    }

    @keyframes fadeInOut {
        0%, 100% { opacity: 0.1; }
        50% { opacity: 0.3; }
    }

    .social-links {
      display: flex;
      gap: 1rem;
      justify-content: center;
      flex-wrap: wrap;
      margin-top: 2rem;
    }

    .social-links .button {
      min-width: 160px;
      justify-content: center;
    }

    section {
      padding: 6rem 0;
    }

    section h2 {
      font-size: 2.5rem;
      text-align: center;
      margin-bottom: 3rem;
      background: linear-gradient(to right, #43B581, #2D7A57);
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
      background: #2C2F33;
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 1rem;
      padding: 2rem;
      transition: all 0.3s ease;
    }

    #roadmap li:hover {
      transform: translateY(-2px);
      box-shadow: 0 0 20px rgba(67, 181, 129, 0.2);
      border-color: #43B581;
    }

    #roadmap h3 {
      color: #43B581;
      margin-bottom: 1rem;
      font-size: 1.5rem;
    }

    #roadmap p {
      color: #B9BBBE;
      line-height: 1.6;
      margin: 0;
    }

    .team-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 2rem;
      padding: 0;
    }

    .team-grid > div {
      text-align: center;
      padding: 2rem;
      background: #2C2F33;
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
      border: 2px solid #43B581;
    }

    .team-grid h3 {
      color: #43B581;
      margin-bottom: 0.5rem;
    }

    .team-grid p {
      color: #B9BBBE;
    }

    .tokenomics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 2rem;
      padding: 2rem 0px; 
    }

    .tokenomics-card {
        background-color: #2C2F33;
        border-radius: 15px;
        padding: 2rem;
        text-align: center;
        border: 2px solid transparent;
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;
    }

    .tokenomics-card:hover {
        border-color: #43B581;
        transform: translateY(-5px);
        box-shadow: 0 10px 20px rgba(67, 181, 129, 0.2);
    }

    .tokenomics-card::before {
        content: '';
        position: absolute;
        top: -50%;
        left: -50%;
        width: 200%;
        height: 200%;
        background: linear-gradient(45deg, transparent, rgba(67, 181, 129, 0.1), transparent);
        transform: rotate(45deg);
        transition: all 0.5s ease;
    }

    .tokenomics-card:hover::before {
        animation: shine 1.5s ease;
    }

    @keyframes shine {
      0% { transform: translateX(-100%) rotate(45deg); }
      100% { transform: translateX(100%) rotate(45deg); }
    }

    .card-emoji {
        font-size: 3rem;
        margin-bottom: 1rem;
    }

    .tokenomics-card h3 {
        color: #B9BBBE;
        margin-bottom: 1rem;
        font-size: 1.1rem;
    }

    .tokenomics-card p {
        color: #43B581;
        font-size: 1.5rem;
        font-weight: bold;
    }

    .faq-grid {
      gap: 1rem;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .faq-item {
      width: 100%;
      overflow: hidden;
      background-color: #2C2F33;
      border-radius: 10px;
      margin-bottom: 1rem;
      overflow: hidden;
      border: 1px solid rgba(67, 181, 129, 0.2);
    }

    .faq-question {
      padding: 1.5rem;
      cursor: pointer;
      display: flex;
      justify-content: space-between;
      align-items: center;
      transition: all 0.3s ease;
    }

    .faq-question:hover {
      background-color: rgba(67, 181, 129, 0.1);
    }

    .faq-answer {
      padding: 0;
      max-height: 0;
      overflow: hidden;
      transition: all 0.3s ease;
      position: relative;
      background: rgba(44, 47, 51, 0.5);
    }

    .faq-item.active .faq-answer {
      max-height: 500px;
    }

    .faq-answer p {
      color: #B9BBBE;
      line-height: 1.6;
      margin: 0;
      padding: 1.5rem 3.5rem 1.5rem 1.5rem;
    }

    .faq-question h3 {
      color: #FFFFFF;
      font-size: 1.2rem;
      margin: 0;
      padding-right: 2rem;
      flex: 1;
    }

    .faq-toggle {
      color: #43B581;
      font-size: 1.5rem;
      font-weight: bold;
      transition: transform 0.3s ease;
    }

    .faq-item.active .faq-toggle {
      transform: rotate(45deg);
    }

    .roadmap-list {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 2rem;
      padding: 2rem 0;
    }

    .roadmap-item {
      background-color: #2C2F33;
      border-radius: 15px;
      padding: 2rem;
      position: relative;
      border: 2px solid transparent;
      transition: all 0.3s ease;
      overflow: hidden;
    }

    .roadmap-item:hover {
      border-color: #43B581;
      transform: translateY(-5px);
      box-shadow: 0 10px 20px rgba(67, 181, 129, 0.2);
    }

    .roadmap-item::before {
      content: '';
      position: absolute;
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%;
      background: linear-gradient(45deg, transparent, rgba(67, 181, 129, 0.1), transparent);
      transform: rotate(45deg);
      transition: all 0.5s ease;
    }

    .roadmap-item:hover::before {
      animation: shine 1.5s ease;
    }

    .phase-number {
      background-color: #43B581;
      color: white;
      padding: 0.5rem 1rem;
      border-radius: 20px;
      display: inline-block;
      margin-bottom: 1rem;
      font-weight: bold;
      font-size: 0.9rem;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .roadmap-item h3 {
      color: #FFFFFF;
      margin: 1rem 0;
      font-size: 1.5rem;
    }

    .roadmap-item p {
      color: #B9BBBE;
      margin: 0;
      line-height: 1.6;
    }

    @media (max-width: 768px) {
      .container {
        padding: 0 1rem;
        max-width: 100%;
      }

      .hero-content {
        grid-template-columns: 1fr;
        text-align: center;
        gap: 2rem;
      }

      .hero-left {
        margin: 0 auto;
      }

      .hero-logo-wrapper {
        margin: 0 auto 2rem;
      }

      .hero-buttons {
        flex-direction: column;
        width: 100%;
      }

      .button {
        width: 100%;
        min-width: unset;
      }

      .hero-right {
        display: none;
      }

      .hero-title {
        font-size: 3rem;
      }

      .hero-stats {
        grid-template-columns: 1fr;
        max-width: 300px;
        margin: 0 auto;
      }

      .navbar {
        padding: 0.75rem;
        height: 64px;
      }

      .navbar .container {
        padding: 0;
      }

      .navbar-logo img {
        height: 36px;
      }

      .button.buy-now {
        font-size: 0.85rem;
        padding: 0.4rem 1rem;
        min-width: auto;
        width: auto;
        height: 36px;
      }

      .navbar-links {
        display: none;
      }

      .navbar-right {
        gap: 0;
      }

      .navbar .container {
        justify-content: space-between;
      }

      .team-grid {
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      }

      .contract-address {
        flex-direction: column;
        gap: 0.75rem;
        padding: 1rem;
        margin: 1rem 1rem;
        text-align: center;
        max-width: fit-content;
      }

      .contract-address code {
        width: 100%;
        word-break: break-all;
        font-size: 0.8rem;
        padding: 0.75rem;
      }

      .copy-button {
        width: 100%;
      }

      .roadmap-list {
        grid-template-columns: 1fr;
      }

      .tokenomics-grid {
        grid-template-columns: 1fr;
      }
    }

    .tokenomics-section {
        padding: 6rem 0;
        background: #2C2F33;
        position: relative;
        overflow: hidden;
    }

    .tokenomics-section::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 1px;
        background: linear-gradient(90deg, 
            rgba(67, 181, 129, 0) 0%,
            rgba(67, 181, 129, 0.5) 50%,
            rgba(67, 181, 129, 0) 100%
        );
    }

    .section-header {
        text-align: center;
        margin-bottom: 4rem;
    }

    .section-header h2 {
        font-size: 3rem;
        font-weight: 800;
        margin-bottom: 1rem;
        background: linear-gradient(45deg, #43B581, #2D7A57);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }

    .section-subtitle {
        color: var(--text-secondary);
        font-size: 1.2rem;
    }

    .tokenomics-cards {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 2rem;
        margin: 0 auto;
        max-width: 1200px;
    }

    .tokenomics-card {
        background: rgba(67, 181, 129, 0.1);
        border-radius: 16px;
        padding: 2rem;
        text-align: center;
        transition: all 0.3s ease;
        border: 1px solid rgba(67, 181, 129, 0.2);
        position: relative;
        overflow: hidden;
    }

    .tokenomics-card:hover {
        transform: translateY(-5px);
        background: rgba(67, 181, 129, 0.15);
        border-color: rgba(67, 181, 129, 0.3);
    }

    .tokenomics-card::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 2px;
        background: linear-gradient(90deg, 
            rgba(67, 181, 129, 0) 0%,
            #43B581 50%,
            rgba(67, 181, 129, 0) 100%
        );
        opacity: 0;
        transition: opacity 0.3s ease;
    }

    .tokenomics-card:hover::before {
        opacity: 1;
    }

    .card-icon {
        width: 60px;
        height: 60px;
        background: rgba(67, 181, 129, 0.2);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 1.5rem;
    }

    .card-icon span {
        font-size: 2rem;
    }

    .card-content h3 {
        color: var(--text-primary);
        font-size: 1.2rem;
        margin-bottom: 1rem;
    }

    .card-value {
        color: #43B581;
        font-size: 1.5rem;
        font-weight: bold;
        font-family: 'Courier New', monospace;
    }

    @media (max-width: 1024px) {
        .tokenomics-cards {
            grid-template-columns: repeat(2, 1fr);
            gap: 1.5rem;
            padding: 0 1rem;
        }
    }

    @media (max-width: 768px) {
        .tokenomics-section {
            padding: 4rem 0;
        }

        .section-header h2 {
            font-size: 2.5rem;
        }

        .section-subtitle {
            font-size: 1rem;
            padding: 0 1rem;
        }

        .tokenomics-cards {
            grid-template-columns: 1fr;
            max-width: 400px;
            margin: 0 auto;
        }

        .tokenomics-card {
            padding: 1.5rem;
        }

        .card-icon {
            width: 50px;
            height: 50px;
            margin-bottom: 1rem;
        }

        .card-icon span {
            font-size: 1.5rem;
        }

        .card-value {
            font-size: 1.25rem;
        }
    }

    .community-section {
        padding: 4rem 0;
        background: linear-gradient(180deg, rgba(67, 181, 129, 0.1) 0%, rgba(34, 34, 34, 0) 100%);
    }

    .community-buttons {
        display: flex;
        justify-content: center;
        gap: 2rem;
        margin-top: 3rem;
    }

    .community-button {
        display: flex;
        align-items: center;
        padding: 0.75rem 1.5rem;
        border-radius: 12px;
        text-decoration: none;
        color: white;
        font-weight: 500;
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;
        background: #2b2b2b;
        border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .button-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 32px;
        margin-right: 12px;
        border-radius: 8px;
        transition: all 0.3s ease;
    }

    .button-text {
        font-size: 1rem;
        transition: all 0.3s ease;
    }

    .community-button:hover {
        transform: translateY(-2px);
        background: #333333;
        border-color: rgba(255, 255, 255, 0.2);
    }

    .community-button:hover .button-icon {
        transform: scale(1.1) rotate(5deg);
    }

    .community-button.telegram .button-icon {
        background: #0088cc;
    }

    .community-button.twitter .button-icon {
        background: #1DA1F2;
    }

    .community-button.discord .button-icon {
        background: #5865F2;
    }

    .community-button i {
        font-size: 1.25rem;
    }

    @media (max-width: 768px) {
        .community-buttons {
            flex-direction: column;
            gap: 1rem;
            padding: 0 1rem;
        }
    }

    .section.community-section {
        padding: 4rem 0;
        background: linear-gradient(180deg, rgba(67, 181, 129, 0.1) 0%, rgba(34, 34, 34, 0) 100%);
    }

    @media (max-width: 768px) {
{{ ... }}
    }

    .footer {
        background: #1a1a1a;
        padding: 1rem 0;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
    }

    .footer-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .footer-content span {
        color: #888;
    }

    .footer-content a {
        color: #fff;
        text-decoration: none;
        background: linear-gradient(to right, #43B581, #43B581);
        padding: 6px 16px;
        border-radius: 6px;
        font-size: 14px;
        transition: all 0.3s ease;
        border: 1px solid rgba(67, 181, 129, 0.2);
    }

    .footer-content a:hover {
        background: linear-gradient(to right, #4cc48f, #4cc48f);
        transform: translateY(-1px);
        box-shadow: 0 2px 8px rgba(67, 181, 129, 0.2);
    }

    @media (max-width: 768px) {
        .footer-content {
            flex-direction: column;
            gap: 10px;
        }
    }
`;
};
