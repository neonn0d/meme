export const generatePlayfulJS = (): string => {
  return `
    document.addEventListener('DOMContentLoaded', function() {
      // FAQ Accordion
      const faqQuestions = document.querySelectorAll('.faq-question');
      
      faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
          const faqId = this.getAttribute('data-faq');
          const answer = document.getElementById('faq-answer-' + faqId);
          
          // Toggle active class
          answer.classList.toggle('active');
          
          // Change icon
          const icon = this.querySelector('.faq-icon');
          icon.textContent = answer.classList.contains('active') ? '-' : '+';
        });
      });
      
      // Smooth scrolling for anchor links
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
          e.preventDefault();
          
          const targetId = this.getAttribute('href');
          if (targetId === '#') return;
          
          const targetElement = document.querySelector(targetId);
          if (targetElement) {
            window.scrollTo({
              top: targetElement.offsetTop - 80, // Offset for fixed navbar
              behavior: 'smooth'
            });
          }
        });
      });
      
      // Animation on scroll
      const animateOnScroll = () => {
        const elements = document.querySelectorAll('.feature-card, .tokenomics-card, .team-card, .roadmap-item');
        
        elements.forEach(element => {
          const elementPosition = element.getBoundingClientRect().top;
          const windowHeight = window.innerHeight;
          
          if (elementPosition < windowHeight - 50) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
          }
        });
      };
      
      // Set initial styles for animation
      const elementsToAnimate = document.querySelectorAll('.feature-card, .tokenomics-card, .team-card, .roadmap-item');
      elementsToAnimate.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      });
      
      // Run animation on load and scroll
      animateOnScroll();
      window.addEventListener('scroll', animateOnScroll);
      
      // Form submission (prevent default)
      const contactForm = document.querySelector('.contact-form');
      if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
          e.preventDefault();
          alert('This is a demo form. In a real website, this would submit your message.');
        });
      }
      
      // Mobile navigation toggle (if implemented in the future)
      const setupMobileNav = () => {
        const navButton = document.querySelector('.mobile-nav-toggle');
        if (navButton) {
          navButton.addEventListener('click', function() {
            const navMenu = document.querySelector('.nav-menu');
            navMenu.classList.toggle('active');
          });
        }
      };
      
      setupMobileNav();
    });
  `;
};
