export const generateModernJS = () => {
  return `
// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    
    const target = document.querySelector(targetId);
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// Smart navbar (hides on scroll down, shows on scroll up)
let lastScrollTop = 0;
const navbar = document.querySelector('.nav');
const navbarHeight = navbar.getBoundingClientRect().height;

window.addEventListener('scroll', () => {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  
  if (scrollTop > lastScrollTop && scrollTop > navbarHeight) {
    navbar.style.transform = 'translateY(-100%)';
    navbar.style.transition = 'transform 0.3s ease-in-out';
  } else {
    navbar.style.transform = 'translateY(0)';
  }
  
  lastScrollTop = scrollTop;
});

// Glow effect on hover for buttons
document.querySelectorAll('.glow-btn').forEach(button => {
  button.addEventListener('mousemove', (e) => {
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    button.style.setProperty('--x', \`\${x}px\`);
    button.style.setProperty('--y', \`\${y}px\`);
  });
});

// Initialize DexTools widget if it exists
const dextoolsWidget = document.getElementById('dextools-widget');
if (dextoolsWidget) {
  const script = document.createElement('script');
  script.src = 'https://www.dextools.io/widgets/en/chart.js';
  script.async = true;
  document.body.appendChild(script);

  script.onload = () => {
    new DexToolsWidget({
      container: dextoolsWidget,
      chain: 'ether',
      chartType: 'price',
      theme: 'dark',
      chartHeight: 400
    });
  };
}

// Intersection Observer for fade-in animations
const observerOptions = {
  root: null,
  rootMargin: '0px',
  threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('fade-in');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Observe all cards and sections
document.querySelectorAll('.tokenomics-card, .social-card, .roadmap-card, .team-card, .faq-card').forEach(card => {
  card.style.opacity = '0';
  card.style.transform = 'translateY(20px)';
  observer.observe(card);
});

// Add fade-in animation styles
const style = document.createElement('style');
style.textContent = \`
  .fade-in {
    animation: fadeIn 0.6s ease forwards;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .glow-btn {
    position: relative;
    overflow: hidden;
  }

  .glow-btn::after {
    content: '';
    position: absolute;
    width: 100px;
    height: 100px;
    top: var(--y, 0);
    left: var(--x, 0);
    transform: translate(-50%, -50%);
    background: radial-gradient(circle closest-side, rgba(255, 255, 255, 0.1), transparent);
    pointer-events: none;
  }
\`;

document.head.appendChild(style);

// Parallax effect for the hero section
const heroContent = document.querySelector('.hero-content');
if (heroContent) {
  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    heroContent.style.transform = \`translateY(\${scrolled * 0.3}px)\`;
  });
}

// Initialize stars background
function createStars() {
  const starsContainer = document.querySelector('.stars');
  const numStars = 200;
  
  for (let i = 0; i < numStars; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    star.style.left = \`\${Math.random() * 100}%\`;
    star.style.top = \`\${Math.random() * 100}%\`;
    star.style.animationDelay = \`\${Math.random() * 3}s\`;
    starsContainer.appendChild(star);
  }
}

createStars();

// Add star styles
const starStyles = document.createElement('style');
starStyles.textContent = \`
  .star {
    position: absolute;
    width: 2px;
    height: 2px;
    background: white;
    border-radius: 50%;
    animation: twinkle 3s infinite;
  }

  @keyframes twinkle {
    0%, 100% {
      opacity: 0;
    }
    50% {
      opacity: 1;
    }
  }
\`;

document.head.appendChild(starStyles);

// Navigation
document.addEventListener('DOMContentLoaded', function() {
    const nav = document.querySelector('nav');
    if (nav) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                nav.classList.add('nav-scrolled');
            } else {
                nav.classList.remove('nav-scrolled');
            }
        });
    }
});

// Copy to clipboard function
async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        
        // Show success message
        const button = event.currentTarget;
        if (button) {
            // Create or get tooltip
            let tooltip = button.querySelector('.copy-tooltip');
            if (!tooltip) {
                tooltip = document.createElement('div');
                tooltip.className = 'copy-tooltip';
                button.appendChild(tooltip);
            }
            
            // Update tooltip
            tooltip.textContent = 'Copied!';
            tooltip.classList.add('show');
            
            // Hide tooltip after delay
            setTimeout(() => {
                tooltip.classList.remove('show');
                tooltip.textContent = 'Copy';
            }, 2000);
        }
    } catch (err) {
        console.error('Failed to copy text:', err);
        // Show error message
        const button = event.currentTarget;
        if (button) {
            const tooltip = button.querySelector('.copy-tooltip');
            if (tooltip) {
                tooltip.textContent = 'Failed to copy';
                tooltip.classList.add('show', 'error');
                setTimeout(() => {
                    tooltip.classList.remove('show', 'error');
                    tooltip.textContent = 'Copy';
                }, 2000);
            }
        }
    }
}

// Add tooltip styles
const tooltipStyles = document.createElement('style');
tooltipStyles.textContent = \`
  .copy-tooltip {
    position: absolute;
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);
    padding: 4px 8px;
    background: rgba(0, 0, 0, 0.8);
    color: white;
    border-radius: 4px;
    font-size: 12px;
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.2s, visibility 0.2s;
  }

  .copy-tooltip.show {
    opacity: 1;
    visibility: visible;
  }

  .copy-tooltip.error {
    background: rgba(255, 0, 0, 0.8);
  }

  .copy-address {
    position: relative;
  }
\`;

document.head.appendChild(tooltipStyles);
`;
};
