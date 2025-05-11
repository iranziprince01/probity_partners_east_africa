// chat-widget.js - Handles live chat widget toggle behavior

document.addEventListener("DOMContentLoaded", () => {
  const chatButton = document.getElementById("chat-button");
  const chatBox = document.getElementById("chat-box");

  if (chatButton && chatBox) {
    chatButton.addEventListener("click", () => {
      const isVisible = chatBox.style.display === "block";
      chatBox.style.display = isVisible ? "none" : "block";
    });
  }
});
