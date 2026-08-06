/**
 * Level Up Page — Carousel Controller
 * Auto-advances every 5 seconds. Prev/Next buttons for manual control.
 * Optimized for INP: uses requestAnimationFrame + setTimeout, debounced keyboard,
 * batched DOM reads/writes.
 */
(function () {
    'use strict';

    const track   = document.getElementById('luCarouselTrack');
    const prevBtn = document.getElementById('luPrev');
    const nextBtn = document.getElementById('luNext');
    const counter = document.getElementById('luCounter');

    if (!track) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
        track.style.transition = 'none';
    }

    // Fisher–Yates shuffle of slide order on page load so visitors see a fresh sequence each visit
    const slideEls = Array.from(track.querySelectorAll('.lu-carousel__slide'));
    for (let i = slideEls.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [slideEls[i], slideEls[j]] = [slideEls[j], slideEls[i]];
    }
    track.replaceChildren(...slideEls);

    const slides = track.querySelectorAll('.lu-carousel__slide');
    const total  = slides.length;
    let current  = 0;
    let timer;

    function goTo(index) {
        current = (index + total) % total;
        // Batch DOM writes together — read once, write together
        track.style.transform = 'translateX(-' + (current * 100) + '%)';
        counter.textContent   = (current + 1) + ' / ' + total;
    }

    function startAuto() {
        if (prefersReducedMotion) return;
        function tick() {
            timer = setTimeout(function () {
                requestAnimationFrame(function () {
                    goTo(current + 1);
                    tick();
                });
            }, 5000);
        }
        tick();
    }

    function resetAuto() {
        if (timer) {
            clearTimeout(timer);
            timer = null;
        }
        startAuto();
    }

    prevBtn.addEventListener('click', function () {
        goTo(current - 1);
        resetAuto();
    });

    nextBtn.addEventListener('click', function () {
        goTo(current + 1);
        resetAuto();
    });

    // Keyboard support — debounced to 200ms
    let lastKeyTime = 0;
    document.addEventListener('keydown', function (e) {
        if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
        var now = Date.now();
        if (now - lastKeyTime < 200) return;
        lastKeyTime = now;
        if (e.key === 'ArrowLeft')  { goTo(current - 1); }
        if (e.key === 'ArrowRight') { goTo(current + 1); }
        resetAuto();
    });

    // Init
    goTo(0);
    startAuto();

    // ---- Swipe / Drag Support (Phase 4.1) ----
    (function () {
        var startX      = 0;
        var startY      = 0;
        var currentX    = 0;
        var isDragging  = false;
        var isSwiping   = false;
        var dragSlides  = 0; // prevent multiple advances
        var carouselEl  = document.querySelector('.lu-carousel');
        var trackEl     = track;

        function getX(e) {
            if (e.type.indexOf('touch') === 0) {
                return e.touches[0].clientX;
            }
            return e.clientX;
        }

        function getY(e) {
            if (e.type.indexOf('touch') === 0) {
                return e.touches[0].clientY;
            }
            return e.clientY;
        }

        function onStart(e) {
            // Ignore if the user clicked a button
            if (e.target.closest && e.target.closest('.lu-carousel__btn')) return;
            isDragging = true;
            isSwiping = false;
            dragSlides = 0;
            startX = getX(e);
            startY = getY(e);
            currentX = startX;
            // Pause auto-advance during interaction
            if (timer) {
                clearTimeout(timer);
                timer = null;
            }
            // Disable transition for real-time drag follow
            if (prefersReducedMotion) return;
            trackEl.style.transition = 'none';
        }

        function onMove(e) {
            if (!isDragging) return;
            var dx = getX(e) - startX;
            var dy = getY(e) - startY;

            // If vertical movement dominates, don't treat as swipe
            if (Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 10) {
                // Allow vertical scroll — clean up and bail
                isDragging = false;
                isSwiping = false;
                trackEl.style.transition = '';
                return;
            }

            e.preventDefault(); // Prevent page scroll while swiping horizontally
            currentX = getX(e);
            isSwiping = true;

            if (prefersReducedMotion) return;

            // Real-time drag follow
            var offset = ((currentX - startX) / trackEl.offsetWidth) * 100;
            var baseTranslate = -(current * 100);
            trackEl.style.transform = 'translateX(calc(' + baseTranslate + '% + ' + offset + 'px))';
        }

        function onEnd() {
            if (!isDragging) return;
            isDragging = false;

            // Restore transition
            trackEl.style.transition = '';

            if (!isSwiping) {
                // Wasn't a swipe — restart timer
                resetAuto();
                return;
            }

            var deltaX = currentX - startX;

            if (Math.abs(deltaX) > 50 && dragSlides === 0) {
                dragSlides = 1;
                if (deltaX < 0) {
                    goTo(current + 1);
                } else {
                    goTo(current - 1);
                }
            } else {
                // Snap back to current slide
                goTo(current);
            }

            isSwiping = false;
            resetAuto();
        }

        // Touch events
        carouselEl.addEventListener('touchstart', onStart, { passive: true });
        carouselEl.addEventListener('touchmove', onMove, { passive: false });
        carouselEl.addEventListener('touchend', onEnd, { passive: true });

        // Mouse drag events
        carouselEl.addEventListener('mousedown', onStart);
        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseup', onEnd);

        // Prevent text selection while dragging
        carouselEl.addEventListener('dragstart', function (e) { e.preventDefault(); });
    }());
}());
