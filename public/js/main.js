/**
 * @description Main JavaScript for Raedam website with comprehensive Firebase Analytics
 * @version 2.0.0
 */

// Firebase Analytics Configuration
const firebaseConfig = {
  apiKey: "AIzaSyAmPjGKsiyZyWYpngSAJ-tIzAP9lMp_wss",
  authDomain: "theory-parking.firebaseapp.com",
  projectId: "theory-parking",
  storageBucket: "theory-parking.appspot.com",
  messagingSenderId: "192548003681",
  appId: "1:192548003681:web:75dfba17644c49dd9caf20",
  measurementId: "G-6S8CGR6TWP"
};

// Initialize Firebase Analytics
let analytics = null;
try {
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  analytics = firebase.analytics();
  console.log('Firebase Analytics initialized successfully');
} catch (error) {
  console.warn('Firebase Analytics not available:', error);
}

// Analytics Helper Class
class AnalyticsTracker {
  constructor() {
    this.sessionStartTime = Date.now();
    this.pageViews = 0;
    this.userInteractions = 0;
    this.setupAnalytics();
  }

  setupAnalytics() {
    if (!analytics) return;
    
    // Track page view
    this.trackPageView();
    
    // Track user engagement
    this.trackUserEngagement();
    
    // Track performance metrics
    this.trackPerformanceMetrics();
  }

  trackPageView() {
    if (!analytics) return;
    
    const pagePath = window.location.pathname;
    const pageTitle = document.title;
    const referrer = document.referrer;
    
    analytics.logEvent('page_view', {
      page_title: pageTitle,
      page_location: pagePath,
      page_referrer: referrer,
      timestamp: new Date().toISOString()
    });

    // Track custom page view event
    analytics.logEvent('raedam_page_view', {
      page_type: this.getPageType(pagePath),
      page_section: 'main_content',
      user_agent: navigator.userAgent,
      screen_resolution: `${screen.width}x${screen.height}`,
      viewport_size: `${window.innerWidth}x${window.innerHeight}`,
      timestamp: new Date().toISOString()
    });

    console.log(`📊 Analytics: Page view tracked - ${pageTitle} (${pagePath})`);
  }

  getPageType(path) {
    if (path === '/' || path === '/index.html') return 'home';
    if (path.includes('about')) return 'about';
    if (path.includes('contact')) return 'contact';
    if (path.includes('early-access')) return 'early_access';
    return 'other';
  }

  trackUserEngagement() {
    if (!analytics) return;
    
    // Track scroll depth
    this.trackScrollDepth();
    
    // Track time on page
    this.trackTimeOnPage();
    
    // Track form interactions
    this.trackFormInteractions();
    
    // Track button clicks
    this.trackButtonClicks();
    
    // Track navigation
    this.trackNavigation();
  }

  trackScrollDepth() {
    let maxScrollDepth = 0;
    let scrollEvents = 0;
    
    window.addEventListener('scroll', () => {
      const scrollTop = window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = Math.round((scrollTop / docHeight) * 100);
      
      if (scrollPercent > maxScrollDepth) {
        maxScrollDepth = scrollPercent;
        
        // Track significant scroll milestones
        if (scrollPercent >= 25 && scrollPercent % 25 === 0) {
          analytics.logEvent('scroll_milestone', {
            scroll_percentage: scrollPercent,
            page_path: window.location.pathname,
            timestamp: new Date().toISOString()
          });
        }
      }
      
      scrollEvents++;
    });

    // Track final scroll depth when leaving page
    window.addEventListener('beforeunload', () => {
      analytics.logEvent('scroll_depth_final', {
        max_scroll_percentage: maxScrollDepth,
        total_scroll_events: scrollEvents,
        page_path: window.location.pathname,
        time_on_page: Date.now() - this.sessionStartTime,
        timestamp: new Date().toISOString()
      });
    });
  }

