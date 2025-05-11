// form-validation.js - Validates form fields before submission

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");

  if (form) {
    form.addEventListener("submit", (e) => {
      const inputs = form.querySelectorAll("input[required], textarea[required]");
      let valid = true;

      inputs.forEach(input => {
        if (!input.value.trim()) {
          valid = false;
          input.style.border = "1px solid red";
        } else {
          input.style.border = "";
        }
      });

      if (!valid) {
        e.preventDefault();
        alert("Please fill in all required fields.");
      }
    });
  }
});
