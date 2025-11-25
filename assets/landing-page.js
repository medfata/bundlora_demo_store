/**
 * Landing Page JavaScript for Bundlora
 * Minimal interactions for enhanced user experience
 */

(function() {
  'use strict';

  // Initialize landing page functionality when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLandingPage);
  } else {
    initLandingPage();
  }

  function initLandingPage() {
    initSmoothScrolling();
    initCTATracking();
    initAnimationOnScroll();
    initTrustBadgeAnimations();
  }

  /**
   * Smooth scrolling for anchor links
   */
  function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
      link.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
          e.preventDefault();
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  }

  /**
   * Track CTA button clicks for analytics
   */
  function initCTATracking() {
    const ctaButtons = document.querySelectorAll('.landing-btn--primary');

    ctaButtons.forEach(button => {
      button.addEventListener('click', function() {
        // Track CTA clicks
        if (typeof gtag !== 'undefined') {
          gtag('event', 'click', {
            'event_category': 'CTA',
            'event_label': this.textContent.trim(),
            'value': 1
          });
        }

        // Track with Shopify Analytics if available
        if (typeof ShopifyAnalytics !== 'undefined') {
          ShopifyAnalytics.lib.track('Landing Page CTA Click', {
            buttonText: this.textContent.trim(),
            buttonLocation: this.closest('section').className
          });
        }
      });
    });
  }

  /**
   * Animate elements as they come into view
   */
  function initAnimationOnScroll() {
    // Check if Intersection Observer is supported
    if (!('IntersectionObserver' in window)) {
      return;
    }

    const animatedElements = document.querySelectorAll(
      '.landing-bundle-types__card, .landing-social-proof__testimonial, .landing-setup-process__step'
    );

    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    animatedElements.forEach(element => {
      // Set initial state
      element.style.opacity = '0';
      element.style.transform = 'translateY(20px)';
      element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';

      observer.observe(element);
    });
  }

  /**
   * Animate trust badges with a staggered effect
   */
  function initTrustBadgeAnimations() {
    const trustBadges = document.querySelectorAll('.landing-trust-badge');

    if (trustBadges.length === 0) return;

    // Animate trust badges with staggered delay
    trustBadges.forEach((badge, index) => {
      badge.style.opacity = '0';
      badge.style.transform = 'scale(0.9)';
      badge.style.transition = 'opacity 0.4s ease, transform 0.4s ease';

      setTimeout(() => {
        badge.style.opacity = '1';
        badge.style.transform = 'scale(1)';
      }, index * 100);
    });
  }

  /**
   * Add visual feedback for button interactions
   */
  function addButtonFeedback() {
    const buttons = document.querySelectorAll('.landing-btn');

    buttons.forEach(button => {
      button.addEventListener('mousedown', function() {
        this.style.transform = 'translateY(1px) scale(0.98)';
      });

      button.addEventListener('mouseup', function() {
        this.style.transform = '';
      });

      button.addEventListener('mouseleave', function() {
        this.style.transform = '';
      });
    });
  }

  // Initialize button feedback
  addButtonFeedback();

  /**
   * Lazy load images for better performance
   */
  function initLazyLoading() {
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

      const lazyImages = document.querySelectorAll('img[data-src]');
      lazyImages.forEach(img => imageObserver.observe(img));
    }
  }

  // Initialize lazy loading
  initLazyLoading();

  /**
   * Add subtle parallax effect to hero section (optional enhancement)
   */
  function initParallaxEffect() {
    const heroSection = document.querySelector('.landing-hero');
    if (!heroSection) return;

    let ticking = false;

    function updateParallax() {
      const scrolled = window.pageYOffset;
      const rate = scrolled * -0.5;

      if (heroSection) {
        heroSection.style.transform = `translateY(${rate}px)`;
      }

      ticking = false;
    }

    function requestParallaxUpdate() {
      if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
      }
    }

    // Only enable parallax on desktop to avoid mobile performance issues
    if (window.innerWidth > 768) {
      window.addEventListener('scroll', requestParallaxUpdate);
    }
  }

  // Initialize parallax effect (optional)
  // initParallaxEffect();

})();