(() => {
  const initSal = () => {
    const sal = typeof window !== "undefined" ? window.sal : undefined;

    if (typeof sal !== "function") {
      console.warn("sal.js failed to load before sal-init ran");
      return;
    }

    sal({
      threshold: 0.2,
      once: true,
      rootMargin: "0% 0%",
      animateClassName: "sal-animate",
      disabled: () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    });
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initSal, { once: true });
  } else {
    initSal();
  }
})();
