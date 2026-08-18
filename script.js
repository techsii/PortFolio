// Initialize EmailJS with your public key
(function() {
    emailjs.init("FvVfm0YF7DIRNw8XV");
})();

// Theme Management
class ThemeManager {
    constructor() {
        this.currentTheme = localStorage.getItem('theme') || 'dark';
        this.root = document.documentElement;
        this.themeToggle = document.getElementById('theme-toggle');
        
        this.init();
    }
    
    init() {
        this.setTheme(this.currentTheme);
        this.themeToggle.addEventListener('click', () => this.toggleTheme());
    }
    
    setTheme(theme) {
        this.currentTheme = theme;
        this.root.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        
        const icon = this.themeToggle.querySelector('i');
        if (theme === 'light') {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        }
    }
    
    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
    }
}

// Navigation Management
class NavigationManager {
    constructor() {
        this.nav = document.querySelector('.navbar');
        this.menu = document.querySelector('.nav-menu');
        this.toggle = document.getElementById('mobile-menu');
        this.navLinks = document.querySelectorAll('.nav-link');
        
        this.init();
    }
    
    init() {
        this.setupScrollListener();
        this.setupMobileMenu();
        this.setupSmoothScrolling();
        this.setupActiveLinkHighlighting();
    }
    
    setupScrollListener() {
        let lastScrollTop = 0;
        
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            if (scrollTop > 100) {
                this.nav.classList.add('scrolled');
            } else {
                this.nav.classList.remove('scrolled');
            }
            
            lastScrollTop = scrollTop;
        });
    }
    
    setupMobileMenu() {
        this.toggle.addEventListener('click', () => {
            this.menu.classList.toggle('active');
            this.toggle.classList.toggle('toggle-active');
        });
        
        // Close menu when clicking on a link
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.menu.classList.remove('active');
                this.toggle.classList.remove('toggle-active');
            });
        });
    }
    
    setupSmoothScrolling() {
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
    }
    
    setupActiveLinkHighlighting() {
        const sections = document.querySelectorAll('section[id]');
        
        window.addEventListener('scroll', () => {
            let current = '';
            const scrollPosition = window.scrollY + 100;
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                
                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    current = section.getAttribute('id');
                }
            });
            
            this.navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        });
    }
}

// Scroll Progress Indicator
class ScrollProgress {
    constructor() {
        this.progress = document.querySelector('.scroll-progress');
        this.init();
    }
    
    init() {
        window.addEventListener('scroll', () => {
            const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
            this.progress.style.width = `${scrolled}%`;
        });
    }
}

// Back to Top Button
class BackToTop {
    constructor() {
        this.button = document.getElementById('backToTop');
        this.init();
    }
    
    init() {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                this.button.classList.add('visible');
            } else {
                this.button.classList.remove('visible');
            }
        });
        
        this.button.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// Contact Form Management
class ContactForm {
    constructor() {
        this.form = document.getElementById('contactForm');
        this.submitBtn = this.form.querySelector('button[type="submit"]');
        this.isSubmitting = false;
        
        this.init();
    }
    
    init() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });
    }
    
    async handleSubmit() {
        if (this.isSubmitting) return;
        
        const formData = new FormData(this.form);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            subject: formData.get('subject'),
            message: formData.get('message')
        };
        
        // Validation
        if (!this.validateForm(data)) {
            this.showMessage('Please fill in all fields correctly.', 'error');
            return;
        }
        
        this.setSubmitting(true);
        
        try {
            const response = await emailjs.send('service_i6oxght', 'template_rfs0a1u', {
                from_name: data.name,
                from_email: data.email,
                subject: data.subject,
                message: data.message
            });
            
            this.showMessage('Message sent successfully! I\'ll get back to you soon.', 'success');
            this.form.reset();
        } catch (error) {
            console.error('Email sending failed:', error);
            this.showMessage('Failed to send message. Please try again later.', 'error');
        } finally {
            this.setSubmitting(false);
        }
    }
    
    validateForm(data) {
        return data.name.trim() && 
               data.email.trim() && 
               data.subject.trim() && 
               data.message.trim() &&
               this.isValidEmail(data.email);
    }
    
    isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    setSubmitting(isSubmitting) {
        this.isSubmitting = isSubmitting;
        if (isSubmitting) {
            this.submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            this.submitBtn.disabled = true;
        } else {
            this.submitBtn.innerHTML = 'Send Message';
            this.submitBtn.disabled = false;
        }
    }
    
    showMessage(message, type) {
        // Remove existing messages
        const existingMessage = document.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        // Create new message
        const messageDiv = document.createElement('div');
        messageDiv.className = `form-message form-message-${type}`;
        messageDiv.textContent = message;
        
        // Add to form
        this.form.parentNode.insertBefore(messageDiv, this.form.nextSibling);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.remove();
            }
        }, 5000);
    }
}

// Scroll Animations
class ScrollAnimations {
    constructor() {
        this.observer = null;
        this.init();
    }
    
    init() {
        this.setupIntersectionObserver();
        this.setupSkillProgress();
    }
    
