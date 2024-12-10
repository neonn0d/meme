export const generatePepeJS = (): string => {
  return `
  document.addEventListener('DOMContentLoaded', function() {
    // Contract copy functionality
    const contractLink = document.querySelector('.contract-link');
    if (contractLink) {
      contractLink.addEventListener('click', function(e) {
        e.preventDefault();
        const contract = this.getAttribute('data-contract');
        navigator.clipboard.writeText(contract).then(() => {
          alert('Contract address copied!');
        });
      });
    }

    // Mobile navbar functionality
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
      hamburger.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log('Hamburger clicked'); // Debug log
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.classList.toggle('no-scroll');
      });

      // Close menu when clicking a link
      const navLinks = document.querySelectorAll('.nav-links a');
      navLinks.forEach(link => {
        link.addEventListener('click', () => {
          hamburger.classList.remove('active');
          navMenu.classList.remove('active');
          document.body.classList.remove('no-scroll');
        });
      });

      // Close menu when clicking outside
      document.addEventListener('click', (e) => {
        if (navMenu.classList.contains('active') && 
            !navMenu.contains(e.target) && 
            !hamburger.contains(e.target)) {
          hamburger.classList.remove('active');
          navMenu.classList.remove('active');
          document.body.classList.remove('no-scroll');
        }
      });
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const href = this.getAttribute('href');
        if (href === '#') return;
        
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });

    // FAQ functionality
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
      const question = item.querySelector('.faq-question');
      const answer = item.querySelector('.faq-answer');
      const toggle = item.querySelector('.faq-toggle');
      
      if (question) {
        question.addEventListener('click', () => {
          // Close other FAQs
          faqItems.forEach(otherItem => {
            if (otherItem !== item) {
              otherItem.classList.remove('active');
              const otherAnswer = otherItem.querySelector('.faq-answer');
              const otherToggle = otherItem.querySelector('.faq-toggle');
              if (otherAnswer) otherAnswer.style.maxHeight = '0px';
              if (otherToggle) otherToggle.textContent = '+';
            }
          });

          // Toggle current FAQ
          item.classList.toggle('active');
          if (answer && toggle) {
            if (item.classList.contains('active')) {
              answer.style.maxHeight = answer.scrollHeight + 'px';
              toggle.textContent = '−';
            } else {
              answer.style.maxHeight = '0px';
              toggle.textContent = '+';
            }
          }
        });
      }
    });
  });
  `;
};