import { PreviewData } from '@/types';

export const generateStellarCSS = ({ primaryColor = '#3B82F6', secondaryColor = '#c0bfbc' }: PreviewData): string => {
    return `
/* Custom properties for colors */
:root {
    --primary-color: ${primaryColor};
    --secondary-color: ${secondaryColor};
    scroll-behavior: smooth;
}

/* Base styles */
body {
    font-family: 'Inter', sans-serif;
    background-color: #0f172a;
    color: white;
    overflow-x: hidden;
    position: relative;
    /* Super simple stars background that will definitely work */
    background-image: 
        radial-gradient(white, rgba(255,255,255,.2) 2px, transparent 40px),
        radial-gradient(white, rgba(255,255,255,.15) 1px, transparent 30px),
        radial-gradient(white, rgba(255,255,255,.1) 2px, transparent 40px),
        radial-gradient(rgba(255,255,255,.4), rgba(255,255,255,.1) 2px, transparent 30px);
    background-size: 550px 550px, 350px 350px, 250px 250px, 150px 150px;
    background-position: 0 0, 40px 60px, 130px 270px, 70px 100px;
}

/* Button styles */
.btn-primary {
    background-color: var(--primary-color);
    color: white;
    padding: 0.75rem 1.5rem;
    border-radius: 0.5rem;
    font-weight: 600;
    transition: all 0.3s ease;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
}

.btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}

.btn-secondary {
    background-color: transparent;
    color: white;
    padding: 0.75rem 1.5rem;
    border-radius: 0.5rem;
    font-weight: 600;
    border: 2px solid var(--secondary-color);
    transition: all 0.3s ease;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
}

.btn-secondary:hover {
    background-color: var(--secondary-color);
    color: #0f172a;
}

/* Hero section */
.hero {
    position: relative;
    min-height: 80vh;
    display: flex;
    align-items: center;
    overflow: hidden;
}

.hero-content {
    position: relative;
    z-index: 10;
}

.hero-image {
    animation: float 6s ease-in-out infinite;
}

/* Tokenomics section */
.tokenomics-card {
    background: rgba(15, 23, 42, 0.6);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 1rem;
    padding: 1.5rem;
    backdrop-filter: blur(10px);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.tokenomics-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}

.tokenomics-icon {
    background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
    width: 50px;
    height: 50px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 1rem;
}

/* Roadmap section */
.roadmap-phase {
    position: relative;
    padding-left: 2rem;
    margin-bottom: 2rem;
}

.roadmap-phase::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    width: 1rem;
    height: 1rem;
    background-color: var(--primary-color);
    border-radius: 50%;
    z-index: 1;
}

.roadmap-phase::after {
    content: '';
    position: absolute;
    left: 0.5rem;
    top: 1rem;
    width: 1px;
    height: calc(100% + 1rem);
    background-color: rgba(255, 255, 255, 0.2);
    transform: translateX(-50%);
}

.roadmap-phase:last-child::after {
    display: none;
}

/* Team section */
.team-card {
    background: rgba(15, 23, 42, 0.6);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 1rem;
    overflow: hidden;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.team-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}

.team-image {
    width: 100%;
    height: 200px;
    object-fit: cover;
}

/* FAQ section */
.faq-item {
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    padding: 1.5rem 0;
}

.faq-question {
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    font-weight: 600;
    font-size: 1.1rem;
}

.faq-answer {
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.3s ease, padding 0.3s ease;
    opacity: 0;
}

.faq-item.active .faq-answer {
    max-height: 500px;
    padding-top: 1rem;
    opacity: 1;
}

.faq-icon {
    transition: transform 0.3s ease;
}

.faq-item.active .faq-icon {
    transform: rotate(45deg);
}

/* Community section */
.community-card {
    background: rgba(15, 23, 42, 0.6);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 1rem;
    padding: 1.5rem;
    backdrop-filter: blur(10px);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.community-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}

/* Animation for scroll reveal */
.reveal {
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.6s ease, transform 0.6s ease;
}

.reveal.active {
    opacity: 1;
    transform: translateY(0);
}

/* Copy animation */
.copy-animation {
    animation: pulse 1s ease-in-out;
}

@keyframes pulse {
    0% {
        transform: scale(1);
    }
    50% {
        transform: scale(1.05);
    }
    100% {
        transform: scale(1);
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

/* Responsive styles */
@media (max-width: 768px) {
    .hero {
        text-align: center;
    }
    
    .hero-image {
        margin-top: 2rem;
    }
    
    .tokenomics-card {
        margin-bottom: 1rem;
    }
    
    .team-card {
        margin-bottom: 2rem;
    }
}
`;
};