  trackTimeOnPage() {
    const checkpoints = [10, 30, 60, 120, 300]; // seconds
    let currentCheckpoint = 0;
    
    const timeTracker = setInterval(() => {
      const timeOnPage = Math.floor((Date.now() - this.sessionStartTime) / 1000);
      
      if (currentCheckpoint < checkpoints.length && timeOnPage >= checkpoints[currentCheckpoint]) {
        analytics.logEvent('time_on_page_checkpoint', {
          seconds_on_page: checkpoints[currentCheckpoint],
          page_path: window.location.pathname,
          timestamp: new Date().toISOString()
        });
        currentCheckpoint++;
      }
    }, 1000);

    // Clean up interval when leaving page
    window.addEventListener('beforeunload', () => {
      clearInterval(timeTracker);
    });
  }

  trackFormInteractions() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach((form, index) => {
      const formType = this.getFormType(form);
      
      // Track form start
      form.addEventListener('focusin', (e) => {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') {
          analytics.logEvent('form_field_focus', {
            form_type: formType,
            field_name: e.target.name || e.target.id || 'unknown',
            field_type: e.target.type || 'text',
            page_path: window.location.pathname,
            timestamp: new Date().toISOString()
          });
        }
      });

      // Track form submission
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = new FormData(form);
        const formFields = {};
        
        for (let [key, value] of formData.entries()) {
          formFields[key] = value;
        }
        
        analytics.logEvent('form_submission', {
          form_type: formType,
          form_fields: Object.keys(formFields),
          page_path: window.location.pathname,
          timestamp: new Date().toISOString()
        });

        // Simulate form submission (in real app, this would submit to backend)
        console.log('📝 Form submitted:', formType, formFields);
        
        // Show success message
        this.showFormSuccess(form);
      });
    });
  }

  getFormType(form) {
    if (form.classList.contains('contact-form')) return 'contact';
    if (form.classList.contains('signup-form')) return 'early_access_signup';
    if (form.classList.contains('newsletter-form')) return 'newsletter';
    return 'general';
  }

  showFormSuccess(form) {
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    
    submitButton.innerHTML = '<span>✓ Submitted!</span>';
    submitButton.disabled = true;
    
    setTimeout(() => {
      submitButton.innerHTML = originalText;
      submitButton.disabled = false;
      form.reset();
    }, 3000);
  }

  trackButtonClicks() {
    const buttons = document.querySelectorAll('button, .btn, a[href^="#"]');
    
    buttons.forEach(button => {
      button.addEventListener('click', (e) => {
        const buttonText = button.textContent.trim() || button.innerText.trim();
        const buttonType = this.getButtonType(button);
        const buttonLocation = this.getButtonLocation(button);
        
        analytics.logEvent('button_click', {
          button_text: buttonText,
          button_type: buttonType,
          button_location: buttonLocation,
          page_path: window.location.pathname,
          timestamp: new Date().toISOString()
        });

        console.log(`🔘 Analytics: Button click tracked - ${buttonText} (${buttonType})`);
      });
    });
  }

  getButtonType(button) {
    if (button.classList.contains('btn-primary')) return 'primary';
    if (button.classList.contains('btn-secondary')) return 'secondary';
    if (button.classList.contains('btn-outline')) return 'outline';
    if (button.tagName === 'A') return 'link';
    return 'button';
  }

  getButtonLocation(button) {
    if (button.closest('.header')) return 'header';
    if (button.closest('.hero')) return 'hero';
    if (button.closest('.cta')) return 'cta';
    if (button.closest('.footer')) return 'footer';
    return 'content';
  }

  trackNavigation() {
    const navLinks = document.querySelectorAll('.nav-link, .nav-mobile-link');
    
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        const linkText = link.textContent.trim();
        const linkHref = link.getAttribute('href');
        const linkLocation = link.closest('.nav-desktop') ? 'desktop' : 'mobile';
        
        analytics.logEvent('navigation_click', {
          link_text: linkText,
          link_href: linkHref,
          link_location: linkLocation,
          page_path: window.location.pathname,
          timestamp: new Date().toISOString()
        });

        console.log(`🧭 Analytics: Navigation tracked - ${linkText} -> ${linkHref}`);
      });
    });
  }

  trackPerformanceMetrics() {
    if (!analytics) return;
    
    // Track page load performance
    window.addEventListener('load', () => {
      const loadTime = Date.now() - this.sessionStartTime;
      
      analytics.logEvent('page_load_performance', {
        load_time_ms: loadTime,
        page_path: window.location.pathname,
        dom_content_loaded: performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart,
        timestamp: new Date().toISOString()
      });

      console.log(`⚡ Analytics: Page load performance tracked - ${loadTime}ms`);
    });

    // Track Core Web Vitals
    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.entryType === 'largest-contentful-paint') {
              analytics.logEvent('core_web_vitals', {
                metric_name: 'LCP',
                metric_value: entry.startTime,
                page_path: window.location.pathname,
                timestamp: new Date().toISOString()
              });
            }
          }
        });
        
        observer.observe({ entryTypes: ['largest-contentful-paint'] });
      } catch (e) {
        console.warn('Core Web Vitals tracking not available:', e);
      }
    }
  }

  // Custom event tracking methods
  trackCustomEvent(eventName, parameters = {}) {
    if (!analytics) return;
    
    const eventData = {
      ...parameters,
      page_path: window.location.pathname,
      timestamp: new Date().toISOString()
    };
    
    analytics.logEvent(eventName, eventData);
    console.log(`📊 Analytics: Custom event tracked - ${eventName}`, eventData);
  }

  trackUserJourney(step, details = {}) {
    this.trackCustomEvent('user_journey_step', {
      step: step,
      ...details
    });
  }

  trackFeatureUsage(feature, action, details = {}) {
    this.trackCustomEvent('feature_usage', {
      feature: feature,
      action: action,
      ...details
    });
  }
}

