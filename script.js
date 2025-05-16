// Helper function to re-initialize active navigation links
function updateActiveNavLinks() {
  const currentLocation = window.location.pathname;
  const navLinks = document.querySelectorAll("#header-placeholder .nav-link");

  navLinks.forEach((link) => {
    const linkHref = link.getAttribute("href");
    if (!linkHref || linkHref === "#") return;

    const linkUrl = new URL(linkHref, window.location.origin);
    const linkPath = linkUrl.pathname;

    let currentPathForComparison = currentLocation;
    if (currentLocation.endsWith("/")) {
      currentPathForComparison += "index.html";
    }

    let linkPathForComparison = linkPath;
    if (linkPath.endsWith("/")) {
      linkPathForComparison += "index.html";
    }

    if (
      (currentPathForComparison === "/index.html" &&
        linkPathForComparison === "/") ||
      (currentPathForComparison === "/" &&
        linkPathForComparison === "/index.html")
    ) {
      link.classList.add("active");
    } else if (linkPathForComparison === currentPathForComparison) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
}

// Helper function to re-initialize dropdown hover effect for Bootstrap dropdowns
function initializeHeaderDropdownHover() {
  const dropdowns = document.querySelectorAll("#header-placeholder .dropdown");
  dropdowns.forEach((dropdown) => {
    if (window.innerWidth >= 992) {
      const toggle = dropdown.querySelector(".dropdown-toggle");
      if (toggle && typeof bootstrap !== "undefined" && bootstrap.Dropdown) {
        const bsDropdown =
          bootstrap.Dropdown.getInstance(toggle) ||
          new bootstrap.Dropdown(toggle);

        dropdown.addEventListener("mouseenter", function () {
          if (bsDropdown && !bsDropdown._isShown()) {
            bsDropdown.show();
          }
        });
        dropdown.addEventListener("mouseleave", function () {
          if (bsDropdown && bsDropdown._isShown()) {
            bsDropdown.hide();
          }
        });
      }
    }
  });
}

// Helper function to re-initialize mobile menu toggler (Bootstrap's default behavior might be enough with data attributes)
function initializeMobileMenu() {
  const navbarToggler = document.querySelector(
    "#header-placeholder .navbar-toggler"
  );
  const navbarCollapse = document.querySelector(
    "#header-placeholder .navbar-collapse"
  );

  if (navbarToggler && navbarCollapse) {
    document.addEventListener(
      "click",
      function (event) {
        const isClickInsideNavbar = navbarCollapse.contains(event.target);
        const isToggler = navbarToggler.contains(event.target);
        if (
          navbarCollapse.classList.contains("show") &&
          !isClickInsideNavbar &&
          !isToggler
        ) {
          if (typeof bootstrap !== "undefined" && bootstrap.Collapse) {
            const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
            if (bsCollapse) {
              bsCollapse.hide();
            } else {
              navbarCollapse.classList.remove("show");
            }
          } else {
            navbarCollapse.classList.remove("show");
          }
        }
      },
      true
    );
  }
}

// Function to setup header scroll effect
function setupHeaderScrollEffect() {
  const actualHeader = document.querySelector("#header-placeholder .header");
  if (!actualHeader) {
    setTimeout(setupHeaderScrollEffect, 100);
    return;
  }
  let lastScroll = 0;
  window.addEventListener("scroll", () => {
    const currentScroll = window.pageYOffset;
    if (!actualHeader) return;

    if (currentScroll <= 50) {
      actualHeader.classList.remove("scroll-up");
      actualHeader.classList.remove("scroll-down");
      return;
    }
    if (
      currentScroll > lastScroll &&
      !actualHeader.classList.contains("scroll-down")
    ) {
      actualHeader.classList.remove("scroll-up");
      actualHeader.classList.add("scroll-down");
    } else if (
      currentScroll < lastScroll &&
      actualHeader.classList.contains("scroll-down")
    ) {
      actualHeader.classList.remove("scroll-down");
      actualHeader.classList.add("scroll-up");
    }
    lastScroll = currentScroll <= 0 ? 0 : currentScroll;
  });
}

function handleDynamicHeaderAppearance() {
  const headerElement = document.querySelector("#header-placeholder .header");
  const topBarElement = document.querySelector(".top-bar");
  const trustedBySection = document.querySelector(".trusted-by");

  // If header isn't loaded yet, defer execution slightly
  if (!headerElement) {
    requestAnimationFrame(handleDynamicHeaderAppearance);
    return;
  }

  // If trustedBySection is not on the page, header should remain in its initial state.
  // So, we only proceed if trustedBySection exists.
  if (!trustedBySection) {
    // Set initial state explicitly if no trigger section
    headerElement.classList.remove("header-scrolled");
    if (topBarElement) topBarElement.classList.remove("top-bar-scrolled");
    // console.log(".trusted-by section not found. Header remains in initial state.");
    return;
  }

  const headerHeight = headerElement.offsetHeight;
  const topBarHeight = topBarElement ? topBarElement.offsetHeight : 0;
  let trustedByOffsetTop = 0;

  function calculateOffset() {
    // Recalculate offset in case of dynamic content changes before scroll
    trustedByOffsetTop = trustedBySection.offsetTop;
  }
  calculateOffset(); // Initial calculation

  const scrollThreshold = trustedByOffsetTop - headerHeight - topBarHeight - 50; // 50px buffer

  function toggleHeaderStylesOnScroll() {
    // Recalculate offset in case of late image loads or other reflows affecting section position
    calculateOffset();
    const currentScrollThreshold =
      trustedBySection.offsetTop - headerHeight - topBarHeight - 50;

    if (window.pageYOffset > currentScrollThreshold) {
      headerElement.classList.add("header-scrolled");
      if (topBarElement) topBarElement.classList.add("top-bar-scrolled");
    } else {
      headerElement.classList.remove("header-scrolled");
      if (topBarElement) topBarElement.classList.remove("top-bar-scrolled");
    }
  }

  window.addEventListener("scroll", toggleHeaderStylesOnScroll, {
    passive: true,
  });
  window.addEventListener("resize", () => {
    // Recalculate on resize
    requestAnimationFrame(calculateOffset);
    requestAnimationFrame(toggleHeaderStylesOnScroll);
  });

  // Initial check. Defer slightly to ensure layout is stable.
  requestAnimationFrame(toggleHeaderStylesOnScroll);
}

// Function to initialize and handle the scroll-to-top button (in-footer version)
function initializeScrollTopButton() {
  const scrollTopButton = document.querySelector(".scroll-top"); // Still targets .scroll-top

  if (scrollTopButton) {
    scrollTopButton.addEventListener("click", (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  }
}

document.addEventListener("DOMContentLoaded", function () {
  if (typeof AOS !== "undefined") {
    AOS.init({
      duration: 800,
      easing: "ease",
      once: true,
      offset: 50,
    });
  }

  const searchForm = document.querySelector(".search-form");
  if (searchForm) {
    searchForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const searchInput = this.querySelector('input[type="search"]');
      const searchTerm = searchInput.value.trim();
      if (searchTerm) {
        const searchUrl = `${
          window.location.origin
        }/search.html?q=${encodeURIComponent(searchTerm)}`;
        window.location.href = searchUrl;
      }
    });
  }

  document.body.addEventListener("click", function (e) {
    const anchor = e.target.closest('a[href^="#"]');
    if (anchor) {
      const targetId = anchor.getAttribute("href");
      if (targetId && targetId.length > 1) {
        e.preventDefault();
        try {
          const targetElement = document.querySelector(targetId);
          if (targetElement) {
            targetElement.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          }
        } catch (error) {
          console.warn(
            `Smooth scroll target "${targetId}" not found or invalid selector.`
          );
        }
      }
    }
  });

  const fetchAndInsertHTML = (filePath, placeholderId, callback) => {
    fetch(filePath)
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `HTTP error ${response.status} fetching ${filePath}. URL: ${response.url}`
          );
        }
        return response.text();
      })
      .then((data) => {
        const placeholder = document.getElementById(placeholderId);
        if (placeholder) {
          placeholder.innerHTML = data;
          if (typeof callback === "function") {
            // Ensure callback is executed after innerHTML is processed by the browser
            requestAnimationFrame(callback);
          }
        } else {
          console.warn(
            `Placeholder element '${placeholderId}' not found in the document.`
          );
        }
      })
      .catch((error) =>
        console.error(`Error loading HTML into ${placeholderId}: ${error}`)
      );
  };

  let pathToRoot = "";
  const currentPathname = window.location.pathname;
  const pathSegments = currentPathname
    .split("/")
    .filter((segment) => segment.length > 0);

  let depth = 0;
  if (pathSegments.length > 0) {
    if (pathSegments[pathSegments.length - 1].includes(".")) {
      depth = pathSegments.length - 1;
    } else {
      depth = pathSegments.length;
    }
  }
  if (
    currentPathname === "/" ||
    (currentPathname.endsWith("/index.html") &&
      pathSegments.length === 1 &&
      pathSegments[0] === "index.html")
  ) {
    depth = 0;
  }

  pathToRoot = "../".repeat(depth);

  const headerFile = pathToRoot + "header.html";
  const footerFile = pathToRoot + "footer.html";

  fetchAndInsertHTML(headerFile, "header-placeholder", () => {
    updateActiveNavLinks();
    initializeHeaderDropdownHover();
    initializeMobileMenu();
    setupHeaderScrollEffect();
    handleDynamicHeaderAppearance();

    const scripts = document.querySelectorAll("#header-placeholder script");
    scripts.forEach((script) => {
      const newScript = document.createElement("script");
      if (script.src) {
        newScript.src = script.src;
      } else {
        newScript.textContent = script.textContent;
      }
      document.head.appendChild(newScript).remove();
    });
  });

  fetchAndInsertHTML(footerFile, "footer-placeholder", () => {
    initializeScrollTopButton(); // Initialize scroll-to-top button after footer is loaded
    // Any other footer-specific callbacks can go here
  });

  const getInTouchPlaceholder = document.getElementById(
    "get-in-touch-placeholder"
  );
  if (
    (getInTouchPlaceholder &&
      window.location.pathname.endsWith("index.html")) ||
    window.location.pathname === "/" ||
    window.location.pathname.endsWith("/index")
  ) {
    const getInTouchPath = pathToRoot + "get_in_touch.html";
    fetchAndInsertHTML(getInTouchPath, "get-in-touch-placeholder", function () {
      // Callbacks after get_in_touch is loaded, if any
      // For example, initialize form validation or specific event listeners for this section
      if (document.getElementById("getInTouchForm")) {
        // Re-run the script from get_in_touch.html to attach event listeners
        const contactTypeSelect = document.getElementById("contactType");
        const companyNameGroup = document.getElementById("companyNameGroup");
        const companyNameInput = document.getElementById("companyName");
        const getInTouchForm = document.getElementById("getInTouchForm");

        if (
          contactTypeSelect &&
          companyNameGroup &&
          companyNameInput &&
          getInTouchForm
        ) {
          function toggleCompanyNameField() {
            if (contactTypeSelect.value === "company") {
              companyNameGroup.style.display = "block";
              companyNameInput.setAttribute("required", "required");
            } else {
              companyNameGroup.style.display = "none";
              companyNameInput.removeAttribute("required");
              companyNameInput.value = "";
            }
          }

          contactTypeSelect.addEventListener("change", toggleCompanyNameField);
          toggleCompanyNameField(); // Initial check

          getInTouchForm.addEventListener("submit", function (event) {
            if (!getInTouchForm.checkValidity()) {
              event.preventDefault();
              event.stopPropagation();
              // Simple alert for now, could be replaced with more sophisticated error display
              alert("Please fill out all required fields correctly.");
            }
            getInTouchForm.classList.add("was-validated");
          });
        }
      }
      if (typeof AOS !== "undefined") {
        AOS.refresh();
      }
    });
  } else if (getInTouchPlaceholder) {
    // If not on index.html but placeholder exists, remove it
    getInTouchPlaceholder.remove();
  }
});
