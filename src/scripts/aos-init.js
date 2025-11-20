import AOS from "aos";

let initialized = false;

const initAOS = () => {
  if (initialized || typeof window === "undefined") {
    return;
  }

  initialized = true;

  AOS.init({
    disable: () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    duration: 550,
    easing: "ease-out",
    once: true,
    mirror: false,
    offset: 80,
  });

  window.addEventListener("resize", () => {
    AOS.refresh();
  });
};

export default initAOS;
