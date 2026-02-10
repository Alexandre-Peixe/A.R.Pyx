// ========================================
// A.R.Pyx — Author Landing Page
// Minimal JS: mobile nav + scroll effects
// ========================================

(function () {
  "use strict";

  // ---------- Mobile Navigation Toggle ----------
  const navToggle = document.getElementById("navToggle");
  const navLinks = document.getElementById("navLinks");

  if (navToggle && navLinks) {
    navToggle.addEventListener("click", function () {
      const isOpen = navLinks.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", isOpen);
    });

    // Close menu when a link is clicked
    navLinks.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        navLinks.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // ---------- Navbar shadow on scroll ----------
  const navbar = document.getElementById("navbar");

  if (navbar) {
    window.addEventListener(
      "scroll",
      function () {
        if (window.scrollY > 10) {
          navbar.style.boxShadow = "0 2px 16px rgba(44, 36, 32, 0.2)";
        } else {
          navbar.style.boxShadow = "0 2px 8px rgba(44, 36, 32, 0.15)";
        }
      },
      { passive: true }
    );
  }

  // ---------- Fade-in on scroll (Intersection Observer) ----------
  const fadeElements = document.querySelectorAll(
    ".book-layout, .char-card, .author-layout, .novella-layout, .newsletter-box"
  );

  if (fadeElements.length > 0 && "IntersectionObserver" in window) {
    fadeElements.forEach(function (el) {
      el.style.opacity = "0";
      el.style.transform = "translateY(24px)";
      el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    });

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );

    fadeElements.forEach(function (el) {
      observer.observe(el);
    });
  }
})();