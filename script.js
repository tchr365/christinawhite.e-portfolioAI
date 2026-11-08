"use strict";

/* ADD YOUR PROJECT LINKS HERE.
   Paste a full URL or a relative file path between the quotation marks.
   Each entry updates the project button AND its matching dropdown link.
   Example: svgLogo: "projects/my-logo.svg"
   Empty links show a friendly "available soon" message.
*/
const projectLinks = {
  svgLogo: "",
  inkscapeBookcover: "",
  aiBookcover: "",
  interactiveQuiz: "",
  customDragDrop: "",
  aiDragDrop: "",
  traditionalVideo: "",
  aiVideo: "",
  animation: "",
  screencast: ""
};

document.documentElement.classList.add("js");
const menuToggle = document.querySelector(".menu-toggle");
const navigationLinks = document.querySelector(".nav-list");
const dropdowns = [...document.querySelectorAll(".nav-dropdown")];
const projectDialog = document.querySelector(".project-dialog");
const mobileNavigation = window.matchMedia("(max-width: 1150px)");

function closeDropdowns(except = null) {
  dropdowns.forEach(dropdown => {
    if (dropdown !== except) dropdown.open = false;
  });
}

function closeMenu() {
  navigationLinks.classList.remove("is-open");
  menuToggle.setAttribute("aria-expanded", "false");
  closeDropdowns();
}

menuToggle.hidden = false;
menuToggle.addEventListener("click", () => {
  const isOpen = navigationLinks.classList.toggle("is-open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  if (!isOpen) closeDropdowns();
});
mobileNavigation.addEventListener("change", closeMenu);

dropdowns.forEach(dropdown => {
  dropdown.addEventListener("toggle", () => {
    if (dropdown.open) closeDropdowns(dropdown);
  });
});

document.addEventListener("click", event => {
  if (!event.target.closest(".navigation")) closeMenu();
});

document.addEventListener("keydown", event => {
  if (event.key !== "Escape" || projectDialog.open) return;
  const openDropdown = dropdowns.find(dropdown => dropdown.open);
  if (openDropdown) {
    openDropdown.open = false;
    openDropdown.querySelector("summary").focus();
  } else if (navigationLinks.classList.contains("is-open")) {
    closeMenu();
    menuToggle.focus();
  }
});

document.querySelectorAll("[data-project]").forEach(link => {
  const url = projectLinks[link.dataset.project].trim();
  if (url) {
    link.href = url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
  } else {
    link.addEventListener("click", event => {
      event.preventDefault();
      document.querySelector("#project-dialog-title").textContent = link.textContent.trim();
      // Move focus back to a visible element after closing a mobile dropdown.
      const fromMenu = Boolean(link.closest(".navigation"));
      const focusTarget = fromMenu
        ? (mobileNavigation.matches ? menuToggle : link.closest("details").querySelector("summary"))
        : link;
      closeMenu();
      projectDialog.addEventListener("close", () => focusTarget.focus(), { once: true });
      projectDialog.showModal();
    });
  }
});

navigationLinks.addEventListener("click", event => {
  if (event.target.closest("a")) closeMenu();
});

// Highlight a selected section in the navigation.
function highlightSection(id) {
  document.querySelectorAll("[data-section]").forEach(item => {
    const selected = item.dataset.section === id;
    item.classList.toggle("is-active", selected);
    const label = item.matches("details") ? item.querySelector("summary") : item;
    if (selected) label.setAttribute("aria-current", "location");
    else label.removeAttribute("aria-current");
  });
}
document.querySelectorAll('.nav-link[href^="#"]').forEach(link => {
  link.addEventListener("click", () => highlightSection(link.hash.slice(1)));
});
window.addEventListener("hashchange", () => highlightSection(location.hash.slice(1)));
highlightSection(location.hash.slice(1) || "about");

// Match half the portfolio card's actual height when desktop text reflows.
// Mobile CSS allows natural heights so text never gets clipped.
if ("ResizeObserver" in window) {
  const portfolioCard = document.querySelector(".portfolio-card");
  new ResizeObserver(() => {
    document.querySelector(".contact-card").style.setProperty(
      "--portfolio-height", `${portfolioCard.getBoundingClientRect().height}px`
    );
  }).observe(portfolioCard);
}

// Make Back to Top return both the viewport and keyboard focus to the start.
document.querySelector(".back-to-top a").addEventListener("click", () => {
  const top = document.querySelector("#top");
  top.tabIndex = -1;
  top.focus({ preventScroll: true });
  top.addEventListener("blur", () => top.removeAttribute("tabindex"), { once: true });
});
