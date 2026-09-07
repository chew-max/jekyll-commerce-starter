document.addEventListener("DOMContentLoaded", function () {
  const toggle = document.querySelector(".mobile-nav-toggle");
  const navigation = document.querySelector(".main-navigation");

  if (toggle && navigation) {
    toggle.addEventListener("click", function () {
      const isOpen = toggle.getAttribute("aria-expanded") === "true";

      toggle.setAttribute("aria-expanded", String(!isOpen));
      navigation.classList.toggle("is-open");
      document.body.classList.toggle("nav-open");
    });
  }
});