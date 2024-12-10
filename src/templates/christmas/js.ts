export const generateChristmasJS = () => `
// Snow animation
function createSnowflakes() {
    const container = document.getElementById('snow-container');
    if (!container) return;

    // Clear existing snowflakes
    container.innerHTML = '';

    // Create snowflakes
    const numberOfSnowflakes = 50;
    for (let i = 0; i < numberOfSnowflakes; i++) {
        const snowflake = document.createElement('div');
        snowflake.className = 'snowflake';
        snowflake.style.cssText = \`
            position: fixed;
            background: white;
            border-radius: 50%;
            pointer-events: none;
            user-select: none;
            animation-name: snowfall-\${Math.floor(Math.random() * 4)};
            animation-duration: \${Math.random() * 3 + 2}s;
            animation-timing-function: linear;
            animation-iteration-count: infinite;
            width: \${Math.random() * 4 + 2}px;
            height: \${Math.random() * 4 + 2}px;
            opacity: \${Math.random() * 0.6 + 0.4};
            left: \${Math.random() * 100}vw;
            top: -10px;
            will-change: transform;
        \`;
        container.appendChild(snowflake);
    }
}

// Create keyframes for different snow patterns
function createSnowKeyframes() {
    const style = document.createElement('style');
    const keyframes = [];
    
    for (let i = 0; i < 4; i++) {
        keyframes.push(\`
            @keyframes snowfall-\${i} {
                0% {
                    transform: translate3d(0, -10px, 0);
                }
                100% {
                    transform: translate3d(\${(Math.random() - 0.5) * 200}px, 100vh, 0);
                }
            }
        \`);
    }
    
    style.textContent = keyframes.join('\\n');
    document.head.appendChild(style);
}

// Hamburger menu
function setupMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navLinksItems = document.querySelectorAll('.nav-link');

    if (!hamburger || !navLinks) return;

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Close menu when clicking a link
    navLinksItems.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });
}

// Christmas light effects
function createChristmasLights() {
    const lights = document.querySelector('.christmas-lights');
    if (!lights) return;

    lights.innerHTML = Array(20).fill(null)
        .map((_, i) => \`<div class="light" style="left: \${i * 5}%"></div>\`)
        .join('');
}

// Festive hover effects
function addFestiveEffects() {
    // Add sparkle effect to buttons
    document.querySelectorAll('.christmas-btn').forEach(btn => {
        btn.addEventListener('mouseover', () => {
            btn.style.transform = 'scale(1.05) translateY(-2px)';
        });
        btn.addEventListener('mouseout', () => {
            btn.style.transform = 'none';
        });
    });

    // Add jingle effect to holly icons
    document.querySelectorAll('.holly').forEach(holly => {
        holly.addEventListener('mouseover', () => {
            holly.style.transform = 'rotate(15deg)';
        });
        holly.addEventListener('mouseout', () => {
            holly.style.transform = 'none';
        });
    });
}

// Copy to clipboard with festive feedback
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        const copyBtn = document.querySelector('.copy-btn');
        if (copyBtn) {
            const originalText = copyBtn.innerHTML;
            copyBtn.innerHTML = '🎄 Copied!';
            copyBtn.style.background = '#28a745';
            setTimeout(() => {
                copyBtn.innerHTML = originalText;
                copyBtn.style.background = '';
            }, 2000);
        }
    }).catch(err => console.error('Failed to copy:', err));
}

// Smooth scroll with Christmas easing
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

// Initialize
function init() {
    createSnowKeyframes();
    createSnowflakes();
    setupMobileMenu();
    createChristmasLights();
    addFestiveEffects();

    // Recreate snowflakes periodically to prevent them from getting stuck
    setInterval(createSnowflakes, 10000);
}

// Start when DOM is loaded
document.addEventListener('DOMContentLoaded', init);
`;