    setupIntersectionObserver() {
        const options = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    
                    // Trigger skill progress animation
                    if (entry.target.classList.contains('skills')) {
                        this.animateSkillBars();
                    }
                }
            });
        }, options);
        
        // Observe all sections and card types
        document.querySelectorAll('.section, .project-card, .service-card, .certification-card, .achievement-card, .skill-block').forEach(el => {
            this.observer.observe(el);
        });
    }
    
    setupSkillProgress() {
        // Pre-calculate skill percentages
        this.skillPercentages = {
            'HTML': 95,
            'CSS': 90,
            'JavaScript': 85,
            'React': 80,
            'Node.js': 85,
            'Express': 80,
            'MongoDB': 80,
            'Firebase': 75,
            'Git & GitHub': 90,
            'VS Code': 95
        };
    }
    
    animateSkillBars() {
        const skillBars = document.querySelectorAll('.skill-progress');
        
        skillBars.forEach(bar => {
            const skillName = bar.parentElement.previousElementSibling.textContent;
            const percentage = this.skillPercentages[skillName] || 0;
            
            // Animate to the target percentage
            let currentWidth = 0;
            const interval = setInterval(() => {
                if (currentWidth >= percentage) {
                    clearInterval(interval);
                    bar.style.width = `${percentage}%`;
                } else {
                    currentWidth++;
                    bar.style.width = `${currentWidth}%`;
                }
            }, 20);
        });
    }
}

// Particle Background (Enhanced Hero Background)
class ParticleBackground {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.particles = [];
        this.isAnimating = false;
        
        this.init();
    }
    
    init() {
        this.createCanvas();
        this.setupParticles();
        this.animate();
    }
    
    createCanvas() {
        this.canvas = document.createElement('canvas');
        this.canvas.style.position = 'absolute';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.zIndex = '-2';
        
        const hero = document.querySelector('.hero');
        hero.insertBefore(this.canvas, hero.firstChild);
        
        this.ctx = this.canvas.getContext('2d');
        this.resize();
        
        window.addEventListener('resize', () => this.resize());
    }
    
    resize() {
        this.canvas.width = this.canvas.offsetWidth;
        this.canvas.height = this.canvas.offsetHeight;
    }
    
    setupParticles() {
        const particleCount = 50;
        
        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 2 + 1,
                opacity: Math.random() * 0.5 + 0.1
            });
        }
    }
    
    animate() {
        if (!this.isAnimating) {
            this.isAnimating = true;
        }
        
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw particles
        this.particles.forEach(particle => {
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(102, 126, 234, ${particle.opacity})`;
            this.ctx.fill();
            
            // Move particles
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Bounce off edges
            if (particle.x < 0 || particle.x > this.canvas.width) particle.vx *= -1;
            if (particle.y < 0 || particle.y > this.canvas.height) particle.vy *= -1;
        });
        
        requestAnimationFrame(() => this.animate());
    }
}

// Loading Animation
class LoadingAnimation {
    constructor() {
        this.loader = null;
        this.init();
    }
    
    init() {
        // Create loading screen
        this.loader = document.createElement('div');
        this.loader.className = 'loading';
        this.loader.innerHTML = '<div class="loader"></div>';
        
        document.body.appendChild(this.loader);
        
        // Remove after 2 seconds or when page loads
        setTimeout(() => {
            this.hide();
        }, 2000);
        
        window.addEventListener('load', () => {
            setTimeout(() => {
                this.hide();
            }, 500);
        });
    }
    
    hide() {
        if (this.loader) {
            this.loader.style.opacity = '0';
            setTimeout(() => {
                if (this.loader.parentNode) {
                    this.loader.parentNode.removeChild(this.loader);
                }
            }, 500);
        }
    }
}

// Initialize All Components
document.addEventListener('DOMContentLoaded', () => {
    // Initialize loading animation first
    new LoadingAnimation();
    
    // Initialize all components
    new ThemeManager();
    new NavigationManager();
    new ScrollProgress();
    new BackToTop();
    new ContactForm();
    new ScrollAnimations();
    new ParticleBackground();
    
    // Add some additional enhancements
    setupTypingAnimation();
    setupScrollReveal();
});

// Additional Enhancements
function setupTypingAnimation() {
    const text = "Full Stack Developer";
    const element = document.querySelector('.hero-subtitle');
    let index = 0;
    
    function typeWriter() {
        if (index < text.length) {
            element.textContent = text.slice(0, index + 1);
            index++;
            setTimeout(typeWriter, 100);
        }
    }
    
    // Start typing animation after hero title loads
    setTimeout(typeWriter, 1000);
}

function setupScrollReveal() {
    // Add subtle fade-in for all sections
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });
}

// Performance optimizations
window.addEventListener('load', () => {
    // Lazy load images
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    observer.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => {
            imageObserver.observe(img);
        });
    }
});

// Accessibility enhancements
document.addEventListener('DOMContentLoaded', () => {
    // Add ARIA labels
    const nav = document.querySelector('.navbar');
    nav.setAttribute('aria-label', 'Main navigation');
    
    const menu = document.querySelector('.nav-menu');
    menu.setAttribute('role', 'navigation');
    
    // Keyboard navigation for mobile menu
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const menu = document.querySelector('.nav-menu');
            const toggle = document.getElementById('mobile-menu');
            if (menu.classList.contains('active')) {
                menu.classList.remove('active');
                toggle.classList.remove('toggle-active');
            }
        }
    });
});

// Error handling for EmailJS
window.addEventListener('error', (e) => {
    console.error('JavaScript Error:', e.error);
    // You can add error reporting here if needed
});

// Console welcome message
console.log(`
%c🚀 Portfolio Loaded Successfully!
%c
Made with ❤️ by Neel Bhattacharjee
📧 neel04735@gmail.com
📱 +91 7070882198
`, 'color: #667eea; font-size: 16px; font-weight: bold;', 'color: #a0a8b3; font-size: 12px;');