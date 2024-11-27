export const generateCosmicJS = (): string => {
    return `
  document.addEventListener('DOMContentLoaded', () => {
    // Smooth scroll for navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        document.querySelector(anchor.getAttribute('href')).scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      });
    });
  
    // Dynamic button hover effect
    document.querySelectorAll('.button').forEach(button => {
      button.addEventListener('mouseenter', () => button.style.opacity = '0.8');
      button.addEventListener('mouseleave', () => button.style.opacity = '1');
    });
  });
  `;
  };
  