/**
 * app.js
 * Project 1: The Responsive Layout — DecodeLabs
 * Pure Vanilla JavaScript - Interactive client component controllers.
 * Fully native, compliant state management and event listeneing.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize all interactive modules
  initMobileNavigation();
  initViewportInspector();
  initBentoCardFilters();
  initFluidTypographyDemo();
  initLayoutMechanicsDemo();
  initDesignTokenCustomizer();
  initInteractivityLogger();
  
  // Quick startup confirmation log in developer console
  console.log('🚀 DecodeLabs Layout Lab: Fully initialized.');
});

/* ==========================================================================
   1. Mobile Navigation Burger Menu Controller
   ========================================================================== */
function initMobileNavigation() {
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');
  
  if (!menuToggle || !navLinks) return;

  menuToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    const isActive = menuToggle.classList.toggle('active');
    navLinks.classList.toggle('active');
    menuToggle.setAttribute('aria-expanded', isActive ? 'true' : 'false');
  });

  // Close navigation menu if clicked outside the navigation block
  document.addEventListener('click', (e) => {
    if (!navLinks.contains(e.target) && !menuToggle.contains(e.target)) {
      menuToggle.classList.remove('active');
      navLinks.classList.remove('active');
      menuToggle.setAttribute('aria-expanded', 'false');
    }
  });

  // Responsive accessibility reset on window resize
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 1024) {
      menuToggle.classList.remove('active');
      navLinks.classList.remove('active');
      menuToggle.setAttribute('aria-expanded', 'false');
    }
  });
}

/* ==========================================================================
   2. Real-time Viewport Inspector & Telemetry Monitor
   ========================================================================== */
function initViewportInspector() {
  const vpWidthValue = document.getElementById('vpWidthValue');
  const vpHeightValue = document.getElementById('vpHeightValue');
  const breakpointValue = document.getElementById('breakpointValue');
  const currentGridValue = document.getElementById('currentGridValue');
  
  // Custom metadata elements in footer audit list
  const auditWidth = document.getElementById('auditWidth');
  const auditBreakpoint = document.getElementById('auditBreakpoint');

  function updateMetrics() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    // Write size dimensions
    if (vpWidthValue) vpWidthValue.textContent = `${width}px`;
    if (vpHeightValue) vpHeightValue.textContent = `${height}px`;
    if (auditWidth) auditWidth.textContent = `${width}px`;

    // Detect Active CSS Breakpoints
    let breakpointLabel = 'Mobile';
    let layoutSchema = 'Single Column Block';
    
    if (width >= 1024) {
      breakpointLabel = 'Desktop (≥1024px)';
      layoutSchema = '2D Grid Layout (Sidebar + Main)';
    } else if (width >= 768) {
      breakpointLabel = 'Tablet (768px - 1023px)';
      layoutSchema = '2-Column Responsive Card Grid';
    } else {
      breakpointLabel = 'Mobile (<768px)';
      layoutSchema = 'Single-Column Stacked Stream';
    }

    if (breakpointValue) {
      breakpointValue.textContent = breakpointLabel;
      // Change color based on current layout
      if (width >= 1024) {
        breakpointValue.style.color = 'var(--color-mocha)';
      } else if (width >= 768) {
        breakpointValue.style.color = '#1A5E6F'; /* Blue variant */
      } else {
        breakpointValue.style.color = 'var(--color-dark-muted)';
      }
    }
    
    if (currentGridValue) currentGridValue.textContent = layoutSchema;
    if (auditBreakpoint) auditBreakpoint.textContent = width >= 1024 ? 'DESKTOP' : (width >= 768 ? 'TABLET' : 'MOBILE');
  }

  // Bind throttle updates to window resize handler
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(updateMetrics, 50); // Small 50ms trailing edge debounce for CPU saving
  });

  // Trigger once immediately
  updateMetrics();
}

/* ==========================================================================
   3. Bento Card Categories Filter System
   ========================================================================== */
function initBentoCardFilters() {
  const filterTabs = document.querySelectorAll('.filter-tab');
  const articleCards = document.querySelectorAll('.article-card');

  if (filterTabs.length === 0 || articleCards.length === 0) return;

  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Toggle active states on design tab buttons
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filterCategory = tab.getAttribute('data-filter');

      // Filter card entries based on type selection attributes
      articleCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        
        if (filterCategory === 'all' || cardCategory === filterCategory) {
          card.classList.remove('card-filtered-out');
          // Smooth micro fade-in entrance transition
          card.style.opacity = '0';
          setTimeout(() => {
            card.style.opacity = '1';
          }, 30);
        } else {
          card.classList.add('card-filtered-out');
        }
      });
    });
  });
}

/* ==========================================================================
   4. Fluid Typography Live Clamp Sandbox Emulator
   ========================================================================== */
