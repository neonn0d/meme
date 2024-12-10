export const generateChristmasJS = () => `
// Immediately create snow container if it doesn't exist
(function() {
    if (!document.getElementById('snow-container')) {
        const snowContainer = document.createElement('div');
        snowContainer.id = 'snow-container';
        snowContainer.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100vh; pointer-events: none; z-index: 1; overflow: hidden;';
        document.body.insertBefore(snowContainer, document.body.firstChild);
    }
})();

// Snow animation
const createSnow = () => {
    const snowflakes = 50;
    const container = document.getElementById('snow-container');
    if (!container) return;

    // Clear container
    container.innerHTML = '';

    // Create keyframes style if it doesn't exist
    if (!document.getElementById('snow-keyframes')) {
        const keyframesStyle = document.createElement('style');
        keyframesStyle.id = 'snow-keyframes';
        keyframesStyle.textContent = \`
            @keyframes snowfall {
                0% {
                    transform: translate3d(var(--left-ini), 0, 0);
                }
                100% {
                    transform: translate3d(var(--left-end), 100vh, 0);
                }
            }
        \`;
        document.head.appendChild(keyframesStyle);
    }

    // Create snowflakes
    for (let i = 0; i < snowflakes; i++) {
        const snowflake = document.createElement('div');
        const randomLeft = Math.random() * 100;
        const leftIni = randomLeft - 10;
        const leftEnd = randomLeft + 10;
        
        snowflake.style.cssText = \`
            position: fixed;
            z-index: 999999;
            width: \${Math.random() * 3 + 2}px;
            height: \${Math.random() * 3 + 2}px;
            background: white;
            border-radius: 50%;
            opacity: \${Math.random() * 0.6 + 0.4};
            --left-ini: \${leftIni}vw;
            --left-end: \${leftEnd}vw;
            left: \${randomLeft}vw;
            top: -5vh;
            animation: snowfall \${Math.random() * 3 + 2}s linear infinite;
            animation-delay: -\${Math.random() * 5}s;
        \`;
        
        container.appendChild(snowflake);
    }
};

// Create snow immediately and recreate periodically
createSnow();
setInterval(createSnow, 5000);

// Mobile menu toggle
function toggleMobileMenu() {
    const nav = document.querySelector('.nav-links');
    const hamburger = document.querySelector('.hamburger');
    if (nav && hamburger) {
        nav.classList.toggle('active');
        hamburger.classList.toggle('active');
    }
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
            // Close mobile menu if open
            const nav = document.querySelector('.nav-links');
            const hamburger = document.querySelector('.hamburger');
            if (nav && nav.classList.contains('active')) {
                nav.classList.remove('active');
                hamburger?.classList.remove('active');
            }
        }
    });
});

// Copy contract address
function copyContractAddress() {
    const address = document.getElementById('contract-address')?.textContent;
    if (address) {
        navigator.clipboard.writeText(address).then(() => {
            const tooltip = document.getElementById('copy-tooltip');
            if (tooltip) {
                tooltip.textContent = 'Copied!';
                setTimeout(() => {
                    tooltip.textContent = 'Copy to clipboard';
                }, 2000);
            }
        });
    }
}

// Initialize everything when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Setup mobile menu click handler
    const hamburger = document.querySelector('.hamburger');
    if (hamburger) {
        hamburger.addEventListener('click', toggleMobileMenu);
    }
    
    // Setup copy button click handler
    const copyBtn = document.querySelector('.copy-btn');
    if (copyBtn) {
        copyBtn.addEventListener('click', copyContractAddress);
    }
    
    // Ensure snow is running
    createSnow();
});
`;
