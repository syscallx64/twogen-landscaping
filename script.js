/**
 * TwoGen Landscaping - Main JavaScript
 * Handles: Mobile menu, FAQ accordion, Form submission (Web3Forms), Smooth scroll, Header scroll effect
 */

document.addEventListener('DOMContentLoaded', function() {
    // ===== MOBILE MENU =====
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const nav = document.getElementById('nav');
    
    if (mobileMenuBtn && nav) {
        mobileMenuBtn.addEventListener('click', function() {
            nav.classList.toggle('active');
            // Animate hamburger to X
            const spans = this.querySelectorAll('span');
            if (nav.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
        
        // Close menu when clicking a link
        nav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('active');
                const spans = mobileMenuBtn.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            });
        });
    }
    
    // ===== HEADER SCROLL EFFECT =====
    const header = document.getElementById('header');
    let lastScroll = 0;
    
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            header.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
            header.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
        } else {
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.05)';
            header.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
        }
        
        lastScroll = currentScroll;
    });
    
    // ===== FAQ ACCORDION =====
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const faqItem = this.closest('.faq-item');
            const isActive = faqItem.classList.contains('active');
            
            // Close all other items
            document.querySelectorAll('.faq-item').forEach(item => {
                item.classList.remove('active');
            });
            
            // Toggle current item
            if (!isActive) {
                faqItem.classList.add('active');
            }
        });
    });
    
    // ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Skip if it's just "#"
            if (href === '#') return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const headerHeight = header.offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // ===== CONTACT FORM HANDLING (Web3Forms) =====
    const contactForm = document.getElementById('contact-form');
    const formMessage = document.getElementById('form-message');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Client-side validation
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const service = document.getElementById('service').value;
            const message = document.getElementById('message').value.trim();
            
            if (!name || !email || !phone || !service || !message) {
                showFormMessage('Please fill in all required fields.', 'error');
                return;
            }
            
            if (!isValidEmail(email)) {
                showFormMessage('Please enter a valid email address.', 'error');
                return;
            }
            
            // Show loading state
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            // Prepare form data
            const formData = new FormData(contactForm);
            
            // Remove honeypot field if empty (spam prevention)
            const honeypot = formData.get('website');
            if (honeypot) {
                console.log('Honeypot triggered - likely spam');
                return; // Silently fail for bots
            }
            
            // Send AJAX request to Web3Forms
            fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    showFormMessage('Thank you! Your request has been sent. We will contact you shortly.', 'success');
                    contactForm.reset();
                } else {
                    showFormMessage('Oops! Something went wrong. Please try again or call us directly.', 'error');
                    console.error('Web3Forms error:', data);
                }
            })
            .catch(error => {
                showFormMessage('Network error. Please check your connection and try again.', 'error');
                console.error('Fetch error:', error);
            })
            .finally(() => {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            });
        });
    }
    
    // Helper function to show form messages
    function showFormMessage(message, type) {
        formMessage.textContent = message;
        formMessage.className = 'form-message ' + type;
        formMessage.style.display = 'block';
        
        // Auto-hide success messages after 5 seconds
        if (type === 'success') {
            setTimeout(() => {
                formMessage.style.display = 'none';
            }, 5000);
        }
    }
    
    // Helper function for email validation
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // ===== ESCAPE USER INPUTS (XSS Prevention) =====
    // Sanitize any user-generated content that might be displayed (if we were to display it)
    // In this site, we only collect data, but good practice to include:
    function escapeHTML(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }
    
    // Apply to any dynamic content that includes user input (not needed in current static site)
    // But included as a reference for future expansion
    
    // ===== INTERSECTION OBSERVER FOR ANIMATIONS =====
    // Optional: Add scroll-triggered animations for elements
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements that should animate on scroll
    document.querySelectorAll('.service-card, .why-card, .testimonial-card, .gallery-item, .step').forEach(el => {
        el.classList.add('animate-target');
        observer.observe(el);
    });
    
    // Add CSS for animations (injected via JS since we're in one file)
    const style = document.createElement('style');
    style.textContent = `
        .animate-target {
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }
        .animate-target.animate-in {
            opacity: 1;
            transform: translateY(0);
        }
    `;
    document.head.appendChild(style);
});