function initFluidTypographyDemo() {
  const viewportSlider = document.getElementById('viewportSlider');
  const sliderWidthValue = document.getElementById('sliderWidthValue');
  const fontClampText = document.getElementById('fontClampText');
  const fontFormulaLabel = document.getElementById('fontFormulaLabel');

  if (!viewportSlider || !fontClampText) return;

  function updateFontSizeSimulator() {
    const simulatedWidth = parseInt(viewportSlider.value);
    if (sliderWidthValue) sliderWidthValue.textContent = `${simulatedWidth}px`;

    // Simulated CSS clamp() logic mapping
    // clamp(1.25rem, 2.5vw + 0.6rem, 2.2rem)
    // Convert simulatedWidth into simulated font sizes
    const baseRem = 16;
    const minFontSizePx = 1.25 * baseRem; // 20px
    const maxFontSizePx = 2.2 * baseRem;  // 35.2px
    const vwPx = (simulatedWidth * 0.025) + (0.6 * baseRem); // 2.5vw + 10px

    // Clamped calculation
    let clampedPx = Math.max(minFontSizePx, Math.min(vwPx, maxFontSizePx));
    
    // Set simulated styling directly on test block
    fontClampText.style.fontSize = `${clampedPx}px`;
    
    if (fontFormulaLabel) {
      fontFormulaLabel.textContent = `Active Size: ${clampedPx.toFixed(1)}px (Calculated: Math.clamp(20px, ${(vwPx).toFixed(1)}px, 35.2px))`;
    }
  }

  viewportSlider.addEventListener('input', updateFontSizeSimulator);
  updateFontSizeSimulator(); // Initial calibration run
}

/* ==========================================================================
   5. Hybrid Layout Grid vs Flex Mechanics Toggle Sandbox
   ========================================================================== */
function initLayoutMechanicsDemo() {
  const toggleLayoutBtn = document.getElementById('toggleLayoutBtn');
  const layoutPreviewArea = document.getElementById('layoutPreviewArea');
  const currentLayoutLabel = document.getElementById('currentLayoutLabel');

  if (!toggleLayoutBtn || !layoutPreviewArea) return;

  toggleLayoutBtn.addEventListener('click', () => {
    const isGrid = layoutPreviewArea.classList.contains('preview-grid-mode');

    if (isGrid) {
      // Toggle to Flex Mode
      layoutPreviewArea.classList.remove('preview-grid-mode');
      layoutPreviewArea.classList.add('preview-flex-mode');
      toggleLayoutBtn.textContent = 'Switch to CSS Grid';
      if (currentLayoutLabel) currentLayoutLabel.textContent = 'CSS Flexbox (Wrapping & Squeeze flow)';
    } else {
      // Toggle to Grid Mode
      layoutPreviewArea.classList.remove('preview-flex-mode');
      layoutPreviewArea.classList.add('preview-grid-mode');
      toggleLayoutBtn.textContent = 'Switch to Flexbox';
      if (currentLayoutLabel) currentLayoutLabel.textContent = 'CSS Grid (2D Rigidity, 3 Symmetrical columns)';
    }
  });
}

/* ==========================================================================
   6. Design Token Swatches Customizer & Contrast Auditor
   ========================================================================== */
function initDesignTokenCustomizer() {
  const swatches = document.querySelectorAll('.swatch-item');
  const auditContrast = document.getElementById('auditContrast');

  if (swatches.length === 0) return;

  swatches.forEach(swatch => {
    swatch.addEventListener('click', () => {
      // De-select former color swatches
      document.querySelectorAll('.swatch-color').forEach(sc => sc.classList.remove('active'));
      
      const swatchColor = swatch.querySelector('.swatch-color');
      swatchColor.classList.add('active');
      
      const selectedColorHex = swatch.getAttribute('data-hex');
      const selectedColorName = swatch.getAttribute('data-name');
      
      // Update DOM Custom Properties on element element
      // Let the primary emphasis color shift to Mocha, Blue or neutral dark!
      document.documentElement.style.setProperty('--color-mocha', selectedColorHex);
      
      // Update Contrast validation readout text
      if (auditContrast) {
        let contrastRatio = '4.8 : 1 (AA Pass ✅)';
        if (selectedColorHex === '#A0D4E0') {
          contrastRatio = '3.5 : 1 (Requires dark text backing ℹ️)';
        } else if (selectedColorHex === '#A8956F') {
          contrastRatio = '4.5 : 1 (AA Symmetrical Pass ✅)';
        } else {
          contrastRatio = '14.2 : 1 (AAA Perfect Pass ✅)';
        }
        
        auditContrast.textContent = `Accent: ${selectedColorName} (${selectedColorHex}) | Contrast on Dark backing: ${contrastRatio}`;
      }
    });
  });
}

/* ==========================================================================
   7. Intern Playground Logging Form (Interactivity Simulation)
   ========================================================================== */
function initInteractivityLogger() {
  const logForm = document.getElementById('logForm');
  const logInput = document.getElementById('logInput');
  const logTerminal = document.getElementById('logTerminal');

  if (!logForm || !logInput || !logTerminal) return;

  logForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const textVal = logInput.value.trim();
    if (textVal === '') return;

    // Get timestamp for beautiful terminal alignment
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0];

    // Append output line with sanitized tags
    const newLine = document.createElement('div');
    newLine.style.padding = '0.2rem 0';
    newLine.style.borderBottom = '1px solid #332d26';
    newLine.innerHTML = `<span style="color: #A8956F;">[${timeStr}]</span> > ${sanitizeHTML(textVal)}`;
    
    // Reverse/prepend to keep latest on top
    logTerminal.insertBefore(newLine, logTerminal.firstChild);
    
    // Clear field
    logInput.value = '';
    
    // Auto visual animation flicker effect on terminal
    logTerminal.style.borderColor = '#A4E68E';
    setTimeout(() => {
      logTerminal.style.borderColor = 'var(--color-border)';
    }, 150);
  });
}

// Helper utility function to sanitize user log input string to prevent cross-site issues (XSS)
function sanitizeHTML(str) {
  return str.replace(/[&<>'"]/g, 
    tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag)
  );
}
