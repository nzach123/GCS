/**
 * GCS Showcase - Hero Rotation System
 * 
 * Features:
 * - Auto-advances slides every 8 seconds
 * - Pauses on hover for better UX
 * - Cleans up timer on page unload (memory leak prevention)
 * - Graceful degradation: works without JS (shows first slide)
 */

(function() {
    'use strict';

    // Configuration
    const CONFIG = {
        rotationInterval: 8000,  // 8 seconds
        pauseOnHover: true,
        totalSlides: 3
    };

    // State
    let rotationTimer = null;
    let currentSlide = 1;
    let isPaused = false;

    /**
     * Initialize the hero rotation system
     */
    function init() {
        const heroSection = document.querySelector('.showcase-hero');
        const infoArea = document.querySelector('.hero-info-area');
        
        if (!heroSection) return;

        // Start auto-rotation
        startRotation();

        // Pause on hover (info area)
        if (CONFIG.pauseOnHover && infoArea) {
            infoArea.addEventListener('mouseenter', pauseRotation);
            infoArea.addEventListener('mouseleave', resumeRotation);
        }

        // Handle manual navigation clicks
        document.querySelectorAll('.nav-label').forEach(label => {
            label.addEventListener('click', handleNavClick);
        });

        // Cleanup on page unload
        window.addEventListener('beforeunload', cleanup);
    }

    /**
     * Start the auto-rotation timer
     */
    function startRotation() {
        if (rotationTimer) clearInterval(rotationTimer);
        
        rotationTimer = setInterval(() => {
            if (!isPaused) {
                advanceSlide();
            }
        }, CONFIG.rotationInterval);
    }

    /**
     * Advance to the next slide
     */
    function advanceSlide() {
        currentSlide = (currentSlide % CONFIG.totalSlides) + 1;
        selectSlide(currentSlide);
    }

    /**
     * Select a specific slide by number
     */
    function selectSlide(slideNum) {
        const radio = document.getElementById(`hero-${slideNum}`);
        if (radio) {
            radio.checked = true;
            currentSlide = slideNum;
        }
    }

    /**
     * Handle manual navigation clicks
     */
    function handleNavClick(e) {
        // Get the slide number from the radio id in the for attribute
        const forAttr = e.target.getAttribute('for');
        if (forAttr) {
            const slideNum = parseInt(forAttr.replace('hero-', ''), 10);
            if (!isNaN(slideNum)) {
                currentSlide = slideNum;
                // Reset timer to give user time to view selected slide
                startRotation();
            }
        }
    }

    /**
     * Pause the rotation
     */
    function pauseRotation() {
        isPaused = true;
    }

    /**
     * Resume the rotation
     */
    function resumeRotation() {
        isPaused = false;
    }

    /**
     * Cleanup timers (memory leak prevention)
     */
    function cleanup() {
        if (rotationTimer) {
            clearInterval(rotationTimer);
            rotationTimer = null;
        }
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
