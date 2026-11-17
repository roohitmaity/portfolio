document.addEventListener("DOMContentLoaded", () => {
    const navbar = document.getElementById("navbar");
    const menuToggle = document.getElementById("menu-toggle");
    const navLinks = document.getElementById("nav-links");
    const yearSpan = document.getElementById("year");

    // 1. Set current year in footer
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // 2. Transparent navbar transitions to frosted glass on scroll
    const handleNavbarScroll = () => {
        if (window.scrollY > 30) {
            navbar.classList.add("scrolled");
        } else {
            navbar.classList.remove("scrolled");
        }
    };
    window.addEventListener("scroll", handleNavbarScroll, { passive: true });
    handleNavbarScroll();

    // 3. Mobile menu toggle
    if (menuToggle && navLinks) {
        menuToggle.addEventListener("click", () => {
            navLinks.classList.toggle("open");
        });

        navLinks.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", () => {
                navLinks.classList.remove("open");
            });
        });
    }

    // 4. Smooth scroll-reveal animations
    const revealElements = document.querySelectorAll(".reveal");
    const revealObserver = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.12 }
    );
    revealElements.forEach(el => revealObserver.observe(el));

    // 5. Active navbar item highlighting on scroll
    const sections = document.querySelectorAll("section[id]");
    const navAnchors = document.querySelectorAll(".nav-links a");

    const highlightActiveLink = () => {
        const scrollPosition = window.scrollY + 140;

        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute("id");

            if (scrollPosition >= top && scrollPosition < top + height) {
                navAnchors.forEach(anchor => {
                    anchor.classList.remove("active");
                    if (anchor.getAttribute("href") === `#${id}`) {
                        anchor.classList.add("active");
                    }
                });
            }
        });
    };
    window.addEventListener("scroll", highlightActiveLink, { passive: true });

    // 6. Liquid Morphing & Blooming Slime Cursor
    const slime = document.getElementById("slime-cursor");
    if (slime && window.matchMedia("(pointer: fine)").matches) {
        let mouseX = -100, mouseY = -100;
        let currentX = -100, currentY = -100;
        let prevX = -100, prevY = -100;
        let lockedElement = null;
        let isClicking = false;

        window.addEventListener("mousemove", (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        }, { passive: true });

        window.addEventListener("mousedown", () => {
            isClicking = true;
            slime.classList.add("clicking");
        });

        window.addEventListener("mouseup", () => {
            isClicking = false;
            slime.classList.remove("clicking");
        });

        const morphTargets = document.querySelectorAll("a, button, .badge, .tag-row span, .social-icon-badge");
        morphTargets.forEach(el => {
            el.addEventListener("mouseenter", () => {
                lockedElement = el;
                slime.classList.add("morphed");
            });

            el.addEventListener("mouseleave", () => {
                if (lockedElement === el) {
                    lockedElement = null;
                    slime.classList.remove("morphed");
                }
            });
        });

        const animateSlime = () => {
            if (lockedElement) {
                const rect = lockedElement.getBoundingClientRect();
                const computedStyle = window.getComputedStyle(lockedElement);
                const borderRadius = computedStyle.borderRadius || "16px";

                const targetCenterX = rect.left + rect.width / 2;
                const targetCenterY = rect.top + rect.height / 2;

                const pullX = targetCenterX + (mouseX - targetCenterX) * 0.15;
                const pullY = targetCenterY + (mouseY - targetCenterY) * 0.15;

                currentX += (pullX - currentX) * 0.25;
                currentY += (pullY - currentY) * 0.25;

                const expandedWidth = rect.width * 1.15 + 10;
                const expandedHeight = rect.height * 1.15 + 10;
                const pad = isClicking ? -2 : 6;

                slime.style.width = `${expandedWidth + pad}px`;
                slime.style.height = `${expandedHeight + pad}px`;
                slime.style.borderRadius = borderRadius;
                slime.style.transform = `translate3d(${currentX - (expandedWidth + pad) / 2}px, ${currentY - (expandedHeight + pad) / 2}px, 0) scale(${isClicking ? 0.95 : 1})`;
            } else {
                currentX += (mouseX - currentX) * 0.22;
                currentY += (mouseY - currentY) * 0.22;

                const vx = currentX - prevX;
                const vy = currentY - prevY;
                const speed = Math.min(Math.hypot(vx, vy), 45);
                const angle = Math.atan2(vy, vx) * (180 / Math.PI);

                const stretchX = 1 + (speed / 45) * 0.55;
                const squishY = 1 - (speed / 45) * 0.28;
                const clickScale = isClicking ? 0.78 : 1;

                const baseSize = 34;
                slime.style.width = `${baseSize}px`;
                slime.style.height = `${baseSize}px`;
                slime.style.borderRadius = "50%";

                slime.style.transform = `translate3d(${currentX - baseSize / 2}px, ${currentY - baseSize / 2}px, 0) rotate(${angle}deg) scale(${stretchX * clickScale}, ${squishY * clickScale})`;
            }

            prevX = currentX;
            prevY = currentY;
            requestAnimationFrame(animateSlime);
        };

        animateSlime();
    }
});