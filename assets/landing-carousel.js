/* Horizontal Bundle Carousel - Full Width */
class HorizontalBundleCarousel {
  constructor(element) {
    this.carousel = element;
    this.track = this.carousel.querySelector('.landing-hero__carousel-track');
    this.cards = [...this.carousel.querySelectorAll('.landing-hero__carousel-card')];
    this.prevBtn = this.carousel.querySelector('[data-carousel-prev]');
    this.nextBtn = this.carousel.querySelector('[data-carousel-next]');

    this.scrollAmount = 420; // Card width + gap
    this.isScrolling = false;

    this.init();
  }

  init() {
    // Bind events
    this.prevBtn?.addEventListener('click', () => this.scrollPrev());
    this.nextBtn?.addEventListener('click', () => this.scrollNext());

    // Keyboard navigation
    this.carousel.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') this.scrollPrev();
      if (e.key === 'ArrowRight') this.scrollNext();
    });

    // Touch/swipe support
    this.addTouchSupport();

    // Update navigation buttons based on scroll position
    this.track.addEventListener('scroll', () => this.updateNavigation());

    // Initial navigation state
    this.updateNavigation();
  }

  scrollPrev() {
    if (this.isScrolling) return;

    this.isScrolling = true;
    this.track.scrollBy({
      left: -this.scrollAmount,
      behavior: 'smooth'
    });

    setTimeout(() => {
      this.isScrolling = false;
    }, 300);
  }

  scrollNext() {
    if (this.isScrolling) return;

    this.isScrolling = true;
    this.track.scrollBy({
      left: this.scrollAmount,
      behavior: 'smooth'
    });

    setTimeout(() => {
      this.isScrolling = false;
    }, 300);
  }

  updateNavigation() {
    const scrollLeft = this.track.scrollLeft;
    const maxScroll = this.track.scrollWidth - this.track.clientWidth;

    // Update prev button
    if (this.prevBtn) {
      this.prevBtn.style.opacity = scrollLeft <= 0 ? '0.5' : '1';
      this.prevBtn.style.pointerEvents = scrollLeft <= 0 ? 'none' : 'auto';
    }

    // Update next button
    if (this.nextBtn) {
      this.nextBtn.style.opacity = scrollLeft >= maxScroll ? '0.5' : '1';
      this.nextBtn.style.pointerEvents = scrollLeft >= maxScroll ? 'none' : 'auto';
    }
  }

  addTouchSupport() {
    let startX = 0;
    let startY = 0;
    let deltaX = 0;
    let deltaY = 0;
    let isDragging = false;

    this.track.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      isDragging = true;
    }, { passive: true });

    this.track.addEventListener('touchmove', (e) => {
      if (!isDragging) return;

      deltaX = e.touches[0].clientX - startX;
      deltaY = e.touches[0].clientY - startY;

      // Prevent vertical scroll if horizontal swipe detected
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        e.preventDefault();
      }
    }, { passive: false });

    this.track.addEventListener('touchend', () => {
      if (!isDragging) return;

      // Threshold for swipe detection
      if (Math.abs(deltaX) > 50 && Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX > 0) {
          this.scrollPrev();
        } else {
          this.scrollNext();
        }
      }

      startX = 0;
      startY = 0;
      deltaX = 0;
      deltaY = 0;
      isDragging = false;
    }, { passive: true });

    // Mouse drag support for desktop
    let mouseDown = false;
    let startScrollLeft = 0;

    this.track.addEventListener('mousedown', (e) => {
      mouseDown = true;
      startX = e.pageX - this.track.offsetLeft;
      startScrollLeft = this.track.scrollLeft;
      this.track.style.cursor = 'grabbing';
    });

    this.track.addEventListener('mouseleave', () => {
      mouseDown = false;
      this.track.style.cursor = 'grab';
    });

    this.track.addEventListener('mouseup', () => {
      mouseDown = false;
      this.track.style.cursor = 'grab';
    });

    this.track.addEventListener('mousemove', (e) => {
      if (!mouseDown) return;
      e.preventDefault();
      const x = e.pageX - this.track.offsetLeft;
      const walk = (x - startX) * 2;
      this.track.scrollLeft = startScrollLeft - walk;
    });
  }

  // Public method to scroll to specific card
  scrollToCard(index) {
    if (index >= 0 && index < this.cards.length) {
      const targetScroll = index * this.scrollAmount;
      this.track.scrollTo({
        left: targetScroll,
        behavior: 'smooth'
      });
    }
  }
}

// Initialize carousel when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const carousels = document.querySelectorAll('[data-carousel]');
  carousels.forEach(carousel => new HorizontalBundleCarousel(carousel));
});

// Handle window resize
window.addEventListener('resize', () => {
  const carousels = document.querySelectorAll('[data-carousel]');
  carousels.forEach(carousel => {
    const instance = carousel.carouselInstance;
    if (instance) {
      instance.updateNavigation();
    }
  });
});