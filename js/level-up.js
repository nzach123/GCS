/**
 * Level Up Page — Carousel Controller
 * Auto-advances every 5 seconds. Prev/Next buttons for manual control.
 */
(function () {
    'use strict';

    const track   = document.getElementById('luCarouselTrack');
    const prevBtn = document.getElementById('luPrev');
    const nextBtn = document.getElementById('luNext');
    const counter = document.getElementById('luCounter');

    if (!track) return;

    const slides = track.querySelectorAll('.lu-carousel__slide');
    const total  = slides.length;
    let current  = 0;
    let timer;

    function goTo(index) {
        current = (index + total) % total;
        track.style.transform = `translateX(-${current * 100}%)`;
        counter.textContent   = `${current + 1} / ${total}`;
    }

    function startAuto() {
        timer = setInterval(function () {
            goTo(current + 1);
        }, 5000);
    }

    function resetAuto() {
        clearInterval(timer);
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

    // Keyboard support
    document.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowLeft')  { goTo(current - 1); resetAuto(); }
        if (e.key === 'ArrowRight') { goTo(current + 1); resetAuto(); }
    });

    // Init
    goTo(0);
    startAuto();
}());
