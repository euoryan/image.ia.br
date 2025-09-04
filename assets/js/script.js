// Modern JavaScript for image.ia.br - Big Tech Quality
(function() {
    'use strict';

    // Configuration
    const CONFIG = {
        animationDuration: 200,
        debounceDelay: 100,
        gridSpeed: 20000,
        particleCount: 15
    };

    // State management
    const state = {
        isInitialized: false,
        mousePosition: { x: 0, y: 0 },
        scrollPosition: 0,
        isScrolling: false
    };

    // DOM elements
    let elements = {};

    // Initialize the application
    function init() {
        if (state.isInitialized) return;
        
        try {
            setupElements();
            setupEventListeners();
            setupAnimations();
            setupAccessibility();
            createFloatingParticles();
            
            state.isInitialized = true;
            console.log('🚀 image.ia.br initialized successfully');
        } catch (error) {
            console.error('❌ Initialization error:', error);
        }
    }

    // Setup DOM elements
    function setupElements() {
        elements = {
            nav: document.querySelector('.nav'),
            hero: document.querySelector('.hero'),
            contactCard: document.querySelector('.contact-card'),
            emailButton: document.querySelector('.email-button'),
            langButtons: document.querySelectorAll('.lang-btn'),
            floatingElements: document.querySelector('.floating-elements'),
            gridLines: document.querySelector('.grid-lines'),
            gridDots: document.querySelector('.grid-dots'),
            mouseLight: null
        };
        
        // Create mouse light effect
        createMouseLight();
    }

    // Setup event listeners
    function setupEventListeners() {
        // Mouse movement
        document.addEventListener('mousemove', handleMouseMove);
        
        // Scroll events
        window.addEventListener('scroll', throttle(handleScroll, 16));
        
        // Resize events
        window.addEventListener('resize', debounce(handleResize, CONFIG.debounceDelay));
        
        // Email button click
        if (elements.emailButton) {
            elements.emailButton.addEventListener('click', handleEmailClick);
        }
        
        // Language button clicks
        elements.langButtons.forEach(btn => {
            btn.addEventListener('click', handleLangClick);
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', handleKeydown);
        
        // Focus management
        document.addEventListener('focusin', handleFocusIn);
        document.addEventListener('focusout', handleFocusOut);
    }

    // Setup animations and effects
    function setupAnimations() {
        // Intersection Observer for scroll animations
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate-in');
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            });
            
            // Observe elements for animation
            document.querySelectorAll('.contact-card, .domain-section').forEach(el => {
                observer.observe(el);
            });
        }
        
        // Parallax effect for grid
        setupParallaxEffect();
    }

    // Setup accessibility features
    function setupAccessibility() {
        // Reduced motion preference
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            disableAnimations();
        }
        
        // High contrast mode
        if (window.matchMedia('(prefers-contrast: high)').matches) {
            document.body.classList.add('high-contrast');
        }
        
        // Setup ARIA live region
        setupLiveRegion();
    }

    // Create mouse light effect
    function createMouseLight() {
        // Check if user prefers reduced motion
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return;
        }
        
        const mouseLight = document.createElement('div');
        mouseLight.className = 'mouse-light';
        document.body.appendChild(mouseLight);
        
        elements.mouseLight = mouseLight;
    }

    // Create floating particles
    function createFloatingParticles() {
        if (!elements.floatingElements) return;
        
        const particleCount = window.innerWidth < 768 ? 8 : CONFIG.particleCount;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.cssText = `
                position: absolute;
                width: 2px;
                height: 2px;
                background: var(--primary);
                border-radius: 50%;
                opacity: 0.6;
                pointer-events: none;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation: float ${3 + Math.random() * 3}s ease-in-out infinite;
                animation-delay: ${Math.random() * 2}s;
            `;
            
            elements.floatingElements.appendChild(particle);
        }
    }

    // Setup parallax effect
    function setupParallaxEffect() {
        let ticking = false;
        
        function updateParallax() {
            const scrolled = window.pageYOffset;
            const rate = scrolled * 0.5;
            
            if (elements.gridLines) {
                elements.gridLines.style.transform = `translate(${rate}px, ${rate}px)`;
            }
            
            if (elements.gridDots) {
                elements.gridDots.style.transform = `translate(${-rate * 0.3}px, ${-rate * 0.3}px)`;
            }
            
            ticking = false;
        }
        
        function requestTick() {
            if (!ticking) {
                requestAnimationFrame(updateParallax);
                ticking = true;
            }
        }
        
        window.addEventListener('scroll', requestTick);
    }

    // Setup ARIA live region
    function setupLiveRegion() {
        const liveRegion = document.createElement('div');
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.className = 'sr-only';
        liveRegion.style.cssText = `
            position: absolute;
            width: 1px;
            height: 1px;
            padding: 0;
            margin: -1px;
            overflow: hidden;
            clip: rect(0, 0, 0, 0);
            white-space: nowrap;
            border: 0;
        `;
        document.body.appendChild(liveRegion);
        
        state.liveRegion = liveRegion;
    }

    // Event handlers
    function handleMouseMove(e) {
        state.mousePosition.x = e.clientX;
        state.mousePosition.y = e.clientY;
        
        // Update mouse light position
        updateMouseLight();
        
        // Update floating elements position
        updateFloatingElements();
    }

    function handleScroll() {
        state.scrollPosition = window.pageYOffset;
        
        // Update nav background
        if (elements.nav) {
            if (state.scrollPosition > 100) {
                elements.nav.style.background = 'rgba(10, 10, 10, 0.98)';
            } else {
                elements.nav.style.background = 'rgba(10, 10, 10, 0.95)';
            }
        }
        
        state.isScrolling = true;
        clearTimeout(state.scrollTimeout);
        state.scrollTimeout = setTimeout(() => {
            state.isScrolling = false;
        }, 150);
    }

    function handleResize() {
        // Recreate particles on resize
        if (elements.floatingElements) {
            elements.floatingElements.innerHTML = '';
            createFloatingParticles();
        }
    }

    function handleEmailClick(e) {
        e.preventDefault();
        
        const originalText = elements.emailButton.textContent;
        
        // Visual feedback
        elements.emailButton.textContent = 'Abrindo...';
        elements.emailButton.style.opacity = '0.8';
        
        // Announce to screen readers
        if (state.liveRegion) {
            state.liveRegion.textContent = 'Abrindo cliente de email';
        }
        
        setTimeout(() => {
            elements.emailButton.textContent = originalText;
            elements.emailButton.style.opacity = '1';
            
            // Open email client
            window.location.href = 'mailto:contato@euoryan.com';
        }, 500);
        
        // Analytics tracking
        trackEvent('email_click');
    }

    function handleLangClick(e) {
        // Remove active class from all buttons
        elements.langButtons.forEach(btn => btn.classList.remove('active'));
        
        // Add active class to clicked button
        e.target.closest('.lang-btn').classList.add('active');
        
        // Analytics tracking
        trackEvent('language_switch', { language: e.target.closest('.lang-btn').textContent.trim() });
    }

    function handleKeydown(e) {
        // Handle keyboard shortcuts
        if (e.key === 'Escape') {
            // Remove focus from any focused element
            if (document.activeElement && document.activeElement.blur) {
                document.activeElement.blur();
            }
        }
        
        // Handle Enter key on language buttons
        if (e.key === 'Enter' && e.target.classList.contains('lang-btn')) {
            e.target.click();
        }
    }

    function handleFocusIn(e) {
        document.body.classList.add('keyboard-navigation');
    }

    function handleFocusOut(e) {
        // Only remove if no other element is focused
        setTimeout(() => {
            if (!document.activeElement || document.activeElement === document.body) {
                document.body.classList.remove('keyboard-navigation');
            }
        }, 100);
    }

    // Utility functions
    function updateMouseLight() {
        if (!elements.mouseLight) return;
        
        // Update position
        elements.mouseLight.style.left = state.mousePosition.x + 'px';
        elements.mouseLight.style.top = state.mousePosition.y + 'px';
        
        // Show the light effect
        elements.mouseLight.style.opacity = '1';
    }

    function updateFloatingElements() {
        if (!elements.floatingElements) return;
        
        const particles = elements.floatingElements.querySelectorAll('.particle');
        particles.forEach((particle, index) => {
            const speed = 0.3 + (index % 3) * 0.1;
            const x = (state.mousePosition.x / window.innerWidth) * 100 * speed;
            const y = (state.mousePosition.y / window.innerHeight) * 100 * speed;
            
            particle.style.transform = `translate(${x}px, ${y}px)`;
        });
    }

    function disableAnimations() {
        document.documentElement.style.setProperty('--transition', 'none');
        
        // Disable CSS animations
        const style = document.createElement('style');
        style.textContent = `
            *, *::before, *::after {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
            }
        `;
        document.head.appendChild(style);
    }

    function trackEvent(eventName, data = {}) {
        // Simple analytics tracking
        console.log('📊 Event:', eventName, data);
        
        // You can integrate with Google Analytics, Mixpanel, etc. here
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, data);
        }
    }

    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Cleanup on page unload
    window.addEventListener('beforeunload', function() {
        if (state.liveRegion) {
            state.liveRegion.remove();
        }
        if (elements.mouseLight) {
            elements.mouseLight.remove();
        }
    });

    // Expose API for external use
    window.ImageIABr = {
        getState: () => ({ ...state }),
        trackEvent: trackEvent,
        version: '2.0.0'
    };

})();