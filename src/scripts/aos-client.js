import AOS from "aos";

const initAOS = () => {
	if (typeof window === "undefined" || window.__taylormadeAOSLoaded) {
		return;
	}

	window.__taylormadeAOSLoaded = true;

	const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
	const shouldDisable = () => reducedMotionQuery.matches;

	AOS.init({
		disable: shouldDisable,
		duration: 550,
		easing: "ease-out",
		once: true,
		mirror: false,
		offset: 80,
	});

	window.addEventListener("resize", () => {
		AOS.refresh();
	});

	reducedMotionQuery.addEventListener("change", () => {
		AOS.refresh();
	});
};

if (document.readyState === "loading") {
	document.addEventListener("DOMContentLoaded", initAOS, { once: true });
} else {
	initAOS();
}
