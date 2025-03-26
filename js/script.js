/* filepath: d:\C Drive files\Downloads\delme\REDES\script.js */
// Performance optimized matrix effect
document.addEventListener("DOMContentLoaded", () => {
  const binaryOverlay = document.getElementById("binary-overlay");
  const container = document.querySelector(".matrix-container");

  let lastX = 0,
    lastY = 0;
  let activeBits = new Map(); // Track only visible bits
  let allBits = [];
  let ticking = false;

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

    if (!ticking) {
      window.requestAnimationFrame(() => {
        updateBinaryOverlay(lastX, lastY);
        ticking = false;
      });
      ticking = true;
    }
  });

  // Optimized update function
  function updateBinaryOverlay(x, y) {
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
        //   bit.style.color = "rgba(8, 8, 8, 0.3)"; // Reduced from 0.5 to 0.3
        //   uncomment this to show the center numbers too
        bit.style.color = "rgba(255, 255, 255, 0.15)"; // Keeping reduced brightness

        // Rarely change these binary values
        if (Math.random() > 0.93) {
          bit.textContent = Math.random() > 0.5 ? "1" : "0";
        }
      } else if (distance < maxDistance) {
        // Less visible outer ring with decreased brightness
        const opacity = 0.15 - (distance - innerRadius) / 400; // Increased divisor for smoother falloff with larger radius

        if (opacity > 0.05) {
          // Keeping lower threshold
          bit.style.opacity = "1";
          bit.style.color = `rgba(220, 255, 220, ${opacity})`; // Keeping decreased green tint opacity
        } else {
          bit.style.opacity = "0";
        }
      } else if (bit.style.opacity !== "0") {
        bit.style.opacity = "0";
      }
    }
  }
});
