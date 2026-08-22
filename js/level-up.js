/**
 * Level Up Page — Carousel Controller
 * Auto-advances every 5 seconds. Prev/Next buttons, pause control, keyboard,
 * touch-swipe and mouse-drag navigation.
 *
 * Accessibility notes:
 * - Auto-rotation can be paused (WCAG 2.2.2) and pauses itself on hover/focus.
 * - The counter is a live region only while rotation is stopped, per the WAI-ARIA
 *   carousel pattern — announcing every 5s otherwise talks over the whole page.
 * - Arrow keys are scoped to the carousel so they don't hijack page scrolling.
 */
(function () {
    'use strict';

    const track    = document.getElementById('luCarouselTrack');
    const prevBtn  = document.getElementById('luPrev');
    const nextBtn  = document.getElementById('luNext');
    const counter  = document.getElementById('luCounter');
    const pauseBtn = document.getElementById('luPause');
    const carousel = document.querySelector('.lu-carousel');

    /* Every element below is dereferenced unconditionally, so bail unless all exist. */
    if (!track || !prevBtn || !nextBtn || !counter || !pauseBtn || !carousel) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* Fisher–Yates over slides 1..n-1 only.
       Slide 0 stays pinned because it is the preload / fetchpriority target in the
       markup: shuffling it would leave the prioritised image off-screen on most
       loads. Visitors still get a fresh sequence after the first photo. */
    const slideEls = Array.from(track.querySelectorAll('.lu-carousel__slide'));
    for (let i = slideEls.length - 1; i > 1; i--) {
        const j = 1 + Math.floor(Math.random() * i);
        [slideEls[i], slideEls[j]] = [slideEls[j], slideEls[i]];
    }
    track.replaceChildren(...slideEls);

    const slides = track.querySelectorAll('.lu-carousel__slide');
    const total  = slides.length;
    let current  = 0;
    let timer    = null;
    let paused   = false;

    /* Slides past the first carry their URLs in data-src/data-srcset and are
       fetched only when they come into play.

       loading="lazy" cannot do this job here: the slides are flex children
       offset horizontally inside an overflow:hidden track, and Chrome does not
       treat that as off-screen, so it eagerly fetched all 14 (~2.3 MB) on load. */
    function hydrate(index) {
        const slide = slides[(index + total) % total];
        const img = slide && slide.querySelector('img');
        if (!img || !img.dataset.src) return;
        if (img.dataset.srcset) {
            img.srcset = img.dataset.srcset;
            delete img.dataset.srcset;
        }
        img.src = img.dataset.src;
        delete img.dataset.src;
    }

    /* Current slide plus both neighbours, so an advance never lands on a blank frame. */
    function hydrateAround(index) {
        hydrate(index);
        hydrate(index - 1);
        hydrate(index + 1);
    }

    function goTo(index) {
        current = (index + total) % total;
        track.style.transform = 'translateX(-' + (current * 100) + '%)';
        counter.textContent   = (current + 1) + ' / ' + total;
        hydrateAround(current);
    }

    function startAuto() {
        if (prefersReducedMotion || paused) return;
        stopAuto();
        /* Silence the counter while the carousel advances on its own. */
        counter.setAttribute('aria-live', 'off');
        timer = setInterval(function () {
            requestAnimationFrame(function () { goTo(current + 1); });
        }, 5000);
    }

    function stopAuto() {
        if (timer) {
            clearInterval(timer);
            timer = null;
        }
        /* Stopped: changes are now user-driven, so announce them. */
        counter.setAttribute('aria-live', 'polite');
    }

    /* Restart the timer after a user interaction, unless the user has pressed pause. */
    function resetAuto() {
        stopAuto();
        startAuto();
    }

    function setPaused(next) {
        paused = next;
        pauseBtn.setAttribute('aria-pressed', String(paused));
        pauseBtn.setAttribute('aria-label', paused ? 'Play slideshow' : 'Pause slideshow');
        pauseBtn.textContent = paused ? '▶' : '‖';
        if (paused) { stopAuto(); } else { startAuto(); }
    }

    prevBtn.addEventListener('click', function () {
        goTo(current - 1);
        resetAuto();
    });

    nextBtn.addEventListener('click', function () {
        goTo(current + 1);
        resetAuto();
    });

    pauseBtn.addEventListener('click', function () {
        setPaused(!paused);
    });

    /* Arrow keys act only when focus is inside the carousel. */
    let lastKeyTime = 0;
    carousel.addEventListener('keydown', function (e) {
        if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
        const now = Date.now();
        if (now - lastKeyTime < 200) return;
        lastKeyTime = now;
        e.preventDefault();
        goTo(e.key === 'ArrowLeft' ? current - 1 : current + 1);
        resetAuto();
    });

    /* Pause while the pointer or keyboard focus is on the carousel. */
    carousel.addEventListener('mouseenter', stopAuto);
    carousel.addEventListener('mouseleave', function () { if (!paused) startAuto(); });
    carousel.addEventListener('focusin', stopAuto);
    carousel.addEventListener('focusout', function (e) {
        if (!carousel.contains(e.relatedTarget) && !paused) startAuto();
    });

    /* Don't run the timer while the tab is hidden. */
    document.addEventListener('visibilitychange', function () {
        if (document.hidden) { stopAuto(); } else if (!paused) { startAuto(); }
    });

    // Init
    goTo(0);
    setPaused(false);

    // ---- Swipe / Drag Support ----
    (function () {
        let startX     = 0;
        let startY     = 0;
        let currentX   = 0;
        let isDragging = false;
        let isSwiping  = false;

        function getX(e) { return e.type.indexOf('touch') === 0 ? e.touches[0].clientX : e.clientX; }
        function getY(e) { return e.type.indexOf('touch') === 0 ? e.touches[0].clientY : e.clientY; }

        function onStart(e) {
            if (e.target.closest && e.target.closest('.lu-carousel__btn')) return;
            isDragging = true;
            isSwiping  = false;
            startX     = getX(e);
            startY     = getY(e);
            currentX   = startX;
            stopAuto();
            if (prefersReducedMotion) return;
            /* Follow the pointer in real time — the CSS transition is restored on release. */
            track.style.transition = 'none';
        }

        function onMove(e) {
            if (!isDragging) return;
            const dx = getX(e) - startX;
            const dy = getY(e) - startY;

            // Vertical movement dominates — let the page scroll and abandon the drag.
            if (Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 10) {
                isDragging = false;
                isSwiping  = false;
                track.style.transition = '';
                goTo(current);
                return;
            }

            if (e.cancelable) e.preventDefault();
            currentX  = getX(e);
            isSwiping = true;

            if (prefersReducedMotion) return;

            /* baseTranslate is a percentage, dx is pixels — calc() mixes them.
               (Previously dx was converted to a percentage and then emitted with a
               px unit, which made the track follow at ~1/10 of pointer speed.) */
            const baseTranslate = -(current * 100);
            track.style.transform = 'translateX(calc(' + baseTranslate + '% + ' + dx + 'px))';
        }

        function onEnd() {
            if (!isDragging) return;
            isDragging = false;
            track.style.transition = '';

            if (!isSwiping) {
                if (!paused) startAuto();
                return;
            }

            const deltaX = currentX - startX;
            if (Math.abs(deltaX) > 50) {
                goTo(deltaX < 0 ? current + 1 : current - 1);
            } else {
                goTo(current);
            }

            isSwiping = false;
            if (!paused) startAuto();
        }

        carousel.addEventListener('touchstart', onStart, { passive: true });
        carousel.addEventListener('touchmove', onMove, { passive: false });
        carousel.addEventListener('touchend', onEnd, { passive: true });

        carousel.addEventListener('mousedown', onStart);
        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseup', onEnd);

        carousel.addEventListener('dragstart', function (e) { e.preventDefault(); });
    }());
}());
