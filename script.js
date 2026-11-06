/* =========================================================
   Frieren Portfolio: script.js
   Features:
     1. Day / Night theme that follows the visitor's system setting
     2. Hamburger menu for mobile navigation
     3. Active nav link highlight while scrolling
     4. Photo fallback, contact form message, and footer year
   ========================================================= */

// Matches when the operating system is set to dark mode
const darkModeQuery = window.matchMedia("(prefers-color-scheme: dark)");

/**
 * Applies a theme by setting data-theme on <html>.
 * The CSS swaps all colors based on this attribute.
 * @param {string} theme - "light" or "dark"
 */
function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
}

/**
 * Applies the theme that matches the operating system's setting.
 */
function applySystemTheme() {
    applyTheme(darkModeQuery.matches ? "dark" : "light");
}

// Apply the theme right away (this file loads in <head>) so the page
// never flashes the wrong colors before it finishes loading.
applySystemTheme();

// Switch live if the visitor changes their system setting
darkModeQuery.addEventListener("change", applySystemTheme);

/**
 * Sets up the hamburger menu that shows and hides the nav on mobile.
 */
function initMobileMenu() {
    const menuButton = document.getElementById("menu-toggle");
    const nav = document.getElementById("site-nav");
    if (!menuButton || !nav) {
        return;
    }

    /**
     * Opens or closes the menu and keeps the ARIA state in sync.
     * @param {boolean} isOpen - true to open, false to close
     */
    function setMenuOpen(isOpen) {
        nav.classList.toggle("open", isOpen);
        menuButton.setAttribute("aria-expanded", String(isOpen));
        menuButton.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
    }

    // Toggle the menu when the hamburger is clicked
    menuButton.addEventListener("click", function () {
        const isOpen = menuButton.getAttribute("aria-expanded") === "true";
        setMenuOpen(!isOpen);
    });

    // Close the menu after choosing a link so the section is visible
    nav.querySelectorAll("a").forEach(function (link) {
        link.addEventListener("click", function () {
            setMenuOpen(false);
        });
    });

    // Close the menu with the Escape key
    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
            setMenuOpen(false);
        }
    });

    // Close the menu if the screen is resized up to desktop width
    window.matchMedia("(min-width: 769px)").addEventListener("change", function (event) {
        if (event.matches) {
            setMenuOpen(false);
        }
    });
}

/**
 * Highlights the nav link for whichever section is currently on screen.
 */
function initActiveNavLink() {
    const navLinks = document.querySelectorAll(".nav-link");
    const sections = document.querySelectorAll("#home, #about, #skills, #projects, #contact");
    if (!("IntersectionObserver" in window) || sections.length === 0) {
        return;
    }

    // Watch a band in the middle of the screen; the section crossing it is "active"
    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (!entry.isIntersecting) {
                return;
            }
            navLinks.forEach(function (link) {
                const isMatch = link.getAttribute("href") === "#" + entry.target.id;
                link.classList.toggle("active", isMatch);
            });
        });
    }, { rootMargin: "-45% 0px -50% 0px" });

    sections.forEach(function (section) {
        observer.observe(section);
    });
}

/**
 * Shows a monogram instead of a broken image if the profile photo
 * cannot be loaded.
 */
function initPhotoFallback() {
    const photo = document.getElementById("portrait-img");
    if (!photo) {
        return;
    }

    /** Swaps the photo for the monogram circle. */
    function showFallback() {
        photo.parentElement.classList.add("no-photo");
    }

    // The image may have already failed before this code ran
    if (photo.complete && photo.naturalWidth === 0) {
        showFallback();
    } else {
        photo.addEventListener("error", showFallback);
    }
}

/**
 * Handles the contact form. The browser checks the required fields first
 * (the submit event only fires when they are valid). There is no server
 * behind this static site, so the form confirms it was filled in and
 * points visitors to the links that do reach me.
 */
function initContactForm() {
    const form = document.getElementById("contact-form");
    const status = document.getElementById("form-status");
    if (!form || !status) {
        return;
    }

    form.addEventListener("submit", function (event) {
        event.preventDefault();
        const name = form.elements.name.value.trim();
        status.textContent =
            "Thanks, " + name + "! This demo form isn't connected to email yet, " +
            "so please also reach me on LinkedIn or GitHub.";
        form.reset();
    });
}

/**
 * Writes the current year into the footer copyright line.
 */
function setFooterYear() {
    const yearSpan = document.getElementById("year");
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
}

// Run everything once the HTML has finished loading
document.addEventListener("DOMContentLoaded", function () {
    initMobileMenu();
    initActiveNavLink();
    initPhotoFallback();
    initContactForm();
    setFooterYear();
});
