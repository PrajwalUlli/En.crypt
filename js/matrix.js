// Performance optimized matrix effect
document.addEventListener("DOMContentLoaded", () => {
  const binaryOverlay = document.getElementById("binary-overlay");
  const container = document.querySelector(".matrix-container");
  const navbarBrand = document.querySelector(".navbar-brand");
  const toolButtons = document.querySelectorAll(".tool-button");

  // Improved stutter-proof navbar animations with simpler, non-bouncy animations
  function animateNavbar() {
    // First, reset any inline styles that might cause conflicts
    gsap.set([navbarBrand, toolButtons], { clearProps: "all" });

    // Remove the transform from CSS by setting it explicitly with GSAP
    // This avoids the conflict between CSS and GSAP animations
    toolButtons.forEach((button) => {
      button.style.transform = "translateY(10px)";
    });

    // Create a master timeline
    const masterTl = gsap.timeline();

    // Logo animation - simple fade in with no bounce
    const logoTl = gsap.timeline();
    logoTl
      .set(navbarBrand, {
        opacity: 0,
        y: -15,
      })
      .to(navbarBrand, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: "power1.out", // Simpler easing with no bounce
      })
      .to(
        navbarBrand,
        {
          textShadow:
            "0 0 18px rgba(255, 140, 0, 0.8), 0 0 8px rgba(255, 120, 0, 0.6)", // Enhanced orange glow
          duration: 0.4,
          yoyo: true,
          repeat: 1,
        },
        "-=0.2"
      );

    // Buttons animation with staggered appearance - no bounce
    const buttonsTl = gsap.timeline();
    buttonsTl
      .set(toolButtons, {
        opacity: 0,
        y: 10,
      })
      .to(toolButtons, {
        opacity: 1,
        y: 0,
        stagger: 0.1,
        duration: 0.4,
        ease: "power1.out", // Simple easing with no bounce
      });

    // Add both animations to the master timeline
    masterTl.add(logoTl);
    masterTl.add(buttonsTl, "-=0.3"); // Start buttons while logo is still animating
  }

  let lastX = 0,
    lastY = 0;
  let activeBits = new Map(); // Track only visible bits
  let allBits = [];
  let ticking = false;
  let mouseMoveTimeout = null;
  let isIdle = false;

  // Initialize binary overlay with optimized performance
  function initBinaryMatrix() {
    // Clear existing content
    binaryOverlay.innerHTML = "";
    activeBits.clear();
    allBits = [];

    // Get dimensions
    const width = window.innerWidth;
    const height = window.innerHeight;

    // Calculate density - less bits for better performance
    const binarySize = 30; // Increased for better performance
    const cols = Math.ceil(width / binarySize);
    const rows = Math.ceil(height / binarySize);

    // Create binary digits with absolute positioning for better rendering
    const fragment = document.createDocumentFragment();

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const binaryBit = document.createElement("div");
        binaryBit.classList.add("binary-bit");
        binaryBit.textContent = Math.random() > 0.5 ? "1" : "0";

        // Use absolute positioning - significant performance boost
        binaryBit.style.left = col * binarySize + binarySize / 2 + "px";
        binaryBit.style.top = row * binarySize + binarySize / 2 + "px";

        // Store coordinates for faster distance calculation
        binaryBit.x = col * binarySize + binarySize / 2;
        binaryBit.y = row * binarySize + binarySize / 2;

        fragment.appendChild(binaryBit);
        allBits.push(binaryBit);
      }
    }

    binaryOverlay.appendChild(fragment);

    // Trigger navbar animation after matrix is initialized - start sooner
    setTimeout(animateNavbar, 200); // Quick start
  }

  // Initialize matrix
  initBinaryMatrix();

  // Handle window resize with debouncing
  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      initBinaryMatrix();
    }, 250); // Debounce resize events
  });

  // Add mouse movement tracking with throttling
  document.addEventListener("mousemove", (e) => {
    lastX = e.clientX;
    lastY = e.clientY;

    // Reset idle state when mouse moves
    isIdle = false;

    // Clear previous timeout
    if (mouseMoveTimeout) {
      clearTimeout(mouseMoveTimeout);
    }

    // Set timeout to fade out matrix after 3 seconds of no movement
    mouseMoveTimeout = setTimeout(() => {
      isIdle = true;
      fadeOutMatrix();
    }, 1500); // Changed from 3000 to 1500 milliseconds (1.5 seconds)

    if (!ticking) {
      window.requestAnimationFrame(() => {
        updateBinaryOverlay(lastX, lastY);
        ticking = false;
      });
      ticking = true;
    }
  });

  // Function to fade out matrix when idle
  function fadeOutMatrix() {
    if (!isIdle) return;

    // Gradually fade out all visible bits
    const visibleBits = allBits.filter(
      (bit) => bit.style.opacity !== "0"
    );

    if (visibleBits.length > 0) {
      // Use GSAP for smooth fade out
      gsap.to(visibleBits, {
        opacity: 0,
        duration: 1.5,
        ease: "power2.out",
        stagger: {
          from: "random",
          amount: 0.8,
        },
      });
    }
  }

  // Optimized update function
  function updateBinaryOverlay(x, y) {
    // If we're in idle state, cancel the update
    if (isIdle) return;

    const maxDistance = 100; // Increased from 120 to 180
    const innerRadius = 60; // Increased from 50 to 70

    // Only process bits that might be visible (optimization)
    const visibleArea = {
      left: x - maxDistance,
      right: x + maxDistance,
      top: y - maxDistance,
      bottom: y + maxDistance,
    };

    // Update active bits
    for (let i = 0; i < allBits.length; i++) {
      const bit = allBits[i];

      // Skip bits far outside the visible area
      if (
        bit.x < visibleArea.left ||
        bit.x > visibleArea.right ||
        bit.y < visibleArea.top ||
        bit.y > visibleArea.bottom
      ) {
        if (bit.style.opacity !== "0") {
          bit.style.opacity = "0";
        }
        continue;
      }

      // Fast distance calculation using pre-stored coordinates
      const dx = bit.x - x;
      const dy = bit.y - y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < innerRadius) {
        // Reduced brightness inner circle
        bit.style.opacity = "1";
        bit.style.color = "rgba(255, 255, 255, 0.18)"; // Slightly increased brightness

        // Rarely change these binary values
        if (Math.random() > 0.93) {
          bit.textContent = Math.random() > 0.5 ? "1" : "0";
        }
      } else if (distance < maxDistance) {
        // Less visible outer ring with decreased brightness
        const opacity = 0.18 - (distance - innerRadius) / 400; // Increased base opacity

        if (opacity > 0.05) {
          bit.style.opacity = "1";
          bit.style.color = `rgba(255, 230, 190, ${opacity})`; /* Brighter orange tint */
        } else {
          bit.style.opacity = "0";
        }
      } else if (bit.style.opacity !== "0") {
        bit.style.opacity = "0";
      }
    }
  }
});