class RaedamWebsite {
  constructor() {
    this.analytics = new AnalyticsTracker();
    this.init();
  }

  init() {
    this.setupMobileNavigation();
    this.setupScrollEffects();
    this.setupFAQ();
    this.setupSmoothScrolling();
    this.setupAnalyticsEvents();
  }

  setupAnalyticsEvents() {
    // Track hero section interactions
    this.trackHeroInteractions();
    
    // Track feature section interactions
    this.trackFeatureInteractions();
    
    // Track CTA section interactions
    this.trackCTAInteractions();
  }

  trackHeroInteractions() {
    const heroButtons = document.querySelectorAll('.hero .btn');
    const heroImage = document.querySelector('.hero-image');
    
    heroButtons.forEach(button => {
      button.addEventListener('click', () => {
        this.analytics.trackCustomEvent('hero_cta_click', {
          button_text: button.textContent.trim(),
          button_type: button.classList.contains('btn-primary') ? 'primary' : 'secondary'
        });
      });
    });

    if (heroImage) {
      heroImage.addEventListener('load', () => {
        this.analytics.trackCustomEvent('hero_image_loaded', {
          image_src: heroImage.src,
          image_dimensions: `${heroImage.naturalWidth}x${heroImage.naturalHeight}`
        });
      });
    }
  }

  trackFeatureInteractions() {
    const featureCards = document.querySelectorAll('.feature-card');
    
    featureCards.forEach((card, index) => {
      card.addEventListener('click', () => {
        const featureTitle = card.querySelector('h3')?.textContent.trim();
        this.analytics.trackCustomEvent('feature_card_click', {
          feature_title: featureTitle,
          feature_index: index,
          feature_type: 'main_feature'
        });
      });
    });
  }

  trackCTAInteractions() {
    const ctaButtons = document.querySelectorAll('.cta .btn');
    
    ctaButtons.forEach(button => {
      button.addEventListener('click', () => {
        this.analytics.trackCustomEvent('cta_section_click', {
          button_text: button.textContent.trim(),
          button_type: button.classList.contains('btn-primary') ? 'primary' : 'outline',
          cta_section: 'main_cta'
        });
      });
    });
  }

