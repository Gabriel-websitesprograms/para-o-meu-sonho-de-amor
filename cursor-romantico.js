(() => {
    const supportsDecorativeCursor = window.matchMedia("(hover: hover) and (pointer: fine)");
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (!supportsDecorativeCursor.matches || prefersReducedMotion.matches) return;

    const cursor = document.createElement("div");
    const glow = document.createElement("span");
    const flower = document.createElement("span");
    const initial = document.createElement("span");
    const heart = document.createElement("span");
    cursor.className = "rose-cursor";
    cursor.setAttribute("aria-hidden", "true");
    glow.className = "rose-cursor-glow";
    flower.className = "rose-cursor-flower";
    initial.className = "rose-cursor-letter";
    initial.textContent = "L";
    heart.className = "rose-cursor-heart";
    heart.textContent = "❤️";
    flower.append(initial, heart);
    cursor.append(glow, flower);
    document.body.append(cursor);
    document.body.classList.add("rose-cursor-enabled");

    let pointerIsInside = false;
    let lastPointerEvent;

    const moveCursor = (event) => {
        lastPointerEvent = event;
        cursor.style.left = `${event.clientX}px`;
        cursor.style.top = `${event.clientY}px`;
    };

    document.addEventListener("pointerenter", (event) => {
        if (event.pointerType !== "mouse" && event.pointerType !== "pen") return;
        pointerIsInside = true;
        cursor.classList.add("is-visible");
        moveCursor(event);
    });

    document.addEventListener("pointermove", (event) => {
        if (event.pointerType !== "mouse" && event.pointerType !== "pen") return;
        pointerIsInside = true;
        cursor.classList.add("is-visible");
        moveCursor(event);

        const interactiveElement = event.target instanceof Element
            ? event.target.closest("a, button, input, textarea, select, summary, [role='button']")
            : null;
        cursor.classList.toggle("is-hovering", Boolean(interactiveElement));
    });

    document.addEventListener("pointerleave", (event) => {
        if (event.relatedTarget) return;
        pointerIsInside = false;
        cursor.classList.remove("is-visible", "is-hovering");
    });

    document.addEventListener("pointerdown", (event) => {
        if (!pointerIsInside || (event.pointerType !== "mouse" && event.pointerType !== "pen")) return;
        cursor.classList.remove("is-clicking");
        void cursor.offsetWidth;
        cursor.classList.add("is-clicking");

        for (let index = 0; index < 6; index += 1) {
            const petal = document.createElement("span");
            const angle = (Math.PI * 2 * index) / 6;
            const distance = 34 + (index % 2) * 12;
            petal.className = "rose-cursor-petal";
            petal.textContent = index % 2 === 0 ? "✿" : "♥";
            petal.style.setProperty("--burst-x", `${Math.cos(angle) * distance}px`);
            petal.style.setProperty("--burst-y", `${Math.sin(angle) * distance}px`);
            petal.style.left = `${event.clientX}px`;
            petal.style.top = `${event.clientY}px`;
            document.body.append(petal);
            petal.addEventListener("animationend", () => petal.remove(), { once: true });
        }
    });

    cursor.addEventListener("animationend", (event) => {
        if (event.animationName === "rose-cursor-click") cursor.classList.remove("is-clicking");
    });

    window.addEventListener("blur", () => {
        pointerIsInside = false;
        cursor.classList.remove("is-visible", "is-hovering");
    });

    window.addEventListener("focus", () => {
        if (lastPointerEvent && document.hasFocus()) {
            pointerIsInside = true;
            cursor.classList.add("is-visible");
        }
    });
})();
