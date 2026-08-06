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
            var focusable = getFocusableElements();
            if (focusable.length > 0) {
                focusable[0].focus();
            }
        }

        function closeMenu() {
            btn.setAttribute('aria-expanded', 'false');
            nav.classList.remove('nav--open', 'nav--animating');
            overlay.style.display = 'none';
            if (overlay.parentNode) {
                overlay.parentNode.removeChild(overlay);
            }
            btn.focus();
        }

        function toggleMenu() {
            var isOpen = btn.getAttribute('aria-expanded') === 'true';
            if (isOpen) { closeMenu(); } else { openMenu(); }
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

        overlay.addEventListener('click', closeMenu);

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && btn.getAttribute('aria-expanded') === 'true') {
                closeMenu();
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
                closeMenu();
            }
        });

        /* ---- Re-query links on open for safety ---- */
        var openListener = function () {
            /* Re-query links each time menu opens */
            var links = Array.from(nav.querySelectorAll('a'));
            links.forEach(function (link) {
                link.addEventListener('click', closeMenu);
            });
        };
        btn.addEventListener('click', openListener);

        /* ---- Resize close ---- */
        var resizeTimer;
        window.addEventListener('resize', function () {
            cancelAnimationFrame(resizeTimer);
            resizeTimer = requestAnimationFrame(function () {
                if (window.innerWidth > 767 && btn.getAttribute('aria-expanded') === 'true') {
                    closeMenu();
                }
            });
        });
    });
}());