  setupMobileNavigation() {
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const mobileNav = document.querySelector('.nav-mobile');
    const body = document.body;

    if (!mobileToggle || !mobileNav) return;

    mobileToggle.addEventListener('click', () => {
      const isActive = mobileToggle.classList.contains('active');
      
      if (isActive) {
        this.closeMobileMenu();
      } else {
        this.openMobileMenu();
      }
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!mobileToggle.contains(e.target) && !mobileNav.contains(e.target)) {
        this.closeMobileMenu();
      }
    });

    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeMobileMenu();
      }
    });
  }

  openMobileMenu() {
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const mobileNav = document.querySelector('.nav-mobile');
    const body = document.body;

    mobileToggle.classList.add('active');
    mobileNav.classList.add('active');
    body.style.overflow = 'hidden';
  }

  closeMobileMenu() {
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const mobileNav = document.querySelector('.nav-mobile');
    const body = document.body;

    mobileToggle.classList.remove('active');
    mobileNav.classList.remove('active');
    body.style.overflow = '';
  }

  setupScrollEffects() {
    const header = document.querySelector('.header');
    if (!header) return;

    let lastScrollY = window.scrollY;
    let ticking = false;

    const updateHeader = () => {
      if (window.scrollY > 100) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
      lastScrollY = window.scrollY;
      ticking = false;
    };

    const requestTick = () => {
      if (!ticking) {
        requestAnimationFrame(updateHeader);
        ticking = true;
      }
    };

    window.addEventListener('scroll', requestTick);
  }

  setupFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
      const question = item.querySelector('.faq-question');
      const answer = item.querySelector('.faq-answer');
      const toggle = item.querySelector('.faq-toggle');
      
      if (!question || !answer || !toggle) return;

      question.addEventListener('click', () => {
        const isOpen = item.classList.contains('active');
        
        // Close all other FAQ items
        faqItems.forEach(otherItem => {
          if (otherItem !== item) {
            otherItem.classList.remove('active');
            const otherToggle = otherItem.querySelector('.faq-toggle');
            if (otherToggle) otherToggle.textContent = '+';
          }
        });

        // Toggle current item
        if (isOpen) {
          item.classList.remove('active');
          toggle.textContent = '+';
        } else {
          item.classList.add('active');
          toggle.textContent = '−';
        }
      });
    });
  }

  setupSmoothScrolling() {
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
          const headerHeight = document.querySelector('.header')?.offsetHeight || 80;
          const targetPosition = target.offsetTop - headerHeight;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new RaedamWebsite();
});

// Add some utility functions
window.RaedamUtils = {
  // Debounce function for performance
  debounce: function(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  // Throttle function for scroll events
  throttle: function(func, limit) {
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
  },

  // Check if element is in viewport
  isInViewport: function(element) {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  },

  // Add intersection observer for animations
  observeElements: function(selector, callback, options = {}) {
    const elements = document.querySelectorAll(selector);
    const observer = new IntersectionObserver(callback, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px',
      ...options
    });

    elements.forEach(el => observer.observe(el));
    return observer;
  }
};

// Add scroll animations
document.addEventListener('DOMContentLoaded', () => {
  // Animate elements when they come into view
  const animateOnScroll = (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
      }
    });
  };

  // Observe elements for animation
  const observer = window.RaedamUtils.observeElements(
    '.feature-card, .step-card, .benefit-card, .value-card, .team-member',
    animateOnScroll
  );
});

// Add form handling
document.addEventListener('DOMContentLoaded', () => {
  const forms = document.querySelectorAll('form');
  
  forms.forEach(form => {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Get form data
      const formData = new FormData(this);
      const data = Object.fromEntries(formData);
      
      // Simple validation
      const requiredFields = this.querySelectorAll('[required]');
      let isValid = true;
      
      requiredFields.forEach(field => {
        if (!field.value.trim()) {
          isValid = false;
          field.classList.add('error');
        } else {
          field.classList.remove('error');
        }
      });
      
      if (isValid) {
        // Show success message (in real app, this would submit to server)
        this.innerHTML = '<div class="success-message"><h3>Thank you!</h3><p>Your message has been sent successfully.</p></div>';
      }
    });
  });
});

// Add loading states for buttons
document.addEventListener('DOMContentLoaded', () => {
  const buttons = document.querySelectorAll('.btn');
  
  buttons.forEach(button => {
    button.addEventListener('click', function() {
      if (this.type === 'submit') {
        const originalText = this.innerHTML;
        this.innerHTML = '<span>Loading...</span>';
        this.disabled = true;
        
        // Reset after 2 seconds (in real app, this would be after form submission)
        setTimeout(() => {
          this.innerHTML = originalText;
          this.disabled = false;
        }, 2000);
      }
    });
  });
});
