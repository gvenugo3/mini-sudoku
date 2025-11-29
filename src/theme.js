/**
 * Theme Management Script
 * Handles light/dark mode toggling and persistence.
 */

const themeToggleBtn = document.getElementById("theme-toggle");
const htmlElement = document.documentElement;

// Function to set the theme
function setTheme(theme) {
  if (theme === "dark") {
    htmlElement.classList.add("dark");
    localStorage.setItem("theme", "dark");
  } else {
    htmlElement.classList.remove("dark");
    localStorage.setItem("theme", "light");
  }
  updateToggleIcon(theme);
}

// Function to update the toggle button icon
function updateToggleIcon(theme) {
  if (!themeToggleBtn) return;

  // Simple SVG icons for sun and moon
  const sunIcon = `
        <svg class="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
        </svg>
    `;
  const moonIcon = `
        <svg class="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
        </svg>
    `;

  themeToggleBtn.innerHTML = theme === "dark" ? sunIcon : moonIcon;
}

// Initialize theme
function initTheme() {
  const savedTheme = localStorage.getItem("theme");
  const systemPrefersDark = window.matchMedia(
    "(prefers-color-scheme: dark)"
  ).matches;

  if (savedTheme) {
    setTheme(savedTheme);
  } else {
    setTheme(systemPrefersDark ? "dark" : "light");
  }
}

// Event Listener for Toggle Button
console.log("Theme script loaded");
console.log("Theme toggle button:", themeToggleBtn);

if (themeToggleBtn) {
  console.log("Adding click listener to theme toggle");
  themeToggleBtn.addEventListener("click", () => {
    console.log("Theme toggle clicked");
    const isDark = htmlElement.classList.contains("dark");
    setTheme(isDark ? "light" : "dark");
  });
} else {
  console.error("Theme toggle button not found!");
}

// Listen for system preference changes
window
  .matchMedia("(prefers-color-scheme: dark)")
  .addEventListener("change", (e) => {
    if (!localStorage.getItem("theme")) {
      setTheme(e.matches ? "dark" : "light");
    }
  });

// Run initialization
initTheme();
