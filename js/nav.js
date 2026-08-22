/**
 * Mobile Navigation — Hamburger Menu Toggle
 * Handles open/close, keyboard support, focus management, overlay, and reduced-motion.
 * Single source of truth for all pages — loaded via <script defer>.
 */
(function () {
    'use strict';

    document.addEventListener('DOMContentLoaded', function () {
        var header = document.querySelector('.site-header');
        var nav = header && header.querySelector('nav');
        if (!nav || header.querySelector('.hamburger-btn')) return;

        /* ---- Create hamburger button ---- */
        var btn = document.createElement('button');
        btn.className = 'hamburger-btn';
        btn.setAttribute('aria-label', 'Toggle navigation menu');
        btn.setAttribute('aria-expanded', 'false');
        btn.setAttribute('aria-controls', 'site-nav');
        btn.setAttribute('type', 'button');
        btn.innerHTML = '<span class="hamburger-icon"></span>';
        nav.setAttribute('id', 'site-nav');
        header.insertBefore(btn, nav);

        /* ---- Reduced motion check ---- */
        var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        /* ---- Overlay element (reused) ---- */
        var overlay = document.createElement('div');
        overlay.className = 'nav-overlay';
        overlay.style.display = 'none';

        /* ---- Core functions ---- */
        function getFocusableElements() {
            return Array.from(nav.querySelectorAll('a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])'));
        }

        function openMenu() {
            btn.setAttribute('aria-expanded', 'true');
            nav.classList.add('nav--open');
            if (!prefersReducedMotion) {
                nav.classList.add('nav--animating');
            }
            /* Insert overlay after nav */
            if (nav.parentNode) {
                nav.parentNode.insertBefore(overlay, nav.nextSibling);
            }
            overlay.style.display = '';
            /* Stop the page behind the drawer from scrolling under it */
            document.body.style.overflow = 'hidden';
            var focusable = getFocusableElements();
            if (focusable.length > 0) {
                focusable[0].focus();
            }
        }

        /**
         * @param {boolean} restoreFocus Return focus to the hamburger. Only true when
         * the user closed the menu deliberately — on a resize-triggered close the
         * button is display:none, so focusing it would strand focus on a hidden element.
         */
        function closeMenu(restoreFocus) {
            btn.setAttribute('aria-expanded', 'false');
            nav.classList.remove('nav--open', 'nav--animating');
            overlay.style.display = 'none';
            if (overlay.parentNode) {
                overlay.parentNode.removeChild(overlay);
            }
            document.body.style.overflow = '';
            if (restoreFocus === true) {
                btn.focus();
            }
        }

        function toggleMenu() {
            var isOpen = btn.getAttribute('aria-expanded') === 'true';
            if (isOpen) { closeMenu(true); } else { openMenu(); }
        }

        /* ---- Focus trap ---- */
        function handleTabKey(e) {
            if (btn.getAttribute('aria-expanded') !== 'true') return;
            var focusable = getFocusableElements();
            if (focusable.length === 0) return;
            var first = focusable[0];
            var last = focusable[focusable.length - 1];
            if (e.shiftKey) {
                if (document.activeElement === first) {
                    e.preventDefault();
                    last.focus();
                }
            } else {
                if (document.activeElement === last) {
                    e.preventDefault();
                    first.focus();
                }
            }
        }

        /* ---- Event listeners ---- */
        btn.addEventListener('click', toggleMenu);

        overlay.addEventListener('click', function () { closeMenu(true); });

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && btn.getAttribute('aria-expanded') === 'true') {
                closeMenu(true);
                e.preventDefault();
            }
            if (e.key === 'Tab') {
                handleTabKey(e);
            }
        });

        document.addEventListener('click', function (e) {
            if (!header.contains(e.target) &&
                !overlay.contains(e.target) &&
                btn.getAttribute('aria-expanded') === 'true') {
                closeMenu(true);
            }
        });

        /* ---- Close on nav link click (the link itself still navigates) ---- */
        Array.prototype.forEach.call(nav.querySelectorAll('a'), function (link) {
            link.addEventListener('click', function () { closeMenu(false); });
        });

        /* ---- Resize close ---- */
        var resizeTimer;
        window.addEventListener('resize', function () {
            cancelAnimationFrame(resizeTimer);
            resizeTimer = requestAnimationFrame(function () {
                if (window.innerWidth > 767 && btn.getAttribute('aria-expanded') === 'true') {
                    /* Hamburger is display:none above 767px — don't focus it. */
                    closeMenu(false);
                }
            });
        });
    });
}());