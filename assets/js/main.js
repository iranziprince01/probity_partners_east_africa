// main.js - Site-wide behavior scripts

document.addEventListener("DOMContentLoaded", () => {
  console.log("Website loaded and ready.");
  
  // Example: Smooth scroll to top
  const toTopBtn = document.getElementById("to-top");
  if (toTopBtn) {
    toTopBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
});
