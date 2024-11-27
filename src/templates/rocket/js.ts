export const generateTemplate3JS = () => {
  return `
// Star background animation
function generateStars(id, count, size) {
  const stars = document.getElementById(id);
  let style = '';
  
  for (let i = 0; i < count; i++) {
    const left = Math.random() * 100;
    const top = Math.random() * 100;
    const animationDuration = 3 + Math.random() * 7;
    
    style += \`
      #\${id}:before {
        content: '';
        position: absolute;
        width: \${size}px;
        height: \${size}px;
        background: transparent;
        box-shadow: \${left}vw \${top}vh #fff;
        animation: starTwinkle \${animationDuration}s infinite linear;
      }
    \`;
  }
  
  const styleSheet = document.createElement('style');
  styleSheet.textContent = style;
  document.head.appendChild(styleSheet);
}

generateStars('stars', 700, 1);
generateStars('stars2', 200, 2);
generateStars('stars3', 100, 3);

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// Smart navbar
const navbar = document.querySelector('.nav');
let lastScrollY = window.scrollY;

window.addEventListener('scroll', () => {
  const currentScrollY = window.scrollY;
  
  if (currentScrollY > lastScrollY) {
    navbar.style.transform = 'translateY(-100%)';
  } else {
    navbar.style.transform = 'translateY(0)';
  }
  
  lastScrollY = currentScrollY;
});

// Parallax effect
const heroContent = document.querySelector('.hero-content');
const heroImage = document.querySelector('.hero-image');

window.addEventListener('scroll', () => {
  const scrolled = window.pageYOffset;
  if (heroContent && heroImage) {
    heroContent.style.transform = \`translateY(\${scrolled * 0.2}px)\`;
    heroImage.style.transform = \`translateY(\${scrolled * 0.1}px)\`;
  }
});

// Intersection Observer for animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: '20px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('fade-in');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Observe elements
document.querySelectorAll('.tokenomics-card, .social-card').forEach(el => {
  observer.observe(el);
});

// Copy to clipboard functionality
async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    const copyBtn = document.querySelector('.copy-btn');
    const originalIcon = copyBtn.innerHTML;
    copyBtn.innerHTML = '<i class="fas fa-check"></i>';
    copyBtn.classList.add('copied');
    
    setTimeout(() => {
      copyBtn.innerHTML = originalIcon;
      copyBtn.classList.remove('copied');
    }, 2000);
  } catch (err) {
    console.error('Failed to copy text: ', err);
  }
}

// Add animation styles
const animationStyles = \`
  @keyframes starTwinkle {
    0%, 100% { opacity: 0; }
    50% { opacity: 1; }
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

  .fade-in {
    animation: fadeIn 0.6s ease forwards;
  }

  .tokenomics-card, .social-card {
    opacity: 0;
  }
\`;

const styleSheet = document.createElement('style');
styleSheet.textContent = animationStyles;
document.head.appendChild(styleSheet);

// Interactive button effects
document.querySelectorAll('.plasma-btn, .glow-btn').forEach(button => {
  button.addEventListener('mousemove', (e) => {
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    button.style.setProperty('--x', \`\${x}px\`);
    button.style.setProperty('--y', \`\${y}px\`);
  });
});

// Add button interaction styles
const buttonStyles = \`
  .plasma-btn, .glow-btn {
    position: relative;
    overflow: hidden;
  }

  .plasma-btn::after, .glow-btn::after {
    content: '';
    position: absolute;
    width: 100px;
    height: 100px;
    top: var(--y, 0);
    left: var(--x, 0);
    transform: translate(-50%, -50%);
    background: radial-gradient(circle closest-side, rgba(255, 255, 255, 0.2), transparent);
    transition: width 0.2s ease, height 0.2s ease;
  }

  .plasma-btn:hover::after, .glow-btn:hover::after {
    width: 200px;
    height: 200px;
  }
\`;

const buttonStyleSheet = document.createElement('style');
buttonStyleSheet.textContent = buttonStyles;
document.head.appendChild(buttonStyleSheet);
`};
